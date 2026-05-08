/* cropflre.github.io — interactions */
(function () {
  // --- Theme toggle (persisted) ---
  const KEY = "cropflre-theme";
  const root = document.documentElement;
  const saved = localStorage.getItem(KEY);
  if (saved) root.setAttribute("data-theme", saved);

  const btn = document.querySelector("[data-theme-toggle]");
  if (btn) {
    btn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      if (next === "dark") root.removeAttribute("data-theme");
      else root.setAttribute("data-theme", "light");
      localStorage.setItem(KEY, next);
    });
  }

  // --- Reveal on scroll ---
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // --- Card spotlight ---
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--x", `${e.clientX - r.left}px`);
      card.style.setProperty("--y", `${e.clientY - r.top}px`);
    });
  });

  // --- Copy code buttons ---
  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const pre = btn.closest(".codeblock").querySelector("pre");
      const text = pre.innerText;
      navigator.clipboard.writeText(text).then(() => {
        const orig = btn.textContent;
        btn.textContent = "✓ copied";
        setTimeout(() => (btn.textContent = orig), 1400);
      });
    });
  });

  // --- Typewriter for hero subtitle (optional element) ---
  const tw = document.querySelector("[data-typewriter]");
  if (tw) {
    const words = JSON.parse(tw.dataset.words || "[]");
    let wi = 0, ci = 0, del = false;
    const tick = () => {
      const w = words[wi] || "";
      tw.textContent = del ? w.slice(0, --ci) : w.slice(0, ++ci);
      let delay = del ? 40 : 80;
      if (!del && ci === w.length) { delay = 1400; del = true; }
      else if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; delay = 300; }
      setTimeout(tick, delay);
    };
    if (words.length) tick();
  }

  // --- Dynamic year ---
  const y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
})();
