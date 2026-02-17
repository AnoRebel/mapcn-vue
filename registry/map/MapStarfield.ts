/**
 * Three.js starfield skybox custom layer for MapLibre GL globe projections.
 *
 * Renders a procedural point-star field and an optional panoramic galaxy texture
 * behind the globe. Implements MapLibre's CustomLayerInterface.
 *
 * Based on @geoql/maplibre-gl-starfield, refactored as a local utility.
 * External dependencies: maplibre-gl, three
 */
import type {
  CustomLayerInterface,
  CustomRenderMethodInput,
  Map as MaplibreMap,
} from "maplibre-gl";
import {
  AddEquation,
  BackSide,
  BufferGeometry,
  Camera,
  CustomBlending,
  Float32BufferAttribute,
  LinearFilter,
  Matrix4,
  Mesh,
  OneFactor,
  OneMinusSrcAlphaFactor,
  Points,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  TextureLoader,
  Vector3,
  WebGLRenderer,
} from "three";
import type { Object3D, Texture } from "three";

export interface MapStarfieldOptions {
  /** Unique layer ID (default: "starfield") */
  id?: string;
  /** Number of individual point stars (default: 4000) */
  starCount?: number;
  /** Base point size for stars (default: 2.0) */
  starSize?: number;
  /** Hex color for point stars (default: 0xffffff) */
  starColor?: number;
  /** URL to a panoramic galaxy/milky-way texture (equirectangular). If omitted, only point stars are rendered. */
  galaxyTextureUrl?: string;
  /** Brightness multiplier for the galaxy texture (default: 0.35) */
  galaxyBrightness?: number;
}

// --- GLSL Shaders ---

const GALAXY_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec4 clipPos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    // Push to far plane so it's always behind everything
    clipPos.z = clipPos.w * 0.99999;
    gl_Position = clipPos;
  }
`;

const GALAXY_FRAGMENT = /* glsl */ `
  uniform sampler2D tSky;
  uniform float uBrightness;
  varying vec2 vUv;
  void main() {
    vec3 col = texture2D(tSky, vUv).rgb * uBrightness;
    gl_FragColor = vec4(col, 1.0);
  }
`;

const STAR_VERTEX = /* glsl */ `
  attribute float aSize;
  attribute float aOpacity;
  varying float vOpacity;

  void main() {
    vOpacity = aOpacity;
    vec4 clipPos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    clipPos.z = clipPos.w * 0.9999;
    gl_Position = clipPos;
    gl_PointSize = aSize;
  }
`;

const STAR_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  varying float vOpacity;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float a = vOpacity * smoothstep(0.5, 0.1, d);
    gl_FragColor = vec4(uColor * a, a);
  }
`;

/**
 * MapLibre custom layer that renders a Three.js starfield skybox.
 *
 * Usage:
 * ```ts
 * map.addLayer(new MapStarfieldLayer({
 *   starCount: 5000,
 *   starSize: 2.5,
 *   galaxyTextureUrl: '/milkyway.jpg',
 * }), 'satellite');  // insert before the first map layer
 * ```
 */
export class MapStarfieldLayer implements CustomLayerInterface {
  readonly id: string;
  readonly type = "custom" as const;
  readonly renderingMode = "3d" as const;

  private starCount: number;
  private starSize: number;
  private starColor: number;
  private galaxyTextureUrl: string | undefined;
  private galaxyBrightness: number;

  private renderer: WebGLRenderer | null = null;
  private scene: Scene | null = null;
  private camera: Camera | null = null;

  constructor(options: MapStarfieldOptions = {}) {
    this.id = options.id ?? "starfield";
    this.starCount = options.starCount ?? 4000;
    this.starSize = options.starSize ?? 2.0;
    this.starColor = options.starColor ?? 0xffffff;
    this.galaxyTextureUrl = options.galaxyTextureUrl;
    this.galaxyBrightness = options.galaxyBrightness ?? 0.35;
  }

