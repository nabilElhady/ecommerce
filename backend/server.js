const app = require("./index");
require("dotenv").config({ path: "./config.env" });
const mongoose = require("mongoose");
const cors = require("cors");

const DB = process.env.DataBaseURL;
app.use(cors());

console.log(DB);
mongoose.connect(DB, {}).then((con) => {
  console.log("connection to db is done");
});
app.listen(8000, () => {
  console.log(`app is running on port 8000`);
});
