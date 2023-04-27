// Paper class
class paper {
  static counter = 1;
  constructor(title, abstract, authors, presenter, reviewrs) {
    this.id = paper.counter++;
    this.title = title;
    this.abstract = abstract;
    this.authors = authors;
    this.presenter = presenter;
    this.reviewrs = reviewrs;
    this.evaluation = "";
    this.status = false;
  }
}

// Author class
class author {
  static counter = 1;
  constructor(fname, lname, email, affiliation) {
    this.id = author.counter++;
    this.fname = fname;
    this.lname = lname;
    this.email = email;
    this.affiliation = affiliation;
  }
}

export async function paperSubmission() {
  //Load page content
  const mainContent = document.querySelector(".main");
  const page = await fetch("../../paper.html");
  const pageHTMLContent = await page.text();

  //CSS Style for loaded contnets
  mainContent.innerHTML = pageHTMLContent;
  mainContent.style.display = "flex";
  mainContent.style.justifyContent = "center";
  mainContent.style.margin = "0";

  //HTML Element Selection
  let titleInput = document.querySelector(".input-title");
  let abstractInput = document.querySelector(".input-abstract");
  let authorsContainer = document.querySelector(".authors-list ol");
  let presentersContainer = document.querySelector(".presenters-list ol");
  let presentersDropList = document.querySelector("#presentersDropList");
  let submitBtn = document.querySelector(".submit");
  let addAuthorBtn = document.querySelector(".add-author");
  let authorForm = document.querySelector(".fieldset");
  let fnameInput = document.querySelector("#fname");
  let lnameInput = document.querySelector("#lname");
  let emailInput = document.querySelector("#email");
  let affiliationSelect = document.querySelector("#affiliation");
  let addBtn = document.querySelector(".add");
  let cancelBtn = document.querySelector(".cancel");

  //Arrays to store the authors and the reviewers
  let authorsArray = [];
  let reviewrsArray = await getReviewrs();

  //Add Author Onclick Action
  addAuthorBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    authorForm.classList.toggle("show");

    //Fetch the affiliations
    getAffiliations(affiliationSelect);
  });

  addBtn.addEventListener("click", (e) => {
    e.preventDefault();

    //Close the add author form after clic add
    addAuthor(
      fnameInput,
      lnameInput,
      emailInput,
      affiliationSelect,
      authorsArray
    );

    //Add the new author to the authors container
    appendAuthorsToAuthorList(authorsArray, authorsContainer);

    //Close the add author form
    authorForm.classList.toggle("show");

    //Delete the author from the authors container and the authors array and the presenters drop list after clicking the delete button
    let deleteAuthorBtns = document.querySelectorAll(".targetAuthor i");
    deleteAuthor(
      deleteAuthorBtns,
      authorsArray,
      presentersDropList,
      presentersContainer
    );

    //Add the new author to the presenters drop list
    appendAuthorsToPresenterList(authorsArray, presentersDropList);

    console.log(authorsArray);
  });

  //Add the select presnter to the presenters container
  presentersDropList.addEventListener("change", (e) => {
    let id = e.target.options[e.target.selectedIndex].getAttribute("data-id");
    presentersContainer.innerHTML = `<li class = "selectedPresenter" data-id = ${id}>${
      e.target.options[e.target.selectedIndex].innerHTML
    }`;
    //get thhe id from the attribute data-id
    console.log();
  });

  // Close the add author form when clicking cancel
  cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    authorForm.classList.toggle("show");
  });

  // Submit the paper
  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let presenter = document.querySelector(".selectedPresenter").innerText;
    createPaper(
      titleInput,
      abstractInput,
      authorsArray,
      presenter,
      reviewrsArray
    );
  });
}

function appendAuthorsToAuthorList(authorsArray, authorsContainer) {
  authorsContainer.innerHTML = authorsArray
    .map(
      (author) =>
        `<li class = "targetAuthor" data-id = ${author.id}>${author.fname} ${author.lname}<i class="ti ti-x"></i></li>`
    )
    .join("");
}

