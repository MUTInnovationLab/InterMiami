import { Component } from '@angular/core';
import { SafeStyle, DomSanitizer } from '@angular/platform-browser';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {  LoadingController,NavController, ToastController , AlertController} from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { async } from '@angular/core/testing';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  // fullname!: string;
  // email!: string;
  // subject!: string;
  // message!: string;

  
  public alertButtons = [
    {
      text: 'Register',
      cssClass: 'alert-button-cancel',
      handler: () => {
        this.navController.navigateForward("/applicant-resgister");
      }
    },
    {
      text: 'Login',
      cssClass: 'alert-button-cancel',
      handler: () => {
        this.navController.navigateForward("/applicant-login");
      }
    },
    {
      text: 'Explore',
      cssClass: 'alert-button-confirm',
      handler: () => {
        this.navController.navigateForward("/posts");
      }

    },
  ];

  backgroundImage: SafeStyle;

  constructor(private sanitizer: DomSanitizer, private db: AngularFirestore,private loadingController: LoadingController,
    navCtrl: NavController,private auth: AngularFireAuth,private navController: NavController,
    private toastController: ToastController) {
    const imagePath = '../assets/background.jpeg'; 
    this.backgroundImage = this.sanitizer.bypassSecurityTrustStyle(`url(${imagePath})`);
   }

   Login() {
    this.navController.navigateForward("/applicant-login");
  }





 
  }
