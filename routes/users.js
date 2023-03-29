const router = require("./auth");
const User = require("../models/User");

const roter = require("express").Router();

//CRDO
//ユーザー情報の更新
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        //$setはUser.jsのUserSchemaのパラメーター全てを参照する
        $set: req.body,
      });
      res.status(200).json("ユーザー情報が更新されました");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res
      .status(403)
      .json("あなたは自分のアカウントの時だけ情報を更新できます");
  }
});
//ユーザー情報の削除
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("ユーザー情報が削除されました");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res
      .status(403)
      .json("あなたは自分のアカウントの時だけ情報を削除できます");
  }
});

//ユーザー情報の取得
router.get("/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      //user._docはユーザーの中にあるすべての情報_docはMongoDBで配列を取り出す際に使用される
      //...otherは分割代入
      const {password,updatedAt,...other} = user._doc;
      res.status(200).json(other);
    } catch (err) {
      return res.status(500).json(err);
    }
});


// roter.get("/", (req, res) => {
//   res.send("user router");
// });

module.exports = router;
