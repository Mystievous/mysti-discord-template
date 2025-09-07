export interface EntryBase {
    name: string;
}

export interface EntryPublic extends EntryBase {
    id: number;
}

export interface EntryCreate extends EntryBase { }