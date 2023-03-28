const roter = require("express").Router();

roter.get("/",(req,res) => {
  res.send("auth router");
});

module.exports = roter;
