const express = require("express");
const app = express();
const PORT = 5000 || process.env.PORT;
const cors = require("cors");

app.use(cors());
app.use(express.json());

//ROUTES
app.use("/server/groups", require("./routes/groups"));
app.use("/server/patients", require("./routes/patients"));
app.use("/server/data", require("./routes/data"));

app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
