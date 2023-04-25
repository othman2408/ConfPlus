export async function paperReview() {
    //Load page content
    const mainContent = document.querySelector(".main");
    const page = await fetch("../../review.html");
    const pageHTMLContent = await page.text();

    //CSS Style for loaded contnets
    mainContent.innerHTML = pageHTMLContent;
    mainContent.style.display = "flex";
    mainContent.style.justifyContent = "center";
    mainContent.style.margin = "0";
}