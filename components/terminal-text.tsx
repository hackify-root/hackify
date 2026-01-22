"use client";

import { useEffect, useState } from "react";

interface TerminalTextProps {
  text: string;
  speed?: number;
  className?: string;
  showCursor?: boolean;
  onComplete?: () => void;
}

export function TerminalText({
  text,
  speed = 50,
  className = "",
  showCursor = true,
  onComplete,
}: TerminalTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    setDisplayText("");
    setIsComplete(false);

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <span className={className}>
      {displayText}
      {showCursor && (
        <span className={`${isComplete ? "animate-pulse" : ""}`}>_</span>
      )}
    </span>
  );
}
