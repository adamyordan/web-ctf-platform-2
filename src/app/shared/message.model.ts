import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
export class Message {

  constructor(
    public title: string,
    public body: string,
    public contest: string,
  ) { };

  static empty(): Message {
    return new Message(null, null, null);
  }

  static delete(af: AngularFire, contestKey: string, messageKey: string): firebase.Promise<void> {
    const ref = '/contests/' + contestKey + '/messages/' + messageKey;
    return af.database.object(ref).remove();
  }

}
