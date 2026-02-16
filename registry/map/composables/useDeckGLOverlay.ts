import { ref, watch, onMounted, onUnmounted } from "vue";
import { MapboxOverlay } from "@deck.gl/mapbox";
import type { Layer } from "@deck.gl/core";
import { useMap } from "./useMap";

export interface UseDeckGLOverlayOptions {
  layers: Layer[];
  interleaved?: boolean;
}

export function useDeckGLOverlay(props: UseDeckGLOverlayOptions) {
  const { map, isLoaded } = useMap();
  const overlayRef = ref<MapboxOverlay | null>(null);
  const isSetup = ref(false);

  const interleaved = () => props.interleaved ?? true;

  function setupOverlay() {
    if (!map.value || isSetup.value) return;

    const overlay = new MapboxOverlay({
      interleaved: interleaved(),
      layers: props.layers,
      useDevicePixels: true,
    });

    map.value.addControl(overlay);
    overlayRef.value = overlay;
    isSetup.value = true;
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
    overlayRef.value.setProps({ layers: props.layers });
  }

  onMounted(() => {
    if (isLoaded.value) {
      setupOverlay();
    } else {
      const unwatch = watch(isLoaded, (loaded) => {
        if (loaded) {
          setupOverlay();
          unwatch();
        }
      });
    }
  });

  onUnmounted(cleanupOverlay);

  watch(() => props.layers, updateLayers, { deep: true });

  return { isSetup, overlayRef };
}
