import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { AuthService } from '../auth.service';
import { Contest } from '../shared/contest.model';
import { Observable } from 'rxjs/Observable';
import { User } from '../shared/user.model';

@Component({
  selector: 'ctf-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent {
  selectedTab = 'latest';
  isAddFormShown = false;
  contests : FirebaseListObservable<Contest[]>; 

  constructor(
    private router: Router,
    private af: AngularFire,
    private authService: AuthService,
  ) {
    this.contests = af.database.list('/contests');
  }

  enterBoard(id : number) : void {
    this.router.navigate(['/board/', id]);
  } 

  manageBoard(id : number) : void {
    this.router.navigate(['/deck-manage/', id]);
  } 

  newContest: Contest = Contest.empty();
  onNewContestSubmit(): void {
    this.contests.push(this.newContest);
    this.newContest = Contest.empty();
  }

  toggleAddForm(): void {
    this.isAddFormShown = !this.isAddFormShown;
  }

  isParticipated(contest: Contest): Observable<boolean> {
    return this.authService.user.map((user: User) => {
      return Contest.isParticipating(contest, user['$key']);
    });
  }
}
