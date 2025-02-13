document.addEventListener("DOMContentLoaded", () => {
    const eventForm = document.getElementById("event-form");
    const upcomingList = document.getElementById("upcoming-events");
    const pastList = document.getElementById("past-events");
    const filterSelect = document.getElementById("filter");
    
    eventForm.addEventListener("submit", addEvent);
    filterSelect.addEventListener("change", displayEvents);
    displayEvents();
    
    function getEvents() {
        try {
            return JSON.parse(localStorage.getItem("events")) || [];
        } catch (error) {
            console.error("Fel vid hämtning av händelser:", error);
            return [];
        }
    }
    
    function saveEvents(events) {
        try {
            localStorage.setItem("events", JSON.stringify(events));
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
        events.sort((a, b) => new Date(a.start) - new Date(b.start));
        
        const now = new Date();
        const filter = filterSelect.value;
        
        events.forEach(event => {
            const eventDiv = document.createElement("div");
            eventDiv.classList.add("event-item");
            eventDiv.innerHTML = `<b>Event:</b> ${event.name} <br> 
                      <b>Datum:</b> ${event.start.split("T")[0]} - ${event.end.split("T")[0]} <br> 
                      <b>Starttid:</b> ${event.start.split("T")[1]} <br> 
                      <b>Sluttid:</b> ${event.end.split("T")[1]}`;
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "❌";
            deleteBtn.addEventListener("click", () => deleteEvent(event.id));
            
            const editBtn = document.createElement("button");
            editBtn.textContent = "✏️";
            editBtn.addEventListener("click", () => editEvent(event.id));
            
            eventDiv.appendChild(editBtn);
            eventDiv.appendChild(deleteBtn);
            
            if (new Date(event.end) < now) {
                eventDiv.classList.add("past-event");
                if (filter === "all" || filter === "past") pastList.appendChild(eventDiv);
            } else {
                if (filter === "all" || filter === "upcoming") upcomingList.appendChild(eventDiv);
            }
        });
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
