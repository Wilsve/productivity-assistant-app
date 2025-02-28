const addRutineContainer = document.getElementById('add-rutine-container');
const habitsContainer = document.querySelector('#habits-container');
const form = document.getElementById('add-routine-form');
const filterDropdown = document.getElementById('filter-dropdown');
const sortDropdown = document.getElementById('sort-dropdown');


const addRutineBtn = document.getElementById('rutine-btn');
const backBtn = document.querySelector('.back-btn');
const filterBtn = document.querySelector('.filter-btn');

const errorMessage = document.querySelector('.error-message')

//Local och sessionstorage
const loggedUser = sessionStorage.getItem("loggedInUser");
let habits = [];

// Ladda sparade rutiner
function loadHabits() {
    const storedHabits = localStorage.getItem(`habits_${loggedUser}`);
    if (storedHabits) {
        habits = JSON.parse(storedHabits);
        habits.forEach(habit => displayHabit(habit));
    }
}

// Spara rutiner
function saveHabits() {
    localStorage.setItem(`habits_${loggedUser}`, JSON.stringify(habits));
}

// Logga ut
const logoutBtn = document.querySelector('.logout');

logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('loggedInUser');
    window.location.href = '../login/login.html';
});

// Skriva ut inloggat användarnamn
const loggedInUser = sessionStorage.getItem('loggedInUser');
const userData = JSON.parse(localStorage.getItem(`user_${loggedInUser}`));
document.querySelector('.username').textContent = loggedInUser;


// Visa/dölj formulär 
const buttons = [addRutineBtn, backBtn];
buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        addRutineContainer.classList.toggle('hidden');
        habitsContainer.classList.toggle('hidden');
    });
});

//Filter knapp
filterBtn.addEventListener('click', () => {
    const filterContainers = document.querySelectorAll('.filter-container');
    filterContainers.forEach(container => {
        container.classList.toggle('hidden');
    });
});


// Hämta form data
function getFormData() {
    const priorityInput = document.querySelector('input[name="priority"]:checked');
    return {
        title: document.getElementById('rutine-title').value,
        goal: document.getElementById('repetition-number').value,
        frequency: document.getElementById('frequency').value,
        category: document.getElementById('category').options[document.getElementById('category').selectedIndex].text,
        priority: priorityInput.value,
        priorityText: document.querySelector(`label[for="${priorityInput.id}"]`).textContent,
        completedReps: 0,
        streak: 0,
        lastUpdated: null
    };
}
// Skapa HTML för kort
function createCard(habit) {
    const isCompleted = parseInt(habit.completedReps) >= parseInt(habit.goal);
    const completedClass = isCompleted ? 'completed-routine' : '';
    const completedText = isCompleted ? 'Done!' : habit.completedReps;
    
    return `
<div class="routine-card ${habit.priority}-priority ${completedClass}">
    <div class="left-container">
        <div class="title-container">
            <h3>${habit.title}</h3>
            <p class="priority-text">${habit.priorityText}</p>
        </div>
        <div class="category-container">
            <p>${habit.category}</p>
        </div>
    </div>
    <div class="right-container">    
        <div class="counter-container">
            <div class="counter-header">
                <p><i class="fa-solid fa-bullseye"></i> ${habit.goal} times/${habit.frequency}</p>
            </div>
        </div>
    </div>
    <div class="bottom-container">
        <div class="streak-container">
            <div class="streak-header">
                <p><i class="fa-solid fa-fire"></i> ${habit.streak} days in a row</p>
            </div>
        </div>
            <div class="day-container">
                <button class="remove-day-btn"><i class="fa-solid fa-minus"></i></button>
                <p class="day-count">${completedText}</p>
                <button class="add-day-btn"><i class="fa-solid fa-plus"></i></button>
                <button class="reset-btn"><i class="fa-solid fa-arrow-rotate-left"></i></button>
                <button class="delete-btn"><i class="fa-solid fa-trash-can"></i></button>
            </div>
    </div>
</div>
    `;
}

