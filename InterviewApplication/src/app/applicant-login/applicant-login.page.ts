import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-applicant-login',
  templateUrl: './applicant-login.page.html',
  styleUrls: ['./applicant-login.page.scss'],
})
export class ApplicantLoginPage implements OnInit {
  email: any;
  password: any;
  emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // regular expression for email validation
  passwordError: any; // Variable to hold the error message for the password

  constructor(
    private db: AngularFirestore,
    private loadingController: LoadingController,
    private navCtrl: NavController,
    private auth: AngularFireAuth,
    private toastController: ToastController
  ) { }

  ngOnInit() {}

  goToHomePage(): void {
    this.navCtrl.navigateBack('/home');
  }

  reset() {
    this.navCtrl.navigateForward("/reset");
  }

  signUp() {
    this.navCtrl.navigateForward("/create");
  }

  goToSignUp() {
    this.navCtrl.navigateForward("/applicant-resgister");
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

    // Validate password

    if (!this.password) {
      const toast = await this.toastController.create({
        message: 'Please enter your password.',
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
    this.passwordError = null;

    if (!this.email) {
      this.showToast("Please enter your email");
      return;
    }

    if (!this.password) {
      this.showToast("Please enter a password");
      return;
    }

    const loader = await this.loadingController.create({
      message: 'Signing in',
      cssClass: 'custom-loader-class'
    });
    await loader.present();

    this.auth.signInWithEmailAndPassword(this.email, this.password)
      .then((userCred) => {
        if (userCred) {
          this.db.collection('registeredStudents', ref => ref.where('email', '==', this.email))
            .get()
            .toPromise()
            .then((querySnapshot: any) => {
              querySnapshot.forEach((doc: { id: any; data: () => any; }) => {
                const id = doc.id;
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
                this.navCtrl.navigateForward("/posts");
              } else {
                this.navCtrl.navigateForward("/dashboard");
              }
            })
            .catch((error) => {
              loader.dismiss();
              const errorMessage = error.message;
            });
        }
      })
      .catch(async (error) => {
        loader.dismiss();
        const errorMessage = error.message;
        if (errorMessage === "Firebase: The password is invalid or the user does not have a password. (auth/wrong-password)." 
        || errorMessage === "Firebase: There is no user record corresponding to this identifier. The user may have been deleted. (auth/user-not-found).") {
    

          const toast =  this.toastController.create({
            message: 'Invalid email or password',
            duration: 2000,
            color: 'danger'
          });
          (await toast).present();
          return;
        } else if (errorMessage === "Firebase: The email address is badly formatted. (auth/invalid-email).") {
          this.showToast("incorrectly formatted email");
        }
      });
  }
  
  async getUserData(email: string) {
    try {
      const snapshot = await this.db.collection("registeredStudents").ref.where("email", "==", email).get();
      if (!snapshot.empty) {
        const userData = snapshot.docs[0].data();
        return userData;
      } else {
        return null;
      }
    } catch (error) {
      this.showToast("Error fetching user data:"+ error);
      return null;
    }
  }
  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Duration in milliseconds
      position: 'top' // Toast position: 'top', 'bottom', 'middle'
    });
    toast.present();
  }
}
