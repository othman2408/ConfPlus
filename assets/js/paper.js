class paper {
    static counter = 0;
    constructor(title, abstract, authors, presenter, reviewrs) {
        this.id = paper.counter++
        this.title = title
        this.abstract = abstract
        this.authors = authors
        this.presenter = presenter
        this.reviewrs = reviewrs
    }
}


class author {
    static counter = 0;
    constructor(fname, lname, email, affiliation) {
        this.id = author.counter++
        this.fname = fname
        this.lname = lname
        this.email = email
        this.affiliation = affiliation
    }
}


function assignReviewr(reviewersArray) {
    return [reviewersArray[Math.floor(Math.random() * reviewersArray.length)],reviewersArray[Math.floor(Math.random() * reviewersArray.length)]]
}

async function getReviewr(url) {
   let request = await fetch(url);
   let data = await request.json();
   let reviewers = [];

   data.filter((item) => {
      if(item.role === "reviewer")
         reviewers.push(item);
   });

   return reviewers;
}

export async function paperSubmission() {

    //Load page content 
    const mainContent = document.querySelector('.main');
    const page = await fetch("../../paper.html")
    const pageHTMLContent = await page.text()

    //CSS Style for loaded contnets
    mainContent.innerHTML = pageHTMLContent;
    mainContent.style.display = "flex"
    mainContent.style.justifyContent = "center"
    mainContent.style.margin = "0"

    //HTML Element Selection
    let titleInput = document.querySelector(".input-title")
    let abstractInput = document.querySelector(".input-abstract")
    let authorsContainer = document.querySelector(".authors-list ol")
    let presentersContainer = document.querySelector(".presenters-list ol")
    let presentersDropList = document.querySelector("#presentersDropList")
    let presentersList = document.querySelector("#presenters-list")
    let submitBtn = document.querySelector(".submit")
    let addAuthorBtn = document.querySelector(".add-author")
    let authorForm = document.querySelector(".fieldset")
    let fnameInput = document.querySelector("#fname")
    let lnameInput = document.querySelector("#lname")
    let emailInput = document.querySelector("#email")
    let affiliationSelect = document.querySelector("#affiliation")
    let addBtn = document.querySelector(".add")
    let cancelBtn = document.querySelector(".cancel")


    let usersRepo = "https://raw.githubusercontent.com/cmps350s2023/cmps350-content-m/main/project/users.json";
    let authorsArray = []
    let reviewrsArray = await getReviewr(usersRepo);
    //Add Author Onclick Action
    addAuthorBtn.addEventListener("click", async () => {
        authorForm.style.display = "flex"

        //Fetch the affiliations
        let request = await fetch("https://gist.githubusercontent.com/Athman-aa1808162/d7f5f9c884b3f26f5e490912cdb6713d/raw/81ce86423c51339f1ff2986c11b94da240cb9c30/institutions")
        let data = await request.json()


        //Add the fetched affiliations from the repo to the add author form 
        affiliationSelect.innerHTML = data.map(affiliation => `<option value="${affiliation.name}">${affiliation.name}</option>`)


        //New Auhtor Object
        addBtn.addEventListener("click", (e) => {
            e.preventDefault()

            //Close the add author form after clic add
            if ((fnameInput.value || lnameInput.value || emailInput.value) == "") {
                alert("empty")
            } else {
                authorsArray.push(new author(fnameInput.value, lnameInput.value, emailInput.value, affiliationSelect.value))
                authorsContainer.innerHTML = authorsArray.map(author => `<li>${author.fname} ${author.lname}<i class="ti ti-x"></i></li>`).join("")

                //Append the added authors to the presenetrs drop-down list
                authorsArray.forEach(author => {
                    const existingOption = presentersDropList.querySelector(`option[value="${author.id}"]`);
                    if (!existingOption) {
                        const option = document.createElement('option');
                        option.value = author.id;
                        option.textContent = `${author.fname} ${author.lname}`;
                        presentersDropList.appendChild(option);
                    }
                })

            }

            fnameInput.value = ""
            lnameInput.value = ""
            emailInput.value = ""

        })

        //Add the select presnter to the presenters container
        presentersDropList.addEventListener("change", (e) => {
            presentersContainer.innerHTML = `<li class = "selectedPresenter">${e.target.options[e.target.selectedIndex].innerHTML}<i class="ti ti-x"></i></li>`
        })

    })


    cancelBtn.addEventListener("click", (e) => {
        e.preventDefault()
        authorForm.style.display = "none"
    })




    submitBtn.addEventListener("click", (e) => {
        // e.preventDefault()
        let newPaper = new paper(titleInput.value, abstractInput.value, authorsArray, document.querySelector(".selectedPresenter").innerText, assignReviewr(reviewrsArray));
        let papersArr;
        if (localStorage.getItem("papers")) {
            papersArr = JSON.parse(localStorage.getItem("papers"));
        } else {
            papersArr = [];
        }
        papersArr.push(newPaper);
        localStorage.setItem("papers", JSON.stringify(papersArr));
    });

}