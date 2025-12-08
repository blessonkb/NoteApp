const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectdb = require("./config/db");
const notesRoutes = require("./routs/notes");

dotenv.config();

const app = express();
const PORT = process.env.PORT;
connectdb();
app.use(cors());
app.use(express.json());


app.use("/api", notesRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
