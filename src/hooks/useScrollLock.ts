import { useEffect, useRef } from 'react'

/**
 * Custom hook to lock/unlock body scroll
 * @param isLocked - Whether the scroll should be locked
 */
export const useScrollLock = (isLocked: boolean) => {
  const originalOverflowRef = useRef<string | null>(null)
  const hasModifiedRef = useRef<boolean>(false)

  // Consolidated scroll lock/unlock logic
  useEffect(() => {
    if (isLocked) {
      // Store original overflow value only if we haven't stored it yet
      if (originalOverflowRef.current === null) {
        originalOverflowRef.current = document.body.style.overflow
      }
      
      // Lock scroll
      document.body.style.overflow = 'hidden'
      hasModifiedRef.current = true
    } else {
      // If unlocked, restore original value if we had modified it
      if (hasModifiedRef.current && originalOverflowRef.current !== null) {
        document.body.style.overflow = originalOverflowRef.current
        hasModifiedRef.current = false
        originalOverflowRef.current = null
      }
    }

    // Cleanup on effect change or component unmount
    return () => {
      if (hasModifiedRef.current && originalOverflowRef.current !== null) {
        document.body.style.overflow = originalOverflowRef.current
        // Reset refs to avoid stale state if hook is reused
        hasModifiedRef.current = false
        originalOverflowRef.current = null
      }
    }
  }, [isLocked])
}
