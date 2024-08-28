import { Database, open } from "sqlite";
import sqlite3 from "sqlite3";

let db: Database<sqlite3.Database, sqlite3.Statement>;

// Open a connection to the SQLite database.
export const openDatabase = async () => {
  db = await open({
    filename: "./database.sqlite",
    driver: sqlite3.Database,
  });
};

// Initialize the database schema.
export const initializeDatabase = async () => {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS measures (
      measure_uuid TEXT PRIMARY KEY,
      customer_code TEXT NOT NULL,
      measure_datetime TEXT NOT NULL,
      measure_type TEXT NOT NULL CHECK(measure_type IN ('WATER', 'GAS')),
      has_confirmed BOOLEAN NOT NULL DEFAULT 0,
      image_url TEXT,
      measure_value REAL  -- Added this line to include the measure_value column
    )
  `);
};

export interface Measure {
  measure_uuid: string;
  measure_datetime: Date;
  measure_type: string;
  has_confirmed: boolean;
  image_url: string;
}

export const openDb = async () => {
  return open({
    filename: "./database.sqlite",
    driver: sqlite3.Database,
  });
};
export const insertReading = async (
  measure_uuid: string,
  image_url: string,
  customer_code: string,
  measure_datetime: string,
  measure_type: string,
  measure_value: number
) => {
  const db = await openDb();
  await db.run(
    `
    INSERT INTO measures (measure_uuid, image_url, customer_code, measure_datetime, measure_type, measure_value)
    VALUES (?, ?, ?, ?, ?, ?)
  `,
    [
      measure_uuid,
      image_url,
      customer_code,
      measure_datetime,
      measure_type,
      measure_value,
    ]
  );
};

// Get a measure by its UUID
export const getMeasureByUUID = async (
  measure_uuid: string
): Promise<Measure | null> => {
  const db = await openDb();
  const measure = await db.get(
    "SELECT * FROM measures WHERE measure_uuid = ?",
    measure_uuid
  );
  return measure || null;
};

// Update the measure value
export const updateMeasureValue = async (
  measure_uuid: string,
  newValue: number
): Promise<void> => {
  const db = await openDb();
  await db.run(
    "UPDATE measures SET measure_value = ?, has_confirmed = TRUE WHERE measure_uuid = ?",
    [newValue, measure_uuid]
  );
};

export const getMeasuresByCustomerCode = async (
  customerCode: string,
  measureType?: string
) => {
  const db = await openDb();
  const query = `
      SELECT * FROM measures
      WHERE customer_code = ?
      ${measureType ? "AND measure_type = ?" : ""}
    `;
  const params = measureType ? [customerCode, measureType] : [customerCode];
  return db.all(query, params);
};
