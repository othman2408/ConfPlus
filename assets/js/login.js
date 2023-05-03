import * as paper from "./paper.js";
import * as review from "./review.js";
import * as organizer from "./organizer.js";
import { success, warning, error } from "./script.js";
const url =
  "https://raw.githubusercontent.com/cmps350s2023/cmps350-content-m/main/project/users.json";

let userID;

export async function loadPage(pageUrl) {
  //Load Login Form
  const mainContent = document.querySelector(".main");
  const page = await fetch(pageUrl);
  const pageHTMLContent = await page.text();
  mainContent.innerHTML = pageHTMLContent;
  mainContent.style.display = "flex";
  mainContent.style.justifyContent = "center";

  //HTML Element Selection
  let emailInput = document.querySelector(".email-input");
  let passwordInput = document.querySelector(".password-input");
  let loginBtn = document.querySelector(".login-btn");

  //Get Users Data
  let request = await fetch(url);
  let data = await request.json();

  let login = document.querySelector(".login");
  login.innerHTML = "Login";
  // Action done after click the login button
  loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    if (emailInput.value == "" && passwordInput.value == "") {
      warning("Please fill all the fields");
      return;
    } else if (
      checker(emailInput.value, passwordInput.value, data)[0] == "author"
    ) {
      userID = checker(emailInput.value, passwordInput.value, data)[1];
      paper.paperSubmission();
    } else if (
      checker(emailInput.value, passwordInput.value, data)[0] == "reviewer"
    ) {
      userID = checker(emailInput.value, passwordInput.value, data)[1];
      review.paperReview(userID);
    } else if (
      checker(emailInput.value, passwordInput.value, data)[0] == "organizer"
    ) {
      organizer.organizer();
    } else {
      error("Wrong Email or Password");
    }
  });
}

// Loop over the users objects array and check for match
function checker(email, password, data) {
  for (let user of data) {
    if (user.email == email && user.password == password)
      return [user.role, user.id];
  }
  return false;
}
