import { Injectable }       from '@angular/core';
import { CanActivate, CanLoad, 
  Route, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { AuthService }      from '../auth.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.authenticated.map((isAuthenticated: boolean) => {
      if (isAuthenticated) return true;
      this.router.navigate(['/login']);
      return false;
    })
  }

}
