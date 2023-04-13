class paper {
    static counter = 0;
    constructor(title, abstract, authors, presenter) {
        this.id = paper.counter++
        this.title = title
        this.abstract = abstract
        this.authors = authors
        this.presenter = presenter
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
    let authorsContainer = document.querySelector(".authors-list")
    let presentersContainer = document.querySelector(".presenters-list")
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

    let authorsArray = []
    //Add Author Onclick Action
    addAuthorBtn.addEventListener("click", async () => {
        authorForm.style.display = "flex"

        let request = await fetch("https://gist.githubusercontent.com/Athman-aa1808162/d7f5f9c884b3f26f5e490912cdb6713d/raw/81ce86423c51339f1ff2986c11b94da240cb9c30/institutions")
        let data = await request.json()


        affiliationSelect.innerHTML = data.map(affiliation => `<option value="${affiliation.name}">${affiliation.name}</option>`)


        //New Auhtor Object

        addBtn.addEventListener("click", (e) => {
            e.preventDefault()
            authorsArray.push(new author(fnameInput.value, lnameInput.value, emailInput.value, affiliationSelect.value))
        })

        cancelBtn.addEventListener("click", () => {
            authorForm.style.display = "none"
        })

    })


    presentersDropList.innerHTML = authorsArray.map(author => `<option value="${author.id}">${author.fname} ${author.lname}</option>`)


    submitBtn.addEventListener("click", (e) => {
        // e.preventDefault()
        let newPaper = new paper(titleInput.value, abstractInput.value, authorsArray, "presenter.value");
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