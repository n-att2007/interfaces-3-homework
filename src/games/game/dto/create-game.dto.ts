export class CreateGameDto {
    name: string;
    description: string;
    minPlayers: number;
    maxPlayers: number;
    category: string;
    createdBy: number; // User ID of the creator
}
