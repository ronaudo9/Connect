const roter = require("express").Router();

roter.get("/",(req,res) => {
  res.send("posts router");
});

module.exports = roter;
