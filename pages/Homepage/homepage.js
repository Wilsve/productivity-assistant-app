
const quotes = [
    {
        quote: "fetch('coffee').then(startWorking).catch(needMoreCoffee)",
        author: "API Konsument"
    },
    {
        quote: "querySelector('#motivation').style.display är alltid 'none' på måndagar.",
        author: "Frontend Filosof"
    },
    {
        quote: "REST API: För när du behöver en paus från att koda.",
        author: "HTTP Humorist"
    },
    {
        quote: "document.getElementById('deadline').style.approach = 'tooFast'",
        author: "DOM Manipulator"
    },
    {
        quote: "try { meetDeadline(); } catch(procrastination) { blame.network.connectivity(); }",
        author: "Exception Handler"
    },
    {
        quote: "Sprint Review: När din demo funkar perfekt tills product owner säger 'kan du bara testa en grej...'",
        author: "Demo Demon"
    },
    {
        quote: "const promises = ['Ska fixa det idag', 'Är nästan klar', 'Bara en bugg kvar']; Promise.all(promises).then(reality.check);",
        author: "Promise Keeper"
    }
];


const apiKey = 'P4hTMGSMdQyc+Qfw69VOuw==Vul8uy2NTMeRSLN3'
const fetchQuote = async () => {
    try {
        const response = await fetch('https://api.api-ninjas.com/v1/quotes', 
        {
            method: 'GET',
            headers: {
                'X-Api-Key': apiKey,
            },
        })

        if(!response.ok){
            throw new Error(`Error: ${response.statusText}`)
        }

        const data = await response.json();
        const quote = data[0]

        const quoteElement = document.getElementById('quote');
        const authorElement = document.getElementById('author');

        quoteElement.textContent = quote.quote;
        authorElement.textContent = quote.author;
        
    } catch (error) {
        console.log('failed to fetch')
    }
}

fetchQuote()





// Skriva ut inloggat användarnamn
const loggedInUser = sessionStorage.getItem('loggedInUser');
const userData = JSON.parse(localStorage.getItem(`user_${loggedInUser}`));
document.querySelector('.username').textContent = loggedInUser;

//Logga ut
const logoutBtn = document.querySelector('.logout');

logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('loggedInUser');
    window.location.href = '../login/login.html';
});

let userTodos = []
let userHabits = []
let userEvents = []
const loadUserData = () => {
    if(loggedInUser){
        const storedUserTodos = localStorage.getItem(`todos_${loggedInUser}`)
        const storedUserEvents = localStorage.getItem(`events_${loggedInUser}`)
        const storedUserHabits = localStorage.getItem(`events_${loggedInUser}`)
        if(storedUserEvents){
            userEvents = JSON.parse(storedUserEvents)
        }
        if(storedUserHabits){
            userHabits = JSON.parse(storedUserHabits)
        }
        if(storedUserTodos){
            userTodos = JSON.parse(storedUserTodos)
        }
    }
}
loadUserData()

console.log(userEvents)
console.log(userHabits)
console.log(userTodos)