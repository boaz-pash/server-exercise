const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const app = express();
const users = require("./data");
app.use(cors());
app.use(express.json());
const port = 8080;
let uuid = crypto.randomUUID;
const saltRounds = 10;

app.get("/", (req, res) => {
  res.send(users);
});
app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  let user = users.filter((item) => item.id == id);
  console.log(user);
  res.send(user);
});
app.post("/users", async (req, res) => {
  let userHash = "";
  await bcrypt.hash(req.body.password, saltRounds).then((hash) => {
    // console.log("Hash ", hash);
    userHash = hash;
    console.log(userHash);
  });
  const newUser = {
    id: uuid(),
    email: req.body.email,
    password: userHash,
  };
  users.push(newUser);
  res.send(`${newUser.email} Created successfully`);
  console.log(users);
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
  res.send(users[users.indexOf(user)]);
  console.log(users);
  console.log(users);
});
app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  let user = users.filter((item) => item.id == id);
  let index = users[users.indexOf(user)];
  index > 0 ? users.splice(index, index) : users.shift();
  res.send(users[index]);
  console.log(users);
});
app.post("/login", (req, res) => {
  const user = users.filter((item) => item.email == req.body.email);
  if (user.length == 1) {
    checkUser(user[0], req.body.password) == true
      ? res.send("Connected")
      : res.send("Something went wrong");
  } else {
    res.send("User do's not exist");
  }
});
app.listen(port, () => {
  console.log("The server is working");
});

async function checkUser(user, pass) {
  const match = await bcrypt.compare(pass, user.password);
  return match;
}
