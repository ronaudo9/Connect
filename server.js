const express = require("express");
const app = express();
const userRote = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const PORT = 3000;

//ミドルウェア
app.use("/api/users", userRote);
app.use("/api/auth",authRoute);
app.use("/api/posts",postRoute);

app.get("/",(req,res) => {
  res.send("hello express");
});

// app.get("/users",(req,res) => {
//   res.send("users express");
// });

app.listen(PORT, () => console.log("サーバーが起動しました"));
