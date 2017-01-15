export class Submission {

  constructor(
    public time: number,
    public contest: string,
    public challenge: string,
    public challengeName: string,
    public username: string,
    public userKey: string,
    public flag: string,
    public correct: boolean,
  ) { };
}
