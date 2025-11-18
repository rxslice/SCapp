export const triggerHapticFeedback = (pattern: VibratePattern = 10) => {
  if (typeof window !== 'undefined' && 'vibrate' in window.navigator) {
    try {
      window.navigator.vibrate(pattern);
    } catch (e) {
      console.warn("Could not trigger haptic feedback.", e);
    }
  }
};