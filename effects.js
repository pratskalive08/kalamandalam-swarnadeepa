(() => {
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const definitions = [
    { selector: ".home-hero", start: 100, end: 120, unit: "%", topDriven: true },
    { selector: ".home-about", start: 80, end: 98, unit: "vh" },
    { selector: ".training-scene", start: 112, end: 136, unit: "%" },
    { selector: ".awards", start: 88, end: 100, unit: "%" },
    { selector: ".performance-feature", start: 112, end: 136, unit: "%" },
    { selector: ".page-hero", start: 112, end: 136, unit: "%", topDriven: true },
    { selector: ".editorial-row .photo", start: 50, end: 60, unit: "vw" }
  ];

  const targets = definitions.flatMap((definition) =>
    [...document.querySelectorAll(definition.selector)].map((element) => ({
      ...definition,
      element
    }))
  );

  if (!targets.length) return;

  let frameRequested = false;

  function update() {
    frameRequested = false;

    for (const target of targets) {
      const { element, start, end, unit, topDriven } = target;
      let progress = 0;

      if (!reduceMotion) {
        if (topDriven) {
          const sectionTop = element.offsetTop;
          progress = clamp((window.scrollY - sectionTop) / Math.max(element.offsetHeight, 1));
        } else {
          const rect = element.getBoundingClientRect();
          progress = clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height));
        }
      }

      const value = start + (end - start) * progress;
      element.style.setProperty("--zoom-size", `${value.toFixed(3)}${unit}`);
    }
  }

  function requestUpdate() {
    if (frameRequested) return;
    frameRequested = true;
    requestAnimationFrame(update);
  }

  addEventListener("scroll", requestUpdate, { passive: true });
  addEventListener("resize", requestUpdate);
  addEventListener("load", requestUpdate, { once: true });
  update();
})();
