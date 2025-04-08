import express from "express";
import axios from "axios";
// import swaggerJsdoc from 'swagger-jsdoc';
// import swaggerUi from 'swagger-ui-express';

const app = express();
const router = express.Router();
app.use(express.json());
app.use("/crimes", router);

const API_URL =
  "https://brottsplatskartan.se/api/events/?location=helsingborg&limit=5";

// Routes

router.get("/", async (req, res) => {
  try {
    const response = await axios.get(API_URL);
    if (!response.data || response.data.data) {
      return res.status(400).json({ message: "No data found" });
    }
    res.json(response.data.data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/headline", async (req, res) => {
  try {
    const response = await axios.get(API_URL);
    const headlines = response.data.data.map((h) => h.headline);
    if (headlines.length === 0) {
      return res.status(400).json({ message: "No headlines found" });
    }
    res.json(headlines);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/search", async (req, res) => {
  try {
    const city = req.query.city?.toLowerCase();
    const response = await axios.get(
      `https://brottsplatskartan.se/api/events/?location=${city}&limit=5`
    );
    const extractCity = response.data.data.filter((c) =>
      c.location_string.toLowerCase().includes(city)
    );
    if (extractCity.length === 0) {
      return res.status(400).json({ message: `Crimes not found in ${city}` });
    }
    res.json(extractCity);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/latest", async (req, res) => {
  try {
    const response = await axios.get(API_URL);
    const crimes = response.data.data;

    if (!crimes || crimes.length === 0) {
      return res.status(400).json({ message: "Crimes not found" });
    }

    const sortCrimes = crimes.sort((a, b) => {
      return new Date(b.pubdate_iso8601) - new Date(a.pubdate_iso8601);
    });
    const latestCrime = sortCrimes[0];

    if (!latestCrime) {
      return res
        .status(400)
        .json({ message: "Could not found the latest crime" });
    }
    res.json(latestCrime);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
