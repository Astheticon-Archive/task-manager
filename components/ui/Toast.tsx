"use client"
import { useEffect, useRef } from "react"

type ToastProps = {
  message: string | null
  onDone: () => void
}

export default function Toast({ message, onDone }: ToastProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!message) return
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      onDone()
    }, 3000)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [message, onDone])

  if (!message) return null

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: "2rem",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 100,
        backgroundColor: "var(--color-peach)",
        color: "#3A3533",
        padding: "0.5rem 1.5rem",
        borderRadius: "9999px",
        fontSize: "0.875rem",
        fontWeight: 600,
        letterSpacing: "0.01em",
        boxShadow: "0 4px 20px var(--color-shadow)",
        animation: "toast-fade-in-out 3s ease forwards",
        whiteSpace: "nowrap",
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      {message}
    </div>
  )
}
