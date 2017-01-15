import { Component, Input } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

import { Contest } from '../shared/contest.model';
import { Challenge } from '../shared/challenge.model';

@Component({
  selector: 'ctf-board',
  template: `
    <div class="ctf-board">
      <div class="row normalize-margin">
        <div class="col-lg-6 no-padding-sides">
          <ctf-deck [contestId]="contestId"
                    (onSelectedProblem)="onSelectedProblem($event)"
                    [selectedProblem]="selectedProblem">
          </ctf-deck>
         </div>
        <div class="col-lg-6 no-padding-sides">
          <div *ngIf="selectedProblem">
            <ctf-card [problem]="selectedProblem" 
              [contest]="contest"
              (onClose)="onSelectedProblem(null)">
            </ctf-card>
          </div>
          <div *ngIf="selectedProblem == null">
            <ctf-scoreboard [contestId]="contestId"></ctf-scoreboard>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ctf-board {
    }
    .normalize-margin {
      margin: 0px;
    }
    .no-padding-sides {
      padding-left: 0px;
      padding-right: 0px;
    }
  `]

})
export class BoardComponent {
  selectedProblem : FirebaseObjectObservable<Challenge>;
  contest : FirebaseObjectObservable<Contest>;
  challenges : FirebaseObjectObservable<Challenge>[];
  contestId: string;

  constructor(
    private af: AngularFire,
    private route: ActivatedRoute,
  ) {
    this.contestId = this.route.snapshot.params['id'];
    this.contest = af.database.object('contests/' + this.route.snapshot.params['id']);
    this.contest.subscribe((ct : Contest) => {
      this.challenges = []
      for (var chKey in ct.challenges) {
        var chObservable = af.database.object('challenges/' + chKey);
        this.challenges.push(chObservable);
      }
    })
  }

  onSelectedProblem(challenge : FirebaseObjectObservable<Challenge>) {
    this.selectedProblem = challenge;
  }
}
