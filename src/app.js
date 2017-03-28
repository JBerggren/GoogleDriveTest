export class App {
  constructor() {
    var SCOPES = 'https://www.googleapis.com/auth/drive'
    var CLIENT_ID = '670438381526-24npq8td5gc18p48mrg1bdqnhqikra7m.apps.googleusercontent.com';
    var DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];

    this.loginService = new LoginService(CLIENT_ID, SCOPES, DISCOVERY_DOCS);
    this.driveService = new DriveService();
    this.files = [];
    this.currentFile = {
      content: '',
      id: null,
      name: 'gDriveSync.example.txt',
      parents: []
    };
    var firstLoad = true;
  }

  attached() {
    gapi.load('client:auth2', () => { this.login(); });
  }

  login() {
    this.loginService.initClient(loggedIn => {
      if (!loggedIn && this.firstLoad) {
        this.loginService.signIn();
        this.firstLoad = false;
      }
    });
  }

  load(){
    var id ="0B4zMwTR7Nf6SdVRHQWVNUXhpY00";
    var file = {id:id};
    this.driveService.loadFile(file,file=>{
      console.log(file);
    });
  }

  save() {
    var content = "Hello world";
    this.currentFile.content = content;
    this.currentFile.name = "my file.json";
    this.driveService.saveFile(this.currentFile,  file => {
      this.currentFile = file
      console.log('saved file with id:' + file.id)
    });
  }
  
  signOut(){
    this.loginService.signOut();
  }

  getFiles() {
    this.driveService.listFiles("*", (err, files) => {
      console.log(err, files);
      this.files = files;
    });
  }
}
