import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {  LoadingController,NavController, ToastController , AlertController} from '@ionic/angular';


@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.page.html',
  styleUrls: ['./all-users.page.scss'],
})
export class AllUsersPage implements OnInit {
  tableData: any[]=[];

  userData:any;

  constructor(private auth: AngularFireAuth,private toastController: ToastController,private alertController: AlertController,private navController: NavController,private db: AngularFirestore) {
    this.getHistoryData();
   }

  ngOnInit() {
    this.getHistoryData();
  }
  getHistoryData() {

    this.db.collection('registeredStaff')
      .valueChanges()
      .subscribe(data =>{
        
      this.userData=data;  
      this.tableData = data;
      
  
  });

}

goToAddUserPage(): void {
  this.navController.navigateBack('/add-user');
}


async presentConfirmationAlert() {
  const alert = await this.alertController.create({
    header: 'Confirmation',
    message: 'Are you sure you want to SIGN OUT?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
       cssClass: 'my-custom-alert',
        handler: () => {
        
        }
      }, {
        text: 'Confirm',
        handler: () => {
         
          
          this.auth.signOut().then(() => {
            this.navController.navigateForward("/applicant-login");
            this.presentToast();
      
      
          }).catch((error) => {
          
          });



        }
      }
    ]
  });
  await alert.present();
}


async presentToast() {
  const toast = await this.toastController.create({
    message: 'SIGNED OUT!',
    duration: 1500,
    position: 'top',
  
  });

  await toast.present();
}

goToView(): void {
  this.navController.navigateBack('/staffprofile');
}

goToHomePage(): void {
  this.navController.navigateBack('/home');
}

}
