import { Component, Input} from '@angular/core';
import { ActivatedRoute, Params, Router }   from '@angular/router';
import { AngularFire, FirebaseObjectObservable, AuthProviders, AuthMethods } from 'angularfire2';
import { AuthService } from '../auth.service';
import { Contest } from '../shared/contest.model';

@Component({
  selector: 'ctf-board-register',
  templateUrl: './board-register.component.html',
  styleUrls: ['./board-register.component.css']
})
export class BoardRegisterComponent {

  contest : FirebaseObjectObservable<Contest>;

  constructor(
    private af: AngularFire,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.contest = af.database.object('contests/' + this.route.snapshot.params['id']);
  }

  participate(): void {
    this.authService.user.subscribe(user => {
      if (user) {
        const ref = 'contests/' + this.route.snapshot.params['id'] + '/participants/' + user['$key'];
        this.af.database.object(ref).set(true);
        this.router.navigate(['board/', this.route.snapshot.params['id']]);
      }
    })
  }

  cancel(): void {
    this.router.navigate(['pwn/']);
  }

}
