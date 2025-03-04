// Hämta viktiga element
const addRutineContainer = document.getElementById('add-rutine-container');
const habitsContainer = document.querySelector('#habits-container');
const form = document.getElementById('add-routine-form');
const filterDropdown = document.getElementById('filter-dropdown');
const sortDropdown = document.getElementById('sort-dropdown');
const frequencyDropdown = document.getElementById('frequency-dropdown');


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

function renderHabits(habitsToRender) {
    const routinesContainer = document.getElementById('routines-container');
    
    if (routinesContainer) {
        routinesContainer.innerHTML = '';
    } else {
        
        const newContainer = document.createElement('div');
        newContainer.id = 'routines-container';
        document.querySelector('main').appendChild(newContainer);
    }
    
    habitsToRender.forEach(habit => {
        const resultDiv = document.createElement('div');
        resultDiv.classList.add('rutine-result');
        resultDiv.innerHTML = createCard(habit);
        
        routinesContainer.appendChild(resultDiv);
    });
}

let filteredHabits = [];

// Deklarerar standard värde för alla filter
let activeFilters = {
    priority: 'all',
    sort: 'rising-priority',
    frequency: 'all',
    status: 'all',
    category: 'all'
};

// Filter funktion för all filter
function allFilters() {
    let result = [...habits];

    if (activeFilters.priority !== 'all') {
        result = result.filter(habit => habit.priority === activeFilters.priority);
    }

    if (activeFilters.frequency !== 'all') {
        result = result.filter(habit => habit.frequency === activeFilters.frequency);
    }

    if (activeFilters.status === 'done') {
        result = result.filter(habit => parseInt(habit.completedReps) >= parseInt(habit.goal));
    } else if (activeFilters.status === 'inprogress') {
        result = result.filter(habit => parseInt(habit.completedReps) < parseInt(habit.goal));
    }

    if (activeFilters.category !== 'all') {
        result = result.filter(habit => habit.category.toLowerCase() === activeFilters.category);
    }

    result.sort((a, b) => {  
        if (activeFilters.sort.includes('priority')) {
            const values = {high: 3, medium: 2, low: 1};
            return activeFilters.sort.includes('falling') ?
                values[b.priority] - values[a.priority] :
                values[a.priority] - values[b.priority];
        }
        const repsA = parseInt(a.completedReps);
        const repsB = parseInt(b.completedReps);
        return activeFilters.sort.includes('falling') ?
            repsB - repsA :
            repsA - repsB;
    });

    if (result.length === 0) {
        errorMessage.textContent = 'No routines found with the selected filters!';
    } else {
        errorMessage.textContent = '';
    }

    filteredHabits = result;
    renderHabits(filteredHabits);
}

// Eventlistners för filter
filterDropdown.addEventListener('change', () => {
    activeFilters.priority = filterDropdown.value;
    allFilters();
});

sortDropdown.addEventListener('change', () => {
    activeFilters.sort = sortDropdown.value;
    allFilters();
});

frequencyDropdown.addEventListener('change', () => {
    activeFilters.frequency = frequencyDropdown.value;
    allFilters();
});

const radioDone = document.getElementById('done');
const radioInprogress = document.getElementById('inprogress');
const radioAll = document.getElementById('all-status');

radioDone.addEventListener('click', () => {
    activeFilters.status = 'done';
    allFilters();
});

radioInprogress.addEventListener('click', () => {
    activeFilters.status = 'inprogress';
    allFilters();
});

if (radioAll) {
    radioAll.addEventListener('click', () => {
        activeFilters.status = 'all';
        allFilters();
    });
}

const categoryDropdown = document.getElementById('category-dropdown');
categoryDropdown.addEventListener('change', () => {
    activeFilters.category = categoryDropdown.value;
    allFilters();
});

loadHabits();
filteredHabits = [...habits]; 
renderHabits(habits);
