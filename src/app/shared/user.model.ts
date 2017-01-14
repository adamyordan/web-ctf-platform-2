export class User {

  constructor(
    public username: string,
    public fullname: string,
    public email: string,
    public uid: string,
    public superuser: boolean,
  ) { };
}
