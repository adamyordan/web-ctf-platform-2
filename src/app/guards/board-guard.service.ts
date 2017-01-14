import { Injectable }       from '@angular/core';
import { CanActivate, CanLoad, 
  Route, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { AuthService }      from '../auth.service';

import { Contest } from '../shared/contest.model';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

@Injectable()
export class BoardGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.isParticipating(route.params['id']).map((isAuthenticated: boolean) => {
      if (isAuthenticated) return true;
      this.router.navigate(['/board', route.params['id'], 'register']);
      return false;
    })
  }
}

@Injectable()
export class BoardRegisterGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.isParticipating(route.params['id']).map((isAuthenticated: boolean) => {
      if (!isAuthenticated) return true;
      this.router.navigate(['/board', route.params['id']]);
      return false;
    })
  }

}
