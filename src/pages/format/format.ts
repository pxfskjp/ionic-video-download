import { Component } from '@angular/core';
import {IonicPage, ToastController, ViewController} from 'ionic-angular';
/**
 * Generated class for the FormatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-format',
  templateUrl: 'format.html',
})
export class FormatPage {
  public fileName = '';
  public format = 'mp4';
  public width = 640;
  public height = 480;

  constructor(
    public modalController: ViewController,
    private toastController: ToastController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FormatPage');
  }

  dismiss(){
    return this.modalController.dismiss();
  }

  async checkProperties(){
    if(this.fileName==''){
      await this.showToast('Alert', 'File name is emptied. Please input file name.', 1500);
      return;
    }

    return this.modalController.dismiss({
      fileName: this.fileName,
      format: this.format,
      width: this.width,
      height: this.height
    });
  }

  async showToast(title: string, message: string, duration: number) {
    const toast = this.toastController.create({
      message: 'Please enter URL of video.',
      duration: duration
    });
    return toast.present();
  }

}
// https://www.youtube.com/watch?v=r2ga-iXS5i4