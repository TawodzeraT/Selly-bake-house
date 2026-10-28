/* Selly Bake House | Halloween 2026 promotion — close + photo zoom */
(function () {
  'use strict';

  function initHalloween() {
    const overlay = document.getElementById('sbhHalloweenOverlay');
    if (!overlay || overlay.dataset.sbhInitialized === 'true') return;
    overlay.dataset.sbhInitialized = 'true';

    // End the promotion at midnight on November 4, 2026 (Maryland / EST).
    const halloweenExpires = new Date('2026-11-04T00:00:00-05:00');
    if (Date.now() >= halloweenExpires.getTime()) {
      overlay.hidden = true;
      overlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('sbh-halloween-is-open');
      return;
    }

    const dialog = overlay.querySelector('.sbh-halloween-dialog');
    const photo = overlay.querySelector('.sbh-halloween-photo');
    const photoImage = photo?.querySelector('img');
    const closeButton = overlay.querySelector('.sbh-halloween-close');
    const previouslyFocused = document.activeElement;
    const focusSelector = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    let zoom = null;
    let zoomTrigger = null;

    function closeZoom() {
      if (!zoom) return;
      zoom.remove();
      zoom = null;
      dialog?.removeAttribute('aria-hidden');
      if (zoomTrigger?.isConnected) zoomTrigger.focus({ preventScroll: true });
      zoomTrigger = null;
    }

    function closeAnnouncement() {
      if (overlay.hidden) return;
      closeZoom();
      overlay.hidden = true;
      overlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('sbh-halloween-is-open');
      document.removeEventListener('keydown', onKeydown, true);
      if (previouslyFocused instanceof HTMLElement && previouslyFocused !== document.body && previouslyFocused.isConnected) {
        previouslyFocused.focus({ preventScroll: true });
      }
    }

    function openZoom(trigger) {
      if (!photoImage || zoom) return;
      zoomTrigger = trigger;
      zoom = document.createElement('div');
      zoom.className = 'sbh-halloween-zoom';
      zoom.setAttribute('role', 'presentation');
      zoom.innerHTML = `
        <section class="sbh-halloween-zoom-dialog" role="dialog" aria-modal="true" aria-label="Enlarged Halloween cookie box photo" tabindex="-1">
          <button class="sbh-halloween-zoom-close" type="button" data-halloween-zoom-close aria-label="Close enlarged photo">&times;</button>
          <img class="sbh-halloween-zoom-image" alt="" draggable="false">
          <p class="sbh-halloween-zoom-caption">Halloween Cookie Box <strong>$25.99</strong></p>
        </section>`;
      const enlargedPhoto = zoom.querySelector('img');
      enlargedPhoto.src = photoImage.currentSrc || photoImage.src;
      enlargedPhoto.alt = photoImage.alt;
      overlay.appendChild(zoom);
      dialog?.setAttribute('aria-hidden', 'true');
      zoom.querySelector('.sbh-halloween-zoom-close')?.focus({ preventScroll: true });
    }

    // Turn the existing cookie photo into an actual accessible zoom button;
    // no changes to index.html are required.
    if (photoImage && photo && !photo.querySelector('[data-halloween-zoom]')) {
      const photoButton = document.createElement('button');
      photoButton.type = 'button';
      photoButton.className = 'sbh-halloween-photo-zoom';
      photoButton.setAttribute('data-halloween-zoom', '');
      photoButton.setAttribute('aria-label', 'Enlarge Halloween cookie box photograph');
      photoImage.parentNode.insertBefore(photoButton, photoImage);
      photoButton.appendChild(photoImage);
    }

    // Capture clicks before the main website's delegated event handlers.
    overlay.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest('[data-halloween-zoom-close]')) {
        event.stopPropagation();
        closeZoom();
        return;
      }
      if (zoom) {
        if (target === zoom) closeZoom(); // Click outside enlarged image.
        return;
      }
      if (target.closest('[data-halloween-close]')) {
        event.stopPropagation();
        closeAnnouncement();
        return;
      }
      if (target.closest('[data-halloween-zoom]')) {
        event.stopPropagation();
        openZoom(target.closest('[data-halloween-zoom]'));
        return;
      }
      if (target === overlay) closeAnnouncement();
    }, true);

    function onKeydown(event) {
      if (overlay.hidden) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (zoom) closeZoom(); else closeAnnouncement();
        return;
      }
      if (event.key !== 'Tab') return;
      const scope = zoom || overlay;
      const controls = [...scope.querySelectorAll(focusSelector)]
        .filter(el => el.getClientRects().length && el.closest('[aria-hidden="true"]') === null);
      if (!controls.length) { event.preventDefault(); (zoom?.querySelector('[role="dialog"]') || dialog)?.focus(); return; }
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && (document.activeElement === first || !scope.contains(document.activeElement))) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !scope.contains(document.activeElement))) {
        event.preventDefault(); first.focus();
      }
    }

    overlay.hidden = false;
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('sbh-halloween-is-open');
    document.addEventListener('keydown', onKeydown, true);
    closeButton?.focus({ preventScroll: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHalloween, { once: true });
  } else {
    initHalloween();
  }
})();
