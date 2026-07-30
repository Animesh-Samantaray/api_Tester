declare module "react-speech-recognition" {
  export interface SpeechRecognitionOptions {
    continuous?: boolean;
    interimResults?: boolean;
    language?: string;
  }

  export interface SpeechRecognition {
    startListening(options?: SpeechRecognitionOptions): Promise<void>;
    stopListening(): void;
    abortListening(): void;
  }

  const SpeechRecognition: SpeechRecognition;

  export interface UseSpeechRecognitionHook {
    transcript: string;
    listening: boolean;
    resetTranscript: () => void;
    browserSupportsSpeechRecognition: boolean;
    isMicrophoneAvailable: boolean;
  }

  export function useSpeechRecognition(): UseSpeechRecognitionHook;

  export default SpeechRecognition;
}
