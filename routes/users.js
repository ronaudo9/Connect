const roter = require("express").Router();

roter.get("/",(req,res) => {
  res.send("user router");
});

module.exports = roter;
