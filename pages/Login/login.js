const login = () => {
    let username = document.querySelector('.username').value
    let password = document.querySelector('.password').value
    let errorText = document.querySelector('.error-message')
    let userPassword = localStorage.getItem(username)

    if(username === "" || password === "" ){
        errorText.innerHTML = 'Please fill in all fields!' 
        return;
    }
    
    if(userPassword === password){
        localStorage.setItem('loggedInUser', username)
        window.location.href = '../Homepage/homepage.html'
    }else{
        errorText.innerHTML = 'Invalid username or password'
        return
    }
    
}

const loginButton = document.querySelector('.login-btn')
loginButton.addEventListener('click', login);

