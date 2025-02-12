const errorMessages = ['Password must contain atleast 5 letters', 'Password must contain atleast one uppercase letter', 'Password must contain atleast one number', 'Please fill in all fields']

const registerUser = () => {
    const username = document.querySelector('.username').value
    const password = document.querySelector('.password').value
    const errorText = document.querySelector('.error-message')
    const successMessage = document.querySelector('.success-popup')
    const loginWindow = document.querySelector('.login-window')
    const overlay = document.querySelector('.overlay')

    if(username === "" || password === ""){
        errorText.innerHTML = errorMessages[3] 
        return;
    }

    const disabledElements = loginWindow.querySelectorAll('input, button');
    disabledElements.forEach(element => {
        element.disabled = true;
    });
    
    successMessage.style.display = 'flex'
    overlay.style.display = 'block'

    localStorage.setItem(username, password)
    
}

const registerButton = document.querySelector('.register-btn')
registerButton.addEventListener('click', registerUser)