import {VideoInfo} from "./VideoInfo";
import {FileTransferObject} from "@ionic-native/file-transfer";

export class DownloadStatus extends VideoInfo{
  private downPro: number;    //0.0~1.0
  private transPro: number;   //0.0~1.0
  public percent: number;     //0.0~100
  public downloading: boolean;
  public tempFile: string;
  public downloader: FileTransferObject;
  public url: string;
  constructor(
    url,
    fileName,
    duration, // in second
    fileSize, // in byte
    width,
    height,
    downloader
  ){
    super(
      fileName,
      duration,
      fileSize,
      width,
      height
      );
    this.url=url;
    this.percent=0;
    this.downloading=false;
    this.tempFile=DownloadStatus.genRandomString(16);
    this.downloader=downloader;
  }

  setDownPro(newPro: number){
    this.downPro=newPro;
    this.percent=Math.round(this.downPro*100+this.transPro*100);
  }

  setTransPro(newPro: number){
    this.transPro+=newPro;
    this.percent=Math.round(this.downPro*100+this.transPro*100);
  }

  static genRandomString(length) {
    let result           = '.';
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

}
