import { ref, Ref, watchEffect } from 'vue'

export function useVolumeSlider(volume: Ref<number>) {
  const volumeSlider = ref<HTMLInputElement | null>(null)

  const updateVolumeFill = () => {
    if (volumeSlider.value) {
      const percent = volume.value * 100
      volumeSlider.value.style.backgroundSize = `${percent}% 100%`
    }
  }

  watchEffect(updateVolumeFill)

  return { volumeSlider, updateVolumeFill }
}
