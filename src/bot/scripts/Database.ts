import { ClientExtended } from "./ClientExtended";

export interface EntryDB {
  name: string;
}

export async function addEntry(client: ClientExtended, entry: EntryDB) {
  if (!client.isDatabaseConnected()) {
    throw new Error("Database is not connected");
  }
  
  const db = client.database;
  const query =
    "INSERT INTO entries (name) VALUES ($1)";
  const params = [
    entry.name
  ];

  try {
    await db.query(query, params);
  } catch (e: any) {
    if (
      e.message.startsWith("duplicate key value violates unique constraint")
    ) {
      throw new Error("Entry already exists");
    } else {
      throw e;
    }
  }

}