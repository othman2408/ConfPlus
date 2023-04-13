import * as login from "./login.js"
let loginBtn = document.querySelector(".login")

loginBtn.addEventListener("click", () => {
   login.loadPage("../../login.html")
})