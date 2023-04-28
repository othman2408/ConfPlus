// Link: Locations and Dates
const locations =
  "https://gist.githubusercontent.com/Athman-aa1808162/3f0f92091de211b973986d438ca65e01/raw/336154438004b7764da79427edf9b5b0829c2f2f/locations";
const dates =
  "https://gist.githubusercontent.com/Athman-aa1808162/61e619e221c2e44ad579b3ea0df7716b/raw/0b094e6bebedd9ea7369133739e0959362179a6b/Dates";

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

  // Locations and Dates Fetch
  let locations = await getLocations();
  let dates = await getDates();

  //Show Organizer form when the create session button is clicked
  createSessionBtn.addEventListener("click", () => {
    let papers = getAcceptedPapers();

    organizerConent.innerHTML = sessionFormTemplate(locations, dates, papers);

    //Selectors
    let acceptedPapers = document.querySelector("#accptedPapers");
    let location = document.querySelector("#location");
    let date = document.querySelector("#date");
    let startTime = document.querySelector("#startTime");
    let endTime = document.querySelector("#endTime");
    let addSessionBtn = document.querySelector(".addSessionBtn");

    //Create Session when the add session button is clicked
    addSessionBtn.addEventListener("click", () => {
      if (
        acceptedPapers.value == "" ||
        location.value == "" ||
        date.value == "" ||
        startTime.value == "" ||
        endTime.value == ""
      ) {
        alert("Please fill all fields");
      } else {
        let session = {
          acceptedPapers: acceptedPapers.value,
          location: location.value,
          date: date.value,
          startTime: startTime.value,
          endTime: endTime.value,
        };

        // Get the parent element of the selected option of the accepted papers
        let parent =
          acceptedPapers.options[acceptedPapers.selectedIndex].dataset.id;

        //Update the accepted papers, to disable the selected paper
        updateAcceptedPapers(parent);

        //Append the session to the sessions
        appendSession(session);

        //Clear form
        acceptedPapers.value = "";
        location.value = "";
        date.value = "";
        startTime.value = "";
        endTime.value = "";
      }
    });
  });
}

// Session Form Template
function sessionFormTemplate(locations, dates, acceptedPapersArr) {
  return `
        <!-- Start Organizer Form -->
        <div class="organizerForm">
          <form action="">
            <!-- Start Accepted Papers -->
            <div class="acceptedPapers">
              <label for="">Accepted Papers</label>
              <select name="" id="accptedPapers">
                <option value="" selected disabled>Select a Paper</option>
                ${acceptedPapersArr
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

  let allAcceptedPapers = [];

  if (localStorage.getItem("selectedPapers") == null) {
    papers.filter((paper) => {
      if (paper.evaluation != null && paper.evaluation.evaluation >= 2) {
        // paper.selected = false;
        allAcceptedPapers.push(paper);
      }
    });
  } else {
    let acceptedPapers = JSON.parse(localStorage.getItem("acceptedPapers"));
    papers.forEach((paper) => {
      acceptedPapers.forEach((acceptedPaper) => {
        if (paper.id != acceptedPaper.id) {
          allAcceptedPapers.push(paper);
        }
      });
    });
  }

  //Set all accepted papers selected to false
  allAcceptedPapers.forEach((paper) => {
    paper.selected = false;
  });

  localStorage.setItem("acceptedPapers", JSON.stringify(allAcceptedPapers));

  return JSON.parse(localStorage.getItem("acceptedPapers"));
}

//Get Locations
async function getLocations() {
  const locations =
    "https://gist.githubusercontent.com/Athman-aa1808162/3f0f92091de211b973986d438ca65e01/raw/336154438004b7764da79427edf9b5b0829c2f2f/locations";

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

// Disable the selected paper, and update the accepted papers
function updateAcceptedPapers(paperID) {
  let acceptedPapers = getAcceptedPapers();

  acceptedPapers.forEach((paper) => {
    if (paper.id == paperID) {
      paper.selected = true;
    }
  });

  localStorage.setItem("acceptedPapers", JSON.stringify(acceptedPapers));
}
