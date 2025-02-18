// Funktion för att visa/dölja formulär
const addRutineBtn = document.querySelector('#rutine-btn');
const addRutineContainer = document.querySelector('#add-rutine-container');
const habitsContainer = document.querySelector('#habits-container');

addRutineBtn.addEventListener('click', () => {
    addRutineContainer.classList.toggle('hidden');
    habitsContainer.classList.toggle('hidden');
});

const backBtn = document.querySelector('.back-btn');
backBtn.addEventListener('click', () => {
    addRutineContainer.classList.add('hidden');
    habitsContainer.classList.remove('hidden');
});
// Funktion för att hämta värden från formuläret och skapa en ny rutin
const form = document.getElementById('add-routine-form');
form.addEventListener('submit', (e) => {
    e.preventDefault(); 
    
    const title = document.getElementById('rutine-title').value;
    const repetitions = document.getElementById('repetition-number').value; 
    const categorySelect = document.getElementById('category');
    const categoryText = categorySelect.options[categorySelect.selectedIndex].text;
    const priorityInput = document.querySelector('input[name="priority"]:checked');
    const priorityText = document.querySelector(`label[for="${priorityInput.id}"]`).textContent;
    

    //Skapa en ny div för att visa rutinen
    const resultDiv = document.createElement('div');
    resultDiv.classList.add('rutine-result');
    
    //Skriva ut data i div
    resultDiv.innerHTML = `
    <div class="routine-card ${priorityInput.value}-priority"> 
        <div class="top-container">
            <div class="title-container">
                <h3>${title}</h3>
                <p>${categoryText}</p>
            </div>
            <div class="counter-container">
                <div class="counter-header">
                    <h3>Antal repetitioner:</h3>
                    <p>${repetitions}</p>
                </div>
                <h3>Dagar i rad</h3>
                <div class="counter-controls">
                    <button class="add-day-btn"><i class="fa-solid fa-plus"></i></button>
                    <span class="day-count">0</span>
                    <button class="remove-day-btn"><i class="fa-solid fa-minus"></i></button>
                </div>
            </div>
            <div class="priority-container">
                <h3>Prioritet</h3>
                <p>${priorityText}</p>
            </div>
        </div>
        <button class="delete-btn"><i class="fa-regular fa-circle-xmark"></i></button>
    </div>
`;
    // Knappar för att lägga till/ta bort dagar
    const addDayBtn = resultDiv.querySelector('.add-day-btn');
    const removeDayBtn = resultDiv.querySelector('.remove-day-btn');
    const dayCountSpan = resultDiv.querySelector('.day-count');

    addDayBtn.addEventListener('click', () => {
        let currentCount = parseInt(dayCountSpan.textContent);
        dayCountSpan.textContent = currentCount + 1;
    });

    removeDayBtn.addEventListener('click', () => {
        let currentCount = parseInt(dayCountSpan.textContent);
        if (currentCount > 0) {
            dayCountSpan.textContent = currentCount - 1;
        }
    });
    // Knapp för att ta bort rutinen
    const deleteBtn = resultDiv.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        resultDiv.remove();
    });
    
    const routinesContainer = document.createElement('div');
    routinesContainer.id = 'routines-container';
    if (!document.getElementById('routines-container')) {
        document.body.appendChild(routinesContainer);
    }
    document.getElementById('routines-container').appendChild(resultDiv);
    form.reset();
    
    addRutineContainer.classList.add('hidden');
    habitsContainer.classList.remove('hidden');
});
// Funtioner för filter/sortering

const filterDropdown = document.getElementById('filter-dropdown');
const sortDropdown = document.getElementById('sort-dropdown');

function allRoutines() {
    return Array.from(document.querySelectorAll('.routine-card'));
}
//Funktion för att filtrera rutiner
function filterRoutines(){
    const selectedPriority = filterDropdown.value;
    const routineCards = allRoutines();

    routineCards.forEach(card => {
        if (selectedPriority === 'all'){
            card.style.display = 'flex';
        } else {
            const hasPriorityClass = card.querySelector('.routine-card').classList.contains(`${selectedPriority}-priority`);
            card.style.display = hasPriorityClass ? 'flex' : 'none';
        }   
    });
}
//Funktion för att sortera rutiner
function allRoutines() {
    return Array.from(document.querySelectorAll('.rutine-result'));
}

function sortRoutines(){
    const sortValue = sortDropdown.value;
    const routineCards = allRoutines();
    const container = routineCards[0].parentElement;

    const priorityValues = {
        'low': 1,
        'medium': 2,
        'high': 3
    };


    const sortedCards = [...routineCards].sort((a, b) => {
        const priorityA = a.querySelector('.routine-card').classList.toString().match(/(low|medium|high)-priority/)[1];
        const priorityB = b.querySelector('.routine-card').classList.toString().match(/(low|medium|high)-priority/)[1];
        const repetitionsA = parseInt(a.querySelector('.counter-header p').textContent);
        const repetitionsB = parseInt(b.querySelector('.counter-header p').textContent);

        switch(sortValue){
            case 'priority-falling':
                return priorityValues[priorityB] - priorityValues[priorityA];
            case 'priority-rising':
                return priorityValues[priorityA] - priorityValues[priorityB];
            case 'repetition-falling':
                return repetitionsB - repetitionsA;
            case 'repetition-rising':
                return repetitionsA - repetitionsB;
            default:
                return 0;
        }
    });
    
    sortedCards.forEach(card => container.appendChild(card));
}
//Eventlisteners för filter och sortering

filterDropdown.addEventListener('change', filterRoutines);
sortDropdown.addEventListener('change', sortRoutines);

// Localstorage