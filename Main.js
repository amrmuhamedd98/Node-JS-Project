const DB = require("./DB");
const express = require("express");
const app = express();
const port = 3000;
DB.connectDB();
const cors = require("cors");

//Middlewares
app.use(cors());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
