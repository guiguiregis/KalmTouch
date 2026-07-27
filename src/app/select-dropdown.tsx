"use client";

import {
  useEffect,
  useEffectEvent,
  useId,
  useRef,
  useState,
} from "react";

export type SelectOption = {
  value: string;
  label: string;
  description?: string;
};

type SelectDropdownProps = {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

export default function SelectDropdown({
  label,
  value,
  options,
  onChange,
  disabled = false,
  placeholder = "Select…",
}: SelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listboxId = useId();
  const labelId = useId();

  const selected = options.find((option) => option.value === value);
  const selectedIndex = options.findIndex((option) => option.value === value);

  const close = useEffectEvent((returnFocus = false) => {
    setOpen(false);
    setActiveIndex(-1);
    if (returnFocus) {
      triggerRef.current?.focus();
    }
  });

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        close();
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open || activeIndex < 0) return;
    const option = listRef.current?.children[activeIndex] as
      | HTMLElement
      | undefined;
    option?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  function openList(focusIndex?: number) {
    if (disabled || options.length === 0) return;
    const index =
      focusIndex ?? (selectedIndex >= 0 ? selectedIndex : 0);
    setActiveIndex(index);
    setOpen(true);
  }

  function choose(next: string) {
    onChange(next);
    close(true);
  }

  function onTriggerKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;

    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp":
      case "Enter":
      case " ":
        event.preventDefault();
        if (!open) {
          openList(
            event.key === "ArrowUp"
              ? Math.max(options.length - 1, 0)
              : selectedIndex >= 0
                ? selectedIndex
                : 0,
          );
        }
        break;
      default:
        break;
    }
  }

  function onListKeyDown(event: React.KeyboardEvent<HTMLUListElement>) {
    if (!open) return;

    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        setActiveIndex((index) =>
          index < options.length - 1 ? index + 1 : 0,
        );
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        setActiveIndex((index) =>
          index > 0 ? index - 1 : options.length - 1,
        );
        break;
      }
      case "Home": {
        event.preventDefault();
        setActiveIndex(0);
        break;
      }
      case "End": {
        event.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      }
      case "Enter":
      case " ": {
        event.preventDefault();
        const option = options[activeIndex];
        if (option) choose(option.value);
        break;
      }
      case "Tab": {
        close();
        break;
      }
      default:
        break;
    }
  }

  return (
    <div ref={rootRef} className="relative block">
      <span
        id={labelId}
        className="mb-2 block text-sm font-medium text-foreground"
      >
        {label}
      </span>

      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={labelId}
        aria-controls={listboxId}
        onClick={() => (open ? close() : openList())}
        onKeyDown={onTriggerKeyDown}
        className={`flex w-full items-center justify-between gap-3 rounded-md border bg-white/80 px-4 py-3 text-left outline-none transition ${
          open
            ? "border-accent ring-2 ring-accent/20"
            : "border-stone focus:border-accent focus:ring-2 focus:ring-accent/20"
        } ${disabled ? "cursor-not-allowed opacity-60" : "hover:border-accent"}`}
      >
        <span
          className={`min-w-0 flex-1 truncate ${
            selected ? "text-foreground" : "text-muted"
          }`}
        >
          {selected ? (
            <>
              {selected.label}
              {selected.description ? (
                <span className="text-muted"> · {selected.description}</span>
              ) : null}
            </>
          ) : (
            placeholder
          )}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          className={`size-4 shrink-0 text-muted transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          <path
            d="M5 7.5 10 12.5 15 7.5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open ? (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={labelId}
          aria-activedescendant={
            activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
          }
          onKeyDown={onListKeyDown}
          className="absolute z-20 mt-2 max-h-60 w-full overflow-auto rounded-md border border-stone bg-white py-1.5 shadow-[0_12px_32px_rgba(10,47,56,0.12)] outline-none animate-dropdown"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;
            return (
              <li
                key={option.value}
                id={`${listboxId}-option-${index}`}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => choose(option.value)}
                className={`mx-1.5 flex cursor-pointer items-start justify-between gap-3 rounded-md px-3 py-2.5 text-sm transition ${
                  isActive || isSelected
                    ? "bg-surface text-foreground"
                    : "text-foreground"
                }`}
              >
                <span className="min-w-0">
                  <span className="block font-medium">{option.label}</span>
                  {option.description ? (
                    <span className="mt-0.5 block text-xs text-muted">
                      {option.description}
                    </span>
                  ) : null}
                </span>
                {isSelected ? (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="mt-0.5 size-4 shrink-0 text-accent"
                  >
                    <path
                      d="M4.5 10.5 8 14l7.5-8"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
