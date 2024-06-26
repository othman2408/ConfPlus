import * as login from "./login.js";

//Selectors
let loginBtn = document.querySelector(".login");
let startBtn = document.querySelector(".start");
let datesSelect = document.querySelector("#dates");
let sheduleContainer = document.querySelector(".card-container");

loginBtn.addEventListener("click", () => {
  login.loadPage("../../login.html");
});
startBtn.addEventListener("click", () => {
  login.loadPage("../../login.html");
});

// All available sessions
let sessions = JSON.parse(localStorage.getItem("shedule"));

//Get Dates
async function getDates() {
  const dates =
    "https://gist.githubusercontent.com/othman2408/61e619e221c2e44ad579b3ea0df7716b/raw/0b094e6bebedd9ea7369133739e0959362179a6b/Dates";

  let response = await fetch(dates);
  let data = await response.json();

  return data;
}

// Dates Array
let datesArr = await getDates();

// Get Elements, Create Options
datesSelect.innerHTML =
  `<option value="" disabled selected>Choose a Date</option>` +
  datesArr.map((date) => `<option>${date.date}</option>`);

// Check if there is no available sessions at this date, show a message
if (sessions === null || sessions.length === 0) {
  sheduleContainer.innerHTML = `<h1 class="no-sessions">No Sessions Available</h1>`;
} else {
  sheduleContainer.innerHTML = sessions
    .map((session) => cardTemplate(session))
    .join("");
}

// Add Event Listener to the dates select
datesSelect.addEventListener("change", onDateSelect);

// Change the sessions according to the date selected
function onDateSelect(e) {
  let choosenDate = e.target.value;

  //Get the sessions of the locla storage
  let sessions = JSON.parse(localStorage.getItem("shedule"));
  //Add the sessions to the container

  //Check if there is no available sessions at this date, show a message
  if (getSessionsForDate(sessions, choosenDate).length === 0) {
    sheduleContainer.innerHTML = `<h1 class="no-sessions">No Sessions Available</h1>`;
  } else {
    sheduleContainer.innerHTML = getSessionsForDate(sessions, choosenDate)
      .map((session) => cardTemplate(session))
      .join("");
  }
}

// Get Sessions
function getSessionsForDate(sessions, date) {
  return sessions.filter((session) => session.date === date);
}

// Card Template
function cardTemplate(session) {
  return `
    <!-- Start Card -->
        <div class="card">
          <div class="card-image">
            <img src="./assets/images/card-img.jpg" alt="" />
          </div>
          <!-- Start Card Info -->
          <div class="cardInfo">
            <div class="cardTitle">
              <h2>${session.title}</h2>
            </div>
            <div class="cardContent">
              <!-- Start Presenter -->
              <div class="cardPresenter">
                <div class="presenter">
                  <i class="bi bi-person"></i>
                  <p>Presenter</p>
                </div>
                <div class="presenterContent">
                  <p>${session.presenter}</p>
                </div>
              </div>
              <!-- End Presenter -->

              <!-- Start Date -->
              <div class="cardDate">
                <div class="date">
                  <i class="bi bi-calendar3"></i>
                  <p>Date</p>
                </div>
                <div class="dateContent">
                  <p>${session.date}</p>
                </div>
              </div>
              <!-- End Date -->

              <!-- Start Time -->
              <div class="cardTime">
                <div class="time">
                  <i class="bi bi-clock-history"></i>
                  <p>Time</p>
                </div>
                <div class="timeContent">
                  <p>${session.startTime} - ${session.endTime}</p>
                </div>
              </div>
              <!-- End Time -->

              <!-- Start Location -->
              <div class="cardLocation">
                <div class="location">
                  <i class="bi bi-geo-alt"></i>
                  <p>${session.location}</p>
                </div>
                <div class="cardID">
                  <i class="bi bi-hash"></i>
                  <p>${session.id}</p>
                </div>
              </div>
              <!-- End Location -->
            </div>
          </div>
          <!-- End Card Info -->
        </div>
        <!-- End Card -->
      </div>
    <!-- End Card Container -->

  `;
}

// Success Alert
export function success(message) {
  return Swal.fire({
    icon: "success",
    title: "Success!",
    text: `${message}`,
    timer: 2000,
    showConfirmButton: false,
  });
}

// Error Alert
export function error(message) {
  return Swal.fire({
    icon: "error",
    title: "Error!",
    text: `${message}`,
    timer: 2000,
    showConfirmButton: false,
  });
}

// Warning Alert
export function warning(message) {
  return Swal.fire({
    icon: "warning",
    title: "Warning!",
    text: `${message}`,
    timer: 2000,
    showConfirmButton: false,
  });
}
