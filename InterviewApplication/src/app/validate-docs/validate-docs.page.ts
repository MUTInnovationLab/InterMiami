import { Component, Input, OnInit,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-validate-docs',
  templateUrl: './validate-docs.page.html',
  styleUrls: ['./validate-docs.page.scss'],
 
})
export class ValidateDocsPage implements OnInit {

  cvUrl:any;
  academicRecordURl:any;
  urlArray:any[]=[];

 constructor(private modalController: ModalController,private sanitizer: DomSanitizer,private navParams: NavParams) {
   const cvUrl = this.sanitizeUrl(this.navParams.get('cvUrl'));
   const academicRecordURl = this.sanitizeUrl(this.navParams.get('academicRecordURl'));
   const letterURL = this.sanitizeUrl(this.navParams.get('letterURL'));
   const idURL = this.sanitizeUrl(this.navParams.get('idURL'));
   this.urlArray.push(cvUrl);
   this.urlArray.push(academicRecordURl);
   this.urlArray.push(letterURL);
   this.urlArray.push(idURL);
 }

 ngOnInit() {
 
 }

 sanitizeUrl(url: string): SafeResourceUrl {
   
   return this.sanitizer.bypassSecurityTrustResourceUrl(url);
 }
 closeModal() {
   this.modalController.dismiss();
 }


}
