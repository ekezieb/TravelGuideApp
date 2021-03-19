const create = document.querySelector("#create");
const createdivErr = document.querySelector("#createError");
const createdivmsg = document.querySelector("#createmsg");
createdivErr.style.display = "none";
createdivmsg.style.display = "none";

const spanLogoutother = document.querySelector("#logout");

if (spanLogoutother) {
  clearAlerts();
  spanLogoutother.addEventListener("click", Logout);
}

async function Logout() {
  const response = await fetch("/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(),
  });
  const res = await response.json();
  if (res.user) {
    showError("User still in session");
  }

  if (res.logout === "ok") {
    showmsg("Logout successful");
    sessiondone();

    return;
  } else {
    showError("Logout not successful");
    return;
  }
}

function sessiondone() {
  window.location.reload();
}

function showError(msg) {
  createdivErr.style.display = "block";
  createdivErr.innerHTML = msg;
}
function showmsg(msg) {
  createdivmsg.style.display = "block";
  createdivmsg.innerHTML = msg;
}
function clearAlerts() {
  createdivErr.style.display = "none";
  createdivErr.innerHTML = "";
  createdivmsg.style.display = "none";
  createdivmsg.innerHTML = "";
}
async function Create(evt) {
  evt.preventDefault();
  clearAlerts();

  const formdata = new FormData(create);

  console.log("formdata", formdata);

  const data = {
    name: formdata.get("name"),
    country: formdata.get("country"),
    post: formdata.get("post"),
  };
  const response = await fetch("/createpost", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const res = await response.json();

  if (res.create === "ok") {
    showmsg("Post Created: Checkout Stories");
    create.reset();

    return;
  } else {
    showError("Invalid post please include: Name, Country, and Post");
    create.reset();
    return;
  }
}

if (create) {
  create.addEventListener("submit", Create);
}
