import { Injectable }       from '@angular/core';
import { CanActivate, CanLoad, 
  Route, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { AuthService }      from '../auth.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

@Injectable()
export class LoginPageGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.authRegState.map((state: any) => {
      if (state.registered) {
        this.router.navigate(['/home']);
        return false;
      }
      if (state.authenticated) {
        this.router.navigate(['/register']);
        return false;
      }
      return true;
    })
  }

}
