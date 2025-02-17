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

const form = document.getElementById('add-routine-form');
form.addEventListener('submit', (e) => {
    e.preventDefault(); 
    
    const title = document.getElementById('rutine-title').value;
    const repetitions = document.getElementById('repetition-number').value; 
    const categorySelect = document.getElementById('category');
    const categoryText = categorySelect.options[categorySelect.selectedIndex].text;
    const priorityInput = document.querySelector('input[name="priority"]:checked');
    const priorityText = document.querySelector(`label[for="${priorityInput.id}"]`).textContent;
    
    const resultDiv = document.createElement('div');
    resultDiv.classList.add('rutine-result');
    
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

    const deleteBtn = resultDiv.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        resultDiv.remove();
    });
    
    document.body.appendChild(resultDiv);
    form.reset();
    
    addRutineContainer.classList.add('hidden');
    habitsContainer.classList.remove('hidden');
});