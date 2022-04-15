require("dotenv").config();
const connectDb = require("./db/db");
const express = require("express");
const cors = require("cors");
const app = express();
const {google} = require("googleapis");

const comments = require("./routes/comments")
const apikey = "AIzaSyDAXtEJIM9IO2wD89wXhcRxmu72ryJGk2I";
const baseApiUrl = "https://www.googleapis.com/youtube/v3";
const youtube = google.youtube({
  version: "v3",
  auth: apikey,
});

app.get("/search-with-googleapis", async (req, res, next) => {
  try {
    const searchQuery = req.query.search_query;
    const response = await youtube.search.list({
      part: "snippet",
      q: searchQuery,
      type: "video",
    });
    const titles = response.data.items.map((item) => item.snippet.title);
    res.send(titles);
  } catch (error) {
    next(err);
  }
});








connectDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/comments", comments);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running. Listening on PORT: ${PORT}`);
});
//nodemon install