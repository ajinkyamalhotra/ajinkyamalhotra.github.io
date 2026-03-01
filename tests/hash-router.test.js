import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createHashRouter } from "@app/routing/hash-router.js";

function defineNumericLayout(section, { offsetTop, offsetHeight, rectTop }) {
  Object.defineProperty(section, "offsetTop", {
    configurable: true,
    value: offsetTop,
  });
  Object.defineProperty(section, "offsetHeight", {
    configurable: true,
    value: offsetHeight,
  });
  section.getBoundingClientRect = () => ({
    top: rectTop,
    left: 0,
    right: 0,
    bottom: rectTop + offsetHeight,
    width: 100,
    height: offsetHeight,
  });
}

function setScrollY(value) {
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    writable: true,
    value,
  });
}

function setupDom() {
  document.body.innerHTML = `
    <header id="topbar"></header>
    <nav class="nav">
      <a href="#overview" data-nav>Overview</a>
      <a href="#projects" data-nav>Projects</a>
    </nav>
    <main>
      <section id="overview"></section>
      <section id="projects"></section>
    </main>
  `;

  const topbar = document.getElementById("topbar");
  const overview = document.getElementById("overview");
  const projects = document.getElementById("projects");

  Object.defineProperty(topbar, "offsetHeight", {
    configurable: true,
    value: 50,
  });

  defineNumericLayout(overview, { offsetTop: 0, offsetHeight: 450, rectTop: 200 });
  defineNumericLayout(projects, { offsetTop: 450, offsetHeight: 500, rectTop: 650 });
}

describe("hash router", () => {
  const realSetTimeout = window.setTimeout;

  beforeEach(() => {
    setupDom();
    setScrollY(100);
    history.replaceState(null, "", window.location.pathname + window.location.search);
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn().mockReturnValue({ matches: false }),
    });
    Object.defineProperty(window, "setTimeout", {
      configurable: true,
      value: (callback, _delay) => {
        callback();
        return 0;
      },
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "setTimeout", {
      configurable: true,
      value: realSetTimeout,
    });
  });

  it("scrolls to hash targets with topbar offset", () => {
    const scrollSpy = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    const router = createHashRouter();

    router.scrollToHash("#overview");

    expect(scrollSpy).toHaveBeenCalledWith({
      top: 240,
      behavior: "smooth",
    });
  });

  it("binds nav links and updates active section on scroll", () => {
    const pushSpy = vi.spyOn(history, "pushState");
    const replaceSpy = vi.spyOn(history, "replaceState");
    const scrollSpy = vi.spyOn(window, "scrollTo").mockImplementation(() => {});

    const router = createHashRouter();
    router.init();

    const overviewLink = document.querySelector('a[href="#overview"]');
    const projectsLink = document.querySelector('a[href="#projects"]');

    projectsLink.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    expect(pushSpy).toHaveBeenCalledWith(null, "", "#projects");
    expect(scrollSpy).toHaveBeenCalled();

    setScrollY(700);
    window.dispatchEvent(new Event("scroll"));

    expect(projectsLink.classList.contains("nav--active")).toBe(true);
    expect(overviewLink.classList.contains("nav--active")).toBe(false);
    expect(replaceSpy).toHaveBeenLastCalledWith(null, "", "#projects");
  });

  it("uses auto behavior when reduced motion is preferred", () => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn().mockReturnValue({ matches: true }),
    });

    const scrollSpy = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    const router = createHashRouter();

    router.scrollToHash("#overview");

    expect(scrollSpy).toHaveBeenCalledWith({
      top: 240,
      behavior: "auto",
    });
  });
});
