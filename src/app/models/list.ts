export interface List {
    id?: number;
    description: string;
    status: boolean;
    editable: boolean;
}
export interface ListItem {
    id?: number;
    code: string;
    description: string;
    listId: number;
    status: boolean;
}
