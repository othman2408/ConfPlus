// Import the success, Error, and Warning Alerts from the script.js file
import { success, error, warning } from "./script.js";

// Link: Locations and Dates
const locations =
  "https://gist.githubusercontent.com/Athman-aa1808162/3f0f92091de211b973986d438ca65e01/raw/336154438004b7764da79427edf9b5b0829c2f2f/locations";
const dates =
  "https://gist.githubusercontent.com/Athman-aa1808162/61e619e221c2e44ad579b3ea0df7716b/raw/0b094e6bebedd9ea7369133739e0959362179a6b/Dates";

export async function organizer() {
  // Change the login to logout
  let login = document.querySelector(".login");
  login.innerHTML = "Logout";

  //Load page content
  const mainContent = document.querySelector(".main");
  const page = await fetch("../../organizer.html");
  const pageHTMLContent = await page.text();

  //CSS Style for loaded contnets
  mainContent.innerHTML = pageHTMLContent;
  mainContent.style.display = "flex";
  mainContent.style.justifyContent = "center";
  mainContent.style.margin = "0";

  // Selectors
  let createSessionBtn = document.querySelector(".createSessionBtn");
  let sessions = document.querySelector(".sessions");
  let organizerConent = document.querySelector(".organizerContnet");

  // Show all sessions when the organizer page is loaded
  getSessions(organizerConent);

  // Locations and Dates Fetch
  let locations = await getLocations();
  let dates = await getDates();

  //Show Organizer form when the create session button is clicked, to create a session
  createSessionBtn.addEventListener("click", () => {
    console.log("clicked");
    let papers = getAcceptedPapers();

    organizerConent.innerHTML = sessionFormTemplate(locations, dates, papers);

    // Selectors
    let addSessionBtn = document.querySelector(".addSessionBtn");
    let presenter = document.querySelector("#presenter");
    let paperSelect = document.querySelector("#accptedPapers");

    //Update presenter name when the paper is selected
    paperSelect.addEventListener("change", (e) => {
      //Update presenter name when the presenter name input is changed
      presenter.value = updatePresenterName(e);
    });

    //Create Session when the add session button is clicked
    addSessionBtn.addEventListener("click", () => {
      createSession();
    });
  });

  //Show all sessions when the sessions button is clicked
  sessions.addEventListener("click", () => {
    getSessions(organizerConent);
  });

  //Update Session
  updateSession(organizerConent, locations, dates);
}

// Update Session
function updateSession(organizerConent, locations, dates) {
  let papers = getAcceptedPapers();
  let formTemplate = sessionFormTemplate(locations, dates, papers);

  // Add event listener to parent element
  organizerConent.addEventListener("click", (e) => {
    if (e.target.classList.contains("updateSession")) {
      // Update button was clicked
      updateFunction(e, formTemplate, organizerConent);
    } else if (e.target.classList.contains("deleteSession")) {
      // Delete button was clicked
      deleteFunction(e, organizerConent);
      success("Session Deleted Successfully");
    }
  });
}

//Update Function, to be called inside the updateSession function, when the update button is clicked
function updateFunction(e, formTemplate, organizerConent) {
  // Get the id of the session to be updated
  let sessionID = e.target.parentElement.parentElement.dataset.id;

  // Get the sessions array from the local storage
  let sessionsArr = JSON.parse(localStorage.getItem("shedule"));

  //Find session in the sessions array by id
  let targetSession = sessionsArr.find((session) => {
    return session.id == sessionID;
  });

  // Load the form template
  organizerConent.innerHTML = formTemplate;

  //Set the values of the selected session to the form
  let paperSelect = document.querySelector("#accptedPapers");
  paperSelect.disabled = true;
  paperSelect.value = targetSession.title;
  let locationSelect = document.querySelector("#location");
  locationSelect.value = targetSession.location;
  let dateSelect = document.querySelector("#date");
  dateSelect.value = targetSession.date;
  let startTime = document.querySelector("#startTime");
  startTime.value = extractHours(targetSession.startTime);
  let endTime = document.querySelector("#endTime");
  endTime.value = extractHours(targetSession.endTime);
  let presenter = document.querySelector("#presenter");
  presenter.value = targetSession.presenter;

  let addSessionBtn = document.querySelector(".addSessionBtn");

  // Get new values from the form
  addSessionBtn.addEventListener("click", () => {
    let newSession = {
      id: targetSession.id,
      title: paperSelect.value,
      location: locationSelect.value,
      date: dateSelect.value,
      startTime: formatTime(startTime.value),
      endTime: formatTime(endTime.value),
      presenter: presenter.value,
    };

    // Check if the new values are valid, in terms of time and location
    let isValid = checkSession(newSession, sessionsArr);

    // If the new values are valid, update the session
    if (isValid) {
      // Find the index of the session in the sessions array
      let index = sessionsArr.findIndex((session) => {
        return session.id == sessionID;
      });

      // Update the session in the sessions array
      sessionsArr[index] = newSession;

      // Update the sessions array in the local storage
      localStorage.setItem("shedule", JSON.stringify(sessionsArr));

      // Show all sessions
      getSessions(organizerConent);
      success("Session Updated Successfully");
    } else {
      // alert("Time or Location is not valid");
      warning("Time or Location is not valid");
    }
  });
}

