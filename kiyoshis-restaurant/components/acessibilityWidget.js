import { useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "kiyoshi.accessibility";

const defaultPrefs = {
  darkMode: false,
  largeText: false,
  customCursor: false,
  comfortableLineHeight: false,
  extraLetterSpacing: false,
  dyslexiaFriendlyFont: false,
};

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState(defaultPrefs);
  const panelRef = useRef(null);
  const triggerRef = useRef(null);

  const actions = useMemo(
    () => [
      {
        id: "largeText",
        label: "Large Text",
        description: "Increase base text size.",
      },
      {
        id: "darkMode",
        label: "Dark Theme",
        description: "Use lower-glare colors.",
      },
      {
        id: "customCursor",
        label: "High-Visibility Cursor",
        description: "Use a clearer pointer style.",
      },
      {
        id: "comfortableLineHeight",
        label: "Comfortable Line Height",
        description: "Add more vertical reading space.",
      },
      {
        id: "extraLetterSpacing",
        label: "Extra Letter Spacing",
        description: "Increase character spacing.",
      },
      {
        id: "dyslexiaFriendlyFont",
        label: "Dyslexia-Friendly Font",
        description: "Switch to a clearer sans-serif stack.",
      },
    ],
    []
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const savedRaw = window.localStorage.getItem(STORAGE_KEY);
      if (!savedRaw) return;
      const saved = JSON.parse(savedRaw);
      setPrefs((prev) => ({ ...prev, ...saved }));
    } catch {
      // Ignore malformed localStorage values and keep defaults.
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    root.classList.toggle("a11y-dark", prefs.darkMode);
    root.classList.toggle("a11y-large-text", prefs.largeText);
    root.classList.toggle("a11y-cursor", prefs.customCursor);
    root.classList.toggle("a11y-line-height", prefs.comfortableLineHeight);
    root.classList.toggle("a11y-letter-spacing", prefs.extraLetterSpacing);
    root.classList.toggle("a11y-dyslexia-font", prefs.dyslexiaFriendlyFont);

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  }, [prefs]);

  useEffect(() => {
    if (!open || !panelRef.current) return;

    const focusables = panelRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusables.length > 0) {
      focusables[0].focus();
    }

    const onEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    const trapTab = (event) => {
      if (event.key !== "Tab") return;
      const nodeList = panelRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!nodeList || nodeList.length === 0) return;

      const first = nodeList[0];
      const last = nodeList[nodeList.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onEscape);
    document.addEventListener("keydown", trapTab);

    return () => {
      document.removeEventListener("keydown", onEscape);
      document.removeEventListener("keydown", trapTab);
    };
  }, [open]);

  // Alt+W hotkey: toggle widget open/closed — works in all browsers
  useEffect(() => {
    const handleHotkey = (e) => {
      if (e.altKey && e.key.toLowerCase() === "w") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleHotkey);
    return () => document.removeEventListener("keydown", handleHotkey);
  }, []);

  // Alt+A hotkey: focus the first add-to-cart button; if one is already focused, click it
  useEffect(() => {
    const handleAddToCart = (e) => {
      if (!e.altKey || e.key.toLowerCase() !== "a") return;
      const focused = document.activeElement;
      if (focused && focused.dataset.addToCart) {
        e.preventDefault();
        focused.click();
      } else {
        const first = document.querySelector("[data-add-to-cart]");
        if (first) {
          e.preventDefault();
          first.focus();
          first.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    };
    document.addEventListener("keydown", handleAddToCart);
    return () => document.removeEventListener("keydown", handleAddToCart);
  }, []);

  const togglePref = (name) => {
    setPrefs((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const clearSettings = () => {
    setPrefs(defaultPrefs);
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="a11y-fab"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open accessibility settings"
        aria-haspopup="dialog"
        aria-expanded={open}
        title="Accessibility settings (Alt+W)"
      >
        <svg
          className="a11y-fab-icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="12" cy="4.6" r="1.8" fill="currentColor" />
          <path
            fill="currentColor"
            d="M5.1 8.35a.9.9 0 0 1 .9-.9h12a.9.9 0 1 1 0 1.8h-4.55v2.1c0 .67.06 1.34.19 2l1.05 5.23a.92.92 0 0 1-1.8.36l-.9-4.45-1.24 4.1a.92.92 0 1 1-1.76-.53l1.51-4.93c.14-.49.21-1 .21-1.51V9.25H6a.9.9 0 0 1-.9-.9Z"
          />
        </svg>
      </button>

      {open ? (
        <div className="a11y-overlay" onClick={() => setOpen(false)}>
          <section
            ref={panelRef}
            className="a11y-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="a11y-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="a11y-panel-header">
              <div>
                <p className="a11y-kicker">Accessibility</p>
                <h2 id="a11y-title">Reading And Navigation Tools</h2>
              </div>
              <button
                type="button"
                className="a11y-close"
                onClick={() => setOpen(false)}
                aria-label="Close accessibility settings"
                title="Close (Esc)"
              >
                Close
              </button>
            </header>

            <p className="a11y-subtitle">Adjust visibility and reading comfort options for this site.</p>

            <ul className="a11y-actions" aria-label="Accessibility options">
              {actions.map((action) => {
                const enabled = prefs[action.id];
                return (
                  <li key={action.id}>
                    <button
                      type="button"
                      className="a11y-option"
                      onClick={() => togglePref(action.id)}
                      aria-pressed={enabled}
                      title={action.label}
                    >
                      <span className="a11y-option-copy">
                        <strong>{action.label}</strong>
                        <small>{action.description}</small>
                      </span>
                      <span className="a11y-state" aria-hidden="true">
                        {enabled ? "On" : "Off"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <footer className="a11y-panel-footer">
              <button
                type="button"
                className="a11y-reset"
                onClick={clearSettings}
                title="Reset all accessibility settings"
              >
                Reset All
              </button>
            </footer>
          </section>
        </div>
      ) : null}
    </>
  );
}
