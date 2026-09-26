/* Configure the reusable placeholder from URL parameters without injecting HTML. */
(() => {
  const params = new URLSearchParams(window.location.search);
  const title = params.get('title')?.trim().slice(0, 60) || 'More';
  const message = params.get('message')?.trim().slice(0, 240) || 'This part of the site is in progress.';
  const route = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'more';

  document.getElementById('placeholder-title').textContent = title;
  document.getElementById('placeholder-description').textContent = message;
  document.getElementById('placeholder-route').textContent = route;
  document.title = `DAN SANDS — ${title}`;
})();
