const locations =
  "https://raw.githubusercontent.com/Athman-aa1808162/ConfPlus/main/assets/json/locations.js?token=GHSAT0AAAAAAB357G3TCBL6BVJAAHGRS5N4ZCLZSYA";
const dates =
  "https://raw.githubusercontent.com/Athman-aa1808162/ConfPlus/main/assets/json/conference-dates.js?token=GHSAT0AAAAAAB357G3SHDCRLEZDUB7DI6Q2ZCLZS7Q";

export async function organizer() {
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

  //Show Organizer form when the create session button is clicked
  createSessionBtn.addEventListener("click", () => {
    organizerConent.innerHTML = sessionFormTemplate();
  });

  //Get accepted papers
  getAcceptedPapers();
}

// Session Form Template
function sessionFormTemplate() {
  return `
        <!-- Start Organizer Form -->
        <div class="organizerForm">
          <form action="">
            <!-- Start Accepted Papers -->
            <div class="acceptedPapers">
              <label for="">Accepted Papers</label>
              <select name="" id="accptedPapers">
                <option value="" selected disabled>Select a Paper</option>
                <option value="">Paper 1</option>
                <option value="">Paper 2</option>
                <option value="">Paper 3</option>
              </select>
            </div>
            <!-- End Accepted Papers -->

            <!-- Start Location -->
            <div class="location">
              <label for="">Location</label>
              <select name="" id="location">
                <option value="" selected disabled>Select a Location</option>
                <option value="">location 1</option>
                <option value="">location 2</option>
                <option value="">location 3</option>
              </select>
            </div>
            <!-- End Location -->

            <!-- Start Date -->
            <div class="date">
              <label for="">Date</label>
              <select name="" id="date">
                <option value="" selected disabled>Select a Date</option>
                <option value="">date 1</option>
                <option value="">date 2</option>
                <option value="">date 3</option>
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
                  <input type="time" name="" id="End Time" />
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
function sessionCardTemplate(paper) {
  return `
    <!-- Start Session Card Template -->
      <div class="sessionCard">
        <!-- Start Session Card Title -->
        <div class="title">
          <h1>${paper.title}</h1>
        </div>
        <!-- End Session Card Title -->

        <!-- Start Card Content -->
        <div class="sessionContent">
          <ul>
            <li>Location:</li>
            <li>Date:</li>
            <li>Time:</li>
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

//Get accepted papers
function getAcceptedPapers() {
  let papers = JSON.parse(localStorage.getItem("papers"));

  let acceptedPapers = [];

  papers.filter((paper) => {
    if (paper.evaluation != null && paper.evaluation.evaluation == 2) {
      acceptedPapers.push(paper);
    }
  });

  console.log(acceptedPapers);
}

// Create a Session
function createSession(e) {
  //Selectors
  // let;
}
