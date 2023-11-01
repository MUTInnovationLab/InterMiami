import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-view-academic-record-modal',
  templateUrl: './view-academic-record-modal.page.html',
  styleUrls: ['./view-academic-record-modal.page.scss'],
})
export class ViewAcademicRecordModalPage implements OnInit {
  pdfUrl: any;
  safePdfUrl: SafeResourceUrl | undefined;


  constructor(private modalController: ModalController,private sanitizer: DomSanitizer,private navParams: NavParams) {
   
  }

  ngOnInit() {
    console.log(this.pdfUrl);
    this.pdfUrl = this.navParams.get('pdfUrl');
    this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfUrl);
  }

  closeModal() {
    this.modalController.dismiss();
  }

}
