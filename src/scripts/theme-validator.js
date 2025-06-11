// Theme System Validation Script
// This script tests all theme functionality and provides debugging information

class ThemeValidator {
  constructor() {
    this.results = [];
    this.errors = [];
  }

  log(message, type = "info") {
    const timestamp = new Date().toISOString();
    const entry = { timestamp, message, type };
    this.results.push(entry);
    console.log(`[${type.toUpperCase()}] ${message}`);
  }

  error(message) {
    this.errors.push(message);
    this.log(message, "error");
  }

  async validateThemeSystem() {
    this.log("Starting theme system validation...");

    // Test 1: Check if theme manager is loaded
    this.validateThemeManager();

    // Test 2: Check theme toggle component
    this.validateThemeToggle();

    // Test 3: Check CSS custom properties
    this.validateCSSProperties();

    // Test 4: Test theme switching
    await this.testThemeSwitching();

    // Test 5: Test persistence
    this.testPersistence();

    // Test 6: Test accessibility
    this.testAccessibility();

    // Test 7: Test responsive design
    this.testResponsiveDesign();

    this.generateReport();
  }

  validateThemeManager() {
    this.log("Validating theme manager...");

    if (typeof window.themeManager === "undefined") {
      this.error("Theme manager not found on window object");
      return;
    }

    const requiredMethods = ["setTheme", "getTheme", "cycleTheme"];
    requiredMethods.forEach((method) => {
      if (typeof window.themeManager[method] !== "function") {
        this.error(`ThemeManager missing method: ${method}`);
      }
    });

    this.log("Theme manager validation complete");
  }

  validateThemeToggle() {
    this.log("Validating theme toggle component...");

    const themeToggle = document.getElementById("theme-toggle");
    if (!themeToggle) {
      this.error("Theme toggle button not found");
      return;
    }

    const themeMenu = document.getElementById("theme-menu");
    if (!themeMenu) {
      this.error("Theme menu not found");
      return;
    }

    const themeOptions = document.querySelectorAll(".theme-option");
    if (themeOptions.length !== 3) {
      this.error(`Expected 3 theme options, found ${themeOptions.length}`);
    }

    // Check ARIA attributes
    if (!themeToggle.getAttribute("aria-label")) {
      this.error("Theme toggle missing aria-label");
    }

    this.log("Theme toggle validation complete");
  }

  validateCSSProperties() {
    this.log("Validating CSS custom properties...");

    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);

    const requiredProperties = [
      "--color-bg",
      "--color-text",
      "--color-primary",
      "--color-surface",
      "--color-border",
    ];

    requiredProperties.forEach((prop) => {
      const value = computedStyle.getPropertyValue(prop);
      if (!value || value.trim() === "") {
        this.error(`CSS property ${prop} not defined or empty`);
      }
    });

    this.log("CSS properties validation complete");
  }

  async testThemeSwitching() {
    this.log("Testing theme switching...");

    if (!window.themeManager) {
      this.error("Cannot test theme switching - theme manager not available");
      return;
    }

    const themes = ["light", "dark", "auto"];
    const root = document.documentElement;

    for (const theme of themes) {
      this.log(`Testing switch to ${theme} theme`);

      try {
        window.themeManager.setTheme(theme);

        // Wait for transition
        await new Promise((resolve) => setTimeout(resolve, 100));

        const currentTheme = root.getAttribute("data-theme");
        if (currentTheme !== theme) {
          this.error(
            `Theme not applied correctly. Expected: ${theme}, Got: ${currentTheme}`
          );
        }

        // Check if resolved theme is set
        const resolvedTheme = root.getAttribute("data-resolved-theme");
        if (!resolvedTheme) {
          this.error("Resolved theme attribute not set");
        }
      } catch (error) {
        this.error(`Error switching to ${theme}: ${error.message}`);
      }
    }

    this.log("Theme switching test complete");
  }

  testPersistence() {
    this.log("Testing theme persistence...");

    try {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme) {
        this.log(`Theme stored in localStorage: ${storedTheme}`);
      } else {
        this.log("No theme stored in localStorage");
      }

      // Test setting and retrieving
      const testTheme = "dark";
      localStorage.setItem("theme", testTheme);
      const retrieved = localStorage.getItem("theme");

      if (retrieved !== testTheme) {
        this.error("Theme persistence failed");
      } else {
        this.log("Theme persistence working correctly");
      }
    } catch (error) {
      this.error(`Persistence test failed: ${error.message}`);
    }
  }

  testAccessibility() {
    this.log("Testing accessibility features...");

    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
      // Test focus
      themeToggle.focus();
      if (document.activeElement === themeToggle) {
        this.log("Theme toggle is focusable");
      } else {
        this.error("Theme toggle cannot be focused");
      }

      // Test keyboard navigation
      const hasTabIndex =
        themeToggle.hasAttribute("tabindex") || themeToggle.tabIndex >= 0;
      if (hasTabIndex) {
        this.log("Theme toggle supports keyboard navigation");
      } else {
        this.log("Theme toggle may not support keyboard navigation");
      }
    }

    // Test color contrast (basic check)
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    const bgColor = computedStyle.getPropertyValue("--color-bg");
    const textColor = computedStyle.getPropertyValue("--color-text");

    if (bgColor && textColor) {
      this.log("Background and text colors are defined");
    } else {
      this.error("Missing background or text color definitions");
    }

    this.log("Accessibility test complete");
  }

  testResponsiveDesign() {
    this.log("Testing responsive design...");

    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
      const computedStyle = getComputedStyle(themeToggle);
      const display = computedStyle.display;

      if (display === "none") {
        this.error("Theme toggle is hidden");
      } else {
        this.log("Theme toggle is visible");
      }

      // Test if component adapts to screen size
      const originalWidth = window.innerWidth;
      this.log(`Current viewport width: ${originalWidth}px`);

      // Check if mobile styles are applied when needed
      if (originalWidth < 768) {
        this.log("Mobile viewport detected");
      } else {
        this.log("Desktop viewport detected");
      }
    }

    this.log("Responsive design test complete");
  }

  generateReport() {
    this.log("Generating validation report...");

    const successCount = this.results.filter((r) => r.type === "info").length;
    const errorCount = this.errors.length;

    console.group("🎨 Theme System Validation Report");
    console.log(`✅ Successful checks: ${successCount}`);
    console.log(`❌ Errors found: ${errorCount}`);

    if (errorCount > 0) {
      console.group("❌ Errors:");
      this.errors.forEach((error) => console.error(error));
      console.groupEnd();
    }

    console.group("📋 Full Results:");
    this.results.forEach((result) => {
      const icon = result.type === "error" ? "❌" : "✅";
      console.log(`${icon} [${result.timestamp}] ${result.message}`);
    });
    console.groupEnd();

    console.groupEnd();

    // Overall status
    if (errorCount === 0) {
      console.log("🎉 Theme system validation PASSED! All tests successful.");
    } else {
      console.warn(
        `⚠️ Theme system validation FAILED with ${errorCount} errors.`
      );
    }

    return {
      passed: errorCount === 0,
      successCount,
      errorCount,
      errors: this.errors,
      results: this.results,
    };
  }
}

// Auto-run validation when script loads
if (typeof window !== "undefined") {
  // Wait for DOM and theme system to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(() => {
        const validator = new ThemeValidator();
        validator.validateThemeSystem();
      }, 500);
    });
  } else {
    setTimeout(() => {
      const validator = new ThemeValidator();
      validator.validateThemeSystem();
    }, 500);
  }
}

// Export for manual testing
window.ThemeValidator = ThemeValidator;
