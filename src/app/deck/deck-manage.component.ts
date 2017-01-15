import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router }   from '@angular/router';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';

import { Contest } from '../shared/contest.model';
import { Challenge } from '../shared/challenge.model';
import { ChallengeContest } from '../shared/challenge-contest.model';
import { Submission } from '../shared/submission.model';
import { Message } from '../shared/message.model';
import { Md5 } from 'ts-md5/dist/md5';

import * as _ from 'lodash';
import swal from 'sweetalert2';

@Component({
  selector: 'ctf-deck-manage',
  templateUrl: './deck-manage.component.html',
  styleUrls: ['./deck-manage.component.css']
})
export class DeckManageComponent {

  contest : FirebaseObjectObservable<Contest>;
  challenges : FirebaseObjectObservable<Challenge>[];
  allChallenges : FirebaseListObservable<Challenge[]>;
  selectedAllChallenge : Challenge;
  newContestName : string;
  newContestDescription : string;
  newChallengeId : string;
  newChallengeName : string;
  newChallengeDescription : string;
  newChallengeFlag : string;
  newChallengeCategory : string;
  newChallengePoint : number;
  isContestFormShown : boolean;
  isChallengeFormShown : boolean;
  selectedTab: string = 'manage';
  submissions: any[] = [];
  messages: any[] = [];
  contestInstance: Contest;

  constructor(
    private af: AngularFire,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.contest = af.database.object('contests/' + this.route.snapshot.params['id']);
    this.contest.subscribe((ct : Contest) => {
      this.contestInstance = ct;
      this.challenges = []
      for (var chKey in ct.challenges) {
        var chObservable = af.database.object('challenges/' + chKey);
        this.challenges.push(chObservable);
      }
      this.submissions = Contest.getSubmissions(ct);
      this.messages = Contest.getMessages(ct);
    })
    this.allChallenges = af.database.list('challenges');
  }

  onChangeSelectAllChallenge(selectedChallenge) : void {
    this.selectedAllChallenge = selectedChallenge;
  }

  addSelectedChallenge() : void {
    if (this.selectedAllChallenge != undefined) {
      var newId = this.selectedAllChallenge['$key'];
      this.af.database.object('contests/' + this.route.snapshot.params['id'] + '/challenges/' + newId)
        .set(ChallengeContest.instantiate(newId, this.selectedAllChallenge.point));
    }
  }

  editChallenge(challengeObservable : FirebaseObjectObservable<Challenge>) : void {
    challengeObservable.subscribe((ch : Challenge) => {
      this.selectedAllChallenge = ch;
      this.editSelectedChallenge();
    });
  }

  removeChallengeFromContest(challengeObservable : FirebaseObjectObservable<Challenge>) : void {
    challengeObservable.subscribe((ch : Challenge) => {
      const challengeRef = 'contests/' + this.route.snapshot.params['id'] + '/challenges/' + ch['$key'];
      this.af.database.object(challengeRef).remove();
    });
  }

  showContestForm() {
    this.contest.subscribe((ct : Contest) => {
      this.newContestName = ct.name;
      this.newContestDescription = ct.description;
    })
    this.isContestFormShown = true;
  }

  saveContestForm() {
    const contestRef = 'contests/' + this.route.snapshot.params['id'] + '/';
    this.af.database.object(contestRef + 'name').set(this.newContestName);
    this.af.database.object(contestRef + 'description').set(this.newContestDescription);
    this.isContestFormShown = false;
  }

  addNewChallenge() {
    this.router.navigate([{ outlets: { 'popup': ['card-manage', 'NEW'] } }]);
  }

  editSelectedChallenge() {
    if (this.selectedAllChallenge) {
      this.newChallengeId = this.selectedAllChallenge['$key'];
      this.newChallengeName = this.selectedAllChallenge.name;
      this.newChallengeDescription = this.selectedAllChallenge.description;
      this.newChallengeFlag = this.selectedAllChallenge.flag;
      this.newChallengeCategory = this.selectedAllChallenge.category;
      this.newChallengePoint = this.selectedAllChallenge.point;
      this.isChallengeFormShown = true;
    }
  }

  saveChallengeForm() {
    const newChallenge = new Challenge(this.newChallengeName, this.newChallengeFlag, 
      Md5.hashStr(this.newChallengeFlag)+'', this.newChallengeDescription,
      this.newChallengeCategory, this.newChallengePoint);
    console.log(newChallenge);

    if (this.newChallengeId == 'NEW') {
      this.af.database.list('challenges').push(newChallenge);
    } else {
      const challengeRef = 'challenges/' + this.newChallengeId;
      this.af.database.object(challengeRef).update(newChallenge);
    }

    this.isChallengeFormShown = false;
    this.selectedAllChallenge = null;
  }

  editChallengePopup(challengeObservable: FirebaseObjectObservable<Challenge>) {
    challengeObservable.subscribe(challenge => {
      this.router.navigate([{ outlets: { 'popup': ['card-manage', challenge['$key']] } }]);
    });
  }

  showMessagePopup(messageId: string) {
    this.router.navigate([{ outlets: { 'popup': ['message-popup', this.contestInstance['$key'], messageId] } }]);
  }

  deleteMessage(messageId: string) {
    swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then(() => {
      Message.delete(this.af, this.contestInstance['$key'], messageId);
      swal('Deleted!', 'Message has been deleted.', 'success');
    });
  }

}
