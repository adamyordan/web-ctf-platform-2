import { Injectable }       from '@angular/core';
import { CanActivate, CanLoad, 
  Route, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { AuthService }      from '../auth.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

@Injectable()
export class SuperuserGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.isSuperUser.map((isSuperUser: boolean) => {
      if (isSuperUser) return true;
      this.router.navigate(['/home']);
      return false;
    })
  }


}
