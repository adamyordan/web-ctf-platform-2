import { Component, EventEmitter, OnChanges, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../auth.service';

import { Contest } from '../shared/contest.model';
import { Challenge } from '../shared/challenge.model';
import { ChallengeContest } from '../shared/challenge-contest.model';

@Component({
  selector: 'ctf-deck',
  templateUrl: 'deck.component.html',
  styleUrls: ['deck.component.css']
})
export class DeckComponent implements OnChanges {
  selectedTab = 'problems';
  @Input() contestId : string;
  @Input() selectedProblem : Challenge;
  @Output() onSelectedProblem = new EventEmitter<FirebaseObjectObservable<Challenge>>();
  contestInstance: Contest;
  challenges: Observable<ChallengeContest[]>;
  scoreboardData: any[] = [];
  messages: any[] = [];


  constructor(
    private location: Location,
    private router: Router,
    private af: AngularFire,
    private authService: AuthService,
  ) {
  }

  ngOnChanges() {
    this.af.database.object('contests/' + this.contestId).subscribe(contest => {
      this.contestInstance = contest;
      this.scoreboardData = Contest.getScoreBoard(this.contestInstance);
      this.messages = Contest.getMessages(this.contestInstance);
    });

    const challengesRef = '/contests/' + this.contestId + '/challenges/';
    this.challenges = this.af.database.list(challengesRef).map((conChalls: ChallengeContest[]) => {
      conChalls.forEach((conChall: ChallengeContest) => {
        this.af.database.object('challenges/' + conChall['$key'])
          .subscribe((metaChallenge: Challenge) => conChall['meta'] = metaChallenge)
      })
      return conChalls;
    })
  }

  selectProblem(problem : FirebaseObjectObservable<ChallengeContest>) : void {
    const ch = this.af.database.object('/challenges/' + problem['$key']);
    this.onSelectedProblem.emit(ch);
  }

  goBack(): void {
    this.location.back();
  }

  editChallengePopup(challenge: Challenge) {
    this.af.database.object('/challenges/' + challenge['$key']).subscribe(challenge => {
      this.router.navigate([{ outlets: { 'popup': ['card-manage', challenge['$key']] } }]);
    });
  }

  isSolved(c: ChallengeContest): boolean {
    return ChallengeContest.hasSolve(c, this.authService.userInstance['$key']);
  }

  showMessagePopup(messageId: string) {
    this.router.navigate([{ outlets: { 'popup': ['message-popup', this.contestInstance['$key'], messageId] } }]);
  }

}
