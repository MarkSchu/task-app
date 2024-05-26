import { ObservableArray } from 'utils/observable.js';
import { api } from 'utils/api.js';
// import { alerts } from 'state/alerts.js';

// // tasks.set();
// // tasks.add();
// // tasks.remove();
// // tasks.updateTask();
// // filter(params);
// // sort(params);

export class Collection extends ObservableArray {

    constructor(collection) {
        super(collection);
        this.value = [];
        this.collection = collection;
    }

    create(data) {
        // alerts.creating();
        const collection = this.collection;
        return api('create', collection, data).then((response) => {
            if (response.status < 300) {
                collections[collection].addAndSort(response.body);
                // alerts.close();
            } else {
                // alerts.error(response.statusText);
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
