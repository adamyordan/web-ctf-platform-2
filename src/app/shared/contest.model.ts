export class Contest {

  constructor(
    public name: string,
    public description: string,
    public challenges: any,
    public participants: any,
  ) { };

  static empty(): Contest {
    return new Contest(null, null, null, null);
  }

  static isParticipating(contest: Contest, userId: string): boolean {
    return contest.participants && contest.participants[userId] != null;
  }
}
