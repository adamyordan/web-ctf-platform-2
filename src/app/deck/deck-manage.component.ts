import { Component } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';

import { Contest } from '../shared/contest.model';
import { Challenge } from '../shared/challenge.model';
import { Md5 } from 'ts-md5/dist/md5';

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
  isContestFormShown : boolean;
  isChallengeFormShown : boolean;

  constructor(
    private af: AngularFire,
    private route: ActivatedRoute,
  ) {
    this.contest = af.database.object('contests/' + this.route.snapshot.params['id']);
    this.contest.subscribe((ct : Contest) => {
      this.challenges = []
      for (var chKey in ct.challenges) {
        var chObservable = af.database.object('challenges/' + chKey);
        this.challenges.push(chObservable);
      }
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
        .set(1);
    }
  }

  editChallenge(challengeObservable : FirebaseObjectObservable<Challenge>) : void {
    challengeObservable.subscribe((ch : Challenge) => {
      this.selectedAllChallenge = ch;
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
    this.newChallengeId = 'NEW';
    this.newChallengeName = '';
    this.newChallengeDescription = '';
    this.newChallengeFlag = '';
    this.isChallengeFormShown = true;
  }

  editSelectedChallenge() {
    if (this.selectedAllChallenge) {
      this.newChallengeId = this.selectedAllChallenge['$key'];
      this.newChallengeName = this.selectedAllChallenge.name;
      this.newChallengeDescription = this.selectedAllChallenge.description;
      this.newChallengeFlag = this.selectedAllChallenge.flag;
      this.isChallengeFormShown = true;
    }
  }

  saveChallengeForm() {
    const newChallenge = new Challenge(this.newChallengeName, this.newChallengeFlag, Md5.hashStr(this.newChallengeFlag)+'', this.newChallengeDescription);
    if (this.newChallengeId == 'NEW') {
      this.af.database.list('challenges').push(newChallenge);
    } else {
      const challengeRef = 'challenges/' + this.newChallengeId;
      this.af.database.object(challengeRef).update(newChallenge);
    }
    this.isChallengeFormShown = false;
    this.selectedAllChallenge = null;
  }

}
