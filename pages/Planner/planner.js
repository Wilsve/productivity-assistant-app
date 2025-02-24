document.addEventListener("DOMContentLoaded", () => {
    const eventForm = document.getElementById("event-form");
    const upcomingList = document.getElementById("upcoming-events");
    const pastList = document.getElementById("past-events");
    const filterSelect = document.getElementById("filter");


    const loggedUser = sessionStorage.getItem("loggedInUser");
    if (!loggedUser) {
        alert("Ingen användare är inloggad!");
        return;
    }
    
    eventForm.addEventListener("submit", addEvent);
    filterSelect.addEventListener("change", displayEvents);
    displayEvents();

    const logoutBtn = document.querySelector(".logout");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            sessionStorage.removeItem("loggedInUser"); 
            window.location.href = "login.html"; 
        });
    }
    // Skriva ut inloggat användarnamn
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    const userData = JSON.parse(localStorage.getItem(`user_${loggedInUser}`));
    document.querySelector('.username').textContent = loggedInUser;
    
    function getEvents() {
        try {
            return JSON.parse(localStorage.getItem(`events_${loggedUser}`)) || [];
        } catch (error) {
            console.error("Fel vid hämtning av händelser:", error);
            return [];
        }
    }

    
    
    function saveEvents(events) {
        try {
            localStorage.setItem(`events_${loggedUser}`, JSON.stringify(events));
        } catch (error) {
            console.error("Fel vid sparande av händelser:", error);
        }
    }
    
    function isValidDate(date) {
        return !isNaN(new Date(date).getTime());
    }
    
    function addEvent(event) {
        event.preventDefault();
        
        const eventName = document.getElementById("event-name").value;
        const startTime = document.getElementById("start-time").value;
        const endTime = document.getElementById("end-time").value;
        
        if (!isValidDate(startTime) || !isValidDate(endTime)) {
            alert("Ogiltigt datum! Kontrollera datumformatet.");
            return;
        }
        
        if (new Date(startTime) >= new Date(endTime)) {
            alert("Sluttiden måste vara efter starttiden!");
            return;
        }
        
        const eventObj = {
            id: Date.now(),
            name: eventName,
            start: startTime,
            end: endTime
        };
        
        let events = getEvents();
        events.push(eventObj);
        saveEvents(events);
        
        displayEvents();
        eventForm.reset();
    }
    
    
    function displayEvents() {
        upcomingList.innerHTML = "";
        pastList.innerHTML = "";
        let events = getEvents();
    
       
        events.sort((a, b) => {
            let startA = new Date(a.start);
            let startB = new Date(b.start);
            let endA = new Date(a.end);
            let endB = new Date(b.end);
    
           
            if (startA - startB !== 0) {
                return startA - startB;
            }
            return endA - endB;
        });
    
        const now = new Date();
        const filter = filterSelect.value;
    
        let hasUpcoming = false;
        let hasPast = false;
        let hasEvents = false;
    
        events.forEach(event => {
            const eventDiv = document.createElement("div");
            eventDiv.classList.add("event-item");
            eventDiv.innerHTML = `<b>${event.name} </b> <br> 
            Datum: ${event.start.split("T")[0]} - ${event.end.split("T")[0]} <br> 
            Starttid: ${event.start.split("T")[1]} <br> 
            Sluttid: ${event.end.split("T")[1]}`;
    
            const deleteBtn = document.createElement("button");
            deleteBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;
            deleteBtn.style.background = "none";
            deleteBtn.style.border = "none";
            deleteBtn.style.cursor = "pointer";
            deleteBtn.style.color = "#F5ECD5";
            deleteBtn.addEventListener("click", () => deleteEvent(event.id));
    
            const editBtn = document.createElement("button");
            editBtn.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
            editBtn.style.background = "none";
            editBtn.style.border = "none";
            editBtn.style.cursor = "pointer";
            editBtn.style.color = "#F5ECD5";
            editBtn.addEventListener("click", () => editEvent(event.id));
    
            eventDiv.appendChild(editBtn);
            eventDiv.appendChild(deleteBtn);
    
            let eventEndTime = new Date(event.end);
            if (eventEndTime < now) {
                eventDiv.classList.add("past-event");
    
                if (filter === "all" || filter === "past") {
                    pastList.appendChild(eventDiv);
                    hasPast = true;
                    hasEvents = true;
                }
            } else {
                if (filter === "all" || filter === "upcoming") { 
                    upcomingList.appendChild(eventDiv);
                    hasUpcoming = true;
                    hasEvents = true;
                }
            }
        });
    
        document.getElementById("upcoming-events-container").style.display = hasUpcoming ? "block" : "none";
        document.getElementById("past-events-container").style.display = hasPast ? "block" : "none";
        document.querySelector(".events-wrapper").style.display = hasEvents ? "block" : "none";
    
        if (filter === "upcoming" && !hasUpcoming) {
            alert("Det finns inga kommande evenemang!");
        } else if (filter === "past" && !hasPast) {
            alert("Det finns inga förflutna evenemang!");
        }
    }
    
    function deleteEvent(id) {
        let events = getEvents();
        events = events.filter(event => event.id !== id);
        saveEvents(events);
        displayEvents();
    }
    
    function editEvent(id) {
        let events = getEvents();
        const eventToEdit = events.find(event => event.id === id);
        
        if (eventToEdit) {
            document.getElementById("event-name").value = eventToEdit.name;
            document.getElementById("start-time").value = eventToEdit.start;
            document.getElementById("end-time").value = eventToEdit.end;
            
            deleteEvent(id);
        }
    }



});



