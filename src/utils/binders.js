import { element, clearChildren } from 'utils/dom.js';

export function bind(observable, createElement) {
    let currentEl = createElement(observable.value);
    observable.onEmit((value) => {
        let newEl = createElement(value);
        let parent = currentEl.parentElement;
        if (parent) {
            parent.removeChild(currentEl);
            parent.appendChild(newEl);
        }
        currentEl = newEl;
    });
    return currentEl;
}

export function listen(observable, createElement) {
    let currentEl = element('div', {style: {display: 'none'}}); // render dummy element to start
    observable.onEmit((value) => {
        let newEl = createElement(value);
        let parent = currentEl.parentElement;
        if (parent) {
            parent.removeChild(currentEl);
            parent.appendChild(newEl);
        }
        currentEl = newEl;
    });
    return currentEl;
}

export function bind2(tag, attrs, observable, createElement) {
    let parent = element(tag, attrs); 
    observable.onEmit((value) => {
        let children = createElement(value);
        clearChildren(parent);
        if (Array.isArray(children)) {
            children.forEach((child) => {
                parent.appendChild(child);
            });
        } else {
            parent.appendChild(children);
        }
    });
    return parent;
}

export function listen2(tag, attrs, observable, createElement) {
    let parent = element(tag, attrs); 
    observable.onEmit((value) => {
        let children = createElement(value);
        clearChildren(parent);
        if (Array.isArray(children)) {
            children.forEach((child) => {
                parent.appendChild(child);
            });
        } else {
            parent.appendChild(children);
        }
    });
    return parent;
}

export function repeatWith(createElement) {
    return (el, list) => {
        var child = el.lastElementChild; 
        while (child) {
            el.removeChild(child);
            child = el.lastElementChild;
        }
        list.forEach((item) => {
            el.appendChild(createElement(item));
        });
    }
}

export function showModalOverlay(el) {
    el.style.zIndex = 1;
    el.style.opacity = 1;
}

export function showAlertOverlay(el) {
    el.style.zIndex = 2;
    el.style.opacity = 1;
}

export function hideOverlay(el) {
    el.style.zIndex = -1;
    el.style.opacity = 0;
}

export function toggleModalOverlay(el, value) {
    value
    ? showModalOverlay(el)
    : hideOverlay(el);
}



