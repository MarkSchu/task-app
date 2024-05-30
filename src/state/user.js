import { ObservableVar } from 'utils/observable.js';
import { pathname } from 'state/pathname.js';
import { asyncRequest } from 'state/async-request.js';

export const user = new ObservableVar();
let auth;

export function initUser () {
    auth = new GoTrue({
        APIUrl: 'https://vanillajstaskapp.netlify.app/.netlify/identity',
        setCookie: false
    });
}

user.current = () => {
    return auth.currentUser();
}

user.signup = (email, password) => {
    asyncRequest.emit('start');
    return auth.signup(email, password)
    .then(() => 
        auth.login(email, password, true)
    )
    .then(() => {
        pathname.redirect('/');
        asyncRequest.emit('stop')
    })
    .catch((err) => {
        console.log(err)
        // asyncRequest.emit(err?.json?.msg || 'Something went wrong.');
    });
}

user.login = (email, password) => {
    asyncRequest.emit('start');
    return auth.login(email, password, true)
    .then(() => {
        pathname.redirect('/');
        asyncRequest.emit('stop')
    })
    .catch((err) => {
        console.log(err)
        // console.log(err?.json['error_description'] || 'Something went wrong.')
        // asyncRequest.error();
    });
}

user.logout = () => {
    asyncRequest.loading();
    auth.currentUser().logout()
    .then(() => {
        pathname.redirect('/login');
        asyncRequest.close();
    })
    .catch((err) => {
        asyncRequest.error(err?.json['error_description'] || 'Something went wrong.');
    })
}

user.isLoggedIn = () => {
    return !!auth.currentUser();
}

user.email = () => {
    return auth.currentUser()?.email;
}

user.id = () => {
    return auth.currentUser()?.id;
}
