import { Component } from '@angular/core';
import {ModalController, NavController, ToastController, AlertController } from 'ionic-angular';
import {FormatPage} from "../format/format";
import {DownloadStatus} from "../../model/DownloadStatus";
import {VideoInfo} from "../../model/VideoInfo";
import {Platform} from 'ionic-angular';
import {VideoEditor} from "@ionic-native/video-editor";
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import {VideoImporterProvider} from "../../providers/video-importer/video-importer";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  url = '';
  taskList: DownloadStatus[] = [];
  videoList: VideoInfo[] = [];

  constructor(
    public navCtrl: NavController,
    public modalController: ModalController,
    public toastController: ToastController,
    public alertController: AlertController,
    private platform: Platform,
    private videoEditor: VideoEditor,
    private videoImporter: VideoImporterProvider,
    private transfer: FileTransfer,
  ) {
    this.videoImporter.checkDirectory(
      ()=>{
        console.log('folder exists');
        this.listVideoFiles();
      },
      async ()=>{
        await this.showToast('Error', 'Cannot create the folder to store videos. App was be exited.', 2000);
        this.platform.exitApp();
      });
  }

  async checkURL() {
    console.log(this.url);
    if (this.url === '') {
      await this.showToast('Alert', 'Please enter URL of video.', 1000)
      return;
    }

    // if(this.url.startsWith('http://www.youtube.com/')){   //youtube video
    //   this.videoImporter.getYoutubeVideoInfo(this.url)
    //     .subscribe((data) => {
    //       this.showMsg(JSON.stringify(data));
    //     });
    // }
    // else {   // other video
    //
    // }

    this.videoImporter.findURL(this.url)
      .subscribe(
        (data) => {
          this.showFormatModal();
        },
        (err: HttpErrorResponse) => {
          if(err.status==404){
            this.showToast('Invalid URL', 'Cannot fild the URL. Please enter URL correctly.', 1500);
            return;
          }
          else{
            this.showFormatModal();
          }
        }
      );

  }

  async showMsg(title: string, message: string) {
    const alert = await this.alertController.create({
      title: title,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async showToast(title: string, message: string, duration: number) {
    const toast = this.toastController.create({
      message: 'Please enter URL of video.',
      duration: duration
    });
    return toast.present();
  }

  private listVideoFiles() {
    this.videoImporter.listDirectory()
      .then((result)=> {
        for (let aFile of result) {
          if (aFile.isFile == true) {
            this.videoEditor.getVideoInfo({fileUri: 'file-uri-here'})
              .then(info=>{
                const aVideo: VideoInfo = new VideoInfo(
                  aFile.name,
                  info.duration,
                  info.size,
                  info.width,
                  info.height
                );
                this.videoList.push(aVideo);
              })
              .catch(err=>{
                aFile.getMetadata((metadata) => {
                  const aVideo: VideoInfo = new VideoInfo(
                    aFile.name,
                    0,
                    metadata.size,
                    0,
                    0
                );
                  this.videoList.push(aVideo);
                })
              });

          } //eof: if (aFile.isFile == true)
        } //eof: for (let aFile of result)
      });
  }

  private showFormatModal() {
    const modal = this.modalController.create(
      FormatPage, {

      },{
        showBackdrop: false,
        enableBackdropDismiss: false
      });
    modal.present()
      .then((options) => {
        const downloader: FileTransferObject = this.transfer.create();
        const newTask: DownloadStatus = new DownloadStatus(
          this.url,
          options.fileName,
          0,
          0,
          options.width,
          options.height,
          downloader
        );
        this.taskList.push(newTask);
        downloader.onProgress((progressEvent) => {
          if (progressEvent.lengthComputable) {
            // Calculate the percentage
            newTask.percent = progressEvent.loaded / progressEvent.total;
          } else {
            newTask.percent++;
          }

        })
        newTask.downloader.download(encodeURI(this.url), this.videoImporter.VIDEO_PATH + newTask.fileName, true)
          .then((entry) => {
          const _temp: DownloadStatus=this.removeTask(newTask.fileName);
          const newVideo=new VideoInfo(
            _temp.fileName,
            _temp.duration,
            _temp.fileSize,
            _temp.width,
            _temp.height
          );
          this.videoList.unshift(newVideo);
          this.getVideoInfo(newVideo.fileName);
        }, (error) => {
          // handle error
        });

      });
  }

  private removeTask(title: string): DownloadStatus {
    for(let i=0; i<this.taskList.length; i++){
      if(this.taskList[i].fileName==title){
        return this.taskList.splice(i, 1)[0];
      }
    }
    return null;
  }

  private getVideoInfo(fileName: string) {
    // TODO: retrieve video info from file.

  }

  abortDownload(title: string){
    for(let i=0; i<this.taskList.length; i++){
      if(this.taskList[i].fileName===title){
        this.taskList[i].downloader.abort();
        this.videoImporter.deleteFile(title)
          .then(isRemoved =>{
            this.taskList.splice(i, 1);
          })
          .catch(() =>{
            this.taskList.splice(i, 1);
          });
      }
    }
  }

  deleteFile(fileName: string){
    this.videoImporter.deleteFile(fileName)
      .then((removeResult) => {
        if(removeResult.success){

        }
      })
      .then((err) => {

      });
  }

  async deleteVideo(title: string) {
    const alert = await this.alertController.create({
      title: 'Delete Video?',
      subTitle: 'File: '+title,
      message: 'Do you want to delete this video?',
      buttons: [{
        text: 'Cancel',
        role: 'cancel'
      }, {
        text: 'Yes',
        handler: () => {
          this.videoImporter.deleteFile(title)
            .then((removeResult) => {
              if(removeResult.success){
                this.showToast('Note', 'File '+title+' is deleted.', 2000);
              }
              else{
                this.showToast('Alert', 'File '+title+' isn\'t deleted.', 2000);
              }
            })
            .then((err) => {
              this.showToast('Alert', 'File '+title+' cannot be deleted.', 2000);
            });
        }
      }]
    });

    await alert.present();
  }
}
