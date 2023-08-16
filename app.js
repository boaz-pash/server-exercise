const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const app = express();
const users = require("./data");

const port = 8080;
let uuid = crypto.randomUUID;
const saltRounds = 10;

async function checkUsersPassword(user, pass) {
  const match = await bcrypt.compare(pass, user.password);
  return match;
}
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
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
    console.log(userHash);
    const newUser = {
      id: uuid(),
      email: req.body.email,
      password: userHash,
    };
    users.push(newUser);
    res.status(201).send(`${newUser.email} Created successfully`);
    console.log(users);
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
  users[users.indexOf(user)] = updatedUser;
  res.status(200).send(users[users.indexOf(user)]);
  console.log(users);
});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  let user = users.filter((item) => item.id == id);
  let index = users[users.indexOf(user)];
  index > 0 ? users.splice(index, index) : users.shift();
  console.log(users);
  res.send("User deleted");
});

app.post("/login", (req, res) => {
  const user = users.filter((item) => item.email == req.body.email);
  if (user.length === 1) {
    if (checkUsersPassword(user[0], req.body.password) == true) {
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
