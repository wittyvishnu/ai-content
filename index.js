import pg from 'pg';
import express from 'express';
import bodyparser from "body-parser";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "movies",
  password: "12345",
  port: 5432,
});

db.connect();

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  res.render("index.ejs", {
    name: null,
    imdb: null,
    genre: null,
    description: null,
    selectedGenre: 'All Genres',
    type:"Movie", // Default value when the page is initially loaded
  });
});

app.post("/showmov", async (req, res) => {
  
  try {
    const genre = req.body.selectedGenre || "All Genres";
    let query;

    // Determine the query based on the selected genre
    
    if (genre === "All Genres") {
      query = `
        SELECT * FROM public.movies
        ORDER BY RANDOM()
        LIMIT 1;
      `;
    } else {
      query = `
        SELECT * FROM public.movies
        WHERE genre ILIKE '%${genre}%'
        ORDER BY RANDOM()
        LIMIT 1;
      `;
    }
 
    
  

    // Execute the query
    const result = await db.query(query);

    // Fetch the random movie details
    const movie = result.rows[0] || {};

    // Render the page with the selected movie details
    res.render("index.ejs", {
      name: movie.name || "No movie found",
      imdb: movie.imdb || "N/A",
      genre: movie.genre || "N/A",
      description: movie.description || "No description available",
      selectedGenre: genre,
      type:"Movie"
    });
  } catch (err) {
    console.error("Error fetching random movie:", err.message);
    res.status(500).send("Server Error");
  }
});
app.post("/showser", async (req, res) => {
  
  try {
    const genre = req.body.selectedGenre || "All Genres";
    let query;

    // Determine the query based on the selected genre
    
    if (genre === "All Genres") {
      query = `
        SELECT * FROM public.series
        ORDER BY RANDOM()
        LIMIT 1;
      `;
    } else {
      query = `
        SELECT * FROM public.series
        WHERE genre ILIKE '%${genre}%'
        ORDER BY RANDOM()
        LIMIT 1;
      `;
    }
    
  

    // Execute the query
    const result = await db.query(query);

    // Fetch the random movie details
    const movie = result.rows[0] || {};

    // Render the page with the selected movie details
    res.render("index.ejs", {
      name: movie.name || "No movie found",
      imdb: movie.imdb || "N/A",
      genre: movie.genre || "N/A",
      description: movie.description || "No description available",
      selectedGenre: genre,
      type:"Series",
    });
  } catch (err) {
    console.error("Error fetching random movie:", err.message);
    res.status(500).send("Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
