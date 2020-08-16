const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const path = require("path");

app.use(cors());
app.use(express.json());

//ROUTES
app.use("/server/groups", require("./routes/groups"));
app.use("/server/patients", require("./routes/patients"));
app.use("/server/data", require("./routes/data"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
}

app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
