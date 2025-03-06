const defaultCard = document.querySelector('.default-card')
const newTodoCard = document.querySelector('.add-todo-card')
const openAddCardButton = document.querySelector('.add-button')
const mainCard = document.querySelector('.todo-card-main')
const addTodoButton = document.querySelector('.add-todo')
const dots = document.querySelector('.dots')
const dropdown = document.querySelector('.edit-delete')
const todoContainer = document.querySelector('.todo-container');
const loggedUser = sessionStorage.getItem("loggedInUser");


let openDropdown = false
let currentEditIndex = null;



let todos = []

let newTodo = {
    title: '',
    description: '',
    deadline: '',
    isCompleted: false,
    estTime: '',
    category: ''
}

const loadTodos = () => {
    if (loggedUser) {
        const storedTodos = localStorage.getItem(`todos_${loggedUser}`);
        if (storedTodos) {
            todos = JSON.parse(storedTodos);
        }
    }
};

const saveTodos = () => {
    if (loggedUser) {
        localStorage.setItem(`todos_${loggedUser}`, JSON.stringify(todos));
    }
};



const addNewTodo = () => {
    let todoTitle = document.getElementById('todo-title').value
    let todoDesc = document.getElementById('todo-desc').value
    let todoTimeEst = document.getElementById('time-est').value
    let todoCategory = document.getElementById('choose-category').value
    let todoDeadline = document.getElementById('pick-date').value
    let errorText = document.querySelector('.error-text')
    let todoDeadlineInput = document.getElementById('pick-date')
    let todoTitleInput = document.getElementById('todo-title')

    newTodo = {
        title: todoTitle,
        description: todoDesc,
        deadline: todoDeadline,
        isCompleted: false,
        estTime: todoTimeEst,
        category: todoCategory
    }

    let selectedDate = new Date(todoDeadline);
    let today = new Date();

    if(selectedDate < today){
        errorText.innerHTML = 'The selected date is in the past! '
        return;
    }

    if(todoTitle.length > 23) {
        errorText.innerHTML = 'Title can not proceed 23 characters!'
        return;
    }
 
    if(todoTitle === ''|| todoDeadline === ''){
        errorText.innerHTML = 'Please fill in all required fields'
        todoTitleInput.style.border = todoTitle === '' ? '2px solid red' : 'none'
        todoDeadlineInput.style.border = todoDeadline === '' ? '2px solid red' : 'none'

        setTimeout(() => {
            todoTitleInput.style.border = ''
            todoDeadlineInput.style.border = ''
            errorText.innerHTML = ''
        }, 2000);

        return;
    }
    // Om currentEditIndex inte är null så ändras "todon" på rätt index
    if (currentEditIndex !== null) {
        todos[currentEditIndex] = newTodo;
        currentEditIndex = null; 
    //om currentEditIndex är null så betyder det att man inte editar en "todo" så den läggs till som vanligt
    } else {
        todos = [...todos, newTodo]
    }

    openDefaultCard()
    renderTodos()
    saveTodos()
    console.log(todos)
}

const editTodo = (index) => {
    currentEditIndex = index; 

    const allDropdowns = document.querySelectorAll('.edit-delete');
    allDropdowns.forEach(dropdown => {
        dropdown.style.display = 'none'; 
    });
    
    document.getElementById('todo-title').value = todos[index].title;
    document.getElementById('todo-desc').value = todos[index].description;
    document.getElementById('time-est').value = todos[index].estTime;
    document.getElementById('choose-category').value = todos[index].category;
    document.getElementById('pick-date').value = todos[index].deadline;

    document.querySelector('.top-text').innerHTML = 'Edit your TODO';
    document.querySelector('.add-todo').innerHTML = 'Save Changes';

    saveTodos()
    openAddNewCard();
};

const deleteTodo = (index, todoItem) => {
    todos.splice(index, 1)
    todoItem.style.opacity = '0'
    setTimeout(()=>{        
        saveTodos()
        renderTodos();}
        ,200)
}

let filteredTodos = [];
const handleCheckbox = (todo, todoMain, todoCard) => {
    todo.isCompleted = !todo.isCompleted
    todoMain.style.textDecoration = todo.isCompleted ? 'line-through' : 'none';
    const selectFilter = document.getElementById('sort').value;
    if(selectFilter != 'All'){
        todoCard.style.opacity = '0'
    }
    setTimeout(()=>{
        filterCompleted()
    },200)
    saveTodos()
}


const filterCompleted = () => {
    const selectFilter = document.getElementById('sort').value;

    if (selectFilter === 'All') {
        filteredTodos = [...todos];
    } else if (selectFilter === 'Completed') {
        filteredTodos = todos.filter(todo => todo.isCompleted);
    } else if (selectFilter === 'not-completed') {
        filteredTodos = todos.filter(todo => !todo.isCompleted);
    }

    handleChangeCategory(); 
};

