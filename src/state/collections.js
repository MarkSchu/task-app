import { ObservableArray, ObservableEvent } from 'utils/observable.js';
import { asyncRequest } from 'state/async-request.js';
import { api } from 'utils/api.js';

export const renderList = new ObservableEvent();

export class Collection extends ObservableArray {

    constructor(collection) {
        super(collection);
        this.value = [];
        this.collection = collection;
    }

    create(data) {
        asyncRequest.emit('start');
        const collection = this.collection;
        return api('create', collection, data).then((response) => {
            if (response.status < 300) {
                asyncRequest.emit('stop');
                this.push(response.body);
                renderList.emit();
            } else {
                asyncRequest.emit('error');
            }
        });
    }
    
    update(_id, changes) {
        // alerts.saving();
        const collection = this.collection;
        changes.type = collection;
        const data = {_id, changes };
        return api('updateById', collection, data).then((response) => {
            if (response.status < 300) {
                collections[collection].replaceAndSort(response.body);
                // alerts.close();
            } else {
                // alerts.error(response.statusText);
            }
        });
    }
    
    delete (_id) {
        // alerts.deleting();
        const collection = this.collection;
        const data = {_id};
        return api('deleteById', collection, data).then((response) => {
            if (response.status < 300) {
                collections[collection].remove(_id);
                // alerts.close();
            } else {
                // alerts.error(response.statusText);
            }
        });
    }

    remove(_id) {
        const index = this.value.findIndex(item => item._id === _id);
        if (index !== -1) {
            this.value.splice(index, 1);
            this.emit();
        }
    }

    replace(newItem) {
        const index = this.value.findIndex(item => item._id === newItem._id);
        if (index !== -1) {
            this.value[index] = newItem;
            this.emit();
        }
    }

    replaceAndSort(newItem) {
        const index = this.value.findIndex(item => item._id === newItem._id);
        if (index !== -1) {
            this.value[index] = newItem;
            this.emit();
        }
    }

    addAndSort(item) {
        this.value.push(item);
        this.emit();
    }

    findById(_id) {
        return this.value.find(domain => domain._id === _id);
    }
}

export const tasks = new Collection('tasks');
export const tags = new Collection('tags');

export function initCollections() {  
    asyncRequest.emit('start');
    return api('initData').then((response) => {
        const { status, body } = response; 
        if (status < 300) {
            tasks.set(body.tasks);
            tags.set(body.tags);
            renderList.emit();
            asyncRequest.emit('stop');
        } else {
            asyncRequest.emit('error');
        }
    });
}