import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth-guard.service';
import { SuperuserGuard } from './guards/superuser-guard.service';
import { LoginPageGuard } from './guards/loginpage-guard.service';
import { RegisterPageGuard } from './guards/registerpage-guard.service';
import { BoardGuard, BoardRegisterGuard } from './guards/board-guard.service';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LibraryComponent } from './library/library.component';
import { BoardComponent } from './board/board.component';
import { DeckComponent } from './deck/deck.component';
import { CardComponent } from './card/card.component';
import { DeckManageComponent } from './deck/deck-manage.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './login/register.component';
import { NotFoundComponent } from './notfound/notfound.component';
import { BoardRegisterComponent } from './board/board-register.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'pwn', component: LibraryComponent, canActivate: [AuthGuard] },
  { path: 'board/:id/register', component: BoardRegisterComponent, canActivate: [AuthGuard, BoardRegisterGuard] },
  { path: 'board/:id', component: BoardComponent, canActivate: [AuthGuard, BoardGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'deck-manage/:id', component: DeckManageComponent, canActivate: [AuthGuard, SuperuserGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [RegisterPageGuard] },
  { path: 'login', component: LoginComponent, canActivate: [LoginPageGuard] },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AuthGuard,
    SuperuserGuard,
    LoginPageGuard,
    RegisterPageGuard,
    BoardGuard,
    BoardRegisterGuard,
  ],
})
export class AppRoutingModule {}
