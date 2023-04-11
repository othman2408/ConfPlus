const url = 'https://raw.githubusercontent.com/cmps350s2023/cmps350-content-m/main/project/users.json'

async function loadPage(pageUrl) {
    //Load Login Form
    const mainContent = document.querySelector('.main');
    const page = await fetch(pageUrl)
    const pageHTMLContent = await page.text()
    mainContent.innerHTML = pageHTMLContent;
    mainContent.style.display = "flex"
    mainContent.style.justifyContent = "center"

    //HTML elemtns
    let emailInput = document.querySelector(".email-input")
    let passwordInput = document.querySelector(".password-input")
    let loginBtn = document.querySelector(".login-btn")

    //Get Users Data
    let request = await fetch(url)
    let data = await request.json()

    // Action done after click the login button
    loginBtn.addEventListener("click", (e) => {
        e.preventDefault()

        if (checker(emailInput.value, passwordInput.value, data))
            alert("yes")
        else
            alert("noo")
    })
}

// Loop over the users object array and check for match
function checker(email, password, data) {
    for (let user of data) {
        if (user.email == email && user.password == password)
            return true
    }
    return false
}

