// let request = await fetch("https://raw.githubusercontent.com/cmps350s2023/cmps350-content-m/main/project/users.json")
// let data = await request.json()

// let arr= [];

// const reviewer = data.filter((item) => {
//       if(item.role === "reviewer")
//          arr.push(item);
// });

// console.log(arr);

let url = "https://raw.githubusercontent.com/cmps350s2023/cmps350-content-m/main/project/users.json";

function generateRandomReviewer() {
    return [arr[Math.floor(Math.random() * arr.length)],arr[Math.floor(Math.random() * arr.length)]]
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

