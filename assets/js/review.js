export async function paperReview(userID) {
  //Load page content
  const mainContent = document.querySelector(".main");
  const page = await fetch("../../review.html");
  const pageHTMLContent = await page.text();

  //CSS Style for loaded contnets
  mainContent.innerHTML = pageHTMLContent;
  mainContent.style.display = "flex";
  mainContent.style.justifyContent = "center";
  mainContent.style.margin = "0";

  let papersContainer = mainContent.querySelector(".papersContainer");

  // Get Papers from Local Storage
  appendPapers(getPapers(), papersContainer, userID);

  let abstractHeader = document.querySelectorAll(".abstarctHeader");
  let abstractContent = document.querySelectorAll(".abstractContent");
  let evaluationHeader = document.querySelectorAll(".evaluationHeader");
  let evaluationContent = document.querySelectorAll(".evaluationContent");
  let evaluateBtn = document.querySelectorAll(".evaluateBtn");

  // Abstract Header Onclick Action
  abstractHeader.forEach((header) => {
    header.addEventListener("click", () => {
      header.nextElementSibling.classList.toggle("show");
    });
  });

  // Evaluation Header Onclick Action
  evaluationHeader.forEach((header) => {
    header.addEventListener("click", (e) => {
      header.nextElementSibling.classList.toggle("show");
      //Retrive Evaluation of a specific paper, when the evaluation header section is clicked
      retrieveEvaluation(e);

      //Scroll to the evaluation section
      let evaluationContent =
        e.target.parentElement.querySelector(".evaluationContent");
      evaluationContent.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    });
  });

  // Evaluate Paper Onclick Action
  evaluateBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      evaluatePaper(e);

      //Close the evaluation form
      e.target.parentElement.classList.toggle("show");
    });
  });
}

// Fetch Assign Paper to specific Reviewer
function getPapers() {
  if (localStorage.getItem("papers")) {
    // Get Papers from Local Storage
    let papers = JSON.parse(localStorage.getItem("papers"));
    return papers;
  } else {
    return null;
  }
}

//Append papers into the DOM
function appendPapers(papers, papersContainer, userID) {
  papers.forEach((paper) => {
    // console.log(paper);
    let paperReviewers = paper.reviewrs;

    // Check if the paper has reviewers
    if (paperReviewers.length > 0) {
      // Check if the paper has this reviewer, if yes append it to the DOM, if not do nothing
      paperReviewers.forEach((reviewer) => {
        if (reviewer.id == userID) {
          papersContainer.innerHTML += paperTemplate(paper);
        }
      });
    }
  });
}

// Paper Template structure
function paperTemplate(paper) {
  return `
    <!-- Start Paper Template -->
      <div class="paperTemplate" data-id = ${paper.id}>
        <!-- Start Paper Title -->
        <div class="title">
          <h1>${paper.title}</h1>
        </div>
        <!-- End Paper Title -->
        <!-- Start Author Section -->
        <div class="paperAuthors">
          <h3> Authors:</h3>
          <ul>
            ${paper.authors
              .map((author) => {
                return `<li>${author.fname} ${author.lname}</li>`;
              })
              .join("")}
          </ul>
        </div>
        <!-- End Author Section -->
        <!-- Start Presenter Section -->
        <div class="paperPresenter">
          <h3>Presenter:</h3>
          <ul>
            <li>${paper.presenter}</li>
          </ul>
        </div>
        <!-- End Presenter Section -->
        <!-- Start Abstract -->
        <div class="paperAbstract">
          <div class="abstarctHeader">
            <h3>abstract</h3>
            <i class="ti ti-chevron-down"></i>
          </div>
          <div class="abstractContent">
            <p>
              ${paper.abstract}
            </p>
          </div>
        </div>
        <!-- End Abstract -->
        <!-- Start Paper Evalution  -->
        <div class="paperEvalution">
          <div class="evaluationHeader">
            <h3>Evaluate</h3>
            <i class="ti ti-chevron-down"></i>
          </div>
          <div class="evaluationContent">
            <select name="" id="evaluation">
              <option value="" selected disabled>Overall evaluation</option>
              <option value="2">Strong Accept</option>
              <option value="1">Accept</option>
              <option value="0">Borderline</option>
              <option value="-1">Reject</option>
              <option value="-2">Strong Reject</option>
            </select>
            <select name="" id="contribution">
              <option value="" selected disabled>Overall contribution</option>
              <option value="5">major & significant</option>
              <option value="4">Clear</option>
              <option value="3">Minor</option>
              <option value="2">No Obvious</option>
              <option value="1">Obvious</option>
            </select>
            <div class="paperStrength">
              <label for="">Paper Strength</label>
              <textarea
                name=""
                id=""
                cols="30"
                rows="3"
                placeholder="Enter Paper Strength"
              ></textarea>
            </div>
            <div class="paperWeakness">
              <label for="">Paper Strength</label>
              <textarea
                name=""
                id=""
                cols="30"
                rows="3"
                placeholder="Enter Paper Weakness"
              ></textarea>
            </div>
            <!-- Start Paper Submit -->
            <a href="#" class="evaluateBtn">Submit</a>
            <!-- End Paper Submit -->
          </div>
        </div>
        <!-- End Paper Evalution  -->
      </div>
    <!-- End Paper Template -->
    `;
}

