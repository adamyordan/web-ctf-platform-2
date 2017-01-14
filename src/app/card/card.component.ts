import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

import { Challenge } from '../shared/challenge.model';

@Component({
  selector: 'ctf-card',
  templateUrl: 'card.component.html',
  styleUrls: ['card.component.css']

})
export class CardComponent {
  @Input() problem : FirebaseObjectObservable<Challenge>;
  @Output() onClose = new EventEmitter<Boolean>();
  selectedTab = "problem";
  editableFlag: string;

  closeCard() : void {
    this.onClose.emit(true);
  }

  submitFlag(): void {
    if (this.editableFlag.trim() == '') return;
    
    this.problem.subscribe((challenge: Challenge) => {
      if (Challenge.submit(challenge, this.editableFlag)) {
        alert('right flag!');
      } else {
        alert('wrong flag!');
      }
      this.editableFlag = "";
    })
  }
}