const handleChangeCategory = () => {
    const selectCategory = document.getElementById('category').value;

    let finalFilteredTodos = [...filteredTodos]; 

    if (selectCategory !== "All") {
        finalFilteredTodos = finalFilteredTodos.filter(todo => todo.category === selectCategory);
    }

    
    renderTodos(finalFilteredTodos); 

};


document.getElementById('category').addEventListener('change', handleChangeCategory);
document.getElementById('sort').addEventListener('change', filterCompleted);



const renderTodos = (todoArr = todos) => {
    todoContainer.innerHTML = ""
    todoArr.forEach((todo, index) => {

    const todoMain = document.createElement("div");

    const todoItem = document.createElement("div");
    todoItem.classList.add("todo-item");

    const checkboxLabel = document.createElement("label");
    checkboxLabel.classList.add("custom-checkbox");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";


    checkbox.checked = todo.isCompleted;
    todoMain.style.textDecoration = todo.isCompleted ? 'line-through' : 'none';


    checkbox.addEventListener('click', ()=>handleCheckbox(todo, todoMain, todoItem))
    

    const checkmark = document.createElement("span");
    checkmark.classList.add("checkmark");

    checkboxLabel.appendChild(checkbox);
    checkboxLabel.appendChild(checkmark);

    todoMain.classList.add("todo-main");

    const editDelete = document.createElement("div");
    editDelete.classList.add("edit-delete");

    const deleteBtn = document.createElement("h3");
    deleteBtn.innerHTML = "Delete";
    deleteBtn.addEventListener('click', ()=>deleteTodo(index, todoItem))

    const editBtn = document.createElement("h3");
    editBtn.innerHTML = "Edit";
    editBtn.addEventListener('click', ()=>editTodo(index))


    editDelete.appendChild(deleteBtn);
    editDelete.appendChild(editBtn);

    const titleDiv = document.createElement("div");
    titleDiv.classList.add("title");

    const titleElement = document.createElement("h2");
    titleElement.innerHTML = todo.title;

    const dotsImg = document.createElement("img");
    dotsImg.classList.add("dots");
    dotsImg.src = "../../img/dots-horizontal-svgrepo-com (2).svg";
    dotsImg.alt = "menu";

    titleDiv.appendChild(titleElement);
    titleDiv.appendChild(dotsImg);

    const categoryText = document.createElement("div");
    categoryText.classList.add("category-text");
    categoryText.innerHTML = todo.category;

    const descriptionText = document.createElement("div");
    descriptionText.classList.add("description-text");
    descriptionText.innerHTML = todo.description;

    const timeDue = document.createElement("div");
    timeDue.classList.add("time-due");

    const timeDiv = document.createElement("div");
    timeDiv.classList.add("time");
    timeDiv.innerHTML = `Time est. - ${todo.estTime}`;

    const dueDiv = document.createElement("div");
    dueDiv.classList.add("is-due");
    dueDiv.innerHTML = `Due - ${todo.deadline}`;

    timeDue.appendChild(timeDiv);
    timeDue.appendChild(dueDiv);

    todoMain.appendChild(editDelete);
    todoMain.appendChild(titleDiv);
    todoMain.appendChild(categoryText);
    todoMain.appendChild(descriptionText);
    todoMain.appendChild(timeDue);

    todoItem.appendChild(checkboxLabel);
    todoItem.appendChild(todoMain);

    document.querySelector(".todo-container").appendChild(todoItem);
    });
}


const openAddNewCard = () => {
    isOpen = 'false'
    newTodoCard.style.display = 'flex'
    defaultCard.style.display = 'none'
}

const openDefaultCard = () => {
    let errorText = document.querySelector('.error-text')
    errorText.innerHTML = ''
    document.querySelector('.top-text').innerHTML = 'Add a new TODO';
    document.querySelector('.add-todo').innerHTML = 'Add TODO';
    document.getElementById('todo-title').value = '';
    document.getElementById('todo-desc').value = '';
    document.getElementById('time-est').value = '1-3 Hours';
    document.getElementById('choose-category').value = 'Work';
    document.getElementById('pick-date').value = '';

    newTodoCard.style.display = 'none'
    defaultCard.style.display = 'flex'
}

addTodoButton.addEventListener('click', addNewTodo)
openAddCardButton.addEventListener('click', openAddNewCard)  

todoContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('dots')) {
        const dropdown = event.target.closest('.todo-item').querySelector('.edit-delete');

        if (dropdown) {
            dropdown.style.display = dropdown.style.display === 'flex' ? 'none' : 'flex';
        }
    }
});

const filterButton = document.querySelector('.filter-btn')
let isDown = false
const handleToggleFilters = () => {
    const filterContainer = document.querySelector('.filter-container')
    filterContainer.style.display =  !isDown ? 'flex' : 'none'
    isDown = !isDown
}

filterButton.addEventListener('click', handleToggleFilters)

const backButton = document.querySelector('.back-btn')
backButton.addEventListener('click', openDefaultCard)

loadTodos()
filteredTodos = [...todos];
renderTodos(filteredTodos)
filterCompleted()