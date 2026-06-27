// ===== ARM Burst — Script =====

// ===== PRELOADER =====
window.addEventListener("load", () => {
  setTimeout(() => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
      preloader.classList.add("hidden");
    }
  }, 1200);
  animateCounters();
});

// ===== PARTICLE CANVAS =====
const canvas = document.getElementById("particleCanvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedY = -Math.random() * 0.3 - 0.1;
      this.speedX = (Math.random() - 0.5) * 0.2;
      this.opacity = Math.random() * 0.3 + 0.05;
      this.color =
        Math.random() > 0.6
          ? "rgba(0, 0, 0," + this.opacity + ")"
          : "rgba(51, 51, 51," + this.opacity + ")";
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      if (this.y < -10) this.reset();
      if (this.y < -10) this.y = canvas.height + 10;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  // Create particles
  for (let i = 0; i < 60; i++) {
    particles.push(new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

// ===== CURSOR GLOW =====
const glow = document.getElementById("cursorGlow");
if (glow) {
  document.addEventListener("mousemove", (e) => {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
  });
}

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById("navbar");
let lastScroll = 0;
window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;
  if (navbar) {
    if (currentScroll > 60) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }
  lastScroll = currentScroll;
});

// ===== MOBILE MENU =====
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
const closeMenu = document.getElementById("closeMenu");

if (hamburger && mobileMenu && closeMenu) {
  hamburger.addEventListener("click", () => {
    mobileMenu.classList.add("active");
  });
  closeMenu.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
  });
}

function closeMobile() {
  if (mobileMenu) {
    mobileMenu.classList.remove("active");
  }
}

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("active");
        }, i * 120);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
);

revealElements.forEach((el) => revealObserver.observe(el));

// ===== ABOUT EXPERIENCE BAR =====
const barFill = document.querySelector(".bar-fill");
if (barFill) {
  const barObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          barFill.classList.add("active");
          barObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 },
  );
  barObserver.observe(barFill.closest(".about-exp-bar"));
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
  const counters = document.querySelectorAll("[data-count]");
  counters.forEach((counter) => {
    const target = parseInt(counter.dataset.count);
    const duration = 2000;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      if (target >= 1000) {
        counter.textContent = current.toLocaleString() + "+";
      } else {
        counter.textContent = current + "+";
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }
    // Delay start for visual effect
    setTimeout(() => requestAnimationFrame(updateCounter), 800);
  });
}

// ===== REVIEWS INFINITE SCROLL =====
// Removed innerHTML duplication to avoid breaking inline script references

// ===== SMOOTH SCROLL FOR NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Collect values
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const interest = document.getElementById("interest").value;
    const message = document.getElementById("message").value;

    const btn = document.getElementById("submitBtn");
    const originalText = btn.textContent;

    // The UX
    btn.textContent = "Connecting to WhatsApp...";
    btn.style.opacity = "0.7";
    btn.disabled = true;

    // The Backup: Silently send to Netlify Forms
    const formData = new URLSearchParams();
    formData.append("form-name", "Gym-Leads");
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("interest", interest);
    formData.append("message", message);

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    }).catch((error) => console.error("Form submission error:", error));

    setTimeout(() => {
      // The Formatting
      const waMessage = `🦖 ARM Burst GYM INQUIRY\n\n👤 Name: ${name}\n📞 Phone: ${phone}\n✉️ Email: ${email}\n🏋️ Interest: ${interest}\n🎯 Goal: ${message}`;
      const encodedMessage = encodeURIComponent(waMessage);

      // The Redirection
      const waUrl = `https://wa.me/918838344590?text=${encodedMessage}`;
      window.open(waUrl, "_blank");

      contactForm.reset();

      btn.textContent = originalText;
      btn.style.opacity = "1";
      btn.disabled = false;
    }, 1200);
  });
}

// ===== PARALLAX EFFECT ON HERO =====
window.addEventListener("scroll", () => {
  const scrolled = window.scrollY;
  const heroVisual = document.querySelector(".hero-visual");
  if (heroVisual && scrolled < window.innerHeight) {
    heroVisual.style.transform = `translateY(${scrolled * 0.08}px)`;
  }
});

// ===== ACTIVE NAV LINK HIGHLIGHT =====
const sections = document.querySelectorAll("section[id]");
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY + 200;
  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute("id");
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        link.style.color = "var(--gold)";
      } else {
        link.style.color = "";
      }
    }
  });
});

