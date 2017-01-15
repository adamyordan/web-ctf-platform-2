export class Solver {

  constructor(
    public contest: string,
    public challenge: string,
    public username: string,
    public time: number,
  ) { };

  static empty(): Solver {
    return new Solver(null, null, null, null);
  }

}
