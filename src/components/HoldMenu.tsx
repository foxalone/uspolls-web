import { useEffect, useRef, useState, type FocusEvent, type PointerEvent, type ReactNode } from "react";

const HOLD_MS = 480;
const MOVE_CANCEL = 12;

export function HoldMenu<T extends string>({
  label,
  current,
  options,
  onSelect,
  className = "",
}: {
  label: string;
  current: T;
  options: { id: T; label: string; content: ReactNode }[];
  onSelect: (id: T) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [holding, setHolding] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | null>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const fromKeyboard = useRef(false);
  const firstOption = useRef<HTMLButtonElement>(null);
  const currentOption = options.find((option) => option.id === current) ?? options[0];
  const others = options.filter((option) => option.id !== current);

  function clearTimer() {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }

  function openMenu(keyboard: boolean) {
    if (others.length === 0) return;
    fromKeyboard.current = keyboard;
    setOpen(true);
    setHolding(false);
  }

  useEffect(() => () => clearTimer(), []);

  useEffect(() => {
    if (!open) return;
    if (fromKeyboard.current) firstOption.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function onPointerDown(event: PointerEvent<HTMLButtonElement>) {
    if (event.button !== 0) return;
    start.current = { x: event.clientX, y: event.clientY };
    setHolding(true);
    clearTimer();
    timer.current = window.setTimeout(() => {
      timer.current = null;
      start.current = null;
      openMenu(false);
      if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") navigator.vibrate(12);
    }, HOLD_MS);
  }

  function onPointerMove(event: PointerEvent<HTMLButtonElement>) {
    if (!start.current) return;
    const dx = event.clientX - start.current.x;
    const dy = event.clientY - start.current.y;
    if (dx * dx + dy * dy > MOVE_CANCEL * MOVE_CANCEL) {
      clearTimer();
      start.current = null;
      setHolding(false);
    }
  }

  function onPointerUp() {
    const pending = timer.current !== null;
    clearTimer();
    start.current = null;
    setHolding(false);
    if (pending && open) setOpen(false);
  }

  return (
    <div
      className={`hold-menu${className ? ` ${className}` : ""}`}
      ref={rootRef}
      onBlur={(event: FocusEvent<HTMLDivElement>) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={currentOption ? `${label}: ${currentOption.label}` : label}
        className={`hold-menu__trigger${holding ? " is-holding" : ""}`}
        onContextMenu={(event) => {
          event.preventDefault();
          openMenu(false);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
            event.preventDefault();
            openMenu(true);
          }
        }}
        onPointerCancel={onPointerUp}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        type="button"
      >
        {currentOption?.content}
      </button>
      {open ? (
        <div aria-label={label} className="hold-menu__panel" role="menu">
          {others.map((option, index) => (
            <button
              aria-label={option.label}
              className="hold-menu__option"
              key={option.id}
              onClick={() => {
                onSelect(option.id);
                setOpen(false);
              }}
              ref={index === 0 ? firstOption : undefined}
              role="menuitem"
              type="button"
            >
              {option.content}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
