
const addRutineBtn = document.querySelector('#rutine-btn');
const addRutineContainer = document.querySelector('#add-rutine-container');
const habitsContainer = document.querySelector('#habits-container');

addRutineBtn.addEventListener('click', () => {
    addRutineContainer.classList.toggle('hidden');
    habitsContainer.classList.toggle('hidden');
});

const form = document.getElementById('add-routine-form');
form.addEventListener('submit', (e) => {
    e.preventDefault(); 
    
    const title = document.getElementById('rutine-title').value;
   
    const categorySelect = document.getElementById('category');
    const categoryText = categorySelect.options[categorySelect.selectedIndex].text;
    
  
    const priorityInput = document.querySelector('input[name="priority"]:checked');
    const priorityText = document.querySelector(`label[for="${priorityInput.id}"]`).textContent;
    
    const resultDiv = document.createElement('div');
    resultDiv.classList.add('rutine-result');
    
    resultDiv.innerHTML = `
        <div class="routine-card ${priorityInput.value}-priority"> 
            <h3>${title}</h3>
            <p>Kategori: ${categoryText}</p>
            <p>Prioritet: ${priorityText}</p>
        </div>
    `;
    
    document.body.appendChild(resultDiv);
    form.reset();
    
    addRutineContainer.classList.add('hidden');
    habitsContainer.classList.remove('hidden');
});