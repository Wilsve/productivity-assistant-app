const addRutineContainer = document.getElementById('add-rutine-container');
const habitsContainer = document.querySelector('#habits-container');
const form = document.getElementById('add-routine-form');
const filterDropdown = document.getElementById('filter-dropdown');
const sortDropdown = document.getElementById('sort-dropdown');

const addRutineBtn = document.getElementById('rutine-btn');
const backBtn = document.querySelector('.back-btn');

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


// Visa/dölj formulär 
const buttons = [addRutineBtn, backBtn];
buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        addRutineContainer.classList.toggle('hidden');
        habitsContainer.classList.toggle('hidden');
    });
});

// Hämta form data
function getFormData() {
    const priorityInput = document.querySelector('input[name="priority"]:checked');
    return {
        title: document.getElementById('rutine-title').value,
        goal: document.getElementById('repetition-number').value,
        category: document.getElementById('category').options[document.getElementById('category').selectedIndex].text,
        priority: priorityInput.value,
        priorityText: document.querySelector(`label[for="${priorityInput.id}"]`).textContent,
        completedReps: 0 
    };
}
// Skapa HTML för kort
function createCard(habit) {
    return `
    <div class="routine-card ${habit.priority}-priority"> 
        <div class="top-container">
            <div class="title-container">
                <h3>${habit.title}</h3>
                <p>${habit.category}</p>
            </div>
            <div class="counter-container">
                <div class="counter-header">
                    <p>Mål: ${habit.goal} reps</p>
                </div>
                <h3><i class="fa-solid fa-fire"></i></h3>
                <div class="counter-controls">
                    <button class="add-day-btn"><i class="fa-solid fa-plus"></i></button>
                    <span class="day-count">${habit.completedReps}</span>
                    <button class="remove-day-btn"><i class="fa-solid fa-minus"></i></button>
                </div>
            </div>
            <div class="priority-container">
                <h3>Prioritet</h3>
                <p>${habit.priorityText}</p>
            </div>
        </div>
        <button class="delete-btn"><i class="fa-regular fa-circle-xmark"></i></button>
    </div>`;
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
    const index = Array.from(card.parentElement.children).indexOf(card);

    if (target.classList.contains('add-day-btn')) {
        habits[index].completedReps++;
        dayCount.textContent = habits[index].completedReps;
        saveHabits();
    } 
    else if (target.classList.contains('remove-day-btn') && habits[index].completedReps > 0) {
        habits[index].completedReps--;
        dayCount.textContent = habits[index].completedReps;
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

loadHabits();