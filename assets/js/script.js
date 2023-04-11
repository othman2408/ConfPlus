let login = document.querySelector(".login")

console.log(login);

login.addEventListener("click", async () => {
    const mainContent = document.querySelector('.main');
    const page = await fetch("../../login.html")
    const pageHTMLContent = await page.text()
    mainContent.innerHTML = pageHTMLContent;
})
