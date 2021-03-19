const signupLogin = document.querySelector("#signupform");
const divErr = document.querySelector("#error");
const divmsg = document.querySelector("#msg");
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
async function onSignup(evt) {
  evt.preventDefault();
  clearAlerts();

  const formdata = new FormData(signupLogin);

  console.log("formdata", formdata);

  const data = {
    fname: formdata.get("fname"),
    lname: formdata.get("lname"),
    email: formdata.get("email"),
    confirmedpassword: formdata.get("confirmedpassword"),
    password: formdata.get("password"),
  };
  const response = await fetch("/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const res = await response.json();

  if (res.signup === "ok") {
    showmsg("Signup successful please login");
    signupLogin.reset();

    return;
  } else {
    showError(
      "Login not successful invalid username or password. Password must be at least 8 characters."
    );
    signupLogin.reset();
    return;
  }
}

if (signupLogin) {
  signupLogin.addEventListener("submit", onSignup);
}
