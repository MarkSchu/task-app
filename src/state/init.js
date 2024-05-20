import { pathname } from 'state/pathname.js';
import { user } from 'state/user.js';
import { api } from 'utils/api.js';
import { collections } from 'state/collection.js';
import { sortByDates } from 'utils/dates.js';
import { alerts } from 'state/alerts.js';
import { ObservableVar, ObservableEvent } from 'utils/observable.js';

export const general = new ObservableVar();
export const initLoadComplete = new ObservableEvent();

general.init = () => {
    if (user.isLoggedIn()) {
        general.getAllUserData();
    } else {
        pathname.redirect('/login');
    }
}

general.getAllUserData = () => {
    alerts.loading();
    return api('init').then((response) => {
        const { status, body, statusText } = response; 
        if (status < 300) {
        } else {
        }
    });
}


export default general;