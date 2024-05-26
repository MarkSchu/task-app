import { element } from 'utils/dom.js';
import { listen2 } from 'utils/binders.js';
import { asyncRequest } from 'state/async-request.js';

export function AsyncDisplay() {
    return (
        listen2('div', {}, asyncRequest, (value) => {
            if (value === 'start') {
                return element('div', {textContent: 'Loading...'});
            }
            if (value === 'error') {
                return element('div', {textContent: 'Error...'})
            }
            if (value === 'stop') {
                return element('div', {});
            }
        })
    )
}