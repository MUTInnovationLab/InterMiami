import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavController, ToastController } from '@ionic/angular';
import { AngularFireAuth} from '@angular/fire/compat/auth';



@Component({
  selector: 'app-reset',
  templateUrl: './reset.page.html',
  styleUrls: ['./reset.page.scss'],
})
export class ResetPage implements OnInit {
  email:any;
  emailError:any;
  constructor(private auth:AngularFireAuth,private navController: NavController) { }
  

  ngOnInit() {
  }

  goToHomePage(): void {
    this.navController.navigateBack('/home');
  }

  reset(){
   
   
    this.auth.sendPasswordResetEmail(this.email)
    .then(userCredential => {
  
      window.alert("Email sent with link to reset your password");
     
      this.navController.navigateForward("/sign-in");


      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      window.alert("please enter a valid email");

      // ..
    });
  }

  goToPage() {
    this.navController.navigateForward("/applicant-login");
  }
}
