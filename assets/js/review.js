import * as login from "./login.js";


export async function paperReview() {
    //Load page content
    const mainContent = document.querySelector(".main");
    const page = await fetch("../../review.html");
    const pageHTMLContent = await page.text();

    //CSS Style for loaded contnets
    mainContent.innerHTML = pageHTMLContent;
    mainContent.style.display = "flex";
    mainContent.style.justifyContent = "center";
    mainContent.style.margin = "0";


    let abstractHeader = document.querySelectorAll(".abstarctHeader");
    let abstractContent = document.querySelectorAll(".abstractContent");
    let evaluationHeader = document.querySelectorAll(".evaluationHeader");
    let evaluationContent = document.querySelectorAll(".evaluationContent");


    abstractHeader.forEach((header) => {
        header.addEventListener("click", () => {
            header.classList.toggle("active");
            let panel = header.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
        });
    });

    evaluationHeader.forEach((header) => {
        header.addEventListener("click", () => {
            evaluationContent.forEach((content) => {
                content.classList.toggle("show")
            });
        });
    })


    // Get Papers from Local Storage
    console.log(getPapers());
}

// Fetch Assign Paper to specific Reviewer
function getPapers() {
    if (localStorage.getItem("papers")) {
        let papers = JSON.parse(localStorage.getItem("papers"));
    } else {
        return "No Papers Found";
    }
}

function paperTemplate(paper) {
    return `
          <!-- Start Paper Template -->
      <div class="paperTemplate">
        <!-- Start Paper Title -->
        <div class="title">
          <h1>Paper tilte</h1>
        </div>
        <!-- End Paper Title -->
        <!-- Start Author Section -->
        <div class="paperAuthors">
          <h3>Authors</h3>
          <ul>
            <li>Author 1</li>
            <li>Author 2</li>
            <li>Author 3</li>
          </ul>
        </div>
        <!-- End Author Section -->
        <!-- Start Presenter Section -->
        <div class="paperPresenter">
          <h3>Presenter</h3>
          <ul>
            <li>Presenter 1</li>
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
              Abstraction example Abstraction example Abstraction example
              Abstraction example
            </p>
          </div>
        </div>
        <!-- End Abstract -->
        <!-- Start Paper Evalution  -->
        <div class="paperEvalution">
          <div class="evaluationHeader">
            <h3>Evaluation</h3>
            <i class="ti ti-chevron-down"></i>
          </div>
          <div class="evaluationContent">
            <select name="" id="">
              <option value="" selected disabled>Overall evaluation</option>
              <option value="2">Strong Accept</option>
              <option value="1">Accept</option>
              <option value="0">Borderline</option>
              <option value="-1">Reject</option>
              <option value="-2">Strong Reject</option>
            </select>
            <select name="" id="">
              <option value="" selected disabled>Overall contribution</option>
              <option value="5">major & significant</option>
              <option value="4">Clear</option>
              <option value="3">Minor</option>
              <option value="2">No Obvious</option>
              <option value="1">No Obvious</option>
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
            <label for=""></label>
          </div>
        </div>
        <!-- End Paper Evalution  -->
        <!-- Start Paper Submit -->
        <a href="#" class="paperBtn">Evaluate</a>
        <!-- End Paper Submit -->
      </div>
      <!-- End Paper Template -->
    `

}