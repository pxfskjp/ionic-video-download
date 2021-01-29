import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {FormatPage} from "../pages/format/format";
import { File } from '@ionic-native/file';
import { HttpClientModule } from '@angular/common/http';
import { VideoImporterProvider } from '../providers/video-importer/video-importer';
import { VideoEditor } from "@ionic-native/video-editor";
import {FileTransfer} from "@ionic-native/file-transfer";
// import {FormatPageModule} from "../pages/format/format.module";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    FormatPage,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    FormatPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    File,
    VideoEditor,
    VideoImporterProvider,
    FileTransfer
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
