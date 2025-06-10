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
