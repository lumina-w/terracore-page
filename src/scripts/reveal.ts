export function initReveal(): void {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0 }
  );

  document.querySelectorAll<HTMLElement>('.reveal').forEach((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.classList.add('in');
    } else {
      io.observe(el);
    }
  });

  requestAnimationFrame(() => {
    document.querySelectorAll<HTMLElement>('.reveal:not(.in)').forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        el.classList.add('in');
      }
    });
  });
}
