import React, { useRef, useEffect, useState } from "react";
import { Send, Mic, MicOff } from "lucide-react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  isOpen: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  isOpen,
}) => {
  const [input, setInput] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  // ---------------- Send ----------------

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!input.trim() || isLoading) return;

    onSendMessage(input.trim());
    setInput("");
  };

  // ---------------- Voice ----------------

  const handleVoice = async () => {
    if (!browserSupportsSpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    if (!isMicrophoneAvailable) {
      alert("Please allow microphone permission.");
      return;
    }

    if (!listening) {
      resetTranscript();

      await SpeechRecognition.startListening({
        continuous: false,
        language: "en-US",
      });
    } else {
      SpeechRecognition.stopListening();
    }
  };

  // Automatically insert transcript
  useEffect(() => {
    if (!listening && transcript.trim()) {
      setInput(transcript.trim());
      resetTranscript();
    }
  }, [listening, transcript]);

  // ---------------- Keyboard ----------------

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // ---------------- Focus ----------------

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      const timer = setTimeout(() => {
        textareaRef.current?.focus();
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // ---------------- Auto Height ----------------

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height =
      Math.min(textarea.scrollHeight, 120) + "px";
  }, [input]);
console.log("Supports:", browserSupportsSpeechRecognition);
console.log("Mic:", isMicrophoneAvailable);
console.log("Listening:", listening);
  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-zinc-800 bg-[#111114] p-4"
    >
      <div className="flex items-end gap-2 rounded-2xl border border-zinc-700 bg-zinc-900 p-2">

        {/* Textarea */}

        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          disabled={isLoading}
          placeholder="Ask APIHUB AI..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 resize-none bg-transparent text-sm text-white outline-none placeholder:text-zinc-500 max-h-32"
        />

        {/* Voice Button */}

        {browserSupportsSpeechRecognition && (
          <button
            type="button"
            onClick={handleVoice}
            disabled={!isMicrophoneAvailable}
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 ${
              listening
                ? "bg-red-500 text-white animate-pulse"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
            }`}
            title={
              listening
                ? "Stop Recording"
                : "Start Voice Input"
            }
          >
            {listening ? (
              <MicOff size={18} />
            ) : (
              <Mic size={18} />
            )}
          </button>
        )}

        {/* Send */}

        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-violet-500/30 disabled:cursor-not-allowed disabled:opacity-40"
          title="Send"
        >
          <Send size={18} />
        </button>

      </div>
    </form>
  );
};