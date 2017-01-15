import { Injectable } from '@angular/core';
import { AngularFire, FirebaseAuth, FirebaseAuthState, FirebaseObjectObservable } from 'angularfire2';
import { Router } from '@angular/router';
import { User } from './shared/user.model';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

@Injectable()
export class AuthService {
  redirectUrl: string;
  user: FirebaseObjectObservable<User>;
  userInstance: User;


  constructor(
    private af: AngularFire,
    private auth: FirebaseAuth,
    private router: Router,
  ) {
    this.auth.subscribe((authState: FirebaseAuthState) => {
      if (authState) {
        this.user = this.af.database.object('users/' + authState.uid);        
        this.user.subscribe(user => this.userInstance = user);
      } else {
        this.user = null;
      }
    })
  }

  login(): void {
    this.auth.login().then((state) => {
      if (state) {
        this.af.database.object('users/' + state.uid).subscribe(user => {
          this.router.navigate(['/register']);
        })
      }
    });
  }

  logout(): void {
    this.auth.logout();
    setTimeout(() => this.router.navigate(['/login'], 1000));
  }

  get authState(): Observable<FirebaseAuthState> {
    return this.auth.map((state: FirebaseAuthState) => state);
  }

  get authenticated(): Observable<boolean> {
    return Observable.create((observer) => {
      this.auth.subscribe((state: FirebaseAuthState) => {
        if (state) {
          this.af.database.object('users/' + state.uid).subscribe(
            (user) => observer.next(user.$exists()));          
        } else {
          observer.next(false);
        }
      })
    });
  }

  get isSuperUser(): Observable<boolean> {
    return Observable.create((observer) => {
      this.auth.subscribe((state: FirebaseAuthState) => {
        if (state) {
          this.af.database.object('users/' + state.uid).subscribe(
            (user) => observer.next(user.$exists() && user.superuser));          
        } else {
          observer.next(false);
        }
      })
    });
  }

  get authRegState(): Observable<any> {
    return Observable.create((observer) => {
      this.auth.subscribe((state: FirebaseAuthState) => {
        if (state) {
          this.af.database.object('users/' + state.uid).subscribe(
            (user) => observer.next({authenticated: true, registered: user.$exists()}));          
        } else {
          observer.next({authenticated: false, registered: false});
        }
      })
    });
  }

  isParticipating(contestId: string): Observable<boolean> {
    return Observable.create((observer) => {
      this.auth.subscribe((state: FirebaseAuthState) => {
        if (state) {
          const ref = 'contests/' + contestId + '/participants/' + state.uid;
          this.af.database.object(ref).subscribe(val => {
            observer.next(val.$exists());
          });
        } else {
          observer.next(false);
        }
      })
    });
  }

}