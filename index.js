const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.set("json spaces", 4);
// app.use(express.urlencoded({ extended: true })); // support encoded bodies
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());
app.use(cors());

const { connectDB } = require("./db/db.connect.js");

connectDB();

const { DocsObj } = require("./utils");
const { authV1 } = require("./api/auth.routes");
const { notesV1 } = require("./api/notes.routes");
const { archiveV1 } = require("./api/archive.routes");
const { trashV1 } = require("./api/trash.routes");
const { profileV1 } = require("./api/profile.routes");

app.get("/", (req, res) => {
  res.json({ ...DocsObj });
});

app.use("/auth", authV1);
app.use("/user/notes", notesV1);
app.use("/user/archive", archiveV1);
app.use("/user/trash", trashV1);
app.use("/user/profile", profileV1);

/**
 * 404 Route Handler
 * Note: DO not MOVE. This should be the last route
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "route not found on server, please check",
  });
});

/**
 * Error Handler
 * Don't move
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "error occured, see the errMessage key for more details",
    errorMessage: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

