import express from "express";
import { initializeDatabase } from "./database";

const router = express.Router();
const dbPromise = initializeDatabase();

// Tournaments routes
router.get("/tournaments", async (req, res) => {
  const db = await dbPromise;
  const tournaments = await db.all("SELECT * FROM tournaments");
  res.json(tournaments);
});

router.post("/tournaments", async (req, res) => {
  const db = await dbPromise;
  const { name, type } = req.body;
  try {
    await db.run("INSERT INTO tournaments (name, type) VALUES (?, ?)", [
      name,
      type,
    ]);
    res.status(201).send();
  } catch (error) {
    console.error("Error inserting tournament:", error);
    res.status(500).send("Error inserting tournament");
  }
});

// Players routes
router.get("/players", async (req, res) => {
  const db = await dbPromise;
  const players = await db.all("SELECT * FROM players");
  res.json(players);
});

router.post("/players", async (req, res) => {
  const db = await dbPromise;
  const { name, surname, seeding, bsa_bwf_number, country } = req.body;
  try {
    await db.run(
      "INSERT INTO players (name, surname, seeding, bsa_bwf_number, country) VALUES (?, ?, ?, ?, ?)",
      [name, surname, seeding, bsa_bwf_number, country],
    );
    res.status(201).send();
  } catch (error) {
    console.error("Error inserting player:", error);
    res.status(500).send("Error inserting player");
  }
});

router.put("/players/:bsa_bwf_number", async (req, res) => {
  const db = await dbPromise;
  const { bsa_bwf_number } = req.params;
  const { name, surname, seeding, country } = req.body;
  try {
    await db.run(
      "UPDATE players SET name = ?, surname = ?, seeding = ?, country = ? WHERE bsa_bwf_number = ?",
      [name, surname, seeding, country, bsa_bwf_number],
    );
    res.status(200).send();
  } catch (error) {
    console.error("Error updating player:", error);
    res.status(500).send("Error updating player");
  }
});

router.delete("/players/:bsa_bwf_number", async (req, res) => {
  const db = await dbPromise;
  const { bsa_bwf_number } = req.params;
  try {
    await db.run("DELETE FROM players WHERE bsa_bwf_number = ?", [
      bsa_bwf_number,
    ]);
    res.status(200).send();
  } catch (error) {
    console.error("Error deleting player:", error);
    res.status(500).send("Error deleting player");
  }
});

// Add player to tournament
router.post("/tournaments/:tournament_id/players", async (req, res) => {
  const db = await dbPromise;
  const { tournament_id } = req.params;
  const { bsa_bwf_number, discipline } = req.body;
  try {
    await db.run(
      "INSERT INTO tournament_players (tournament_id, bsa_bwf_number, discipline) VALUES (?, ?, ?)",
      [tournament_id, bsa_bwf_number, discipline],
    );
    res.status(201).send();
  } catch (error) {
    console.error("Error adding player to tournament:", error);
    res.status(500).send("Error adding player to tournament");
  }
});

router.get("/tournaments/:tournament_id/players", async (req, res) => {
  const db = await dbPromise;
  const { tournament_id } = req.params;
  try {
    const players = await db.all(
      `SELECT p.* FROM players p
       JOIN tournament_players tp ON p.bsa_bwf_number = tp.bsa_bwf_number
       WHERE tp.tournament_id = ?`,
      [tournament_id],
    );
    res.json(players);
  } catch (error) {
    console.error("Error fetching players for tournament:", error);
    res.status(500).send("Error fetching players for tournament");
  }
});

// Score routes
router.get(
  "/tournaments/:tournament_id/matches/:match_id/scores",
  async (req, res) => {
    const db = await dbPromise;
    const { match_id } = req.params;
    try {
      const scores = await db.all(`SELECT * FROM scores WHERE match_id = ?`, [
        match_id,
      ]);
      res.json(scores);
    } catch (error) {
      console.error("Error fetching scores:", error);
      res.status(500).send("Error fetching scores");
    }
  },
);

router.post(
  "/tournaments/:tournament_id/matches/:match_id/scores",
  async (req, res) => {
    const db = await dbPromise;
    const { match_id } = req.params;
    const { game_number, player_bsa_bwf_number, score } = req.body;
    try {
      await db.run(
        "INSERT INTO scores (match_id, game_number, player_bsa_bwf_number, score) VALUES (?, ?, ?, ?)",
        [match_id, game_number, player_bsa_bwf_number, score],
      );
      res.status(201).send();
    } catch (error) {
      console.error("Error inserting score:", error);
      res.status(500).send("Error inserting score");
    }
  },
);

router.put(
  "/tournaments/:tournament_id/matches/:match_id/scores/:game_number/:player_bsa_bwf_number",
  async (req, res) => {
    const db = await dbPromise;
    const { match_id, game_number, player_bsa_bwf_number } = req.params;
    const { score } = req.body;
    try {
      await db.run(
        "UPDATE scores SET score = ? WHERE match_id = ? AND game_number = ? AND player_bsa_bwf_number = ?",
        [score, match_id, game_number, player_bsa_bwf_number],
      );
      res.status(200).send();
    } catch (error) {
      console.error("Error updating score:", error);
      res.status(500).send("Error updating score");
    }
  },
);

router.delete(
  "/tournaments/:tournament_id/matches/:match_id/scores",
  async (req, res) => {
    const db = await dbPromise;
    const { match_id } = req.params;
    try {
      await db.run("DELETE FROM scores WHERE match_id = ?", [match_id]);
      res.status(200).send();
    } catch (error) {
      console.error("Error deleting scores:", error);
      res.status(500).send("Error deleting scores");
    }
  },
);

export default router;
