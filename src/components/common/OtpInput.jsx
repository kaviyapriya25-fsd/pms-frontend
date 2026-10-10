import React, { useRef, useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import "./OtpInput.css";

/**
 * Modern 6-digit real-time OTP Input Component
 * Features:
 * - 6 individual dash/box inputs with split layout (3-3)
 * - Auto-focus next box on digit entry
 * - Backspace jumps to previous box and deletes
 * - Arrow key navigation
 * - Full clipboard paste support (Ctrl+V)
 * - Mobile numeric keypad support (inputMode="numeric")
 * - Dynamic bottom dash indicator and focus glow
 */
export default function OtpInput({
  length = 6,
  value = "",
  onChange,
  onComplete,
  disabled = false,
  autoFocus = true,
  hasError = false,
  showHelper = true,
}) {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRefs = useRef([]);

  // Ensure digits array matches length
  const digits = Array.from({ length }, (_, i) => (value && value[i] ? value[i] : ""));

  useEffect(() => {
    if (autoFocus && !disabled && inputRefs.current[0]) {
      // Find first empty index or index 0
      const firstEmpty = digits.findIndex((d) => !d);
      const targetIndex = firstEmpty === -1 ? 0 : firstEmpty;
      inputRefs.current[targetIndex]?.focus();
    }
  }, []);

  const triggerChange = (newDigits) => {
    const otpValue = newDigits.join("");
    if (onChange) {
      onChange(otpValue);
    }
    if (otpValue.length === length && onComplete) {
      onComplete(otpValue);
    }
  };

  const handleInputChange = (e, index) => {
    const val = e.target.value;
    // Extract only the latest digit
    const cleaned = val.replace(/\D/g, "");
    const char = cleaned.slice(-1);

    const newDigits = [...digits];
    newDigits[index] = char || "";
    triggerChange(newDigits);

    // If a digit was entered, auto-focus next input
    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        // Current box has digit -> clear it
        const newDigits = [...digits];
        newDigits[index] = "";
        triggerChange(newDigits);
        e.preventDefault();
      } else if (index > 0) {
        // Current box empty -> move to previous and clear it
        inputRefs.current[index - 1]?.focus();
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        triggerChange(newDigits);
        e.preventDefault();
      }
    } else if (e.key === "ArrowLeft") {
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        e.preventDefault();
      }
    } else if (e.key === "ArrowRight") {
      if (index < length - 1) {
        inputRefs.current[index + 1]?.focus();
        e.preventDefault();
      }
    } else if (e.key === "Delete") {
      const newDigits = [...digits];
      newDigits[index] = "";
      triggerChange(newDigits);
      e.preventDefault();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text/plain");
    const numericChars = pastedText.replace(/\D/g, "").slice(0, length);

    if (!numericChars) return;

    const newDigits = Array.from({ length }, (_, i) => numericChars[i] || "");
    triggerChange(newDigits);

    // Focus the next empty slot or the last one
    const focusTarget = Math.min(numericChars.length, length - 1);
    inputRefs.current[focusTarget]?.focus();
  };

  const handleFocus = (e, index) => {
    setFocusedIndex(index);
    // Select current value for instant overwrite
    e.target.select();
  };

  const handleBlur = () => {
    setFocusedIndex(-1);
  };

  const handleClear = () => {
    const emptyDigits = Array(length).fill("");
    triggerChange(emptyDigits);
    inputRefs.current[0]?.focus();
  };

  const filledCount = digits.filter((d) => d !== "").length;

  return (
    <div className="otp-input-container">
      <div className="otp-boxes-wrapper">
        {Array.from({ length }, (_, i) => {
          const isMidpoint = length === 6 && i === 3;
          const isFocused = focusedIndex === i;
          const isFilled = Boolean(digits[i]);

          return (
            <React.Fragment key={i}>
              {isMidpoint && <span className="otp-separator">—</span>}
              <div
                className={`otp-box-cell ${isFocused ? "focused" : ""} ${
                  isFilled ? "filled" : ""
                } ${hasError ? "error" : ""} ${disabled ? "disabled" : ""}`}
                onClick={() => !disabled && inputRefs.current[i]?.focus()}
              >
                <input
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete={i === 0 ? "one-time-code" : "off"}
                  maxLength={1}
                  value={digits[i]}
                  disabled={disabled}
                  onChange={(e) => handleInputChange(e, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  onPaste={handlePaste}
                  onFocus={(e) => handleFocus(e, i)}
                  onBlur={handleBlur}
                  className="otp-single-input"
                  aria-label={`Digit ${i + 1} of ${length}`}
                />
                <div className="otp-bottom-dash" />
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {showHelper && (
        <div className="otp-helper-row">
          <span
            className={`otp-digit-count ${
              filledCount === length ? "completed" : ""
            }`}
          >
            {filledCount === length ? (
              <>
                <FaCheckCircle color="#16a34a" /> All 6 digits entered
              </>
            ) : (
              `${filledCount} of ${length} digits entered`
            )}
          </span>

          {filledCount > 0 && !disabled && (
            <button
              type="button"
              className="otp-clear-btn"
              onClick={handleClear}
            >
              Clear code
            </button>
          )}
        </div>
      )}
    </div>
  );
}
