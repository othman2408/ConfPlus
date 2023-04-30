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
    "https://gist.githubusercontent.com/Athman-aa1808162/61e619e221c2e44ad579b3ea0df7716b/raw/0b094e6bebedd9ea7369133739e0959362179a6b/Dates";

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

sheduleContainer.innerHTML = sessions
  .map((session) => cardTemplate(session))
  .join("");

// Add Event Listener to the dates select
datesSelect.addEventListener("change", onDateSelect);

// Change the sessions according to the date selected
function onDateSelect(e) {
  let choosenDate = e.target.value;

  //Get the sessions of the locla storage
  let sessions = JSON.parse(localStorage.getItem("shedule"));
  //Add the sessions to the container
  sheduleContainer.innerHTML = getSessionsForDate(sessions, choosenDate)
    .map(cardTemplate)
    .join("");
}

// Get Sessions
function getSessionsForDate(sessions, date) {
  return sessions.filter((session) => session.date === date);
}

function cardTemplate(session) {
  return `
    <!-- Start Card -->
        <div class="card">
          <div class="card-image">
            <img src="./assets/images/card-img.png" alt="" />
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
                  <p>${session.endTime} - ${session.endTime}</p>
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
