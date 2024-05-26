import { ObservableArray, ObservableEvent } from 'utils/observable.js';
import { Collection } from 'utils/collection.js';
import { asyncRequest } from 'state/async-request.js';

export const items = new Collection([]);
export const domains = new Collection([]);
export const renderList = new ObservableEvent();

export function initCollections() {  
    asyncRequest.emit('start');
    items.set([1, 2, 3, 4]);
    domains.set([1, 2, 3, 4]);
    renderList.emit();
    asyncRequest.emit('stop');
    // return api('initData').then((response) => {
    //     const { status, body, statusText } = response; 
    //     if (status < 300) {
    //         items.set([1, 2, 3, 4]);
    //         renderItems.emit();
    //         asyncRequest.emit('stop');
    //     } else {
    //         asyncRequest.emit('error');
    //     }
    // });
}
