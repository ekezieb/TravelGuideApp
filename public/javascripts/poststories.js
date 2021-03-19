const divErr = document.querySelector("#error");
const divmsg = document.querySelector("#msg");

const getform = document.querySelector("#getform");
const divPosts = document.querySelector("#countries");

divErr.style.display = "none";
divmsg.style.display = "none";

function showError(msg) {
  divErr.style.display = "block";
  divErr.innerHTML = msg;
}
function showmsg(msg) {
  divmsg.style.display = "block";
  divmsg.innerHTML = msg;
}
function clearAlerts() {
  divErr.style.display = "none";
  divErr.innerHTML = "";
  divmsg.style.display = "none";
  divmsg.innerHTML = "";
}

//reloadPost is used to get the data that was
//passed in json then pass into divPosts to render
//to body.html page in specified div location with id of countries.
function reloadPost(post) {
  const tag = document.createElement("p");
  const strong = document.createElement("strong");
  const divPost = document.createElement("div");
  divPost.className = "col-lg-4 col-sm-12 my-col file";
  //const divNewPost = document.createElement("div");
  //divNewPost.textContent = "Post:";
  //divPost.appendChild(divNewPost);

  const divCountry = document.createElement("div");
  divCountry.textContent = "Country: " + post.country;
  strong.appendChild(divCountry);
  divPost.appendChild(strong);
  //divPost.appendChild(divCountry);
  const divName = document.createElement("div");
  divName.textContent = "Created By: " + post.name;
  divPost.appendChild(divName);

  const divStory = document.createElement("div");
  divStory.textContent = "Post: " + post.post;
  divPost.appendChild(divStory);
  divPost.style.display = "inline-block";
  tag.appendChild(divPost);
  //divPost.style.cssText = "border: solid;";
  divPost.style.backgroundColor = "#dedede";

  divPosts.append(tag);

  console.log(divPosts);
}
//This function is used to get the country value
// from form then find out if value existed in db
// if so get that data from db and exporting it to
//json then passing that json file to reloadPost
//function.
async function reloadPosts(evt) {
  clearAlerts();
  evt.preventDefault();

  const formdata = new FormData(getform);
  console.log("formdata", formdata);
  const data = {
    country: formdata.get("country"),
  };

  const response = await fetch("/GetPost", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const res = await response.json();
  if (res.error) {
    showError(res.error);
    return;
  }
  if (res.post.length === 0) {
    showError("No Story Entrees Found: " + res.user);
  } else {
    showmsg("Story Entrees Found: " + res.user);
  }
  divPosts.innerHTML = "";
  console.log("Reload Posts got data", res);
  //const stories = res.post;

  //reloadPost(res.post);
  for (let p in res.post) {
    console.log(res.post[p]);

    reloadPost(res.post[p]);
  }
}

//When the checkout story is clicked an action res takes place
//Getting the country value in the form and then calling the reloadPosts
//function.
if (getform) {
  getform.addEventListener("submit", reloadPosts);
}
