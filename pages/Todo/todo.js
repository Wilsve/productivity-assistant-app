const defaultCard = document.querySelector('.default-card')
const newTodoCard = document.querySelector('.add-todo-card')
const openAddCardButton = document.querySelector('.add-button')
const mainCard = document.querySelector('.todo-card-main')
const addTodoButton = document.querySelector('.add-todo')

let todos = []

let todo = {
    title: '',
    description: '',
    deadline: '',
    isCompleted: false,
    estTime: '',
    category: ''
}

const addNewTodo = () => {
    let todoTitle = document.getElementById('todo-title').value
    let todoDesc = document.getElementById('todo-desc').value
    let todoTimeEst = document.getElementById('time-est').value
    let todoCategory = document.getElementById('category').value
    let todoDeadline = document.getElementById('pick-date').value

    todo = {
        title: todoTitle,
        description: todoDesc,
        deadline: todoDeadline,
        isCompleted: false,
        estTime: todoTimeEst,
        category: todoCategory
    }
    todos = [...todos, todo]

    console.log(todos)
}

const openAddNewCard = () => {
    isOpen = 'false'
    newTodoCard.style.display = 'flex'
    defaultCard.style.display = 'none'
}

const openDefaultCard = () => {
    newTodoCard.style.display = 'none'
    defaultCard.style.display = 'flex'
}

addTodoButton.addEventListener('click', addNewTodo)
openAddCardButton.addEventListener('click', openAddNewCard)  