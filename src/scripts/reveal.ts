export function initReveal(): void {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).classList.add('in');
        } else {
          (e.target as HTMLElement).classList.remove('in');
        }
      });
    },
    { threshold: 0.1 },
  );
  document.querySelectorAll<HTMLElement>('.reveal').forEach((el) => io.observe(el));
}
