import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { Location } from '@angular/common';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

import { Contest } from '../shared/contest.model';
import { Challenge } from '../shared/challenge.model';

@Component({
  selector: 'ctf-deck',
  template: `
    <div class="ctf-deck" *ngIf="contest">
      <div class="deck-header">
        <a (click)="goBack()" class="close card-close">&times;</a>
        <h3 class="text-center">{{ (contest | async)?.name }}</h3>
      </div>
      <div class="deck-nav">
        <ul class="nav nav-pills">
          <li [class.active]="selectedTab === 'problems'"><a (click)="selectedTab = 'problems'">Problems</a></li>
          <li [class.active]="selectedTab === 'scoreboard'"><a (click)="selectedTab = 'scoreboard'">Scoreboard</a></li>
          <li [class.active]="selectedTab === 'messages'"><a (click)="selectedTab = 'messages'">Messages</a></li>
        </ul>
      </div>
      <div class="deck-main">
        <div *ngIf="selectedTab === 'problems'">
          <div *ngFor="let challenge of challenges">
            <div class="deck-problem-item"
              (click)="selectProblem(challenge)">
              <div class="dpi-id">{{(challenge | async)?.id}}</div>
              <div class="dpi-name">{{(challenge | async)?.name}}</div>
              <div class="dpi-category">{{(challenge | async)?.category}}</div>
              <div class="dpi-point">{{(challenge | async)?.point}}</div>
              <div class="dpi-action"><button class="btn btn-sm btn-default" (click)="selectProblem(challenge)">go</button></div>
            </div>
          </div>
        </div>
        <div *ngIf="selectedTab === 'scoreboard'">
        </div>
        <div *ngIf="selectedTab === 'messages'">
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ctf-deck {
      background-color: #fff;
      font-family: sans-serif;
      border-top: 1px solid #fff;
      border-right: 1px solid #ddd;
    }
    .deck-header {
      padding: 0px 30px;
    }
    .deck-header > h3 {
      font-weight: bold;
      margin: 30px 0px;
    }
    .deck-nav {
      min-height: 60px;
      background-color: #eee;
      padding: 10px;
    }
    .deck-nav > .nav-pills>li>a {
      color: #555;
      font-weight: bold;
      cursor: pointer;
    }
    .deck-nav > .nav-pills>li.active>a {
      color: #fff;
      background-color: #2aa;
    }
    .deck-main {
      min-height: 100px;
      overflow-y: scroll;
      height: calc(100vh - 198px);
    }
    .deck-problem-item {
      border: 1px solid #ddd;
      margin: 5px;
      display: flex;
    }
    .deck-problem-item:hover {
      background-color: rgba(0,0,0,0.05);
      cursor: pointer;
    }
    .deck-problem-item.active {
      background-color: rgba(0,0,0,0.1);
      cursor: pointer;
    }
    .dpi-id, .dpi-name, .dpi-point, .dpi-action, .dpi-category {
      flex: 1;
      text-align: center;
      padding: 10px 5px;
      line-height: 1;
    }
    .dpi-id {
      flex: 0.5;
    }
    .dpi-action {
      padding: 0px;
      text-align: left;
    }
    .dpi-action button {
      margin: 0px;
      height: 100%;
      border-radius: 0px;
      min-width: 50px;
      border: 1px solid #ddd;
      border-top: 0px;
      border-bottom: 0px;
    }
  `]

})
export class DeckComponent {
  selectedTab = 'problems';
  @Input() contest : FirebaseObjectObservable<Contest>;
  @Input() challenges : FirebaseObjectObservable<Challenge>[];
  @Input() selectedProblem : Challenge;
  @Output() onSelectedProblem = new EventEmitter<FirebaseObjectObservable<Challenge>>();

  constructor(
    private location: Location
  ) {
  }

  selectProblem(problem : FirebaseObjectObservable<Challenge>) : void {
    this.onSelectedProblem.emit(problem);
  }

  goBack(): void {
    this.location.back();
  }

}
