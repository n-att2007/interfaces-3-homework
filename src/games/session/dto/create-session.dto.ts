export class CreateSessionDto {
    gameId: number; // Game ID
    hostId: number; // User ID of the host
    status?: string; // Optional, defaults to 'scheduled'
    notes?: string; // Optional notes
}
