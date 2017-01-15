import { Component, Input } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Params, Router }   from '@angular/router';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { Message } from '../shared/message.model';
import swal from 'sweetalert2';

@Component({
  selector: 'ctf-message-popup',
  templateUrl: './message-popup.component.html',
  styleUrls: ['./popup.css', './message-popup.component.css']
})
export class MessagePopupComponent {
  message: Message = Message.empty();
  messageId: string;
  contestId: string;

  constructor(
    private af: AngularFire,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.messageId = this.route.snapshot.params['id'];
    this.contestId = this.route.snapshot.params['contestId'];
    if (this.messageId != 'NEW') {
      const ref = '/contests/' + this.contestId + '/messages/' + this.messageId;
      this.af.database.object(ref).first().subscribe(message => {
        this.message = message;
      });
    }
  }

  save() {
    const newMessage = {
      title: this.message.title,
      body: this.message.body,
      contest: this.contestId,
    }
    if (this.messageId == 'NEW') {
      const ref = '/contests/' + this.contestId + '/messages/';
      this.af.database.list(ref).push(newMessage);
    } else {
      const ref = '/contests/' + this.contestId + '/messages/' + this.messageId;
      this.af.database.object(ref).update(newMessage);
    }
    swal('Saved!', 'Message saved', 'success');
  }

  delete() {
    swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then(() => {
      Message.delete(this.af, this.contestId, this.messageId).then(() => {
        swal('Deleted!', 'Message has been deleted.', 'success').then(() => this.closePopup());
      });
    });
  }

  closePopup() {
    this.router.navigate([{ outlets: { popup: null }}]);
  }

}
