
// let loggedInUser = localStorage.getItem('loggedInUser')
// if(loggedInUser === null) {
//     window.location.href = '/pages/Login/login.html'
// }

const errorMessages = [
    'Password must contain at least 5 letters',
    'Invalid username or password',
    'Password must contain at least one number',
    'Please fill in all fields'
];

const login = () => {
    let username = document.querySelector('.username').value;
    let password = document.querySelector('.password').value;
    let errorText = document.querySelector('.error-message');

    if (username === "" || password === "") {
        errorText.innerHTML = errorMessages[3];
        return;
    }

    let userData = localStorage.getItem(`user_${username}`);
    if (!userData) {
        errorText.innerHTML = errorMessages[1];
        return;
    }
    // parse data
    userData = JSON.parse(userData);
    let storedPassword = userData.password;

    // check if passwords match
    if (storedPassword === password) {
        sessionStorage.setItem('loggedInUser', username);
        window.location.href = '../Homepage/homepage.html';
    } else {
        errorText.innerHTML = "Invalid username or password";
    }
};

const logOut = () => {
    if(sessionStorage.getItem('loggedInUser')== null){
        window.location.href = '/pages/Login/login.html'
        return
    }
    sessionStorage.removeItem('loggedInUser')
    window.location.href = '/pages/Login/login.html'

}

const loginButton = document.querySelector('.login-btn');
if (loginButton) {
    loginButton.addEventListener('click', login);
}

const logOutButton = document.querySelector('.logout');
if (logOutButton) {
    logOutButton.addEventListener('click', logOut);
}


