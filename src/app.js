export class App {
  constructor() {
    var SCOPES = 'https://www.googleapis.com/auth/drive'
    var CLIENT_ID = '670438381526-24npq8td5gc18p48mrg1bdqnhqikra7m.apps.googleusercontent.com';
    var DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
    var DEVELOPER_KEY = "AIzaSyDNz5LgtO9P0KFhwAa2XUlpx63qf7SYjNE";

    this.loginService = new LoginService(CLIENT_ID, SCOPES, DISCOVERY_DOCS);
    this.driveService = new DriveService(DEVELOPER_KEY);
    this.files = [];
    // this.currentFile = {
    //   content: '',
    //   id: null,
    //   name: 'gDriveSync.example.txt',
    //   parents: []
    // };
    var firstLoad = true;
    this.pickerLoaded = false;
  }

  attached() {
    gapi.load('client:auth2', () => {
      this.loginService.initClient(loggedIn => {
        if (!loggedIn && this.firstLoad) {
          this.loginService.signIn();
          this.firstLoad = false;
        }
      });
    });
    gapi.load('picker', () => { this.pickerLoaded = true; });
  }

  login() {
    this.loginService.signIn();
  }

  load(file) {
    console.log("Loading file")
    this.driveService.get({ id: file.id }, file => {
      console.log("Loaded file");
      console.log(file.content);
    });
  }

  save() {
    var file = {
      content: "Hello world!",
      name: "Example.json",
    };

    this.driveService.save(file,file => {
      console.log('saved file', file);
    });
  }

  showPicker() {
    this.driveService.showPicker(file => {
      console.log("File selected", file);
      this.load(file);
    });
  }

  signOut() {
    this.loginService.signOut();
    this.loggedIn = false;
  }

  getFiles() {
    this.driveService.listFiles("*", (err, files) => {
      console.log(err, files);
      this.files = files;
    });
  }
}
