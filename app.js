const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const app = express();
const users = require("./data");
app.use(cors());
app.use(express.json());
const port = 8080;
let uuid = crypto.randomUUID;

app.get("/", (req, res) => {
  res.send(users);
});
app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  let user = users.filter((item) => item.id == id);
  console.log(user);
  res.send(user);
});
app.post("/users", (req, res) => {
  const newUser = {
    id: uuid(),
    email: req.body.email,
    password: req.body.password,
  };
  users.push(newUser);
  res.status(200).send(`${newUser.email} Created successfully`);
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
    user[0].password == req.body.password
      ? res.send("Connected")
      : res.send("Something went wrong");
  }
  else{
    res.send("User do's not exist")
  }
});
app.listen(port, () => {
  console.log("The server is working");
});
