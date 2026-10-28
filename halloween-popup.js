/* Selly Bake House | Halloween welcome announcement */
(function () {
  'use strict';
  const overlay = document.getElementById('sbhHalloweenOverlay');
  if (!overlay) return;
  // Hide the Halloween offer from November 4, 2026 at 12:00 AM Maryland time.
  const halloweenExpires = new Date('2026-11-04T00:00:00-05:00');
  if (Date.now() >= halloweenExpires.getTime()) {
    overlay.hidden = true;
    overlay.setAttribute('aria-hidden', 'true');
    return;
  }
  const dialog = overlay.querySelector('[role="dialog"]');
  const closeButton = overlay.querySelector('.sbh-halloween-close');
  const focusableSelector = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const lastFocused = document.activeElement;

  function closeAnnouncement() {
    if (overlay.hidden) return;
    overlay.hidden = true;
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('sbh-halloween-is-open');
    document.removeEventListener('keydown', handleKeydown, true);
    if (lastFocused instanceof HTMLElement && lastFocused !== document.body && lastFocused.isConnected) {
      lastFocused.focus({ preventScroll: true });
    }
  }

  function handleKeydown(event) {
    if (overlay.hidden) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopImmediatePropagation();
      closeAnnouncement();
      return;
    }
    if (event.key === 'Tab') {
      const focusable = [...overlay.querySelectorAll(focusableSelector)].filter((el) => el.getClientRects().length);
      if (!focusable.length) { event.preventDefault(); dialog.focus(); return; }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !overlay.contains(document.activeElement))) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !overlay.contains(document.activeElement))) {
        event.preventDefault(); first.focus();
      }
    }
  }

  overlay.querySelectorAll('[data-halloween-close]').forEach((button) => {
    button.addEventListener('click', closeAnnouncement);
  });
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) closeAnnouncement();
  });
  document.body.classList.add('sbh-halloween-is-open');
  document.addEventListener('keydown', handleKeydown, true);
  closeButton?.focus({ preventScroll: true });
})();
