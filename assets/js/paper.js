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
    let authorsList = document.querySelector("#authors-list")
    let presentersList = document.querySelector("#presenters-list")
    let submitBtn = document.querySelector(".submit")

    //Fetch data
    let request = await fetch("https://raw.githubusercontent.com/cmps350s2023/cmps350-content-m/main/project/users.json")
    let data = await request.json()

    // Append authors name to the list
    authorsList.innerHTML = data.map(author => `<option value="${author.first_name}">${author.first_name} ${author.last_name}</option>`)

    
}