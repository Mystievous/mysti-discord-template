import { ClientExtended } from "./ClientExtended";

export interface EntryDB {
  name: string;
}

export async function addEntry(client: ClientExtended, entry: EntryDB) {
  if (!client.database) {
    throw new Error("Database is not connected");
  }
  
  const db = client.database;
  const query = "INSERT INTO entries (name) VALUES (?)";
  const params = [entry.name];

  try {
    await db.execute(query, params);
  } catch (e: any) {
    if (e.code === "ER_DUP_ENTRY") {
      throw new Error("Entry already exists");
    } else {
      throw e;
    }
  }
}