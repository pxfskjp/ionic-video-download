import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// import { Observable } from 'rxjs';
// import { catchError, retry, map } from 'rxjs/operators';
import {File} from "@ionic-native/file";

@Injectable()
export class VideoImporterProvider {
  youtubeApiKey = 'AIzaSyDQgJTi4vHPiAhLYc1FjW-6QwgGCNNoVmQ';
  VIDEO_PATH = 'VideoImport';

  constructor(
    public http: HttpClient,
    private file: File,
  ) {

  }

  // getYoubuteVideoInof(url: string){
  //   let youtubeApi = "http://www.youtube.com/oembed?url=" + url + "&format=json";
  //   return this.http.get(youtubeApi);
  // }

  getYoutubeVideoInfo(url: string) {
    let headers= new HttpHeaders({});
    headers.set("Access-Control-Allow-Origin", "*");
    const endpoint='https://www.googleapis.com/youtube/v3/video?key=' + this.youtubeApiKey + '&url=' + url +'&part=snippet,id';
    console.log('api endpoint:', endpoint);
    return this.http.get(endpoint);
      // .map((res) => {
      //   return res['items'];
      // });
  }

  checkDirectory(onExist, onError){
    this.file.checkDir(this.file.externalRootDirectory, this.VIDEO_PATH)
      .then( bExist => onExist())
      .catch(err => {
        this.file.createDir(this.file.externalRootDirectory, this.VIDEO_PATH, false).
        then(dirEntry => {
          //this.listVideoFiles();
        })
        .catch(async err=> onError());
      });
  }

  listDirectory(){
    return this.file.listDir(this.file.externalDataDirectory,this.VIDEO_PATH);
  }

  findURL(url: string) {
    return this.http.head(url);
  }

  deleteFile(title: string) {
    return this.file.removeFile(this.VIDEO_PATH, title);
  }

}