// Delete Function, to be called inside the updateSession function, when the delete button is clicked
function deleteFunction(e, organizerConent) {
  let sessionID = e.target.parentElement.parentElement.dataset.id;
  let sessionsArr = JSON.parse(localStorage.getItem("shedule"));

  // Find the index of the session in the sessions array
  let index = sessionsArr.findIndex((session) => {
    return session.id == sessionID;
  });

  //Accept the paper Array
  let acceptedPapers = JSON.parse(localStorage.getItem("acceptedPapers"));

  //Find the paper i want to delete, in the acceptedPapers array
  let targetSession = acceptedPapers.findIndex((paper) => {
    return paper.id == sessionID;
  });

  //Set the paper selected to false
  acceptedPapers[targetSession].selected = false;

  // Update the acceptedPapers array in the local storage
  localStorage.setItem("acceptedPapers", JSON.stringify(acceptedPapers));

  // Delete the session from the sessions array
  sessionsArr.splice(index, 1);

  // Update the sessions array in the local storage
  localStorage.setItem("shedule", JSON.stringify(sessionsArr));

  // Show all sessions
  getSessions(organizerConent);
}

// Check if the new values are valid, in terms of time and location
function checkSession(newSession, sessionsArr) {
  let isValid = true;

  sessionsArr.forEach((session) => {
    if (
      session.location === newSession.location &&
      session.date === newSession.date &&
      ((session.startTime >= newSession.startTime &&
        session.startTime < newSession.endTime) ||
        (session.endTime > newSession.startTime &&
          session.endTime <= newSession.endTime) ||
        (session.startTime <= newSession.startTime &&
          session.endTime >= newSession.endTime))
    ) {
      isValid = false;
    }
  });

  return isValid;
}

// Session Form Template
function sessionFormTemplate(locations, dates, acceptedPapers) {
  return `
        <!-- Start Organizer Form -->
        <div class="organizerForm">
          <form action="">
            <!-- Start Accepted Papers -->
            <div class="acceptedPapers">
              <label for="">Accepted Papers</label>
              <select name="" id="accptedPapers">
                <option value="" selected disabled>Select a Paper</option>
                ${acceptedPapers
                  .map((paper) => {
                    if (paper.selected == false) {
                      return `<option data-id = "${paper.id}" value="${paper.title}">${paper.title}</option>`;
                    } else {
                      return `<option data-id = "${paper.id}" value="${paper.title}" disabled>${paper.title}</option>`;
                    }
                  })
                  .join(" ")}
              </select>
            </div>
            <!-- End Accepted Papers -->

            <!-- Start Presenter -->
            <div class="presenter">
              <label for="">Presenter</label>
              <input type="text" value="${"Presenter Name"}" name="" id="presenter" disabled/>
            </div>
            <!-- End Presenter -->

            <!-- Start Location -->
            <div class="location">
              <label for="">Location</label>
              <select name="" id="location">
                <option value="" selected disabled>Select a Location</option>
                ${locations
                  .map((location) => {
                    return `<option value="${location.location}">${location.location}</option>`;
                  })
                  .join(" ")}
              </select>
            </div>
            <!-- End Location -->

            <!-- Start Date -->
            <div class="date">
              <label for="">Date</label>
              <select name="" id="date">
                <option value="" selected disabled>Select a Date</option>
                ${dates
                  .map((date) => {
                    return `<option value="${date.date}">${date.date}</option>`;
                  })
                  .join(" ")}
              </select>
            </div>
            <!-- End Date -->

            <!-- Start Time -->
            <div class="time">
              <label for="">Select A Time</label>
              <div class="timeInputs">
                <div class="startTime">
                  <label for="">From:</label>
                  <input type="time" name="" id="startTime" />
                </div>
                <div class="endTime">
                  <label for="">To:</label>
                  <input type="time" name="" id="endTime" />
                </div>
              </div>
            </div>
            <!-- End Time -->
            <!-- Start Submit -->
            <div class="addSession">
              <a class="addSessionBtn" href="#">ADD</a>
            </div>
            <!-- End Submit -->
          </form>
          </div>
          <!-- End Organizer Form -->
  `;
}

