export class VideoInfo{
  public fileName: string;
  public format: string;
  public duration: number;   //integer, centi-second
  public fileSize: number;
  public width: number;
  public height: number;

  constructor(
    fileName,
    duration, // in second
    fileSize, // in byte
    width,
    height
  ) {
    this.fileName=fileName;
    this.duration=Math.round(duration * 100);
    this.fileSize=fileSize;
    this.width=width;
    this.height=height;

    this.format=VideoInfo.getFormat(fileName);
  }

  getDuration(): string{
    return VideoInfo.formatDuration(this.duration);
  }

  getSize(): string{
    return VideoInfo.formatSize(this.fileSize);
  }

  getDimension(): string{
    return VideoInfo.formatDimension(this.width, this.height);
  }

  static getFormat(fileName: string): string{
    let ext = fileName.split('.').pop();
    ext=ext.toLowerCase();
    if(ext.length==0){
      return 'unknown'
    }
    else{
      return ext;
    }
  }

  static formatDuration(duration: number): string {
    let nDuration = Math.round(duration * 100);
    const msec = nDuration % 100;
    nDuration = (nDuration - msec) / 100;
    const sec = nDuration % 60;
    nDuration = (nDuration - sec) / 60;
    const min = nDuration % 60;
    const hour = (nDuration - sec) / 60;

    let strDuration = '';
    if (hour < 10)
      strDuration += '0';
    strDuration += hour;
    strDuration += ':';
    if (min < 10)
      strDuration += '0';
    strDuration += min;
    strDuration += ':';
    if (sec < 10)
      strDuration += '0';
    strDuration += sec;
    strDuration+='.';
    strDuration+=msec;
    if(msec<10)
      strDuration+='0';
    return strDuration;
  }

  static formatSize(fileSizeInBytes: number): string{
    let i = -1;
    const byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
    do {
      fileSizeInBytes = fileSizeInBytes / 1024;
      i++;
    } while (fileSizeInBytes > 1024);

    return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
  }

  static formatDimension(width: number, height: number): string {
    if (width == 0 || height == 0)
      return '';
    else {
      return width + 'x' + height;
    }
  }
}
