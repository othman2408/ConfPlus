import * as login from "./login.js";
let loginBtn = document.querySelector(".login");

loginBtn.addEventListener("click", () => {
  login.loadPage("../../login.html");
});

//Selectors
let datesSelect = document.querySelector("#dates");
let sheduleContainer = document.querySelector(".card-container");
console.log(sheduleContainer);

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

datesSelect.addEventListener("change", (e) => {
  let choosenDate = e.target.value;

  //Get the sessions of the locla storage
  let sessions = JSON.parse(localStorage.getItem("shedule"));
  console.log(sessions);
  //Add the sessions to the container
  sheduleContainer.innerHTML = sessions
    .map((session) => {
      if (session.date === choosenDate) {
        return cardTemplate(session);
      }
    })
    .join("");
});

function cardTemplate(session) {
  return `
      <div class="card">
         <div class="card-image">
            <img src="./assets/images/card-img.png" alt="" />
         </div>
         <div class="card-links">
            <div class="row1">
               <a href="">${session.title}</a>
               <span>${session.startTime}</span>
            </div>
            <div class="row2">
               <img src="./assets/images/user.svg" alt="" />
               <p>3 Seats Available</p>
            </div>
            <div class="row3">
               <a href=""><i class="ti ti-map-pin"></i>Doha, QU</a>
               <span><i class="ti ti-flame"></i>Type</span>
            </div>
         </div>
         </div>
   `;
}
