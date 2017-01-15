import { Component, Input, OnChanges } from '@angular/core';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import { Contest } from '../shared/contest.model';
import { AuthService } from '../auth.service';

@Component({
  selector: 'ctf-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.css']
})
export class ScoreboardComponent implements OnChanges {
  @Input() contestId: string;
  contestInstance: Contest;
  scoreboardData: any[] = [];
  userData: any = {};

  constructor(
    private af: AngularFire,
    private authService: AuthService,
  ) {
  }

  ngOnChanges() {
    if (this.contestId) {
      this.af.database.object('/contests/' + this.contestId).subscribe((contest: Contest) => {
        this.contestInstance = contest;
        this.scoreboardData = Contest.getScoreBoard(contest);
        this.userData = this.scoreboardData.find(data => {
          return this.authService.userInstance['$key'] == data['$key'];
        })
      })
    }
  }
}
