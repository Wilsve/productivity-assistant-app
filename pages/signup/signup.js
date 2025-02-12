const errorMessages = ['Password must contain atleast 5 letters', 'Password must contain atleast one uppercase letter', 'Password must contain atleast one number', 'Please fill in all fields']

const registerUser = () => {
    let username = document.querySelector('.username').value
    let password = document.querySelector('.password').value
    let errorText = document.querySelector('.error-message')

    if(username === "" || password === ""){
        errorText.innerHTML = errorMessages[3] 
        return;
    }
    

    localStorage.setItem(username, password)
    
}

const registerButton = document.querySelector('.register-btn')
registerButton.addEventListener('click', registerUser)