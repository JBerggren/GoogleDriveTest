function DriveService(developerKey) {

  //*****************************************************
  //GENERIC METHODS
  //*****************************************************

  this.get = function (file, callback) {
    gapi.client.request({
      path: 'https://www.googleapis.com/drive/v3/files/' + file.id,
      method: 'get',
      params: {
        alt: "media",
        mimeType: 'application/json',
        fields: 'id,name,parents'
      }
    }).then(function (resp) {
      var retFile = { name: file.name, id: file.id, content: resp.body, parents: file.parents };
      callback(retFile);
    });
  }

  this.save = function (file, callback) {
    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";

    const contentType = 'application/json';

    var metadata = {
      'name': file.name,
      'mimeType': "application/json"
    };

    var multipartRequestBody =
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: ' + contentType + '\r\n\r\n' +
      file.content +
      close_delim;

    gapi.client.request({
      'path': '/upload/drive/v3/files',
      'method': 'POST',
      'params': { 'uploadType': 'multipart' },
      'headers': {
        'Content-Type': 'multipart/related; boundary="' + boundary + '"'
      },
      'body': multipartRequestBody
    }).then(function(resp){ callback(resp.result);});
  }

  this.list = function (resource, done) {
    var query = ' name contains "' + resource.query_name + '" '
    if (resource.parents) {
      query += ' and "' + resource.parents + '" in parents '
    }
    if (resource.mimeType) {
      query += ' and mimeType="' + resource.mimeType + '" '
    }
    if (resource.trashed != undefined) {
      query += ' and trashed=' + resource.trashed + ' ';
    }
    gapi.client.request({
      path: "https://www.googleapis.com/drive/v3/files",
      method: "get",
      params: {
        pageSize: 30,
        corpus: 'user',
        spaces: 'drive',
        fields: "nextPageToken, files(id, name, mimeType)",
        q: query,
        orderBy: resource.orderBy || 'modifiedTime desc'
      }
    }).then(function (resp) {
      return done(null, resp.result.files);
    }, function (reason) {
      return done(reason, null);
    });
  }

  this.showPicker = function (callback) {
    var accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
    var picker = new google.picker.PickerBuilder().
      addView(google.picker.ViewId.DOCS).
      setOAuthToken(accessToken).
      setDeveloperKey(developerKey).
      setCallback(function(data){
        if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
          var doc = data[google.picker.Response.DOCUMENTS][0];
          callback(doc);
        }
      }).
      build();
    picker.setVisible(true);
  }

  //*****************************************************
  //SPECIFIC METHODS TO MAKE IT EASIER TO USE
  //*****************************************************


  this.listFilesAt = function (query_name, parents, done) {
    this.list({ query_name: query_name, parents: parents, trashed: false }, done)
  }

  this.listFiles = function (query_name, done) {
    this.list({ query_name: query_name, trashed: false }, done)
  }

  this.listFolders = function (query_name, parents, done) {
    this.list({ query_name: query_name, mimeType: 'application/vnd.google-apps.folder', trashed: false }, done)
  }

  this.listFoldersAt = function (query_name, parents, done) {
    this.list({ query_name: query_name, parents: parents, mimeType: 'application/vnd.google-apps.folder', trashed: false }, done)
  }

}
