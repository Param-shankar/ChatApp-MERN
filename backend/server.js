const express = require("express");
const cors = require("cors");
const { chats } = require("./data.js");
const dotenv = require("dotenv");
const moongose = require("mongoose");
const mongodb = require("mongodb");
const find = require("mongodb").find;
const { usermodel } = require("./model/user.js");
const user = require("./model/user.js");
const generatetoken = require("./config/generatetoken.js");
const cloudinary = require("cloudinary");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const cookieParser = require("cookie-parser");
const authuser = require("./middleware/authuser.js");
const logoutroute = require("./routes/logout.js");
const chatm = require("./model/chatmode.js");
const Chat = require("./model/chatmode.js");
const res = require("express/lib/response.js");
const message = require("./model/Message.js");
const { Server } = require("socket.io");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

dotenv.config();
cloudinary.v2.config({
  cloud_name: "darkybkfp",
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const connectdb = async () => {
  try {
    const conn = await moongose.connect(process.env.MOGOURI);
    // console.log(conn)
  } catch (error) {
    console.log(error);
  }
};
console.log(process.env.MOGOURI);
connectdb();

// const db = moongose.Connection;

console.log(usermodel);
const app = express();

//use this to conver the json post request
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

//routes

// const corsOptions = {
//   origin: "http://localhost:5173",
// };
// //adding the cors headers using the middleware
// app.use(cors(corsOptions));

const port = process.env.PORT || 5050;
console.log(port);

app.get("/", (req, res) => {
  res.send("server");
});

app.post("/api/", (req, res) => {
  console.log(req.body);
});

app.post("/api/newuser", upload.single("file"), async (req, res) => {
  const { name, password, email } = req.body;
  // console.log(req);
  console.log(req.file);
  try {
    try {
      var result = await cloudinary.v2.uploader.upload(
        `${req.file?.destination}/${req.file?.filename}`
      );
      // console.log(result);
    } catch (error) {
      console.log(error);
    }
    const newuser = await user.usermodel.create({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
      image: result.secure_url,
    });
    // console.log(newuser);

    res.status(200).json({
      _id: newuser._id,
      name: newuser.name,
      email: newuser.email,
      image: newuser.image,
      exits: false,
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      added: true,
    });
  }
});
//multer middleware
//for pic upload
//use uplaod .array and .single for single for single file

app.post("/api/login", async (req, res) => {
  console.log(req.body);
  const { Userdata } = req.body;
  console.log(Userdata);
  const user_find = await user.usermodel.findOne({ email: Userdata?.email });

  if (user_find == null) {
    res.status(400).send("not found user");
    console.log("not found");
  } else {
    // const matched = (user_find.password === Userdata?.password)
    const matched = await user_find.matchpw(Userdata.password);
    console.log(matched);
    if (matched) {
      res.cookie("uid", generatetoken(user_find._id)).status(200).json({
        match: matched,
        _id: user_find._id,
        name: user_find.name,
        email: user_find.email,
      });
      console.log("value has been send to fontend");
    } else {
      console.log("password in incorrect");
    }
  }
});

app.post("/api/logout", (req, res) => {
  res.clearCookie("uid");
  console.log("cookie has been cleared");
  res.send("cleared cookie");
});

// app.use("/api/chats", (req, res, next) => {
//   let {uid} = req.cookies;
//   try {
//     let userid = authuser(uid);
//     console.log("the is of user is ", userid)
//     next();
//   } catch (error) {
//     console.log("error is here")
//     res.status(400).json({
//       verification: false
//     })
//   }

// });

const cookieauth = (req, res, next) => {
  console.log("i am middlware running");
  let { uid } = req.cookies;
  try {
    let userid = authuser(uid);
    console.log("the is of user is ", userid);
    req.userid = userid?.id;
    next();
  } catch (error) {
    console.log("error is here");
    res.status(400).json({
      verification: false,
    });
  }
};

app.get("/api/chats", cookieauth, (req, res) => {
  // let { uid } = req.cookies;
  // console.log(req.userid)
  console.log("hello");
  res.json({
    status: 200,
    chats: chats,
    verification: true,
  });
});

app.post("/api/chats/accesschats", cookieauth, async (req, res) => {
  const userid = req?.userid;
  const { chatuserid } = req.body;
  console.log("chat user", chatuserid);
  console.log("the use is ", userid);

  if (!chatuserid) {
    console.log("userid is not provided");
    res.sendStatus(400);
  }

  var isChat = await Chat.findOne({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: chatuserid } } },
      { users: { $elemMatch: { $eq: userid } } },
    ],
  }).populate("users", "-password");
  console.log(chatuserid);
  console.log(isChat);

  if (isChat) {
    res.status(400).send(isChat);
  } else {
    //fitting of data into chat to ceatemode
    console.log("else is running");
    // let {name} = await user.usermodel.findById(chatuserid);
    let model_chat = await Chat.create({
      chatname: "sender",
      isGroupChat: false,
      users: [chatuserid, userid],
    });
    let final_chat = await Chat.findById(model_chat._id).populate(
      "users",
      "-password"
    );

    res.status(200).send(final_chat);
  }
});

app.get("/api/chats/fetchchats", cookieauth, async (req, res) => {
  const userid = req?.userid;
  const Username = await user.usermodel.findById(userid);
  console.log(Username.name);
  console.log(userid);

  var chatofuser = await Chat.find({
    isGroupChat: false,
    //this is used to check the that does loggedin user is part of
    users: userid,
  }).populate("users");
  // console.log(chatofuser)

  // res.send(chatofuser)
  res.json({
    status: 200,
    chats: chatofuser,
    verification: true,
    user : Username,
    username: Username.name,
  });
});

app.post("/api/message/send", cookieauth, async (req, res) => {
  const userid = req.userid;
  console.log(userid);
  const { content, chatid } = req.body;

  var newmessage = await message.create({
    sender: userid,
    chat: chatid,
    content: content,
  });
  var finalmsg = await newmessage.populate("sender", "name");
  var finalmsg = await newmessage.populate("chat");
  var finalmsg = await newmessage.populate({
    path: "chat.users",
    select: "name",
  });

  // console.log(finalmsg);
  res.status(200).send(finalmsg);
});

app.get("/api/message/fetchchat/:chatid", async (req, res) => {
  var mesg = await message
    .find({ chat: req.params.chatid })
    .populate("sender", "name")
    .populate("chat")
    .sort({ timeStamp: -1 });
  res.send(mesg);
});

const server = app.listen(port, () => {
  console.log(`listing to port ${port}`);
});

const io = new Server(server, {
  cors:"http:/localhost:5172"
});

//socket io handleing 

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);

  socket.on('message', (data) => {
    console.log(data);
    // io.emit('sendmsg', data);
    socket.to(data.chat._id).emit("messageinroom", data);

  })


  socket.on('joinroom', (chatid) => {
    console.log("emiitned the msg and cahtis is ", chatid)
    console.log(chatid[1]);
    socket.join(chatid[0]);

  })
});
