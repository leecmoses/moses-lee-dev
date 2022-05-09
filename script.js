"use strict";

///////////////////////////////////////
// Modal window

const btnScrollTo = document.querySelector(".btn--scroll-to");
const section2 = document.querySelector("#section--2");
const nav = document.querySelector(".nav");
const tabs = document.querySelectorAll(".toolkit__tab");
const tabsContainer = document.querySelector(".toolkit__tab-container");
const tabsContent = document.querySelectorAll(".toolkit__content");
const allSections = document.querySelectorAll(".section");

///////////////////////////////////////
// Button scrolling

btnScrollTo.addEventListener("click", (e) => {
  section2.scrollIntoView({ behavior: "smooth" });
});

///////////////////////////////////////
// Page navigation
document.querySelector(".nav__logo").addEventListener("click", (e) => {
  e.preventDefault();
  const id = e.target.closest(".nav__link").getAttribute("href");
  document.querySelector(id).scrollIntoView({ behavior: "smooth" });
});

document.querySelector(".nav__links").addEventListener("click", (e) => {
  e.preventDefault();

  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

///////////////////////////////////////
// Tabbed Component

// One way to add the event listeners but not the best way
// tabs.forEach((tab) => tab.addEventListener("click", () => console.log("tab")));

// Use event delegation
tabsContainer.addEventListener("click", (e) => {
  const clicked = e.target.closest(".toolkit__tab");

  // Guard clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach((tab) => {
    tab.classList.remove("toolkit__tab--active");
  });

  tabsContent.forEach((tab) => {
    tab.classList.remove("toolkit__content--active");
  });

  // Active tab
  clicked.classList.add("toolkit__tab--active");

  // Activate content area
  document
    .querySelector(`.toolkit__content--${clicked.dataset.tab}`)
    .classList.add("toolkit__content--active");
});

///////////////////////////////////////
// Menu Fade Animation
const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");

    siblings.forEach((el) => {
      if (el !== link) {
        el.style.opacity = this;
      }
    });
  }
};

// Option #1: Have a callback function with a function inside
// nav.addEventListener("mouseover", (e) => handleHover(e, 0.5));
// nav.addEventListener("mouseout", (e) => handleHover(e, 1));

// Option #2: Use bind method
// The "argument" or this keyword is now the opacity value and the event currentTarget stays the same
nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

///////////////////////////////////////
// Sticky Navigation
const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

///////////////////////////////////////
// Reveal Sections
const revealSection = function (entries, observer) {
  const [entry] = entries;

  // Guard clause
  if (!entry.isIntersecting) return;

  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach((section) => {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

///////////////////////////////////////
// Lazy Loading Images

const imgTargets = document.querySelectorAll("img[data-src]");

const loadImg = function (entries, observer) {
  const [entry] = entries;

  // Guard clause
  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", () => {
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

imgTargets.forEach((img) => {
  imgObserver.observe(img);
});

///////////////////////////////////////
// Slider
const slider = () => {
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotsContainer = document.querySelector(".dots");

  let curSlide = 0;
  const maxSlide = slides.length - 1;

  const slider = document.querySelector(".slider");
  slider.style.overflow = "invisible";

  slides.forEach(
    (slide, index) => (slide.style.transform = `translateX(${index * 100}%)`)
  );

  const createDots = () => {
    slides.forEach((_, i) => {
      dotsContainer.insertAdjacentHTML(
        "beforeend",
        `<button class='dots__dot' data-slide='${i}'></button>`
      );
    });
  };

  const activateDot = (slide) => {
    // Remove the active class from all the dots
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));

    // Add the active class to the current dot
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  const goToSlide = (cur) => {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${(i - cur) * 100}%)`)
    );
    activateDot(cur);
  };

  const nextSlide = () => {
    if (curSlide === maxSlide) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
  };

  const prevSlide = () => {
    if (curSlide === 0) {
      curSlide = maxSlide;
    } else {
      curSlide--;
    }

    goToSlide(curSlide);
  };

  const init = () => {
    createDots();
    goToSlide(0);
    activateDot(0);
  };

  init();

  // Event Handlers
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", (e) => {
    // Short circuiting
    e.key === "ArrowLeft" && prevSlide();
    e.key === "ArrowRight" && nextSlide();
  });

  // Event delegation
  dotsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
    }
  });
};

slider();
