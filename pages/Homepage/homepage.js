
//checks if user is logged in, if not, send them directly to the log in page
if (localStorage.getItem("loggedInUser") === null) {
    window.location.href = '../login/login.html'
}