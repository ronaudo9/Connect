// const router = require("./auth");
const User = require("../models/User");

const router = require("express").Router();

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
// router.get("/:id", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     //user._docはユーザーの中にあるすべての情報_docはMongoDBで配列を取り出す際に使用される
//     //...otherは分割代入
//     const { password, updatedAt, ...other } = user._doc;
//     return res.status(200).json(other);
//   } catch (err) {
//     return res.status(500).json(err);
//   }
// });

//クエリでユーザー情報の取得
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    //user._docはユーザーの中にあるすべての情報_docはMongoDBで配列を取り出す際に使用される
    //...otherは分割代入
    const { password, updatedAt, ...other } = user._doc;
    return res.status(200).json(other);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//ユーザーの情報をすべて取得する
router.get("/userAll", async (req, res) => {
  try {
    const users = await User.find({});
    const userArray = users.map(user => {
      const { password, updatedAt, ...other } = user._doc;
      return other;
    });
    return res.status(200).json(userArray);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//ログインしているユーザー以外のユーザー情報をすべて取得する
router.get("/:id/userList", async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } });
    const userArray = users.map(user => {
      const { password, updatedAt, ...other } = user._doc;
      return other;
    });
    return res.status(200).json(userArray);
  } catch (err) {
    return res.status(500).json(err);
  }
});
//リクエストのあったユーザーIDからフォローしているユーザーの情報を取得
router.get("/:id/followings",async(req,res) => {
  try{
    const user = await User.findById(req.params.id);
    const followingIds = user.followings;
    //自分がフォローしている複数のユーザー情報を取得
    const followings = await User.find({ _id: { $in: followingIds } });
    return res.status(200).json(followings);
  }catch(err){
    return res.status(500).json(err);
  }
})
//ユーザーのフォロー
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      //フォロワーに自分がいなかったらフォローできる
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({
          $push: {
            followers: req.body.userId,
          },
        });
        await currentUser.updateOne({
          $push: {
            followings: req.params.id,
          },
        });
        return res.status(200).json("フォローに成功しました！");
      } else {
        return res
          .status(403)
          .json("あなたはすでにこのユーザーをフォローしています。");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(500).json("自分自身をフォローできません。");
  }
});

//ユーザーのフォローを外す
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      //フォロワーに存在したらフォローを外せる
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({
          $pull: {
            followers: req.body.userId,
          },
        });
        await currentUser.updateOne({
          $pull: {
            followings: req.params.id,
          },
        });
        return res.status(200).json("フォロー解除しました！");
      } else {
        return res.status(403).json("このユーザーはフォロー解除できません。");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(500).json("自分自身をフォロー解除できません。");
  }
});

// roter.get("/", (req, res) => {
//   res.send("user router");
// });

module.exports = router;
