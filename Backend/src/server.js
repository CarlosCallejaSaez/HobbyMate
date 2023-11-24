const dotenv = require("dotenv") ;
dotenv.config();
const express = require("express") ;
const cors  = require("cors") 
const dbconnect = require('./config/database.config.js') ;
const HobbyRouter = require("./routers/hobbies.router.js");
const CommentRouter = require("./routers/comments.router.js");
const FeedRouter = require("./routers/feeds.router.js");
const SectionRouter = require("./routers/sections.router.js");
const UserRouter = require("./routers/users.router.js");

dbconnect();
const app = express();

app.use(express.json());
app.use(cors());

app.disable("x-powered-by");


app.use("/api/hobbies",HobbyRouter);
app.use("/api/comments", CommentRouter);
app.use("/api/feeds", FeedRouter);
app.use("/api/sections", SectionRouter);
app.use("/api/users", UserRouter);
app.get("*", (req, res) => {
  res.status(404).send("<h1>Page not found on the server - © Carlos Calleja- </h1>");
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});