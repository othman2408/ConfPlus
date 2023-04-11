let login = document.querySelector(".login");
let loginContainer = document.querySelector(".login-container");
let body = document.querySelector("body");

login.addEventListener("click", async() => {
    const mainContent = document.querySelector('.main');
    const page = await fetch("../../login.html")
    const pageHTMLContent = await page.text()
    mainContent.innerHTML = pageHTMLContent;
    mainContent.style.display = "flex"
    mainContent.style.justifyContent = "center"
});