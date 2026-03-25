import { Ref, onMounted, onUnmounted } from 'vue'

export function useWheelBlocker(containerRef: Ref<HTMLElement | null>) {
  const handleWheel = (e: WheelEvent) => {
    if (containerRef.value && containerRef.value.contains(e.target as Node)) {
      e.preventDefault()
    }
  }

  onMounted(() => {
    window.addEventListener('wheel', handleWheel, { passive: false })
  })

  onUnmounted(() => {
    window.removeEventListener('wheel', handleWheel)
  })
}
