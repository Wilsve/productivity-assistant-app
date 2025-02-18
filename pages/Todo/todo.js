const defaultCard = document.querySelector('.default-card')
const newTodoCard = document.querySelector('.add-todo-card')
const openAddCardButton = document.querySelector('.add-button')
const mainCard = document.querySelector('.todo-card-main')
const addTodoButton = document.querySelector('.add-todo')

todos = []

new todo = {
    title: '',
    description: '',
    deadline: '',
    isCompleted: false,
    estTime: ''

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

addTodoButton.addEventListener('click', openDefaultCard)
openAddCardButton.addEventListener('click', openAddNewCard)  