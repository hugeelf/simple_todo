const task = document.querySelector('.todo__input')
const add = document.querySelector('.todo__add')
const tasksList = document.querySelector(".todo__items")

let tasks = []
if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'))
}
tasks.forEach(task => {
    renderTask(task)
});

add.addEventListener('click', addTask)
task.addEventListener('keydown', function(event){
    if(event.keyCode === 13){
        addTask()
    }
})
tasksList.addEventListener('click', deleteTask)
tasksList.addEventListener('click', doneTask)

function addTask() {
    if(!task.value){
        return
    }
    const taskName = task.value

    const newTask = {
        id: Date.now(),
        text: taskName,
        done: false,
    }

    tasks.push(newTask)
    renderTask(newTask)

    saveToLocalStorage()
    clearinput()
}

function deleteTask(event) {
    if (event.target.dataset.action !== 'delete') {
        return
    }
    const parentNode = event.target.closest('.todo__single_item')

    const id = Number(parentNode.id)

    const indexToDelete = tasks.findIndex((task) => task.id === id)
    tasks.splice(indexToDelete, 1)

    parentNode.remove()
    saveToLocalStorage()
}

function doneTask(event) {

    if (event.target.dataset.action !== 'completed') {
        return
    }

    const parentNode = event.target.closest('.todo__single_item')

    const id = Number(parentNode.id)

    const task = tasks.find((task) => task.id === id)
    task.done = !task.done

    const taskTitle = parentNode.querySelector('.item__title')
    taskTitle.classList.toggle('item__title--done')

    const buttonRole = parentNode.querySelector('.todo__action')
    buttonRole.classList.toggle('todo__action_restore')

    saveToLocalStorage()

}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task){
    const cssTextClass = task.done ? "item__title item__title--done" : "item__title"
    const cssButtonClass = task.done ? "todo__action todo__action_complete todo__action_restore" : "todo__action todo__action_complete"
    const htmlTaskBlock = `
    <li class="todo__single_item" id="${task.id}">
    <span class="${cssTextClass}">${task.text}</span>
    <div class="item__buttons">
    <button
      class="${cssButtonClass}"
      data-action="completed"
    ></button>
    <button
      class="todo__action todo__action_delete"
      data-action="delete"
    ></button>
    </div>
  </li>`

    tasksList.insertAdjacentHTML('beforeend', htmlTaskBlock)
}

function clearinput() {
    task.value = ''
}