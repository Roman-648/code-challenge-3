document.addEventListener("DOMContentLoaded", () => {
    const filmList = document.getElementById("films");
    const poster = document.getElementById("poster");
    const title = document.getElementById("title");
    const runtime = document.getElementById("runtime");
    const filmInfo = document.getElementById("film-info");
    const showtime = document.getElementById("showtime");
    const ticketNum = document.getElementById("ticket-num");
    const buyTicketButton = document.getElementById("buy-ticket");
  
  
    const fetchFilms = async () => {
      const response = await fetch("http://localhost:3000/films");
      const films = await response.json();
      renderFilmList(films);
      if (films.length > 0) {
        renderFilmDetails(films[0]); 
      }
    };
  
  
    const renderFilmList = (films) => {
      filmList.innerHTML = "";
      films.forEach(film => {
        const li = document.createElement("li");
        li.className = "film item";
        li.textContent = film.title;
        li.dataset.id = film.id;
        li.addEventListener("click", () => {
          renderFilmDetails(film);
        });
  
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "ui red button";
        deleteButton.addEventListener("click", (e) => {
          e.stopPropagation(); 
          deleteFilm(film.id);
        });
        li.appendChild(deleteButton);
        filmList.appendChild(li);
      });
    };
  
  
    const renderFilmDetails = (film) => {
      poster.src = film.poster;
      title.textContent = film.title;
      runtime.textContent = `${film.runtime} minutes`;
      filmInfo.textContent = film.description;
      showtime.textContent = film.showtime;
  
      const availableTickets = film.capacity - film.tickets_sold;
      ticketNum.textContent = availableTickets;
  
      if (availableTickets > 0) {
        buyTicketButton.disabled = false;
        buyTicketButton.textContent = "Buy Ticket";
      } else {
        buyTicketButton.disabled = true;
        buyTicketButton.textContent = "Sold Out";
      }
  
      buyTicketButton.onclick = () => buyTicket(film);
    };
  
  
    const buyTicket = async (film) => {
      if (film.tickets_sold < film.capacity) {
        const updatedTicketsSold = film.tickets_sold + 1;
  
        await fetch(`http://localhost:3000/films/${film.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ tickets_sold: updatedTicketsSold })
        });
  
     
        await fetch("http://localhost:3000/tickets", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            film_id: film.id,
            number_of_tickets: 1
          })
        });
  
     
        renderFilmDetails({ ...film, tickets_sold: updatedTicketsSold });
      }
    };
  
  
    const deleteFilm = async (filmId) => {
      await fetch(`http://localhost:3000/films/${filmId}`, {
        method: "DELETE"
      });
      fetchFilms(); 
    };
  
   
    fetchFilms();
  });
  