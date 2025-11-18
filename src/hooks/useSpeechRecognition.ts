import { useState, useEffect, useRef } from 'react';

// Fix for line 29: Added full Web Speech API type declarations to resolve 'SpeechRecognition' not found error.
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }

  interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
  }

  interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  }

  interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
  }

  interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
  }
  
  interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string;
    readonly message: string;
  }

  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    start(): void;
    stop(): void;
  }

  var SpeechRecognition: {
    prototype: SpeechRecognition;
    new(): SpeechRecognition;
  };
}

interface SpeechRecognitionHook {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  isSupported: boolean;
  error: string;
}

const getSpeechRecognition = (): typeof SpeechRecognition | null => {
  if (typeof window !== 'undefined') {
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
  }
  return null;
};

export function useSpeechRecognition(): SpeechRecognitionHook {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isListeningRef = useRef(false);
  
  const SpeechRecognitionAPI = getSpeechRecognition();
  const isSupported = !!SpeechRecognitionAPI;

  useEffect(() => {
    if (!isSupported) {
      console.warn('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognitionAPI!();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setTranscript(finalTranscript.trim().toLowerCase());
      }
    };

    recognition.onend = () => {
      // This event fires when recognition stops, either manually or automatically.
      // We always transition to a "not listening" state to ensure UI consistency.
      // This prevents race conditions where we try to restart while the service is still closing,
      // which was causing the "recognition has already started" error.
      isListeningRef.current = false;
      setIsListening(false);
    };
    
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error, event.message);
        setError(event.message || `An error occurred: ${event.error}`);
        // onend will be called automatically after an error, which will handle state cleanup.
        isListeningRef.current = false;
        setIsListening(false);
    };

    return () => {
      if (recognitionRef.current) {
        isListeningRef.current = false;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.stop();
      }
    };
  }, [isSupported]);
  
  const startListening = () => {
    if (recognitionRef.current && !isListeningRef.current) {
      setTranscript('');
      setError('');
      isListeningRef.current = true;
      setIsListening(true);
      try {
        recognitionRef.current.start();
      } catch(e) {
          console.error("Error starting recognition", e);
          setError("Could not start voice recognition. Please try again.");
          isListeningRef.current = false;
          setIsListening(false);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListeningRef.current) {
      isListeningRef.current = false;
      // No need to call setIsListening(false) here, as the onend event will fire and handle it.
      recognitionRef.current.stop();
    }
  };

  return { isListening, transcript, startListening, stopListening, isSupported, error };
}