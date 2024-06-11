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

function Checkbox (task, toggleDone) {
    return (
        element('div', {className: 'checkbox'},
            element('input', {
                className: 'checkbox-input',
                type: 'checkbox',
                checked: true,// task.complete,
                onchange: () => {}, // toggleDone
            }),
            element('div', {className: 'checkmark'})
        )
    )
}

function Details(task) {
    return (
        element('div', {
            textContent: task.title,
            className: 'details'
        })
    )
}

function DeleteButton() {
    return (
        element('div', {
            className: 'delete-button',
            textContent: '×'
        })
    )
}

function Task(task) {
    return (
        element('div', {className: 'task'},
            element('div', {className: 'leftside'},
                Checkbox(task)
            ),
            element('div', {className: 'center'},
                Details(task)
            ),
            element('div', {className: 'rightside'},
                DeleteButton(task)
            )
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
        element('div', {
            className: 'tag-select',
            onclick: () => showMenu.toggle()
        },
            element('b', {
                bind: [[selection, showSelection]]
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
        element('div', {className: 'task-controls'},
            form = element('form', {},
                TagSelect(showMenu),
                element('div', {className: 'input'},
                    element('textarea', {
                        rows: 2,
                        name: 'title',
                        required: true
                    }),
                    element('button', {
                        required: true,
                        textContent: 'Add',
                        onclick: handleClick
                    })
                ),
                // element('div', {},
                //     element('label', {textContent: 'Due: '}),
                //     element('input', {
                //         type: 'date',
                //         name: 'duedate'
                //     })
                // )
            )
        )
    )
}

function Tasks(showMenu) {

    const toggleDisplay = (el, value) => {
        value
        ? el.classList.add('hide')
        : el.classList.remove('hide')
    }

    return (
        element('div', {
            className: 'tasks',
            bind: [[showMenu, toggleDisplay]]
        },
            listen2('div', {}, renderList, () => {
                return repeat(filter(tasks.value), Task)
            }),
            TaskInput(showMenu)
        )
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
        element('div', {className: 'tag-create-input'},
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

function TagList(showMenu) {
    
    const toggleDisplay = (el, value) => {
        value
        ? el.classList.add('show')
        : el.classList.remove('show')
    }

    const setSelection = (val) => {
        selection.set(val);
        showMenu.toggle();
        renderList.emit();
    }
    
    return (
        element('div', {
            className: 'tag-menu',
            bind: [[showMenu, toggleDisplay]]
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
            // TagInput()
        )
    )
}

export function Dash() {
    const showMenu = new ObservableBool(false);
    return (
        element('div', {},
            AsyncDisplay(),
            Tasks(showMenu),
            TagList(showMenu)
        )
    )
}