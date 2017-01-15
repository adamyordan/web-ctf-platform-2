import { Component, Input } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Params, Router }   from '@angular/router';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';

import { Contest } from '../shared/contest.model';
import { Challenge } from '../shared/challenge.model';

import { Md5 } from 'ts-md5/dist/md5';
import swal from 'sweetalert2';

@Component({
  selector: 'ctf-card-manage',
  templateUrl: './card-manage.component.html',
  styleUrls: ['./card-manage.component.css']
})
export class CardManageComponent {

  challenge : FirebaseObjectObservable<Challenge>;

  newContestName : string;
  newContestDescription : string;
  newChallengeId : string;
  newChallengeName : string;
  newChallengeDescription : string;
  newChallengeFlag : string;
  newChallengeCategory : string;
  newChallengePoint : number;

  constructor(
    private af: AngularFire,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.challenge = this.af.database.object('/challenges/' + this.route.snapshot.params['id']);
    this.editSelectedChallenge();
  }

  editSelectedChallenge() {
    this.challenge.subscribe(ch => {
      if (this.challenge) {
        this.newChallengeId = ch['$key'];
        this.newChallengeName = ch.name;
        this.newChallengeDescription = ch.description;
        this.newChallengeFlag = ch.flag;
        this.newChallengeCategory = ch.category;
        this.newChallengePoint = ch.point;
      }
    })
  }

  saveChallengeForm() {
    const newChallenge = new Challenge(this.newChallengeName, this.newChallengeFlag, 
      Md5.hashStr(this.newChallengeFlag)+'', this.newChallengeDescription,
      this.newChallengeCategory, this.newChallengePoint);
 
    if (this.newChallengeId == 'NEW') {
      this.af.database.list('challenges').push(newChallenge);
    } else {
      const challengeRef = 'challenges/' + this.newChallengeId;
      this.af.database.object(challengeRef).update(newChallenge);
    }
    swal('Saved!', 'Challenge saved', 'success');
  }

  closePopup() {
    this.router.navigate([{ outlets: { popup: null }}]);
  }

}
