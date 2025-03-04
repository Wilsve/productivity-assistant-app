const quotes = [
  {
    quote: "fetch('coffee').then(startWorking).catch(needMoreCoffee)",
    author: "API Konsument",
  },
  {
    quote:
      "querySelector('#motivation').style.display är alltid 'none' på måndagar.",
    author: "Frontend Filosof",
  },
  {
    quote: "REST API: För när du behöver en paus från att koda.",
    author: "HTTP Humorist",
  },
  {
    quote: "document.getElementById('deadline').style.approach = 'tooFast'",
    author: "DOM Manipulator",
  },
  {
    quote:
      "try { meetDeadline(); } catch(procrastination) { blame.network.connectivity(); }",
    author: "Exception Handler",
  },
  {
    quote:
      "Sprint Review: När din demo funkar perfekt tills product owner säger 'kan du bara testa en grej...'",
    author: "Demo Demon",
  },
  {
    quote:
      "const promises = ['Ska fixa det idag', 'Är nästan klar', 'Bara en bugg kvar']; Promise.all(promises).then(reality.check);",
    author: "Promise Keeper",
  },
];

const apiKey = "P4hTMGSMdQyc+Qfw69VOuw==Vul8uy2NTMeRSLN3";
const fetchQuote = async () => {
  try {
    const response = await fetch("https://api.api-ninjas.com/v1/quotes", {
      method: "GET",
      headers: {
        "X-Api-Key": apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    const quote = data[0];

    const quoteElement = document.getElementById("quote");
    const authorElement = document.getElementById("author");

    quoteElement.textContent = quote.quote;
    authorElement.textContent = quote.author;
  } catch (error) {
    console.log("failed to fetch");
  }
};

fetchQuote();

const calculateDaysLeft = (date) => {
  const currentDate = new Date();
  const futureDate = new Date(date);

  const differenceInTime = futureDate - currentDate;
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));

  return differenceInDays;
};



let userTodos = [];
let userHabits = [];
let userEvents = [];

const loadUserData = () => {
  if (loggedInUser) {
    const storedUserTodos = localStorage.getItem(`todos_${loggedInUser}`);
    const storedUserEvents = localStorage.getItem(`events_${loggedInUser}`);
    const storedUserHabits = localStorage.getItem(`habits_${loggedInUser}`);
    if (storedUserEvents) {
      let fullUserEvents = JSON.parse(storedUserEvents);
      userEvents = fullUserEvents
        .map((event) => ({
          ...event,
          dateDifference: Math.abs(new Date(event.start) - new Date()),
        }))
        .sort((a, b) => a.dateDifference - b.dateDifference)
        .slice(0, 3);
    }
    if (storedUserHabits) {
      let fullUserHabits = JSON.parse(storedUserHabits);
      userHabits = fullUserHabits
        .sort((a, b) => b.completedReps - a.completedReps)
        .slice(0, 3);
    }
    if (storedUserTodos) {
      let fullUserTodos = JSON.parse(storedUserTodos);
      userTodos = fullUserTodos.filter((todo) => !todo.isCompleted).slice(-3);
    }
  }
};
loadUserData();

const habitsList = document.querySelector(".habits");
const renderHabits = () => {
  userHabits.forEach((habit) => {
    const eventsContainer = document.createElement("div");
    eventsContainer.className = "events-container";

    const titleDays = document.createElement("div");
    titleDays.className = "title-days";

    const titleCategoryPrio = document.createElement("div");
    titleCategoryPrio.className = "title-category-prio";

    const titlePrio = document.createElement("div");
    titlePrio.className = "title-prio";

    const title = document.createElement("h3");
    title.textContent = habit.title;

    const prio = document.createElement("div");
    prio.className = "prio";
    prio.textContent = habit.priorityText;

    prio.style.background =
      habit.priority === "low"
        ? "#4CAF50"
        : habit.priority === "medium"
        ? "#FFC107"
        : "#F44336";

    titlePrio.appendChild(title);
    titlePrio.appendChild(prio);

    titleCategoryPrio.appendChild(titlePrio);

    const category = document.createElement("p");
    category.className = "category";
    category.textContent = habit.category;

    titleCategoryPrio.appendChild(category);

    titleDays.appendChild(titleCategoryPrio);

    const daysLeft = document.createElement("div");
    daysLeft.className = "days-left";

    const bullseyeIcon = document.createElement("i");
    bullseyeIcon.className = "fa-solid fa-bullseye";

    daysLeft.appendChild(bullseyeIcon);

    const daysText = document.createElement("p");
    daysText.textContent = `${habit.goal} times/${habit.frequency}`;

    daysLeft.appendChild(daysText);

    titleDays.appendChild(daysLeft);

    const line = document.createElement("div");
    line.className = "line";

    const eventDate = document.createElement("div");
    eventDate.className = "event-date";

    const fireIcon = document.createElement("i");
    fireIcon.className = "fa-solid fa-fire";

    eventDate.appendChild(fireIcon);

    eventDate.innerHTML += `Current reps: ${habit.completedReps}`;

    eventsContainer.appendChild(titleDays);
    eventsContainer.appendChild(line);
    eventsContainer.appendChild(eventDate);

    habitsList.appendChild(eventsContainer);

  });
};

const eventList = document.querySelector(".events");
const renderEvents = () => {
  userEvents.forEach((event) => {
    const eventsContainer = document.createElement("div");
    eventsContainer.className = "events-container";

    const titleDays = document.createElement("div");
    titleDays.className = "title-days";

    const title = document.createElement("h3");
    title.textContent = event.name;

    titleDays.appendChild(title);

    const daysLeft = document.createElement("div");
    daysLeft.className = "days-left";

    const hourglassIcon = document.createElement("i");
    hourglassIcon.className = "fa-solid fa-hourglass-end";
    hourglassIcon.style.color = "#578e7e";

    daysLeft.appendChild(hourglassIcon);

    const daysText = document.createElement("p");
    daysText.textContent = `Starts in ${calculateDaysLeft(event.start)} days`;

    daysLeft.appendChild(daysText);

    titleDays.appendChild(daysLeft);

    const line = document.createElement("div");
    line.className = "line";

    const eventDate = document.createElement("div");
    eventDate.className = "event-date";

    const calendarIcon = document.createElement("i");
    calendarIcon.className = "fa-solid fa-calendar-days fa-rotate-by";
    calendarIcon.style.color = "#578e7e";

    eventDate.appendChild(calendarIcon);

    eventDate.innerHTML += `${event.start.split("T")[0]} - ${event.end.split("T")[0]}`;

    eventsContainer.appendChild(titleDays);
    eventsContainer.appendChild(line);
    eventsContainer.appendChild(eventDate);

    eventList.appendChild(eventsContainer);

  });
};

const todoList = document.querySelector(".todo");
const renderTodos = () => {
  userTodos.forEach((todo) => {
    const eventsContainer = document.createElement("div");
    eventsContainer.className = "events-container";

    const titleDays = document.createElement("div");
    titleDays.className = "title-days";

    const titleCategoryPrio = document.createElement("div");
    titleCategoryPrio.className = "title-category-prio";

    const titlePrio = document.createElement("div");
    titlePrio.className = "title-prio";

    const title = document.createElement("h3");
    title.textContent = todo.title;

    titlePrio.appendChild(title);
    titleCategoryPrio.appendChild(titlePrio);

    const category = document.createElement("p");
    category.className = "category";
    category.textContent = todo.category;

    titleCategoryPrio.appendChild(category);

    titleDays.appendChild(titleCategoryPrio);

    const daysLeft = document.createElement("div");
    daysLeft.className = "days-left";

    const flagIcon = document.createElement("i");
    flagIcon.className = "fa-solid fa-flag";

    daysLeft.appendChild(flagIcon);

    const dueText = document.createElement("p");
    dueText.textContent = `Due - ${todo.deadline}`;

    daysLeft.appendChild(dueText);

    titleDays.appendChild(daysLeft);

    const line = document.createElement("div");
    line.className = "line";

    const description = document.createElement("div");
    description.className = "description";
    description.textContent = todo.description;

    eventsContainer.appendChild(titleDays);
    eventsContainer.appendChild(line);
    eventsContainer.appendChild(description);

    todoList.appendChild(eventsContainer);

  });
};
renderTodos();
renderHabits();
renderEvents();
console.log(userEvents);
console.log(userHabits);
console.log(userTodos);
