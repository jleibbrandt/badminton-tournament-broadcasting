import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";
import path from "path";

const dbPath = path.resolve(__dirname, "../database/tournament.db");

// Ensure the directory exists
const dirPath = path.dirname(dbPath);
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

export async function initializeDatabase() {
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS tournaments (
                                             id INTEGER PRIMARY KEY AUTOINCREMENT,
                                             name TEXT NOT NULL,
                                             type TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS players (
                                         name TEXT NOT NULL,
                                         surname TEXT NOT NULL,
                                         seeding INTEGER,
                                         bsa_bwf_number TEXT NOT NULL PRIMARY KEY,
                                         country TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tournament_players (
                                                    tournament_id INTEGER NOT NULL,
                                                    bsa_bwf_number TEXT NOT NULL,
                                                    discipline TEXT NOT NULL,
                                                    FOREIGN KEY(tournament_id) REFERENCES tournaments(id),
      FOREIGN KEY(bsa_bwf_number) REFERENCES players(bsa_bwf_number),
      PRIMARY KEY (tournament_id, bsa_bwf_number, discipline)
      );
  `);

  return db;
}
