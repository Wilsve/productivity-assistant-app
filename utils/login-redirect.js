const logInOutButton = document.querySelector('.logout')

const loggedInUser = sessionStorage.getItem('loggedInUser')

if(loggedInUser === null) {
    logInOutButton.textContent = 'LOG IN'
    logInOutButton.href = '../Login/login.html'
}else{
    logInOutButton.textContent = 'LOG OUT'
    logInOutButton.href = '../Login/login.html'

}

// Skriva ut inloggat användarnamn
const usernameElement = document.querySelector(".username");

if (loggedInUser && loggedInUser !== "null") {
  const userData = JSON.parse(localStorage.getItem(`user_${loggedInUser}`));
  usernameElement.innerHTML = `<i class="fa-solid fa-user"></i> ${loggedInUser}`;
} else {
  usernameElement.textContent = "";
}
//Logga ut
const logoutBtn = document.querySelector(".logout");

logoutBtn.addEventListener("click", () => {
  sessionStorage.removeItem("loggedInUser");
  window.location.href = "../login/login.html";
});