// ===== TILT EFFECT ON CARDS =====
document.querySelectorAll(".infra-card, .achiever-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

// ===== FOUNDERS CAROUSEL =====
function initFoundersCarousel() {
  const carousel = document.getElementById("foundersCarousel");
  const imageStage = document.getElementById("foundersImageStage");
  const textPanel = document.getElementById("foundersTextPanel");
  const nameEl = document.getElementById("foundersName");
  const roleEl = document.getElementById("foundersRole");
  const quoteEl = document.getElementById("foundersQuote");
  const prevBtn = document.getElementById("foundersPrev");
  const nextBtn = document.getElementById("foundersNext");

  if (!carousel || !imageStage) return;

  const founders = [
    {
      name: "Mr Owner",
      role: "Founder & Head Coach",
      quote:
        "A dedicated fitness professional with a vision to revolutionize the training experience. With over a decade of mastery in bodybuilding and nutrition, he has laid the foundation for ARM Burst's elite standards.",
    },
    {
      name: "The Strategist",
      role: "Founder & Strategic Lead",
      quote:
        "Driving the strategic growth and excellence of ARM Burst. His commitment to providing a world-class environment ensures that every athlete has the tools needed to surpass their own limits.",
    },
  ];

  const images = Array.from(
    imageStage.querySelectorAll(".founders-carousel-img"),
  );
  const total = founders.length;
  let activeIndex = 0;
  let autoplayTimer = null;

  function calculateGap(width) {
    const minWidth = 320;
    const maxWidth = 1456;
    const minGap = width <= 480 ? 36 : 60;
    const maxGap = 86;
    if (width <= minWidth) return minGap;
    if (width >= maxWidth)
      return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth));
    return (
      minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth))
    );
  }

  function updateLayoutVars() {
    const width = imageStage.offsetWidth;
    const gap = calculateGap(width);
    imageStage.style.setProperty("--founders-gap", `${gap}px`);
    imageStage.style.setProperty("--founders-stick-up", `${gap * 0.8}px`);
  }

  function updateImages() {
    images.forEach((img, index) => {
      img.classList.remove("is-active", "is-left", "is-right", "is-hidden");
      const isActive = index === activeIndex;
      const isLeft = index === (activeIndex - 1 + total) % total;
      const isRight = index === (activeIndex + 1) % total;

      if (isActive) img.classList.add("is-active");
      else if (isLeft) {
        img.classList.add("is-left");
        img.style.setProperty("--founders-side", "-1");
      } else if (isRight) {
        img.classList.add("is-right");
        img.style.setProperty("--founders-side", "1");
      } else img.classList.add("is-hidden");
    });
  }

  function renderQuote(text) {
    quoteEl.innerHTML = "";
    text.split(" ").forEach((word, i) => {
      const span = document.createElement("span");
      span.className = "quote-word";
      span.style.animationDelay = `${0.025 * i}s`;
      span.textContent = `${word} `;
      quoteEl.appendChild(span);
    });
  }

  function updateText() {
    const founder = founders[activeIndex];
    textPanel.classList.add("is-changing");

    window.setTimeout(() => {
      nameEl.textContent = founder.name;
      roleEl.textContent = founder.role;
      renderQuote(founder.quote);
      textPanel.classList.remove("is-changing");
    }, 180);
  }

  function goTo(index, fromAutoplay = false) {
    activeIndex = (index + total) % total;
    updateLayoutVars();
    updateImages();
    updateText();
    if (!fromAutoplay) resetAutoplay();
  }

  function next(fromAutoplay = false) {
    goTo(activeIndex + 1, fromAutoplay);
  }

  function prev() {
    goTo(activeIndex - 1);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => next(true), 5000);
  }

  prevBtn?.addEventListener("click", () => prev());
  nextBtn?.addEventListener("click", () => next());

  carousel.addEventListener("mouseenter", () => clearInterval(autoplayTimer));
  carousel.addEventListener("mouseleave", resetAutoplay);

  window.addEventListener("keydown", (e) => {
    const inView =
      carousel.getBoundingClientRect().top < window.innerHeight &&
      carousel.getBoundingClientRect().bottom > 0;
    if (!inView) return;
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  });

  window.addEventListener("resize", () => {
    updateLayoutVars();
    updateImages();
  });

  // Touch swipe support for mobile
  let touchStartX = 0;
  imageStage.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true },
  );

  imageStage.addEventListener(
    "touchend",
    (e) => {
      const diff = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(diff) < 40) return;
      if (diff > 0) prev();
      else next();
    },
    { passive: true },
  );

  updateLayoutVars();
  updateImages();
  renderQuote(founders[0].quote);
  resetAutoplay();
}

initFoundersCarousel();

