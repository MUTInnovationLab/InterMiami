import { Component, OnInit } from '@angular/core';import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {  LoadingController,NavController, ToastController , AlertController} from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-applicant-resgister',
  templateUrl: './applicant-resgister.page.html',
  styleUrls: ['./applicant-resgister.page.scss'],
})
export class ApplicantResgisterPage implements OnInit {
  email: any;
  password: any;
  confirmPassword: any;
  emailError: any;
  passwordError: any;
  confirmPasswordError: any;
  emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // regular expression for email validation
  passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/; // regular expression for password validation
  
  constructor(private db: AngularFirestore,
    private loadingController: LoadingController, 
    navCtrl: NavController,
    private auth: AngularFireAuth,
    private navController: NavController,
    private toastController: ToastController) { }
  ngOnInit() {
  }
  goToHomePage(): void {
    this.navController.navigateBack('/home');
  }
   login(){

    this.navController.navigateForward("/applicant-login");
  
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Duration in milliseconds
      position: 'top' // Toast position: 'top', 'bottom', 'middle'
    });
    toast.present();
  }
  async register() {
    // reset error messages
    this.emailError = null;
    this.passwordError = null;
    this.confirmPasswordError = null;
  
    // validate input
    if (!this.email) {
      this.emailError = 'Please enter your email.';
      this.showToast("Please enter your email");
      return;
    }
  
    if (!this.password) {
      this.passwordError = 'Please enter a password.';
      this.showToast("Please enter a password");
      return;
    }
  
    if (!this.confirmPassword) {
      this.confirmPasswordError = 'Please confirm your password.';
      this.showToast("Please confirm your password");
      return;
    }
    
    if (this.password !== this.confirmPassword) {
      this.confirmPasswordError = 'Passwords do not match.';
      this.showToast("Passwords do not match");
      return;
    }
  
    if (!this.emailRegex.test(this.email)) {
      this.emailError = 'Please enter a valid email address.';
      this.showToast("Please enter a valid email address");
      return;
    }
    
    if (!this.passwordRegex.test(this.password)) {
      this.confirmPasswordError = 'Password must contain at least 8 characters including uppercase, lowercase, and numbers.';
      this.showToast("Password must contain at least 8 characters including uppercase, lowercase, and numbers.");
      return;
    }
  
    // register user if input is valid
    const loader = await this.loadingController.create({
      message: 'Signing up',
      cssClass: 'custom-loader-class'
    });
  
    await loader.present();
    this.auth.createUserWithEmailAndPassword(this.email, this.password)
      .then(async (userCredential) => {
        if (userCredential.user) {
          await this.db.collection('registeredStudents').add({
            email: this.email,
          });
          loader.dismiss();
          this.showToast("Registered Successfully");
          this.navController.navigateForward("applicant-login");
        } else {
          loader.dismiss();
          this.showToast('User not found');
        }
      })
      .catch((error) => {
        loader.dismiss();
        const errorMessage = error.message;
        if (error.code === 'auth/email-already-in-use') {
          this.showToast('This email is already in use. Please use a different email.');
        } else {
          this.showToast(errorMessage);
        }
      });
  }
}