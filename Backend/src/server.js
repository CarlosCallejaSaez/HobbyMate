const dotenv = require("dotenv") ;
dotenv.config();
const express = require("express") ;
const cors  = require("cors") 
const dbconnect = require('./config/database.config.js') ;
const HobbyRouter = require("./routers/hobbies.router.js");

dbconnect();
const app = express();

app.use(express.json());
app.use(cors());

app.disable("x-powered-by");


app.use("/api/activities",HobbyRouter);
app.get("*", (req, res) => {
  res.status(404).send("<h1>Page not found on the server</h1>");
});

const PORT = 5010;

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});