  onAdd(map: MaplibreMap, gl: WebGLRenderingContext): void {
    this.scene = new Scene();
    this.camera = new Camera();

    // --- Galaxy skybox sphere (renders first, behind everything) ---
    if (this.galaxyTextureUrl) {
      const loader = new TextureLoader();
      loader.setCrossOrigin("anonymous");
      const brightness = this.galaxyBrightness;
      const scene = this.scene;

      loader.load(this.galaxyTextureUrl, (texture: Texture) => {
        texture.magFilter = LinearFilter;
        texture.minFilter = LinearFilter;

        const skyGeo = new SphereGeometry(1, 64, 32);
        const skyMat = new ShaderMaterial({
          uniforms: {
            tSky: { value: texture },
            uBrightness: { value: brightness },
          },
          vertexShader: GALAXY_VERTEX,
          fragmentShader: GALAXY_FRAGMENT,
          side: BackSide,
          depthWrite: false,
          depthTest: false,
        });

        const skybox = new Mesh(skyGeo, skyMat);
        // Insert at index 0 so it renders behind point stars
        scene.children.unshift(skybox);
        map.triggerRepaint();
      });
    }

    // --- Point stars ---
    const count = this.starCount;
    const positions = new Float32Array(count * 3);
    const starSizes = new Float32Array(count);
    const opacities = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Uniform distribution on unit sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const i3 = i * 3;
      positions[i3] = Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = Math.cos(phi);
      starSizes[i] = this.starSize * (0.4 + Math.random());
      opacities[i] = 0.15 + Math.random() * 0.85;
    }

    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geo.setAttribute("aSize", new Float32BufferAttribute(starSizes, 1));
    geo.setAttribute("aOpacity", new Float32BufferAttribute(opacities, 1));

    // Decompose hex color
    const cr = ((this.starColor >> 16) & 0xff) / 255;
    const cg = ((this.starColor >> 8) & 0xff) / 255;
    const cb = (this.starColor & 0xff) / 255;

    const mat = new ShaderMaterial({
      uniforms: {
        uColor: { value: new Vector3(cr, cg, cb) },
      },
      vertexShader: STAR_VERTEX,
      fragmentShader: STAR_FRAGMENT,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: CustomBlending,
      blendSrc: OneFactor,
      blendDst: OneMinusSrcAlphaFactor,
      blendEquation: AddEquation,
    });

    this.scene.add(new Points(geo, mat));

    this.renderer = new WebGLRenderer({
      canvas: map.getCanvas(),
      context: gl,
    });
    this.renderer.autoClear = false;
  }

  render(_gl: WebGLRenderingContext, options: CustomRenderMethodInput): void {
    if (!this.renderer || !this.scene || !this.camera) return;

    const P = new Matrix4().fromArray(
      options.projectionMatrix as unknown as number[],
    );
    const MVP = new Matrix4().fromArray(
      options.modelViewProjectionMatrix as unknown as number[],
    );

    // Extract model-view by removing projection
    const PInv = new Matrix4().copy(P).invert();
    const MV = new Matrix4().multiplyMatrices(PInv, MVP);

    // Strip translation → stars at infinity (skybox effect)
    const e = MV.elements;
    e[12] = 0;
    e[13] = 0;
    e[14] = 0;

    this.camera.projectionMatrix.multiplyMatrices(P, MV);

    // Reset Three.js cached GL state so it doesn't conflict with MapLibre
    const r = this.renderer as unknown as Record<string, unknown>;
    if (typeof r["resetState"] === "function") {
      (r["resetState"] as () => void)();
    } else if (
      r["state"] &&
      typeof (r["state"] as Record<string, unknown>)["reset"] === "function"
    ) {
      ((r["state"] as Record<string, unknown>)["reset"] as () => void)();
    }

    this.renderer.render(this.scene, this.camera);
  }

  onRemove(): void {
    this.scene?.traverse((node: Object3D) => {
      if (node instanceof Points) {
        node.geometry.dispose();
        (node.material as ShaderMaterial).dispose();
      }
      if (node instanceof Mesh) {
        node.geometry.dispose();
        (node.material as ShaderMaterial).dispose();
      }
    });
    this.renderer?.dispose();
    this.renderer = null;
    this.scene = null;
    this.camera = null;
  }
}
