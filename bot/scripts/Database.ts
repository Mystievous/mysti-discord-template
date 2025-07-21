import { ClientExtended } from "./ClientExtended";

// Models from /api/db/models.py
export interface Entry {
  name: string;
}

export interface EntryPublic extends Entry {
  id: number;
}

export async function addEntry(
  client: ClientExtended,
  entry: Entry
): Promise<EntryPublic> {
  // Endpoint defined in /api/db/main.py
  const { data } = await client.api.put<EntryPublic>(
    "/entry",
    {},
    { params: entry }
  );
  return data;
}
