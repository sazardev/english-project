/**
 * Advanced Theme Management System
 * Supports light, dark, and auto modes with sophisticated animations
 */

class ThemeManager {
  constructor() {
    this.themes = ["light", "dark", "auto"];
    this.currentTheme = "auto";
    this.mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    this.themeLabels = {
      light: "Claro",
      dark: "Oscuro",
      auto: "Auto",
    };

    this.init();
  }

  init() {
    // Load saved theme or default to auto
    this.currentTheme = localStorage.getItem("theme") || "auto";

    // Apply initial theme without transition
    this.applyTheme(this.currentTheme, false);

    // Listen for system preference changes
    this.mediaQuery.addEventListener("change", () => {
      if (this.currentTheme === "auto") {
        this.updateSystemTheme();
      }
    });

    // Setup theme toggle functionality
    this.setupThemeToggle();

    // Update UI to reflect current theme
    this.updateThemeUI();

    // Add smooth transition class after initial load
    setTimeout(() => {
      document.documentElement.classList.add("theme-transitions");
    }, 150);

    // Add keyboard support
    this.setupKeyboardSupport();
  }

  setupThemeToggle() {
    const themeToggle = document.getElementById("theme-toggle");
    const themeMenu = document.getElementById("theme-menu");
    const themeOptions = document.querySelectorAll(".theme-option");

    if (!themeToggle || !themeMenu) return; // Toggle menu on click
    themeToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = themeMenu.classList.contains("open");

      if (isOpen) {
        this.closeThemeMenu();
      } else {
        this.openThemeMenu();
      }
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!themeToggle.contains(e.target) && !themeMenu.contains(e.target)) {
        themeMenu.classList.remove("open");
      }
    });

    // Handle theme option clicks
    themeOptions.forEach((option) => {
      option.addEventListener("click", (e) => {
        const selectedTheme = option.dataset.theme;
        if (selectedTheme && selectedTheme !== this.currentTheme) {
          this.setTheme(selectedTheme);
          themeMenu.classList.remove("open");
        }
      });
    });

    // Keyboard navigation for accessibility
    themeToggle.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        themeMenu.classList.toggle("open");
      } else if (e.key === "Escape") {
        themeMenu.classList.remove("open");
      }
    });
  }

  openThemeMenu() {
    const themeMenu = document.getElementById("theme-menu");
    if (themeMenu) {
      themeMenu.classList.add("open");
      // Focus first theme option for accessibility
      const firstOption = themeMenu.querySelector(".theme-option");
      if (firstOption) {
        firstOption.focus();
      }
    }
  }

  closeThemeMenu() {
    const themeMenu = document.getElementById("theme-menu");
    if (themeMenu) {
      themeMenu.classList.remove("open");
    }
  }

  setupKeyboardSupport() {
    // Enhanced keyboard navigation for theme menu
    document.addEventListener("keydown", (e) => {
      const themeMenu = document.getElementById("theme-menu");
      if (!themeMenu || !themeMenu.classList.contains("open")) return;

      if (e.key === "Escape") {
        e.preventDefault();
        this.closeThemeMenu();
        document.getElementById("theme-toggle")?.focus();
      } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const options = Array.from(themeMenu.querySelectorAll(".theme-option"));
        const currentIndex = options.findIndex(
          (option) => option === document.activeElement
        );

        let nextIndex;
        if (e.key === "ArrowDown") {
          nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
        } else {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
        }

        options[nextIndex]?.focus();
      }
    });
  }

  setTheme(theme) {
    if (!this.themes.includes(theme)) return;

    this.currentTheme = theme;

    // Save to localStorage
    localStorage.setItem("theme", theme);

    // Apply theme with animation
    this.applyTheme(theme, true);

    // Update UI
    this.updateThemeUI();

    // Trigger custom event for other components
    window.dispatchEvent(
      new CustomEvent("themechange", {
        detail: { theme, resolvedTheme: this.getResolvedTheme() },
      })
    );
  }

  applyTheme(theme, animate = false) {
    const root = document.documentElement;

    if (animate) {
      root.classList.add("theme-switching");

      // Add ripple effect
      this.createThemeRipple();

      setTimeout(() => {
        root.classList.remove("theme-switching");
      }, 300);
    }

    // Remove existing theme classes
    root.classList.remove("theme-light", "theme-dark", "theme-auto");

    // Add new theme class
    root.classList.add(`theme-${theme}`);

    // Set data attribute for CSS selectors
    root.setAttribute("data-theme", theme);

    // Apply resolved theme for auto mode
    const resolvedTheme = this.getResolvedTheme();
    root.setAttribute("data-resolved-theme", resolvedTheme);

    // Update meta theme-color for mobile browsers
    this.updateMetaThemeColor(resolvedTheme);
  }

  getResolvedTheme() {
    if (this.currentTheme === "auto") {
      return this.mediaQuery.matches ? "dark" : "light";
    }
    return this.currentTheme;
  }

  updateSystemTheme() {
    if (this.currentTheme === "auto") {
      this.applyTheme("auto", true);
      this.updateThemeUI();

      // Trigger custom event
      window.dispatchEvent(
        new CustomEvent("themechange", {
          detail: { theme: "auto", resolvedTheme: this.getResolvedTheme() },
        })
      );
    }
  }

  updateThemeUI() {
    const themeLabel = document.getElementById("theme-label");
    const themeOptions = document.querySelectorAll(".theme-option");
    const themeIcons = document.querySelectorAll(".theme-icon");

    // Update label
    if (themeLabel) {
      themeLabel.textContent =
        this.currentTheme.charAt(0).toUpperCase() + this.currentTheme.slice(1);
    }

    // Update active option
    themeOptions.forEach((option) => {
      const isActive = option.dataset.theme === this.currentTheme;
      option.classList.toggle("active", isActive);
    });

    // Update active icon
    themeIcons.forEach((icon) => {
      icon.classList.remove("active");
    });

    const resolvedTheme = this.getResolvedTheme();
    let activeIconClass;

    if (this.currentTheme === "auto") {
      activeIconClass = ".auto-icon";
    } else {
      activeIconClass =
        this.currentTheme === "dark" ? ".dark-icon" : ".light-icon";
    }

    const activeIcon = document.querySelector(activeIconClass);
    if (activeIcon) {
      activeIcon.classList.add("active");
    }
  }

  updateMetaThemeColor(theme) {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const color = theme === "dark" ? "#1f2937" : "#ffffff";
      metaThemeColor.setAttribute("content", color);
    }
  }

  createThemeRipple() {
    const themeToggle = document.getElementById("theme-toggle");
    if (!themeToggle) return;

    const ripple = document.createElement("div");
    ripple.className = "theme-ripple";

    const rect = themeToggle.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = rect.width / 2 - size / 2 + "px";
    ripple.style.top = rect.height / 2 - size / 2 + "px";

    themeToggle.style.position = "relative";
    themeToggle.appendChild(ripple);

    // Trigger animation
    requestAnimationFrame(() => {
      ripple.classList.add("animate");
    });

    // Clean up
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }

  // Public methods for external use
  getTheme() {
    return this.currentTheme;
  }

  getResolvedThemeValue() {
    return this.getResolvedTheme();
  }

  isDark() {
    return this.getResolvedTheme() === "dark";
  }

  isLight() {
    return this.getResolvedTheme() === "light";
  }

  // Cycle through themes (for keyboard shortcuts)
  cycleTheme() {
    const currentIndex = this.themes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % this.themes.length;
    this.setTheme(this.themes[nextIndex]);
  }
}