function deleteAuthor(
  deleteAuthorBtns,
  authorsArray,
  presentersDropList,
  presentersContainer
) {
  deleteAuthorBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      //ID of the author to be deleted
      let id = e.target.parentElement.dataset.id;
      //remove the author from the authors array by splicing it
      authorsArray.splice(
        authorsArray.findIndex(
          (author) => author.id == e.target.parentElement.dataset.id
        ),
        1
      );
      e.target.parentElement.remove();

      //Remove the author from the presenters drop list
      presentersDropList.innerHTML =
        `<option value="" selected disabled>Select Presenter</option>` +
        authorsArray
          .map(
            (author) =>
              `<option data-id = ${author.id} value="${author.id}">${author.fname} ${author.lname}</option>`
          )
          .join("");

      //Remove the added presenter from the presenters container if the deleted author was the presenter
      //Not Working
      let selectedPresenter =
        presentersContainer.querySelector(".selectedPresenter");
      if (selectedPresenter.dataset.id == id) {
        selectedPresenter.remove();
      }
    });
  });
}

// Assign tan random reviewer to the paper
function assignReviewr(reviewersArray) {
  return [
    reviewersArray[Math.floor(Math.random() * reviewersArray.length)],
    reviewersArray[Math.floor(Math.random() * reviewersArray.length)],
  ];
}

// Raetrive the reviewers from the repo
async function getReviewrs() {
  let request = await fetch(
    "https://raw.githubusercontent.com/cmps350s2023/cmps350-content-m/main/project/users.json"
  );
  let data = await request.json();
  let reviewers = [];

  data.filter((item) => {
    if (item.role === "reviewer") reviewers.push(item);
  });

  return reviewers;
}

// Function called when the submit button is clicked, it creates a new paper object and add it to the local storage
function createPaper(title, abstract, authors, presenter, reviewrsArray) {
  let newPaper = new paper(
    title.value,
    abstract.value,
    authors,
    presenter,
    assignReviewr(reviewrsArray)
  );

  let papersArr = getPapersFromLocal() || [];
  papersArr.push(newPaper);
  localStorage.setItem("papers", JSON.stringify(papersArr));
}

// Function to get the papers from the local storage
function getPapersFromLocal() {
  let papersArr;
  if (localStorage.getItem("papers")) {
    papersArr = JSON.parse(localStorage.getItem("papers"));
  } else {
    papersArr = [];
  }
  return papersArr;
}

// Fetch the affiliations from the repo and add them to the affiliation select
async function getAffiliations(affiliationSelect) {
  let request = await fetch(
    "https://gist.githubusercontent.com/Athman-aa1808162/d7f5f9c884b3f26f5e490912cdb6713d/raw/81ce86423c51339f1ff2986c11b94da240cb9c30/institutions"
  );
  let data = await request.json();

  //Add the fetched affiliations from the repo to the add author form
  affiliationSelect.innerHTML =
    `<option value="" selected disabled>Select Affiliation</option>` +
    data.map(
      (affiliation) =>
        `<option value="${affiliation.name}">${affiliation.name}</option>`
    );
}

// Function handle creating a new author object and add it to the authors array
function addAuthor(fname, lname, email, affiliationSelect, authorsArr) {
  if (fname.value && lname.value && email.value && affiliationSelect.value) {
    let newAuthor = new author(
      fname.value,
      lname.value,
      email.value,
      affiliationSelect.value
    );
    authorsArr.push(newAuthor);
    fname.value = "";
    lname.value = "";
    email.value = "";
    affiliationSelect.value = "";
  } else {
    alert("Please fill all the fields");
  }
}

// Function check if the author is already in the presenters drop list, if not it will add it
function appendAuthorsToPresenterList(authorsArray, presentersDropList) {
  authorsArray.forEach((author) => {
    let existingOption = presentersDropList.querySelector(
      `option[value="${author.id}"]`
    );
    if (!existingOption) {
      presentersDropList.innerHTML += `<option data-id="${author.id}" value="${author.id}">${author.fname} ${author.lname}</option>`;
    }
  });
}
