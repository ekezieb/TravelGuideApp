const express = require("express");

const router = express.Router();
const path = require("path");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const myDB = require("../db/MyDB.js");

router.post("/signup", async (req, res) => {
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;

  try {
    if (
      req.body.password === req.body.confirmedpassword &&
      req.body.password.length >= 8
    ) {
      const password = req.body.password;
      const hashedPwd = await bcrypt.hash(password, saltRounds);
      const data = {
        fname: fname,
        lname: lname,
        email: email,
        password: hashedPwd,
      };

      await myDB.signup(data);

      res.send({ signup: "ok" });
    } else {
      res.send({ signup: "error" });
    }
  } catch (e) {
    console.log("Error", e);
    res.status(400).send({ err: e });
  }
});

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const data = {
    email: email,
    password: password,
  };

  try {
    const login = await myDB.login(data);
    if (login === true) {
      req.session.user = data.email;
      res.send({ login: "ok", user: req.session.user });
    } else {
      res.send({ login: "wrong username or password" });
    }
  } catch (e) {
    console.log("Error", e);
    res.status(400).send({ err: e });
  }
});

router.post("/logout", async (req, res) => {
  const username = req.body;

  try {
    const login = await myDB.login(username);
    if (login === false) {
      req.session.user = "";
      res.send({ logout: "ok", user: req.session.user });
    } else {
      res.send({ logout: "error" });
    }
  } catch (e) {
    console.log("Error", e);
    res.status(400).send({ err: e });
  }
});
router.post("/createpost", async (req, res) => {
  const post = req.body.post;
  const country = req.body.country;
  const name = req.body.name;

  if (name !== "" && country !== "select country" && post !== "") {
    const data = {
      name: name,
      country: country,
      post: post,
    };

    try {
      await myDB.createpost(data);
      req.session.msg = `Country: ${data.country}`;

      res.send({ create: "ok" });
    } catch (e) {
      console.log("Error", e);
      res.status(400).send({ err: e });
    }
  } else {
    res.send({ create: "Invalid entree!" });
    console.log("Invalid entree!");
  }
});

// data endpoint for posts
router.post("/GetPost", async (req, res) => {
  delete req.session.msg;
  const select = req.body.country;
  const data = {
    country: select,
  };

  if (select !== "select country") {
    try {
      const post = await myDB.GetPost(data);

      res.send({ post: post, user: req.session.user });
    } catch (e) {
      res.status(400).send({ err: e });
      console.log("Error", e);
    }
  } else {
    console.log("Invalid entree!");
  }
});
router.get("/body.html", (req, res) => {
  if (req.session.user) {
    res.sendFile(path.join(__dirname, "/../public/body.html"));
  } else {
    res.redirect("/");
  }
});

module.exports = router;
