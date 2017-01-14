import { Md5 } from 'ts-md5/dist/md5';

export class Challenge {

  constructor(
    public name: string,
    public flag: string,
    public hashFlag: string,
    public description: string,
    // public category: Category[],
  ) { };

  static empty(): Challenge {
    return new Challenge(null, null, null, null);
  }

  static submit(challenge: Challenge, flag: string): boolean {
    const hashed = Md5.hashStr(flag);
    if (challenge.hashFlag == hashed) {
      return true;
    } else {
      return false;
    }
  }

}
