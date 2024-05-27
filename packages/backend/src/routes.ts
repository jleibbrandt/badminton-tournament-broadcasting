import express from "express";
import { initializeDatabase } from "./database";

const router = express.Router();
const dbPromise = initializeDatabase();

router.get("/tournaments", async (req, res) => {
  const db = await dbPromise;
  const tournaments = await db.all("SELECT * FROM tournaments");
  res.json(tournaments);
});

router.post("/tournaments", async (req, res) => {
  const db = await dbPromise;
  const { name, type } = req.body;
  await db.run("INSERT INTO tournaments (name, type) VALUES (?, ?)", [
    name,
    type,
  ]);
  res.status(201).send();
});

router.get("/players", async (req, res) => {
  const db = await dbPromise;
  const players = await db.all("SELECT * FROM players");
  res.json(players);
});

router.post("/players", async (req, res) => {
  const db = await dbPromise;
  const { name, surname, seeding, bsa_bwf_number, country } = req.body;
  await db.run(
    "INSERT INTO players (name, surname, seeding, bsa_bwf_number, country) VALUES (?, ?, ?, ?, ?)",
    [name, surname, seeding, bsa_bwf_number, country],
  );
  res.status(201).send();
});

export default router;
