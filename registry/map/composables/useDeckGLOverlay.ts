import { ref, watch, onMounted, onUnmounted } from "vue";
import { MapboxOverlay } from "@deck.gl/mapbox";
import type { Layer } from "@deck.gl/core";
import { useMap } from "./useMap";

export interface UseDeckGLOverlayOptions {
  layers: Layer[];
  interleaved?: boolean;
}

export function useDeckGLOverlay(props: UseDeckGLOverlayOptions) {
  const { map, isLoaded, isStyleLoaded } = useMap();
  const overlayRef = ref<MapboxOverlay | null>(null);
  const isSetup = ref(false);

  const interleaved = () => props.interleaved ?? true;

  function setupOverlay() {
    if (!map.value || isSetup.value) return;

    try {
      // Create overlay with empty layers first — MapboxOverlay needs a
      // render frame to sync the map viewport. Without a valid viewport,
      // aggregation layers (Heatmap, Hexagon, etc.) can't build their
      // textures, causing "viewport is null" errors and broken rendering.
      const overlay = new MapboxOverlay({
        interleaved: interleaved(),
        layers: [],
        useDevicePixels: true,
      });

      map.value.addControl(overlay);
      overlayRef.value = overlay;
      isSetup.value = true;

      // Apply actual layers after the viewport is available
      requestAnimationFrame(() => {
        if (overlayRef.value) {
          overlayRef.value.setProps({ layers: props.layers });
        }
      });
    } catch {
      // deck.gl may throw assertion errors on some WebGL contexts;
      // retry once after a short delay
      setTimeout(() => {
        if (isSetup.value || !map.value) return;
        try {
          const overlay = new MapboxOverlay({
            interleaved: interleaved(),
            layers: [],
            useDevicePixels: true,
          });
          map.value.addControl(overlay);
          overlayRef.value = overlay;
          isSetup.value = true;

          requestAnimationFrame(() => {
            if (overlayRef.value) {
              overlayRef.value.setProps({ layers: props.layers });
            }
          });
        } catch {
          // silently fail – map still works without deck.gl overlay
        }
      }, 500);
    }
  }

  function cleanupOverlay() {
    if (!map.value || !isSetup.value || !overlayRef.value) return;

    try {
      map.value.removeControl(overlayRef.value);
    } catch {
      // ignore
    }

    overlayRef.value = null;
    isSetup.value = false;
  }

  function updateLayers() {
    if (!overlayRef.value) return;
    try {
      overlayRef.value.setProps({ layers: props.layers });
    } catch {
      // ignore deck.gl rendering errors
    }
  }

  // Wait for both map load AND style load before setting up overlay
  // This ensures the WebGL context is fully initialized
  function trySetup() {
    if (isLoaded.value && isStyleLoaded.value) {
      setupOverlay();
      return true;
    }
    return false;
  }

  onMounted(() => {
    if (!trySetup()) {
      const unwatch = watch(
        [isLoaded, isStyleLoaded],
        ([loaded, styleLoaded]) => {
          if (loaded && styleLoaded) {
            setupOverlay();
            unwatch();
          }
        },
      );
    }
  });

  onUnmounted(cleanupOverlay);

  // Layers are marked raw in examples to prevent Vue from deep-proxying
  // deck.gl internals. A shallow watch on the array reference is sufficient
  // because computed() returns a new array when reactive deps change.
  watch(() => props.layers, updateLayers);

  return { isSetup, overlayRef };
}