// Funktion för att lägga till rutin i DOM
function displayHabit(habit) {
    const resultDiv = document.createElement('div');
    resultDiv.classList.add('rutine-result');
    resultDiv.innerHTML = createCard(habit);

    const routinesContainer = document.getElementById('routines-container') || 
        document.createElement('div');
    routinesContainer.id = 'routines-container';
    
    if (!document.getElementById('routines-container')) {
        document.querySelector('main').appendChild(routinesContainer);
    }
    routinesContainer.appendChild(resultDiv);
}
// Hanterar +,- och delete knappar

document.body.addEventListener('click', (e) => {
    const target = e.target.closest('button');
    if (!target) return;

    const card = target.closest('.rutine-result');
    if (!card) return;

    const dayCount = card.querySelector('.day-count');
    const routineCard = card.querySelector('.routine-card');
    const index = Array.from(card.parentElement.children).indexOf(card);

    const goalValue = parseInt(habits[index].goal);
    const today = new Date().toDateString();

    
    if (target.classList.contains('add-day-btn')) {

        if (habits[index].completedReps === 0 || 
            (habits[index].completedReps === goalValue - 1 && habits[index].lastUpdated !== today)) {
            
            if (habits[index].lastUpdated !== today) {

                if (habits[index].lastUpdated) {
                    const lastDate = new Date(habits[index].lastUpdated);
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    
                    if (lastDate.toDateString() === yesterday.toDateString()) {
                        habits[index].streak++;
                    } 
                    else if (lastDate < yesterday) {
                        habits[index].streak = 1;
                    }
                } else {
                    habits[index].streak = 1;
                }
                
                habits[index].lastUpdated = today;
            }
        }
        habits[index].completedReps++;

        if (habits[index].completedReps >= goalValue) {
            dayCount.textContent = "Done!";
            routineCard.classList.add('completed-routine');
        } else {
            dayCount.textContent = habits[index].completedReps;
        }

        const streakElement = card.querySelector('.streak-header p');
    if (streakElement) {
        streakElement.innerHTML = `<i class="fa-solid fa-fire"></i> ${habits[index].streak} days in a row`;
    }

        saveHabits();
    } 
    else if (target.classList.contains('remove-day-btn') && habits[index].completedReps > 0) {
        habits[index].completedReps--;

        if (habits[index].completedReps < goalValue) {
            dayCount.textContent = habits[index].completedReps;
            routineCard.classList.remove('completed-routine');
        }
        
        saveHabits();
    }
    else if (target.classList.contains('reset-btn')) {
        habits[index].completedReps = 0;
        dayCount.textContent = "0";
        routineCard.classList.remove('completed-routine');
        saveHabits();
    }
    else if (target.classList.contains('delete-btn')) {
        habits.splice(index, 1);
        card.remove();
        saveHabits();
    }
});

// Hantera formulär submit
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const habit = getFormData();
    habits.push(habit);
    displayHabit(habit);
    saveHabits();  
    form.reset();
    
    addRutineContainer.classList.add('hidden');
    habitsContainer.classList.remove('hidden');
});

let filteredHabits = [];

// Funktion för att visa rutiner
function renderHabits(habitsToRender) {
    const container = document.getElementById('routines-container');
    container.innerHTML = '';
    habitsToRender.forEach(habit => displayHabit(habit));
}

//Filtrera på prioritet
filterDropdown.addEventListener('change', () => { 
    const dropdownValue = filterDropdown.value;

    filteredHabits = dropdownValue === 'all'
        ? [...habits]
        : habits.filter(habit => habit.priority === dropdownValue);

    if (filteredHabits.length === 0 && dropdownValue !== 'all'){
        errorMessage.textContent = `Det finns inga rutiner att visa`
    } else {
        errorMessage.textContent = '';
    }

    renderHabits(filteredHabits);
}); 

// Sortering 
sortDropdown.addEventListener('change', () => {
    const sortValue = sortDropdown.value;

    if (filteredHabits.length === 0) {
        filteredHabits = [...habits];
    }

    filteredHabits.sort((a, b) => {  
        if (sortValue.includes('priority')){
            const values = {high: 3, medium: 2, low: 1};
            return sortValue.includes('falling') ?
                values[b.priority] - values[a.priority] :
                values[a.priority] - values[b.priority];
        }
        const repsA = parseInt(a.completedReps);
        const repsB = parseInt(b.completedReps);
        return sortValue.includes('falling') ?
            repsB - repsA :
            repsA - repsB;
    });

    renderHabits(filteredHabits);  
});

loadHabits();