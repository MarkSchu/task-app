import { ObservableVar } from 'utils/observable.js';
import { render } from 'utils/dom.js';

export const pathname = new ObservableVar(window.location.pathname);

window.addEventListener('popstate', () => {
    pathname.set(window.location.pathname);
});

window.addEventListener('redirect', (e) => {
    pathname.set(window.location.pathname);
});

window.addEventListener('load', () => {
    pathname.set(window.location.pathname);
});

pathname.redirect = (newPathname) => {
    history.pushState({}, '',  newPathname);
    const navEvent = new CustomEvent('redirect');
    window.dispatchEvent(navEvent);
}

pathname.onchange = (callback) => {
    pathname.onEmit((value) => {
        const el = callback();
        render(document.body, el);
    });
}