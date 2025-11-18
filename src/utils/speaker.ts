export const speak = (text: string) => {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported');
    return;
  }

  // Cancel any ongoing speech to prevent overlap
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  const trySpeak = () => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      // You could optionally set a preferred voice here
      window.speechSynthesis.speak(utterance);
    }
  };

  if (window.speechSynthesis.getVoices().length === 0) {
    // Voices not loaded yet, wait for the event
    window.speechSynthesis.addEventListener('voiceschanged', trySpeak, { once: true });
  } else {
    trySpeak();
  }
};