export async function paperSubmission() {

    const mainContent = document.querySelector('.main');
    const page = await fetch("../../paper.html")
    const pageHTMLContent = await page.text()
    mainContent.innerHTML = pageHTMLContent;
    mainContent.style.display = "flex"
    mainContent.style.justifyContent = "center"
    mainContent.style.margin = "0"

    //HTML Element Selection
    let titleInput = document.querySelector(".input-title")
    let abstractInput = document.querySelector(".input-abstract")
    let submitBtn = document.querySelector(".submit")

    console.log(titleInput);
    console.log(abstractInput);
    console.log(submitBtn);
}