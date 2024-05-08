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





  //  submitForm() {
  //    // You can perform any necessary validation or form processing here
  //    // For simplicity, we'll just log the form data in this example
  //    console.log('Fullname:', this.fullname);
  //    console.log('Email:', this.email);
  //    console.log('Subject:', this.subject);
  //    console.log('Message:', this.message);
 
  //    // You can perform additional actions like sending the form data to a server, etc.
  //    // For this example, we'll just reset the form fields after submission
  //    this.fullname = '';
  //    this.email = '';
  //    this.subject = '';
  //    this.message = '';
  //  }

  //  emailjs.send("service_hqx55ua","template_l6eqodi",{
  //   from_name: "Celimpilo",
  //   to_name: "Wandile",
  //   from_email: "generalwandile41@gmail.com",
  //   subject: "Test",
  //   message: "Hi im testing my email service",
  //   });
  }
