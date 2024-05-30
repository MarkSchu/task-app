import { element, render, repeat } from 'utils/dom.js';
import { listen2, bind2 } from 'utils/binders.js';
import { pathname } from 'state/pathname.js';
import { user, initUser } from 'state/user.js';
import { api } from 'utils/api.js';
import { Login } from 'components/login.js';
import { Signup } from 'components/signup.js';
import { ObservableEvent, ObservableVar, ObservableBool, ObservableArray } from 'utils/observable.js';
import { asyncRequest } from 'state/async-request.js';
import { AsyncDisplay } from 'components/async-display.js';
import { tasks, tags,  renderList } from 'state/collections.js';

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
        title: 'Misc Tasks'
    }
}

const selection = new ObservableVar(options.all_tasks);

function filter(tasks) {
    return tasks;
    return tasks.filter(item => {
        if (selection.value._id === options.tags._id) {
            return item.type === 'tags';
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
            return repeat(filter(tasks.value), Item)
        })
    )
}

function TagInput() {

    let form;

    const handleClick = () => {
        if (form.reportValidity()) {
            const data = {
                title: form.elements.title.value
            };
            tags.create(data).then(() => form.reset())
        }
    }

    return (
        element('div', {},
            form = element('form', {},
                element('input', {
                    required: true,
                    type: 'text',
                    name: 'title'
                }),
            ),
            element('button', {
                textContent: 'Create',
                onclick: handleClick
            })
        )
    )
}

function TagMenu(showMenu) {
    
    const toggleMenu = (el, value) => {
        el.style.display = value ? 'block' : 'none';
    }

    const setSelection = (val) => {
        selection.set(val);
        showMenu.toggle();
        renderList.emit();
    }
    
    return (
        element('div', {
            style: {border: '1px solid blue'},
            bind: [[showMenu, toggleMenu]]
        },
            bind2('div', {}, tags, (list) =>
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
            TagInput()
        )
    )
}

function TagSelect (showMenu) {

    const showSelection = (el, val) => {
        el.textContent = val.title;
    }

    const setInputValue = (el, val) => {
        el.value = val._id;
    }

    return (
        element('div', {style: {border: '1px solid black'}},
            element('b', {
                bind: [[selection, showSelection]],
                onclick: () => showMenu.toggle()
            }),
            element('input', {
                type: 'hidden', 
                name: 'tag',
                bind: [[selection, setInputValue]]
            })
        )
    )
}

function TaskInput(showMenu) {

    let form;

    const handleClick = (e) => {
       e.preventDefault();
        if (form.reportValidity()) {
            const data = {
                title: form.elements.title.value,
                tag: form.elements.tag.value,
                duedate: form.elements.duedate.value || ''
            };
            tasks.create(data).then(() => form.reset())
        }
    }

    return (
        element('div', {},
            form = element('form', {},
                TagSelect(showMenu),
                element('div', {},
                    element('input', {
                        type: 'text',
                        name: 'title'
                    }),
                    element('button', {
                        required: true,
                        textContent: 'Add',
                        onclick: handleClick
                    })
                ),
                element('div', {},
                    element('label', {textContent: 'Due: '}),
                    element('input', {
                        type: 'date',
                        name: 'duedate'
                    })
                )
            )
        )
    )
}

export function Dash() {
    const showMenu = new ObservableBool(false);
    return (
        element('div', {},
            AsyncDisplay(),
            DashList(),
            TaskInput(showMenu),
            TagMenu(showMenu)
        )
    )
}