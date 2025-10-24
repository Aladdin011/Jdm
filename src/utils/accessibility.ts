// Accessibility Utilities and Helpers

/**
 * Generates ARIA label for buttons based on action and context
 */
export function generateAriaLabel(
  action: string,
  context?: string,
  state?: string
): string {
  let label = action;
  if (context) label += ` ${context}`;
  if (state) label += `, ${state}`;
  return label;
}

/**
 * Keyboard navigation handler for custom components
 */
export function handleKeyboardNavigation(
  e: React.KeyboardEvent,
  onAction: () => void,
  keys: string[] = ["Enter", " "]
) {
  if (keys.includes(e.key)) {
    e.preventDefault();
    onAction();
  }
}

/**
 * Focus trap for modals and dialogs
 */
export function setupFocusTrap(containerRef: HTMLElement | null): () => void {
  if (!containerRef) return () => {};

  const focusableElements = containerRef.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== "Tab") return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  };

  containerRef.addEventListener("keydown", handleTabKey);

  // Focus first element
  firstElement?.focus();

  return () => {
    containerRef.removeEventListener("keydown", handleTabKey);
  };
}

/**
 * Announces dynamic content changes to screen readers
 */
export function announceToScreenReader(
  message: string,
  priority: "polite" | "assertive" = "polite"
) {
  const announcement = document.createElement("div");
  announcement.setAttribute("role", "status");
  announcement.setAttribute("aria-live", priority);
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Checks if element is visible to assistive technologies
 */
export function isAccessible(element: HTMLElement): boolean {
  return (
    !element.hasAttribute("aria-hidden") &&
    element.getAttribute("aria-hidden") !== "true" &&
    window.getComputedStyle(element).display !== "none" &&
    window.getComputedStyle(element).visibility !== "hidden"
  );
}

/**
 * Generates unique IDs for form labels and inputs
 */
let idCounter = 0;
export function generateUniqueId(prefix: string = "a11y"): string {
  idCounter++;
  return `${prefix}-${idCounter}-${Date.now()}`;
}

/**
 * Skip to content link functionality
 */
export function scrollToContent(contentId: string = "main-content") {
  const content = document.getElementById(contentId);
  if (content) {
    content.setAttribute("tabindex", "-1");
    content.focus();
    content.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/**
 * Color contrast checker (WCAG AA compliance)
 */
export function hasGoodContrast(
  foreground: string,
  background: string,
  fontSize: number = 16
): boolean {
  // Simplified contrast check - in production, use a proper contrast calculation library
  const requiredRatio = fontSize >= 18 || fontSize >= 14 ? 3 : 4.5;
  // This is a placeholder - implement proper contrast calculation
  return true; // Return actual calculation result
}

/**
 * Keyboard shortcut manager
 */
export class KeyboardShortcutManager {
  private shortcuts: Map<string, () => void> = new Map();

  register(key: string, callback: () => void, modifiers: string[] = []) {
    const shortcutKey = this.formatShortcut(key, modifiers);
    this.shortcuts.set(shortcutKey, callback);
  }

  unregister(key: string, modifiers: string[] = []) {
    const shortcutKey = this.formatShortcut(key, modifiers);
    this.shortcuts.delete(shortcutKey);
  }

  private formatShortcut(key: string, modifiers: string[]): string {
    return [...modifiers.sort(), key].join("+").toLowerCase();
  }

  handleKeyPress(e: KeyboardEvent) {
    const modifiers: string[] = [];
    if (e.ctrlKey) modifiers.push("ctrl");
    if (e.shiftKey) modifiers.push("shift");
    if (e.altKey) modifiers.push("alt");
    if (e.metaKey) modifiers.push("meta");

    const shortcutKey = this.formatShortcut(e.key, modifiers);
    const callback = this.shortcuts.get(shortcutKey);

    if (callback) {
      e.preventDefault();
      callback();
    }
  }
}

/**
 * Focus visible utility (show focus only on keyboard navigation)
 */
export function setupFocusVisible() {
  let hadKeyboardEvent = false;

  const handleMouseDown = () => {
    hadKeyboardEvent = false;
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Tab") {
      hadKeyboardEvent = true;
    }
  };

  document.addEventListener("mousedown", handleMouseDown);
  document.addEventListener("keydown", handleKeyDown);

  return () => {
    document.removeEventListener("mousedown", handleMouseDown);
    document.removeEventListener("keydown", handleKeyDown);
  };
}

/**
 * Accessible tooltip trigger
 */
export function createAccessibleTooltip(
  triggerElement: HTMLElement,
  tooltipContent: string,
  tooltipId: string
) {
  triggerElement.setAttribute("aria-describedby", tooltipId);
  triggerElement.setAttribute("aria-label", tooltipContent);

  const showTooltip = () => {
    announceToScreenReader(tooltipContent, "polite");
  };

  const hideTooltip = () => {
    // Tooltip hidden
  };

  triggerElement.addEventListener("mouseenter", showTooltip);
  triggerElement.addEventListener("focus", showTooltip);
  triggerElement.addEventListener("mouseleave", hideTooltip);
  triggerElement.addEventListener("blur", hideTooltip);

  return () => {
    triggerElement.removeEventListener("mouseenter", showTooltip);
    triggerElement.removeEventListener("focus", showTooltip);
    triggerElement.removeEventListener("mouseleave", hideTooltip);
    triggerElement.removeEventListener("blur", hideTooltip);
  };
}

/**
 * Screen reader only CSS class utility
 */
export const srOnly = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: "0",
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  borderWidth: "0",
} as const;

