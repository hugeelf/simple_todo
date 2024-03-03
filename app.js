'use strict'

const tasks =
    (
        localStorage.getItem('tasks')
            ? JSON.parse(localStorage.getItem('tasks'))
            : []
    )

const taskInput = document.querySelector('.todo__input')
const tasksList = document.querySelector('.todo__items')
const addButton = document.querySelector('.todo__add')



//render existed tasks
tasks.forEach(task => {
    renderTask(task)
});

//add task to tasks array with Enter button
taskInput.addEventListener('keydown', (e) => {
    if (e.keyCode === 13 && taskInput.value) {
        e.preventDefault()
        addTask(taskInput.value)
        taskInput.value = ''
    }

})

//add task to tasks array with form button
addButton.addEventListener('click', (e) => {
    if (taskInput.value) {
        e.preventDefault()
        addTask(taskInput.value)
        taskInput.value = ''
    }
})

// change todo status
tasksList.addEventListener('click', (e) => {
    toggleTaskStatusCss(e)
    toggleTaskStatus(e)
})

function addTask(task) {
    const newTask = {
        id: Date.now(),
        todoName: task,
        done: false
    }
    tasks.unshift(newTask)
    renderTask(newTask, 'afterbegin')
    saveToLocalStorage()
    scrollToLastElement()
}

function renderTask(task, where = 'beforeend') {
    const taskNameClass = task.done ? "item__title item__title__done" : "item__title"
    const buttonClass = task.done ? "todo__action_complete todo__action_restore" : "todo__action_complete"
    // const taskStatusClass = task.done ? "todo__single_item__done" :  "todo__single_item"
    tasksList.insertAdjacentHTML(where,
        `
    <li class="todo__single_item" id="${task.id}">
        <span class="${taskNameClass}">
            ${task.todoName}
        </span>
            <div class="item__buttons">
                <button class="${buttonClass}"></button>
                <button class="todo__action_delete"></button>
             </div>
     </li>
`
    )
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function scrollToLastElement() {
    tasksList.lastElementChild.scrollIntoView({
        behavior: 'smooth'
    })
}

function toggleTaskStatusCss(e) {
    if (e.target.classList.contains('todo__action_complete')) {
        e.target.classList.toggle('todo__action_restore')

        e.target.closest('.todo__single_item')
            .querySelector('.item__title').classList.toggle('item__title__done')
        e.target.closest('.todo__single_item').classList.toggle('todo__single_item__done')
    }
    if (e.target.classList.contains('todo__action_delete')) {
        e.target.closest('.todo__single_item').classList.add('todo__single_item__deleted')
    }

    // if(e.target.classList.contains('todo__action_restore')){
    //     console.log(e.target)
    // }
}

function toggleTaskStatus(e) {
    const parentNode = e.target.closest('.todo__single_item')
    const id = Number(parentNode.id)

    if (e.target.classList.contains('todo__action_complete')
        && e.target.classList.contains('todo__action_restore')) {
        renderTask(editLocalStorageData(id, parentNode, 'bottom'))
    }
    if (e.target.classList.contains('todo__action_delete')) {
        const indexToDelete = tasks.findIndex((task) => task.id === id)
        tasks.splice(indexToDelete, 1)
        parentNode.addEventListener('animationend', () => {
            parentNode.remove()
        })
    }

    if ((e.target.classList.contains('todo__action_complete')
        && !e.target.classList.contains('todo__action_restore'))) {
        renderTask(editLocalStorageData(id, parentNode), 'afterbegin')
    }
    saveToLocalStorage()
}

function editLocalStorageData(id, parentNode, whereToAdd = 'top') {
    const taskForChangeStatus = tasks.find((task) => task.id === id)
    taskForChangeStatus.done = !taskForChangeStatus.done

    const indexOfTask = tasks.indexOf(taskForChangeStatus)
    const task = tasks[indexOfTask]

    tasks.splice(indexOfTask, 1)
    if (whereToAdd === 'bottom') {
        tasks.push(task)
    } if (whereToAdd === 'top') {
        tasks.unshift(task)
    }

    parentNode.addEventListener('animationend', () => {
        parentNode.remove()
    })
    return task
}