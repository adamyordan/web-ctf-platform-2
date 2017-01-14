import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';
import { AppRoutingModule } from './app-routing.module';

import { AuthService } from './auth.service';

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
import { SplashComponent } from './shared/splash.component';
import { BoardRegisterComponent } from './board/board-register.component';

export const firebaseConfig = {
  apiKey: 'AIzaSyAKjUApB5F0fnmWX6Pz5hta_bk29nhZXvI',
  authDomain: 'netsos-ctf.firebaseapp.com',
  databaseURL: 'https://netsos-ctf.firebaseio.com',
  storageBucket: 'netsos-ctf.appspot.com',
  messagingSenderId: '585317223341'
};

const firebaseAuthConfig = {
  provider: AuthProviders.Google,
  method: AuthMethods.Popup
};

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LibraryComponent,
    BoardComponent,
    DeckComponent,
    CardComponent,
    DeckManageComponent,
    HomeComponent,
    LoginComponent,
    ProfileComponent,
    RegisterComponent,
    NotFoundComponent,
    SplashComponent,
    BoardRegisterComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig),
    AppRoutingModule,
  ],
  providers: [
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
