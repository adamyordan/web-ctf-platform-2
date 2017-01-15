export class ChallengeContest {

  meta: any;

  constructor(
    public challenge: string,
    public point: number, //contest-point
    public submissions: any,
    public solvers: any,
  ) { };

  static empty(): ChallengeContest {
    return new ChallengeContest(null, null, null, null);
  }

  static instantiate(challenge: string, point: number): ChallengeContest {
    return new ChallengeContest(challenge, point, null, null);
  }

  static hasSolve(cc: ChallengeContest, userKey: string): boolean {
    return cc.solvers && cc.solvers[userKey] != null;
  }

}
