<style data-nativephp-persist="true">
    /* NativePHP safe area insets for Filament layout.
       NativePHP injects --inset-top/right/bottom/left CSS variables
       at runtime with the device's actual safe area values.

       Strategy: A fixed pseudo-element covers the status bar zone.
       The sticky topbar, modals, and slideovers are offset below it. */

    /* Fixed bar covering the status bar area */
    body::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: var(--inset-top, 0px);
        background-color: #49494b;
        z-index: 50;
    }

    html.dark body::before {
        background-color: #161619;
    }

    /* Push all body content below the status bar */
    body {
        padding-top: var(--inset-top, 0px);
        padding-bottom: var(--inset-bottom, 0px);
    }

    /* Sticky topbar: offset below the fixed status bar cover */
    .fi-topbar-ctn {
        top: var(--inset-top, 0px);
    }

    /* Sidebar: account for status bar height */
    .fi-sidebar.fi-main-sidebar {
        top: var(--inset-top, 0px);
        height: calc(100dvh - var(--inset-top, 0px));
    }

    .fi-sidebar-close-overlay {
        top: var(--inset-top, 0px);
    }

    /* Modals: overlay and window container must start below status bar */
    .fi-modal > .fi-modal-close-overlay {
        top: var(--inset-top, 0px);
    }

    .fi-modal > .fi-modal-window-ctn {
        top: var(--inset-top, 0px);
        height: calc(100dvh - var(--inset-top, 0px));
    }

    /* Slideover: the window itself is fixed inset-0, offset it */
    .fi-modal.fi-modal-slide-over > .fi-modal-window-ctn > .fi-modal-window {
        top: var(--inset-top, 0px);
        height: calc(100dvh - var(--inset-top, 0px));
    }

    /* Simple layout (login page): also respect insets */
    .fi-simple-layout {
        padding-top: var(--inset-top, 0px);
        padding-bottom: var(--inset-bottom, 0px);
    }

    /* Landscape: add horizontal insets */
    @media (orientation: landscape) {
        body {
            padding-left: var(--inset-left, 0px);
            padding-right: var(--inset-right, 0px);
        }

        .fi-sidebar.fi-main-sidebar {
            margin-left: var(--inset-left, 0px);
        }
    }
</style>