// Initialize theme manager
let themeManager;

// Wait for DOM to be ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    themeManager = new ThemeManager();
  });
} else {
  themeManager = new ThemeManager();
}

// Add keyboard shortcut (Ctrl/Cmd + Shift + L)
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "l") {
    e.preventDefault();
    if (themeManager) {
      themeManager.cycleTheme();
    }
  }
});

// Export for external use
window.themeManager = themeManager;

// Enhanced CSS for theme transitions and effects
const themeStyles = document.createElement("style");
themeStyles.textContent = `
  /* Theme transition styles */
  .theme-transitions {
    transition: background-color var(--duration-normal) var(--ease-out-quart),
                color var(--duration-normal) var(--ease-out-quart);
  }

  .theme-transitions *,
  .theme-transitions *::before,
  .theme-transitions *::after {
    transition: background-color var(--duration-normal) var(--ease-out-quart),
                color var(--duration-normal) var(--ease-out-quart),
                border-color var(--duration-normal) var(--ease-out-quart),
                box-shadow var(--duration-normal) var(--ease-out-quart);
  }

  /* Theme switching animation */
  .theme-switching {
    animation: themePulse var(--duration-normal) var(--ease-out-quart);
  }

  @keyframes themePulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(0.98); }
  }

  /* Theme ripple effect */
  .theme-ripple {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
    transform: scale(0);
    pointer-events: none;
    z-index: 1;
  }

  .theme-ripple.animate {
    animation: themeRippleEffect 600ms var(--ease-out-expo);
  }

  @keyframes themeRippleEffect {
    0% {
      transform: scale(0);
      opacity: 1;
    }
    100% {
      transform: scale(2);
      opacity: 0;
    }
  }

  /* Prevent flash of incorrect theme */
  html:not([data-theme]) {
    visibility: hidden;
  }

  html[data-theme] {
    visibility: visible;
  }

  /* Enhanced focus states for theme toggle */
  .theme-toggle:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .theme-transitions,
    .theme-transitions *,
    .theme-transitions *::before,
    .theme-transitions *::after {
      transition: none !important;
    }
    
    .theme-switching {
      animation: none !important;
    }
    
    .theme-ripple {
      display: none !important;
    }
  }
`;

document.head.appendChild(themeStyles);
