// Sophisticated Scroll Animations and Micro-interactions
document.addEventListener("DOMContentLoaded", function () {
  // ===== SCROLL REVEAL ANIMATIONS =====

  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        // Unobserve after animating to improve performance
        scrollObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all scroll-reveal elements
  const scrollElements = document.querySelectorAll(".scroll-reveal");
  scrollElements.forEach((el) => scrollObserver.observe(el));

  // ===== STAGGERED ANIMATIONS =====

  // Enhanced staggered animations for nav items
  const staggeredContainers = document.querySelectorAll(".stagger-children");
  staggeredContainers.forEach((container) => {
    const children = container.children;
    Array.from(children).forEach((child, index) => {
      child.style.animationDelay = `${index * 100}ms`;
      child.classList.add("animate-fade-in");
    });
  });

  // ===== PARALLAX EFFECTS =====

  // Subtle parallax for hero backgrounds
  const parallaxElements = document.querySelectorAll("[data-parallax]");

  if (parallaxElements.length > 0) {
    let ticking = false;

    function updateParallax() {
      const scrollY = window.pageYOffset;

      parallaxElements.forEach((element) => {
        const speed = parseFloat(element.dataset.parallax) || 0.5;
        const yPos = -(scrollY * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });

      ticking = false;
    }

    function requestParallaxUpdate() {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }

    window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
  }

  // ===== ENHANCED BUTTON RIPPLE EFFECTS =====

  const rippleButtons = document.querySelectorAll(".button-ripple, .btn");

  rippleButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      // Only add ripple if reduced motion is not preferred
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const ripple = document.createElement("span");
        ripple.className = "ripple-effect";
        ripple.style.cssText = `
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: scale(0);
          animation: ripple 600ms ease-out;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          pointer-events: none;
        `;

        button.style.position = "relative";
        button.style.overflow = "hidden";
        button.appendChild(ripple);

        setTimeout(() => {
          ripple.remove();
        }, 600);
      }
    });
  });

  // ===== SMOOTH HOVER STATES =====

  // Enhanced hover effects for cards
  const hoverCards = document.querySelectorAll(
    ".hover-lift, .hover-lift-subtle"
  );

  hoverCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        this.style.willChange = "transform";
      }
    });

    card.addEventListener("mouseleave", function () {
      this.style.willChange = "auto";
    });
  });

  // ===== FLOATING ELEMENTS =====

  // Add subtle floating animation to decorative elements
  const floatingElements = document.querySelectorAll(".animate-float");
  floatingElements.forEach((element, index) => {
    element.style.animationDelay = `${index * 0.5}s`;
  });

  // ===== NAVIGATION ACTIVE STATES =====

  // Highlight current page in navigation
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    const linkPath = new URL(link.href).pathname;
    if (
      linkPath === currentPath ||
      (currentPath.startsWith("/blog") && linkPath === "/blog") ||
      (currentPath.startsWith("/categories") && linkPath === "/categories") ||
      (currentPath.startsWith("/levels") && linkPath === "/levels")
    ) {
      link.classList.add("active");
    }
  });

  // ===== ENHANCED SCROLL BEHAVIOR =====

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // ===== PERFORMANCE OPTIMIZATIONS =====

  // Optimize animations based on user preferences
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.style.setProperty("--duration-fast", "0ms");
    document.documentElement.style.setProperty("--duration-normal", "0ms");
    document.documentElement.style.setProperty("--duration-slow", "0ms");
  }

  // Pause animations when tab is not visible
  document.addEventListener("visibilitychange", function () {
    const animatedElements = document.querySelectorAll('[class*="animate-"]');
    animatedElements.forEach((element) => {
      if (document.hidden) {
        element.style.animationPlayState = "paused";
      } else {
        element.style.animationPlayState = "running";
      }
    });
  });

  // ===== SCROLL PROGRESS INDICATOR =====

  // Create scroll progress bar
  const scrollIndicator = document.createElement("div");
  scrollIndicator.className = "scroll-indicator";
  document.body.appendChild(scrollIndicator);

  function updateScrollProgress() {
    const scrolled = window.pageYOffset;
    const maxHeight = document.body.scrollHeight - window.innerHeight;
    const progress = (scrolled / maxHeight) * 100;
    scrollIndicator.style.transform = `scaleX(${progress / 100})`;
  }

  window.addEventListener("scroll", updateScrollProgress, { passive: true });

  // ===== MAGNETIC BUTTONS =====

  const magneticElements = document.querySelectorAll(".magnetic");

  magneticElements.forEach((element) => {
    element.addEventListener("mousemove", function (e) {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const moveX = x * 0.15;
      const moveY = y * 0.15;

      element.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    element.addEventListener("mouseleave", function () {
      element.style.transform = "translate(0, 0)";
    });
  });

  // ===== TEXT REVEAL ANIMATIONS =====

  function initTextReveal() {
    const textElements = document.querySelectorAll(".text-reveal");

    textElements.forEach((element) => {
      const text = element.textContent;
      const chars = text.split("");
      element.innerHTML = "";

      chars.forEach((char) => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char;
        element.appendChild(span);
      });
    });

    const textObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          textObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    textElements.forEach((el) => textObserver.observe(el));
  }

  // Initialize text reveal after DOM is fully loaded
  initTextReveal();

  // ===== ENHANCED CARD INTERACTIONS =====

  const interactiveCards = document.querySelectorAll(
    ".card, .feature-card, .level-card, .category-card"
  );

  interactiveCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      this.style.transform = "translateY(-8px) scale(1.02)";
      this.style.transition = "transform 0.3s var(--ease-out-expo)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });

  // ===== CSS KEYFRAMES VIA JAVASCRIPT =====

  // Add ripple keyframes if not already present
  if (!document.querySelector("#ripple-keyframes")) {
    const style = document.createElement("style");
    style.id = "ripple-keyframes";
    style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
    document.head.appendChild(style);
  }

  // ===== PAGE LOADING ANIMATION =====

  // Create page loader
  const pageLoader = document.createElement("div");
  pageLoader.id = "page-loader";
  pageLoader.innerHTML = `
    <div class="loader-content">
      <div class="loader-spinner"></div>
      <div class="loader-text">Loading English Project...</div>
    </div>
  `;
  pageLoader.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    transition: opacity 0.5s ease-out, visibility 0.5s ease-out;
  `;

  const loaderContent = pageLoader.querySelector(".loader-content");
  loaderContent.style.cssText = `
    text-align: center;
    animation: fade-in-up 0.6s ease-out;
  `;

  const loaderSpinner = pageLoader.querySelector(".loader-spinner");
  loaderSpinner.style.cssText = `
    width: 40px;
    height: 40px;
    border: 3px solid #e2e8f0;
    border-top: 3px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 16px;
  `;

  const loaderText = pageLoader.querySelector(".loader-text");
  loaderText.style.cssText = `
    color: #64748b;
    font-size: 14px;
    font-weight: 500;
  `;

  // Add keyframes
  const style = document.createElement("style");
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes fade-in-up {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);

  // Show loader immediately
  document.body.appendChild(pageLoader);

  // Hide loader after page is fully loaded
  window.addEventListener("load", function () {
    setTimeout(() => {
      pageLoader.style.opacity = "0";
      pageLoader.style.visibility = "hidden";
      setTimeout(() => {
        if (pageLoader.parentNode) {
          pageLoader.parentNode.removeChild(pageLoader);
        }
      }, 500);
    }, 300); // Small delay to ensure smooth transition
  });

  // Fallback: hide loader after 3 seconds regardless
  setTimeout(() => {
    if (pageLoader.parentNode) {
      pageLoader.style.opacity = "0";
      pageLoader.style.visibility = "hidden";
    }
  }, 3000);
});