// Session Card Template
function sessionCardTemplate(session) {
  return `
    <!-- Start Session Card Template -->
      <div class="sessionCard" data-id = ${session.id}>
        <!-- Start Session Card Title -->
        <div class="title">
          <h1>${session.title}</h1>
        </div>
        <!-- End Session Card Title -->

        <!-- Start Card Content -->
        <div class="sessionContent">
          <ul>
            <li><i class="bi bi-person"></i> Presenter: <p>${session.presenter}</p></li>
            <li><i class="bi bi-geo-alt"></i> Location: <p>${session.location}</p></li>
            <li><i class="bi bi-calendar3"></i> Date: <p>${session.date}</p></li>
            <li><i class="bi bi-clock-history"></i> Time: <p>${session.startTime} - ${session.endTime}</p></li>
          </ul>
        </div>
        <!-- End Card Content -->

        <div class="cardButtons">
          <button class="updateSession">Update</button>
          <button class="deleteSession">Delete</button>
        </div>
      </div>
    <!-- End Session Card Template -->
  `;
}

//Check if there is an accepted paper array in the local storage, if yes, get it, if no, filter the papers array to get the accepted papers, then check if the papers when method calls more again, so do not duplicate the accepted papers
function getAcceptedPapers() {
  let allPapers = JSON.parse(localStorage.getItem("papers"));

  // Check if there are accepted papers in storage
  if (localStorage.getItem("acceptedPapers")) {
    let acceptedPapers = JSON.parse(localStorage.getItem("acceptedPapers"));

    // Loop through all papers in local storage
    allPapers.forEach((paper) => {
      let found = false;

      // Check if paper is already in accepted papers
      for (let i = 0; i < acceptedPapers.length; i++) {
        if (acceptedPapers[i].id === paper.id) {
          found = true;
          break;
        }
      }

      // If paper is not in accepted papers, but it is accepted, add it
      if (
        !found &&
        paper.evaluation != null &&
        paper.evaluation.evaluation >= 2
      ) {
        paper.selected = false;
        acceptedPapers.push(paper);
      }
    });

    localStorage.setItem("acceptedPapers", JSON.stringify(acceptedPapers));

    return JSON.parse(localStorage.getItem("acceptedPapers"));
  } else {
    // If there are no accepted papers in storage, create new array
    let acceptedPapers = [];
    allPapers.forEach((paper) => {
      if (paper.evaluation != null && paper.evaluation.evaluation >= 2) {
        paper.selected = false;
        acceptedPapers.push(paper);
      }
    });

    localStorage.setItem("acceptedPapers", JSON.stringify(acceptedPapers));

    return JSON.parse(localStorage.getItem("acceptedPapers"));
  }
}

//Get Locations
async function getLocations() {
  const locations =
    "https://gist.githubusercontent.com/Athman-aa1808162/3f0f92091de211b973986d438ca65e01/raw/271b581b9c16265988cbf4dd7938285328449a3c/locations";

  let response = await fetch(locations);
  let data = await response.json();

  return data;
}

//Get Dates
async function getDates() {
  const dates =
    "https://gist.githubusercontent.com/Athman-aa1808162/61e619e221c2e44ad579b3ea0df7716b/raw/0b094e6bebedd9ea7369133739e0959362179a6b/Dates";

  let response = await fetch(dates);
  let data = await response.json();

  return data;
}