// Evaluate Paper Function
function evaluatePaper(e) {
  let id = e.target.closest(".paperTemplate").dataset.id;

  let evaluation = e.target.parentElement.querySelector("#evaluation");
  let contribution = e.target.parentElement.querySelector("#contribution");
  let paperStrength = e.target.parentElement.querySelector(
    ".paperStrength textArea"
  );
  let paperWeakness = e.target.parentElement.querySelector(
    ".paperWeakness textArea"
  );

  let evaluateCartirea = {
    2: "Strong Accept",
    1: "Accept",
    0: "Borderline",
    "-1": "Reject",
    "-2": "Strong Reject",
  };

  let contributionCartirea = {
    5: "major & significant",
    4: "Clear",
    3: "Minor",
    2: "Obvious",
    1: "No Obvious",
  };

  if (
    evaluation.value == "" ||
    contribution.value == "" ||
    paperStrength.value == "" ||
    paperWeakness.value == ""
  ) {
    alert("Please fill all fields");
  } else {
    // Get Papers from Local Storage
    let papers = JSON.parse(localStorage.getItem("papers"));
    //Update Paper Evaluation
    let target = papers.find((paper) => paper.id == id);

    if (target) {
      target.evaluation = {
        evaluation: `${evaluation.value} ${
          evaluateCartirea[`${evaluation.value}`]
        }`,
        contribution: `${contribution.value} ${
          contributionCartirea[`${contribution.value}`]
        }`,
        paperStrength: paperStrength.value,
        paperWeakness: paperWeakness.value,
      };
      target.status = true;
      //Update Local Storage papers
      localStorage.setItem("papers", JSON.stringify(papers));
    } else {
      alert(`Paper with id ${id} not found`);
    }
  }
}

// Check if paper is evaluated or not, and return the evaluation
function checkEvaluation(paperID) {
  // Get Papers from Local Storage
  let papers = JSON.parse(localStorage.getItem("papers"));

  // Check if paper is evaluated or not
  if (papers.find((paper) => paper.id == paperID).evaluation != null) {
    return true;
  }
  return false;
}

// Get Evaluation of tartget paper from local storage and append it into the evaluation from
function retrieveEvaluation(e) {
  //Select the evaluation form
  let id = e.target.parentElement.parentElement.dataset.id;
  let evaluation = e.target.parentElement.querySelector("#evaluation");
  let contribution = e.target.parentElement.querySelector("#contribution");
  let paperStrength = e.target.parentElement.querySelector(
    ".paperStrength textArea"
  );
  let paperWeakness = e.target.parentElement.querySelector(
    ".paperWeakness textArea"
  );

  // Match the target paper with the papers in local storage by id
  let target = getPapers().find((paper) => paper.id == id);
  // If paper is evaluated, retrive the evaluation from local storage and append it into the evaluation form
  if (checkEvaluation(id)) {
    evaluation.value = target.evaluation.evaluation.split(" ")[0];
    contribution.value = target.evaluation.contribution[0];
    paperStrength.value = target.evaluation.paperStrength;
    paperWeakness.value = target.evaluation.paperWeakness;
  }
  // If paper is not evaluated, Nothing will be appended into the evaluation form
  else if (checkEvaluation(id) == false) {
    evaluation.value = "";
    contribution.value = "";
    paperStrength.value = "";
    paperWeakness.value = "";
  }
}