// ===== REVIEWS STACKED CAROUSEL =====
function initReviewsCarousel() {
  const carousel = document.getElementById("reviewsCarousel");
  const stage = document.getElementById("reviewsCarouselStage");
  const dotsWrap = document.getElementById("reviewCarouselDots");
  const prevBtn = document.getElementById("reviewCarouselPrev");
  const nextBtn = document.getElementById("reviewCarouselNext");

  if (!carousel || !stage || !dotsWrap) return;

  const cards = Array.from(stage.querySelectorAll(".review-card"));
  const total = cards.length;
  let currentIndex = 0;
  let exitX = 0;
  let isAnimating = false;
  let autoTimer = null;

  let dragStartX = 0;
  let dragCurrentX = 0;
  let isDragging = false;

  cards.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "review-carousel-dot" + (i === 0 ? " active" : "");
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", `Go to review ${i + 1}`);
    dot.setAttribute("aria-selected", i === 0 ? "true" : "false");
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  const dots = Array.from(dotsWrap.querySelectorAll(".review-carousel-dot"));

  function stackIndex(offset) {
    return (currentIndex + offset) % total;
  }

  function getCurrentCard() {
    return cards[currentIndex];
  }

  function updateStack() {
    cards.forEach((card, index) => {
      card.classList.remove(
        "review-card--current",
        "review-card--stack-1",
        "review-card--stack-2",
        "review-card--hidden",
        "review-card--exiting-left",
        "review-card--exiting-right",
      );
      card.style.transform = "";
      card.style.opacity = "";

      if (index === currentIndex) {
        card.classList.add("review-card--current");
      } else if (index === stackIndex(1)) {
        card.classList.add("review-card--stack-1");
      } else if (index === stackIndex(2)) {
        card.classList.add("review-card--stack-2");
      } else {
        card.classList.add("review-card--hidden");
      }
    });

    dots.forEach((dot, i) => {
      const active = i === currentIndex;
      dot.classList.toggle("active", active);
      dot.setAttribute("aria-selected", active ? "true" : "false");
    });

    applyDragTransform();
  }

  function applyDragTransform() {
    const current = getCurrentCard();
    if (!current || !isDragging) return;

    const rotate = exitX / 20;
    current.style.transform = `translate(${exitX}px, 0) scale(1) rotate(${rotate}deg)`;
    current.style.opacity = String(Math.max(0.4, 1 - Math.abs(exitX) / 400));
  }

  function clearDragStyles() {
    const current = getCurrentCard();
    if (current) {
      current.style.transform = "";
      current.style.opacity = "";
    }
    exitX = 0;
    isDragging = false;
  }

  function advance(direction = 1) {
    if (isAnimating) return;
    isAnimating = true;

    const current = getCurrentCard();
    const outClass =
      direction > 0
        ? "review-card--exiting-right"
        : "review-card--exiting-left";
    const outX = direction > 0 ? 120 : -120;

    if (current) {
      current.classList.add(outClass);
      current.style.transform = `translate(${outX}px, 0) rotate(${outX / 20}deg)`;
      current.style.opacity = "0";
    }

    window.setTimeout(() => {
      currentIndex = (currentIndex + direction + total) % total;
      clearDragStyles();
      updateStack();
      isAnimating = false;
      resetAuto();
    }, 220);
  }

  function next() {
    advance(1);
  }

  function prev() {
    advance(-1);
  }

  function goTo(index) {
    if (isAnimating || index === currentIndex) return;
    clearDragStyles();
    currentIndex = ((index % total) + total) % total;
    updateStack();
    resetAuto();
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      if (!isDragging && !isAnimating) next();
    }, 5000);
  }

  function onPointerDown(e) {
    if (isAnimating) return;
    const current = getCurrentCard();
    if (!current || !current.classList.contains("review-card--current")) return;
    if (e.target.closest(".review-card-arrow")) return;

    isDragging = true;
    dragStartX = e.clientX;
    dragCurrentX = dragStartX;
    current.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    dragCurrentX = e.clientX;
    exitX = dragCurrentX - dragStartX;
    applyDragTransform();
  }

  function onPointerUp(e) {
    if (!isDragging) return;
    const current = getCurrentCard();
    if (current) {
      try {
        current.releasePointerCapture(e.pointerId);
      } catch (_) {
        /* ignore */
      }
    }

    if (Math.abs(exitX) > 100) {
      const direction = exitX < 0 ? 1 : -1;
      isDragging = false;
      advance(direction);
    } else {
      clearDragStyles();
      updateStack();
    }

    isDragging = false;
    resetAuto();
  }

  prevBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    prev();
  });
  nextBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    next();
  });

  stage.addEventListener("pointerdown", onPointerDown);
  stage.addEventListener("pointermove", onPointerMove);
  stage.addEventListener("pointerup", onPointerUp);
  stage.addEventListener("pointercancel", onPointerUp);

  carousel.addEventListener("mouseenter", () => clearInterval(autoTimer));
  carousel.addEventListener("mouseleave", resetAuto);

  updateStack();
  resetAuto();
}

initReviewsCarousel();

// ===== GOLD SHIMMER ON SECTION TITLES =====
const sectionTitles = document.querySelectorAll(".section-title");
const shimmerObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animation = "goldShimmer 3s ease-in-out";
        shimmerObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 },
);
sectionTitles.forEach((el) => shimmerObserver.observe(el));