//Add the session to the shedule
function appendSession(session) {
  if (localStorage.getItem("shedule") != null) {
    let sheduleArr = JSON.parse(localStorage.getItem("shedule"));
    sheduleArr.push(session);
    localStorage.setItem("shedule", JSON.stringify(sheduleArr));
  } else {
    let sheduleArr = [];
    sheduleArr.push(session);
    localStorage.setItem("shedule", JSON.stringify(sheduleArr));
  }
}

// Update Selected Paper, to disable it from being selected again
function disbaleSelectedPaper(id) {
  let acceptedPapers = getAcceptedPapers();

  acceptedPapers.forEach((paper) => {
    if (paper.id == id) {
      paper.selected = true;
    }
  });

  localStorage.setItem("acceptedPapers", JSON.stringify(acceptedPapers));
}

// Create Session
function createSession() {
  //Selectors
  let acceptedPapers = document.querySelector("#accptedPapers");
  let location = document.querySelector("#location");
  let date = document.querySelector("#date");
  let startTime = document.querySelector("#startTime");
  let endTime = document.querySelector("#endTime");
  let presenter = document.querySelector("#presenter");

  if (
    acceptedPapers.value == "" ||
    location.value == "" ||
    date.value == "" ||
    startTime.value == "" ||
    endTime.value == "" ||
    presenter.value == ""
  ) {
    //Show warning
    warning("Please fill in all fields");
  } else if ((startTime + 12).value >= (endTime + 12).value) {
    warning("Start time should be less than end time");
  } else {
    let session = {
      id: acceptedPapers.options[acceptedPapers.selectedIndex].dataset.id,
      title: acceptedPapers.value,
      presenter: presenter.value,
      location: location.value,
      date: date.value,
      startTime: formatTime(startTime.value),
      endTime: formatTime(endTime.value),
    };

    let exisingSessions = JSON.parse(localStorage.getItem("shedule")) || [];

    //Check if there is already an exisiting session with same date and time, or within the same range
    let found = exisingSessions.some((existingSession) => {
      return (
        (existingSession.date == session.date &&
          existingSession.startTime <= session.startTime &&
          existingSession.endTime >= session.startTime &&
          existingSession.location == session.location) ||
        (existingSession.date == session.date &&
          existingSession.startTime <= session.endTime &&
          existingSession.endTime >= session.endTime &&
          existingSession.location == session.location) ||
        (existingSession.date == session.date &&
          existingSession.startTime >= session.startTime &&
          existingSession.endTime <= session.endTime &&
          existingSession.location == session.location)
      );
    });

    if (found) {
      warning(
        "Time Conflict, there is already a session at this time. Please choose another time"
      );
    } else {
      // Get the parent element of the selected option of the accepted papers
      let selectedID =
        acceptedPapers.options[acceptedPapers.selectedIndex].dataset.id;

      //Disable the selected paper option
      acceptedPapers.options[acceptedPapers.selectedIndex].disabled = true;

      //Update the accepted papers, to disable the selected paper
      disbaleSelectedPaper(selectedID);

      //Append the session to the sessions
      appendSession(session);

      //Clear form
      acceptedPapers.value = "";
      location.value = "";
      date.value = "";
      startTime.value = "";
      endTime.value = "";
      presenter.value = "Presenter Name";

      //Show success message
      success("Session Added Successfully");
    }
  }
}

//Get the sessions from the local storage
function getSessions(organizerConent) {
  if (localStorage.getItem("shedule")) {
    let sessions = JSON.parse(localStorage.getItem("shedule"));
    let sessionsHTML = sessions.map((session) => {
      return sessionCardTemplate(session);
    });
    organizerConent.innerHTML = sessionsHTML.join(" ");
  }
}

//Updaed Presenter name, based on selected paper
function updatePresenterName(e) {
  let paperID = e.target.options[e.target.selectedIndex].dataset.id;
  let paperPresenter = getAcceptedPapers().find((paper) => {
    return paper.id == paperID;
  });

  return paperPresenter.presenter;
}

// Format time to AM/PM
function formatTime(inputTime) {
  const [hours, minutes] = inputTime.split(":");
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  const timeString = date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  return timeString;
}

//Extract the number of hours from "AM/PM" time
function extractHours(time) {
  const timeRegex = /(\d{1,2}):(\d{2})/;
  let match = time.match(timeRegex)[0];
  let [hours, minutes] = match.split(":");
  hours = hours.padStart(2, "0");
  return `${hours}:${minutes}`;
}
