import React, { useRef, useEffect, useState } from "react";
import { Send, Mic, MicOff } from "lucide-react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useToast } from "../context/ToastContext";

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
  const { showToast } = useToast();

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
      showToast("Speech Recognition is not supported in this browser.", "error");
      return;
    }

    if (!isMicrophoneAvailable) {
      showToast("Please allow microphone permission.", "error");
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
      setInput((prev) => prev + (prev ? " " : "") + transcript.trim());
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
      Math.min(textarea.scrollHeight, 96) + "px";
  }, [input]);

 return (
  <form
    onSubmit={handleSubmit}
    className="shrink-0 px-4 pb-5 pt-3"
  >
    <div
      className="
      relative
      flex
      items-end
      gap-3

      rounded-[26px]

      border
      border-white/10

      bg-gradient-to-br
      from-white/10
      via-white/[0.06]
      to-white/[0.03]

      backdrop-blur-2xl

      px-4
      py-3

      shadow-[0_10px_35px_rgba(0,0,0,0.35)]

      transition-all
      duration-300

      focus-within:border-violet-500/50
      focus-within:shadow-[0_0_35px_rgba(139,92,246,0.25)]
    "
    >
      {/* Left Glow */}
      <div className="absolute inset-0 rounded-[26px] bg-gradient-to-r from-violet-500/5 via-transparent to-indigo-500/5 pointer-events-none" />

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        rows={1}
        value={input}
        disabled={isLoading}
        placeholder="Ask APIHUB AI anything..."
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="
          relative
          z-10
          flex-1
          resize-none
          bg-transparent
          items-center
          justify-center
          ml-2
          text-[15px]
          leading-6

          text-white
          placeholder:text-zinc-500

          outline-none

          max-h-32

          scrollbar-none
        "
      />

      {/* Right Controls */}
      <div className="relative z-10 flex items-center gap-2">

        {browserSupportsSpeechRecognition && (
          <button
            type="button"
            onClick={handleVoice}
            disabled={!isMicrophoneAvailable}
            title={
              listening
                ? "Stop Recording"
                : "Voice Input"
            }
            className={`
              group

              flex
              h-11
              w-11

              items-center
              justify-center

              rounded-full

              border

              transition-all
              duration-300

              ${
                listening
                  ? `
                    border-red-400
                    bg-red-500
                    text-white
                    shadow-lg
                    shadow-red-500/40
                    animate-pulse
                  `
                  : `
                    border-white/10
                    bg-white/5
                    text-zinc-300

                    hover:border-violet-400/40
                    hover:bg-violet-500/15
                    hover:text-violet-300
                    hover:scale-105
                  `
              }
            `}
          >
            {listening ? (
              <MicOff size={18} />
            ) : (
              <Mic size={18} />
            )}
          </button>
        )}

        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          title="Send"

          className="
            group

            flex
            h-11
            w-11

            items-center
            justify-center

            rounded-full

            bg-gradient-to-r
            from-violet-600
            via-purple-600
            to-indigo-600

            text-white

            shadow-lg
            shadow-violet-500/30

            transition-all
            duration-300

            hover:scale-110
            hover:shadow-violet-500/50

            active:scale-95

            disabled:pointer-events-none
            disabled:opacity-40
            disabled:scale-100
          "
        >
          <Send
            size={17}
            className="transition-transform group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
          />
        </button>
      </div>
    </div>

    <div className="mt-2 px-2 flex items-center justify-between text-[11px] text-zinc-500">
      <span>
        Press <kbd className="rounded bg-white/5 px-1.5 py-0.5">Enter</kbd> to send
      </span>

      <span>
        <kbd className="rounded bg-white/5 px-1.5 py-0.5">
          Shift + Enter
        </kbd>{" "}
        for new line
      </span>
    </div>
  </form>
);
};