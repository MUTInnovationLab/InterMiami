import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {  LoadingController,NavController, ToastController , AlertController} from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-applicant-login',
  templateUrl: './applicant-login.page.html',
  styleUrls: ['./applicant-login.page.scss'],
})
export class ApplicantLoginPage implements OnInit {
  email:any;
  password:any;
  emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // regular expression for email validation
  passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/; // regular expression for password validation
  userData: any;
  emailError: any;
  passwordError: any;

  constructor( private db: AngularFirestore,private loadingController: LoadingController,
     navCtrl: NavController,private auth: AngularFireAuth,private navController: NavController,
     private toastController: ToastController) { }

  ngOnInit() {
  }
  goToHomePage(): void {
    this.navController.navigateBack('/home');
  }

  reset() {
    this.navController.navigateForward("/reset");
  }
  signUp(){

    this.navController.navigateForward("/create");
  
  }
  goToSignUp(){

    this.navController.navigateForward("/applicant-resgister");
  
  }

  async validate() {
    // Validate input
    if (!this.email) {
      const toast = await this.toastController.create({
        message: 'Please enter your email.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      return;
    }
  
    // Validate email format
    if (!this.emailRegex.test(this.email)) {
      const toast = await this.toastController.create({
        message: 'Please provide a valid email address.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      return;
    }
  
    // Validate password format
    if (!this.password) {
      const toast = await this.toastController.create({
        message: 'Please enter your password.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      return;
    }
  
    if (!this.passwordRegex.test(this.password)) {
      const toast = await this.toastController.create({
        message: 'Password must contain at least 8 characters including uppercase, lowercase, and numbers.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      return;
    }
  
    // If all validations pass, continue with sign-in logic
    this.log();
  }
  
  
  
  


  async log() {

    this.emailError = null;
    this.passwordError = null;
   
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

      const loader = await this.loadingController.create({
        message: 'Signing in',
        cssClass: 'custom-loader-class'
      });
      await loader.present();

      this.auth.signInWithEmailAndPassword(this.email, this.password)
      .then(( userCred ) => {

        if (userCred){

        this.db.collection('registeredStudents', ref => ref.where('email', '==', this.email))
        .get()
        .toPromise()
        .then((querySnapshot:any) => {
          querySnapshot.forEach((doc: { id: any; data: () => any; }) => {
            const id = doc.id;
            console.log(id);
            const userData = doc.data();
            const loginCount = userData.loginCount || 0;
            const newLoginCount = loginCount + 1;

            this.db.collection("registeredStudents").doc(id).update({ loginCount: newLoginCount });
          });
        });






     this.db.collection("registeredStudents")
          .ref.where("email", "==", this.email.trim())
          .get()
          .then((querySnapshot) => {
            loader.dismiss();
            if (!querySnapshot.empty) {
              this.navController.navigateForward("/posts");
           
            } else {
              this.navController.navigateForward("/dashboard");
             
            }
          })
          .catch((error) => {
            loader.dismiss();
            const  errorMessage= error.message;
            
          
          });}
      })
    
      .catch((error) => {
        loader.dismiss();
        const errorMessage = error.message;
        if (errorMessage === "Firebase: The password is invalid or the user does not have a password. (auth/wrong-password)." 
        || errorMessage === "Firebase: There is no user record corresponding to this identifier. The user may have been deleted. (auth/user-not-found).") {
          alert("Invalid email or password");
        } else if (errorMessage === "Firebase: The email address is badly formatted. (auth/invalid-email).") {
          const errorMessage = error.message;
          alert("incorrectlly formated email");
        }
      });
    
  }

}