const express = require("express");
const cors = require("cors");
const isEmail = require("isemail");
const jsonfile = require("jsonfile");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const app = express();
const port = 8080;
let uuid = crypto.randomUUID;
const saltRounds = 10;
const dataFile = "./data/file.json";
let users = [];

app.use(cors());
app.use(express.json());

jsonfile.readFile(dataFile, function (err, obj) {
  if (err) console.error(err);
  users = obj;
});

async function checkUsersPassword(user, pass) {
  const match = await bcrypt.compare(pass, user.password);
  return match;
}

app.get("/", (req, res) => {
  console.log(users);
  res.status(200).send(users);
});

app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  let user = users.filter((item) => item.id == id);
  console.log(user);
  res.status(200).send(user);
});

app.post("/users", async (req, res) => {
  try {
    let userHash = await bcrypt.hash(req.body.password, saltRounds);
    if (!isEmail.validate(req.body.email)) {
      res.send("email not valid");
    } else {
      let reqEmail = req.body.email;
      const newUser = {
        id: uuid(),
        email: reqEmail,
        password: userHash,
      };
      users.push(newUser);
      jsonfile.writeFile(dataFile, users, function (err) {
        if (err) console.error(err);
        console.log(users);
      });
      res.status(201).send(`${newUser.email} Created successfully`);
    }
  } catch (error) {
    console.log(error);
  }
});

app.put("/users/:id", (req, res) => {
  const id = req.params.id;
  let user = users.filter((item) => item.id == id);
  const updatedUser = {
    id: id,
    email: req.body.email,
    password: req.body.password,
  };
  users[users.indexOf(user[0])] = updatedUser;
  jsonfile.writeFile(dataFile, users, function (err) {
    if (err) console.error(err);
  });
  res.status(200).send(users[users.indexOf(user[0])]);
  console.log(users);
});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  let user = users.filter((item) => item.id == id);
  let index = users[users.indexOf(user)];
  index > 0 ? users.splice(index, index) : users.shift();
  jsonfile.writeFile(dataFile, users, function (err) {
    if (err) console.error(err);
  });
  res.send("User deleted");
});

app.post("/login", (req, res) => {
  const user = users.filter((item) => item.email === req.body.email);
  if (user.length === 1) {
    // console.log(checkUsersPassword(user[0], req.body.password));
    if (checkUsersPassword(user[0], req.body.password) === true) {
      res.status(200).send("Connected");
    } else {
      console.log("password incorrect");
      res.send("Something went wrong");
    }
  } else {
    console.log("user dos'nt exist");
    res.send("Something went wrong");
  }
});

app.listen(port, () => {
  console.log("The server is working");
});
