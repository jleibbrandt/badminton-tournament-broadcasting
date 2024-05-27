import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

export async function initializeDatabase() {
  const db = await open({
    filename: "./database/tournament.db",
    driver: Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS tournaments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS matches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tournament_id INTEGER NOT NULL,
      player1_id INTEGER NOT NULL,
      player2_id INTEGER NOT NULL,
      score1 INTEGER DEFAULT 0,
      score2 INTEGER DEFAULT 0,
      server_id INTEGER NOT NULL,
      FOREIGN KEY(tournament_id) REFERENCES tournaments(id),
      FOREIGN KEY(player1_id) REFERENCES players(id),
      FOREIGN KEY(player2_id) REFERENCES players(id)
    );

    CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      surname TEXT NOT NULL,
      seeding INTEGER,
      bsa_bwf_number TEXT NOT NULL,
      country TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS officials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL
    );
  `);

  return db;
}
