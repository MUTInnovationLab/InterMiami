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
  
  constructor(private db: AngularFirestore,private loadingController: LoadingController, navCtrl: NavController,private auth: AngularFireAuth,private navController: NavController) { }
  ngOnInit() {
  }
  goToHomePage(): void {
    this.navController.navigateBack('/home');
  }
   login(){

    this.navController.navigateForward("/applicant-login");
  
  }
  async register() {


       // reset error messages
       this.emailError = null;
       this.passwordError = null;
       this.confirmPasswordError = null;


    // validate input
    if (!this.email) {
      this.emailError = 'Please enter your email.';
      alert("Please enter your email");
      return;
    }

    if (!this.password) {
      this.passwordError = 'Please enter a password.';
      alert("Please enter a password");
      return;
    }

    if (!this.confirmPassword) {
      this.confirmPasswordError = 'Please confirm your password.';
      alert("Please confirm your password");
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.confirmPasswordError = 'Passwords do not match.';
      alert("Passwords do not match");
      return;
    }
    

    if (!this.emailRegex.test(this.email)) {
      this.emailError = 'Please enter a valid email address.';
      alert("Please enter a valid email address");
      return;
    }
    
    if (!this.passwordRegex.test(this.password)) {
      this.confirmPasswordError = 'Password must contain at least 8 characters including uppercase, lowercase, and numbers.';
      alert("Password must contain at least 8 characters including uppercase, lowercase, and numbers.");
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
        alert("Registered Successfully");
        this.navController.navigateForward("applicant-login");
      } else {
        loader.dismiss();
        alert('User not found');
      }
    })
    .catch((error) => {
      loader.dismiss();
      const errorMessage = error.message;
      alert(errorMessage);
    });
  }

}



