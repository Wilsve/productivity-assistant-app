document.addEventListener("DOMContentLoaded", () => {
    const eventForm = document.getElementById("event-form");
    const upcomingList = document.getElementById("upcoming-events");
    const pastList = document.getElementById("past-events");
    const filterSelect = document.getElementById("filter");


    const loggedUser = sessionStorage.getItem("loggedInUser");
 
    if (!loggedUser) {
        alert("Ingen användare är inloggad!");
        window.location.href = "/pages/Login/login.html";
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

        let pastEvents = JSON.parse(localStorage.getItem(`pastEvents_${loggedUser}`)) || [];
        let upcomingEvents = [];
       
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
            eventDiv.innerHTML = `<h3 class="h3-card" >${event.name} </h3>
            <div class= "date-text"> 
            Date: ${event.start.split("T")[0]} - ${event.end.split("T")[0]} </div>
            <div class="time-text">
            Time: ${event.start.split("T")[1]} - ${event.end.split("T")[1]} </div>` ;
            

            const buttonContainer = document.createElement("div");
            buttonContainer.classList.add("button-container");

            const deleteBtn = document.createElement("button");
            deleteBtn.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
            deleteBtn.style.background = "none";
            deleteBtn.style.border = "none";
            deleteBtn.style.cursor = "pointer";
            deleteBtn.style.color = "#578e7e";
            deleteBtn.addEventListener("click", () => deleteEvent(event.id));
    
            const editBtn = document.createElement("button");
            editBtn.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
            editBtn.style.background = "none";
            editBtn.style.border = "none";
            editBtn.style.cursor = "pointer";
            editBtn.style.color = "#578e7e";
            editBtn.addEventListener("click", () => editEvent(event.id));
            
            buttonContainer.appendChild(editBtn);
            buttonContainer.appendChild(deleteBtn);


            eventDiv.appendChild(buttonContainer);
      
            
    
            let eventEndTime = new Date(event.end);
            if (eventEndTime < now) {
                eventDiv.classList.add("past-event");
    
                pastEvents.push(event);

                if (filter === "all" || filter === "past") {
                    pastList.appendChild(eventDiv);
                    hasPast = true;
                    hasEvents = true;
                }
            } else {
                upcomingEvents.push(event);

                if (filter === "all" || filter === "upcoming") { 
                    upcomingList.appendChild(eventDiv);
                    hasUpcoming = true;
                    hasEvents = true;
                }
            }
        });

        localStorage.setItem(`pastEvents_${loggedUser}`, JSON.stringify(pastEvents));
        localStorage.setItem(`upcomingEvents_${loggedUser}`,JSON.stringify(upcomingEvents));
    
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



