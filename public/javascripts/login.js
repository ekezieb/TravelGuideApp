const divErr = document.querySelector("#error");
const divmsg = document.querySelector("#msg");
const formLogin = document.querySelector("#loginform");

const spanLogout = document.querySelector("#logout");
const spanUsername = document.querySelector("#username");
//const btn = document.querySelector("#btn");

divErr.style.display = "none";
divmsg.style.display = "none";
spanLogout.style.display = "none";

if (spanLogout) {
  clearAlerts();
  spanLogout.addEventListener("click", Logout);
}

async function Logout() {
  const data = spanUsername;
  const response = await fetch("/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const res = await response.json();
  if (res.user) {
    res.user = "";
    spanUsername.textContent = "";
    showLoginButtion();
  }

  if (res.logout === "ok") {
    showmsg("Logout successful");
    //reloadPosts();

    return;
  } else {
    showError("Logout not successful");
    return;
  }
}

function showLoginButtion() {
  formLogin.className = "d-flex";
  formLogin.style.display = "block";
  spanLogout.style.display = "none";
}

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

function showLogoutButtion(username) {
  formLogin.className = "";
  formLogin.style.display = "none";
  spanLogout.style.display = "block";
  spanUsername.textContent = username;
}

async function onSubmitForm(evt) {
  evt.preventDefault();
  clearAlerts();

  const formdata = new FormData(formLogin);
  console.log("formdata", formdata);
  const data = {
    email: formdata.get("email"),
    password: formdata.get("password"),
  };
  const response = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const res = await response.json();
  if (res.user) {
    showLogoutButtion(res.user);
  }

  if (res.login === "ok") {
    showmsg("Login successful click on Let's get started to continue");
    //reloadPosts();

    return;
  } else {
    showError("Login not successful invalid username or password");
    return;
  }
}

if (formLogin) {
  formLogin.addEventListener("submit", onSubmitForm);
}
