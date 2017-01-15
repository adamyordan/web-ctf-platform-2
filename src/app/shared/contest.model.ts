import * as _ from "lodash";

import { ChallengeContest } from './challenge-contest.model';
import { Solver } from './solver.model';
import { Submission } from './submission.model';

export class Contest {

  constructor(
    public name: string,
    public description: string,
    public challenges: any,
    public participants: any,
    public submissions: any,
    public messages: any,
  ) { };

  static empty(): Contest {
    return new Contest(null, null, null, null, null, null);
  }

  static isParticipating(contest: Contest, userId: string): boolean {
    return contest.participants && contest.participants[userId] != null;
  }

  static getSubmissions(contest: Contest) {
    const submissions = []
    _.values(contest.challenges).forEach((challengeContest: ChallengeContest) => {
      _.keys(challengeContest.submissions).forEach((key: string) => {
        challengeContest.submissions[key]['$key'] = key;
      })
      _.values(challengeContest.submissions).forEach((submission: Submission) => {
        submissions.push(submission);
      })
    })
    submissions.sort((a: Submission, b: Submission) => {
      return b.time - a.time;
    })
    return submissions;
  }

  static getMessages(contest: Contest) {
    _.keys(contest.messages).forEach((contestKey: string) => {
      contest.messages[contestKey]['$key'] = contestKey;
    })
    return _.values(contest.messages);
  }

  static getScoreBoard(contest: Contest) {
    const participants = contest.participants;
    _.keys(contest.participants).forEach((participantKey: string) => {
      //todo fill userdata;
      participants[participantKey] = {
        $key: participantKey,
        username: null,
        point: 0,
        numChallenges: 0,
        latestCorrectSubmission: null,
      }
    });

    _.values(contest.challenges).forEach((challengeContest: ChallengeContest) => {
      _.keys(challengeContest.solvers).forEach((solverKey: string) => {
        const solver: Solver = challengeContest.solvers[solverKey]; 
        participants[solverKey].username = solver.username;
        participants[solverKey].point += challengeContest.point;
        participants[solverKey].numChallenges += 1;
        participants[solverKey].latestCorrectSubmission = 
          participants[solverKey].latestCorrectSubmission == null
          ? solver.time
          : Math.max(participants[solverKey].latestCorrectSubmission, solver.time);
      })
    });

    const participantList = _.values(participants);
    participantList.sort((p1:any, p2:any) => {
      if (p1.point != p2.point) return p2.point - p1.point;
      if (p1.latestCorrectSubmission != p2.latestCorrectSubmission)
        return p1.latestCorrectSubmission - p2.latestCorrectSubmission;
      return p2.numChallenges - p1.numChallenges
    });
    return participantList;
  }
}
