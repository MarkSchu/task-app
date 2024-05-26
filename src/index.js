import { element, renderBody } from 'utils/dom.js';
import { listen2, bind2 } from 'utils/binders.js';
import { pathname } from 'state/pathname.js';
import { user, initUser } from 'state/user.js';
import { api } from 'utils/api.js';
import { Login } from 'components/login.js';
import { Signup } from 'components/signup.js';
import { ObservableEvent, ObservableVar, ObservableBool, ObservableArray } from 'utils/observable.js';
import { asyncRequest } from 'state/async-request.js';
import { Dash } from 'components/dash/dash.js';
import { initCollections } from 'state/collections.js';

pathname.onEmit((value) => {

    initUser(); 

    if (value === '/') {
        if (user.isLoggedIn()) {
            renderBody(Dash());
            initCollections();
        } else {
            pathname.redirect('/login');
        }
    }

    else if (value === '/signup') {
        renderBody(Signup());
    }

    else if (value === '/login') {
        renderBody(Login());
    }

    else {
        renderBody(element('div', {textContent: 'No Such Page!'}))
    }
});


