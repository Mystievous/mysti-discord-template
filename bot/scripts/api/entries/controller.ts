import { api } from "../axios";
import { EntryCreate, EntryPublic } from "./models";

const routeUrl = "/entries";

export async function createEntry(entry: EntryCreate) {
  const { data } = await api.post<EntryPublic>(`${routeUrl}`, entry);
  return data;
}