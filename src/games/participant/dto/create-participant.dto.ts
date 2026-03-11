export class CreateParticipantDto {
    sessionId: number; // Session ID
    userId: number; // User ID
    score: number;
    position: number;
    isWinner: boolean;
}
