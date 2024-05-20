import { element, render, repeat } from 'utils/dom.js';
import { listen2, bind2 } from 'utils/binders.js';
import { pathname } from 'state/pathname.js';
import { user } from 'state/user.js';
import { api } from 'utils/api.js';
import { ObservableEvent, ObservableVar, ObservableBool, ObservableArray } from 'utils/observable.js';

// // tasks.set();
// // tasks.add();
// // tasks.remove();
// // tasks.updateTask();
// // filter(params);
// // sort(params);

const options = {
    tags: {
        _id: 'tags', 
        title: 'Tags'
    },
    all_tasks: {
        _id: 'all_tasks',
        title: 'All Tasks'
    },
    tasks_with_no_tag: {
        _id: 'tasks_with_no_tag', 
        title: 'Tasks with No Tag'
    }
}

const tasks = new ObservableArray([]);
const domains = new ObservableArray([]);
const async = new ObservableEvent();
const renderList = new ObservableEvent();
const selection = new ObservableVar(options.all_tasks);

function filter(items) {
    return items.filter(item => {
        if (selection.value._id === options.tags._id) {
            return item.type === 'domains';
        }
        if (selection.value._id === options.all_tasks._id) {
            return item.type === 'tasks'; 
        }
        if (selection.value._id === options.tasks_with_no_tag._id) {
            return item.type === 'tasks' && !item._id; 
        }
        return selection.value.domain === item._id;
    });
}

function getData() {
    async.emit('start');
    return api('getAllUserData').then((response) => {
        const { status, body, statusText } = response; 
        if (status < 300) {
            tasks.set(body.tasks);
            domains.set(body.domains);
            renderList.emit();
            async.emit('stop');
        } else {
            async.emit('error');
        }
    })
}

function initDash() {
    user.isLoggedIn()
    ? getData()
    : pathname.redirect('/login');
}

function Item(task) {
    return (
        element('div', {},
            element('span', {textContent: task.title})
        )
    )
}

function DashList() {
    return (
        listen2('div', {}, renderList, () => {
            const items = tasks.value.concat(domains.value);
            return repeat(filter(items), Item)
        })
    )
}

function DomainInput () {

    const showMenu = new ObservableBool(false);

    const showSelection = (el, val) => {
        el.textContent = val.title;
    }

    const setSelection = (val) => {
        selection.set(val);
        showMenu.toggle();
        renderList.emit();
    }

    const setInputValue = (el, val) => {
        el.value = val._id;
    }

    const toggleMenu = (el, value) => {
        el.style.display = value ? 'block' : 'none';
    }

    return (
        element('div', {style: {border: '1px solid black'}},
            element('b', {
                bind: [[selection, showSelection]],
                onclick: () => showMenu.toggle()
            }),
            element('div', {
                bind: [[showMenu, toggleMenu]]
            },
                element('div', {
                    textContent: options.tags.title,
                    onclick: () => setSelection(options.tags)
                }),
                element('div', {
                    textContent: options.tasks_with_no_tag.title,
                    onclick: () => setSelection(options.tasks_with_no_tag)
                }),
                bind2('div', {}, domains, (list) =>
                    repeat(list, (domain) => 
                        element('div', {
                            textContent: domain.title,
                            onclick: () => setSelection(domain)
                        })
                    ) 
                ),
                element('div', {
                    textContent: options.all_tasks.title,
                    onclick: () => setSelection(options.all_tasks)
                }),
            ),
            element('input', {
                type: 'hidden', 
                bind: [[selection, setInputValue]]
            })
        )
    )
}

function DashControls() {

    let form;

    const handleClick = () => {
        if (form.reportValidity()) {
            tasks.create(data).then(() => form.reset())
        }
    }

    return (
        element('div', {},
            form = element('form', {},
                DomainInput(),
                element('div', {},
                    element('input', {type: 'text'}),
                    element('button', {
                        required: true,
                        textContent: 'Add',
                        onclick: handleClick
                    })
                ),
                element('div', {},
                    element('label', {textContent: 'Due '}),
                    element('input', {type: 'date'})
                )
            )
        )
    )
}

function AsyncDisplay() {
    return (
        listen2('div', {}, async, (value) => {
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

function Dash() {
    return (
        element('div', {},
            AsyncDisplay(),
            DashList(),
            DashControls()
        )
    )
}

pathname.onEmit((value) => {
    const {body} = document;
    if (value === '/dash') {
        render(body, Dash());
        initDash();
    }
});

