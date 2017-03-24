export class App {
  constructor() {
    var SCOPES = 'https://www.googleapis.com/auth/drive.file'
    var CLIENT_ID = '670438381526-24npq8td5gc18p48mrg1bdqnhqikra7m.apps.googleusercontent.com';
    var DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];

    this.loginService = new LoginService(CLIENT_ID, SCOPES, DISCOVERY_DOCS);
    this.driveService = new DriveService();
    this.files = [];
  }

  attached() {
    gapi.load('client:auth2', ()=>{this.login();});
  }

  login() {
    this.loginService.initClient(loggedIn => {
      if (!loggedIn) {
        this.loginService.signIn();
      }
    });
  }

  getFiles() {
    this.driveService.getFiles("", (err, files) => {
      console.log(err, files);
      this.files = files;
    });
  }
}
