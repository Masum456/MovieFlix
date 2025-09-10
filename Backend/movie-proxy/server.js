import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
import process from "process";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors({ origin: "http://localhost:5173" }));

const API_BASE_URL = 'https://api.themoviedb.org/3';


app.get("/api/movies", async (req, res,) => {
  try {

    const searchQuery = req.query.query || ""; // frontend passes ?query=something

    const tmdbUrl = searchQuery 
      ?
      `${API_BASE_URL}/search/movie?query=${encodeURIComponent(searchQuery)}&language=en-US&page=1` 
      :
      `${API_BASE_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`;

    console.log("Fetching from:", tmdbUrl);

    const response = await fetch(tmdbUrl, {
    headers: {
    Authorization: `Bearer ${process.env.TMDB_API_KEY}`, // ✅ must be v4 token
    Accept: "application/json",
  },
});

if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

