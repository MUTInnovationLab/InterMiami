import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-cv-modal',
  templateUrl: './cv-modal.page.html',
  styleUrls: ['./cv-modal.page.scss'],
})
export class CvModalPage implements OnInit {
  cvUrl: any;
  safePdfUrl: SafeResourceUrl | undefined;

  constructor(private modalController: ModalController,private sanitizer: DomSanitizer,private navParams: NavParams) { }

  ngOnInit() {
    console.log(this.cvUrl);
    this.cvUrl = this.navParams.get('cvUrl');
    this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.cvUrl);
  }

  closeModal() {
    this.modalController.dismiss();
  }
  m(){
    alert(this.cvUrl);
  }

}