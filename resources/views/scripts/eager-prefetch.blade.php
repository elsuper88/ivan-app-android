<script data-navigate-once="true">
(function() {
    'use strict';

    var VISIBILITY_DELAY = 500;
    var CACHE_TTL = 30000;
    var SELECTOR = 'a[wire\\:navigate\\.hover]';

    var prefetched = new Set();
    var timers = new Map();
    var observer = null;

    function isSameOriginDifferentPage(url) {
        try {
            var u = new URL(url, location.origin);
            return u.origin === location.origin
                && u.pathname !== location.pathname;
        } catch (e) {
            return false;
        }
    }

    function triggerPrefetch(el) {
        var url = el.href;
        if (!url || prefetched.has(url) || !isSameOriginDifferentPage(url)) return;

        prefetched.add(url);

        // Dispatch mouseenter to trigger Alpine's x-navigate.hover prefetch handler.
        // Alpine registers a mouseenter listener on wire:navigate.hover elements
        // that calls prefetchHtml() after 60ms, storing the HTML in its internal cache.
        // On the subsequent click, Alpine uses the cached HTML for instant navigation.
        el.dispatchEvent(new MouseEvent('mouseenter', {
            bubbles: true,
            cancelable: true,
            view: window
        }));

        // Dispatch mouseleave shortly after to reset Alpine's internal hover state
        // without cancelling the already-fired 60ms prefetch timeout.
        setTimeout(function() {
            el.dispatchEvent(new MouseEvent('mouseleave', {
                bubbles: true,
                cancelable: true,
                view: window
            }));
        }, 80);

        setTimeout(function() { prefetched.delete(url); }, CACHE_TTL);
    }

    function observeLinks() {
        if (observer) {
            observer.disconnect();
            timers.forEach(function(t) { clearTimeout(t); });
            timers.clear();
        }

        observer = new IntersectionObserver(function(entries) {
            for (var i = 0; i < entries.length; i++) {
                var entry = entries[i];
                var el = entry.target;

                if (entry.isIntersecting) {
                    (function(element) {
                        var timer = setTimeout(function() {
                            triggerPrefetch(element);
                            timers.delete(element);
                        }, VISIBILITY_DELAY);
                        timers.set(element, timer);
                    })(el);
                } else {
                    var timer = timers.get(el);
                    if (timer) {
                        clearTimeout(timer);
                        timers.delete(el);
                    }
                }
            }
        }, { threshold: 0.1 });

        var links = document.querySelectorAll(SELECTOR);
        for (var j = 0; j < links.length; j++) {
            if (isSameOriginDifferentPage(links[j].href)) {
                observer.observe(links[j]);
            }
        }
    }

    // Prefetch on touch (fires ~200-300ms before click on mobile)
    document.addEventListener('touchstart', function(e) {
        var link = e.target.closest(SELECTOR);
        if (link) triggerPrefetch(link);
    }, { passive: true });

    function init() {
        observeLinks();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Re-observe after each SPA navigation (new DOM, new links)
    document.addEventListener('livewire:navigated', function() {
        prefetched.clear();
        requestAnimationFrame(function() { observeLinks(); });
    });
})();
</script>
