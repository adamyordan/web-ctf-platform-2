import { Component, EventEmitter, OnChanges , Input, Output } from '@angular/core';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { AuthService } from '../auth.service';

import { Challenge } from '../shared/challenge.model';
import { ChallengeContest } from '../shared/challenge-contest.model';
import { Contest } from '../shared/contest.model';
import { Submission } from '../shared/submission.model';
import { Solver } from '../shared/solver.model';

import 'rxjs/add/operator/first';

@Component({
  selector: 'ctf-card',
  templateUrl: 'card.component.html',
  styleUrls: ['card.component.css']

})
export class CardComponent implements OnChanges {
  @Input() problem: FirebaseObjectObservable<ChallengeContest>;
  @Input() contest: FirebaseObjectObservable<Contest>;
  @Output() onClose = new EventEmitter<Boolean>();

  challengeContestInstance: ChallengeContest;
  contestInstance: Contest;
  solversObservable: FirebaseListObservable<Solver[]>;

  selectedTab = "problem";
  editableFlag: string;

  constructor(
    private af: AngularFire,
    private authService: AuthService,
  ) {
  }

  ngOnChanges() {
    if (this.problem) {
      this.problem.subscribe((challenge: ChallengeContest) => {
        this.challengeContestInstance = challenge;
        this.af.database.object('/challenges/' + challenge['$key']).subscribe(metaChallenge => {
          this.challengeContestInstance['meta'] = metaChallenge;
        });
        this.updateSubmissionObservable();
      });
    }
    if (this.contest) {
      this.contest.subscribe((contest: Contest) => {
        this.contestInstance = contest;
        this.updateSubmissionObservable();
      });    
    }
  }

  updateSubmissionObservable() {
    if (this.challengeContestInstance && this.contestInstance) {
      const solversRef = '/contests/' + this.contestInstance['$key'] + '/challenges/'
        + this.challengeContestInstance['$key'] + '/solvers/';
      this.solversObservable = this.af.database.list(solversRef);
    }
  }

  closeCard() : void {
    this.onClose.emit(true);
  }

  submitFlag(): void {
    const flag = this.editableFlag.trim();
    if (flag == '' || this.challengeContestInstance == null 
      || this.contestInstance == null || this.challengeContestInstance.meta == null) return;
    
    let correct = Challenge.submit(this.challengeContestInstance.meta, flag);

    const ref = '/contests/' + this.contestInstance['$key'] + '/challenges/'
      + this.challengeContestInstance['$key'] + '/submissions/';

    this.af.database.list(ref)
      .push(new Submission(
          + new Date(),
          this.contestInstance['$key'],
          this.challengeContestInstance['$key'],
          this.challengeContestInstance.meta.name,
          this.authService.userInstance.username,
          this.authService.userInstance['$key'],
          flag, 
          correct));

    if (correct) {
      const solverRef = '/contests/' + this.contestInstance['$key'] + '/challenges/'
        + this.challengeContestInstance['$key'] + '/solvers/' + this.authService.userInstance['$key'];
      
      this.af.database.object(solverRef).update(new Solver(
          this.contestInstance['$key'],
          this.challengeContestInstance['$key'],
          this.authService.userInstance.username,
          + new Date()
        ));
    }

    alert('correct: ' + correct);
    this.editableFlag = "";
  }
}
