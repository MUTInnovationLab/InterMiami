import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



import { AlertController, IonicModule, LoadingController, NavController, ToastController } from '@ionic/angular';
import { Observable, of } from 'rxjs';


import { finalize, switchMap } from 'rxjs/operators';
import { AngularFirestore, QuerySnapshot } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Certificate } from 'crypto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-staffprofile',
  templateUrl: './staffprofile.page.html',
  styleUrls: ['./staffprofile.page.scss'],
})
export class StaffprofilePage implements OnInit {
  user$: Observable<any> = of(null);
  detProfile: any;
  role = {
    history: 'off',
    score: 'off',
    allApplicants: 'off',
    addUser: 'off',
    marks: 'off',
    upcomingInterviews: 'off'
  };

  tableData: any[] = [];

  userData: any;
  currentPage: number = 1;
  rowsPerPage: number = 10;
  recipient: any;
  userEmailArray: string[] = [];
  userDocument: any;
  navController: any;



  constructor(
    private loadingController: LoadingController,
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private navCtrl: NavController,
    private afs: AngularFirestore,
    private alertController: AlertController,
    private db: AngularFirestore,
    private toastController: ToastController,
    private router: Router

  ) {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        // Firebase authentication persistence enabled
        // Proceed with your existing code

        this.user$ = of(firebase.auth().currentUser).pipe(
          switchMap((user) => {
            if (user) {
              const query = this.afs.collection('registeredStaff', (ref) =>
                ref.where('email', '==', user.email)
              );
              return query.valueChanges().pipe(
                switchMap((documents: any[]) => {
                  if (documents.length > 0) {
                    const userProfile = documents[0];
                    console.log(userProfile);
                    return of(userProfile);
                  } else {
                    console.log('No matching documents.');
                    return of(null);
                  }
                })
              );
            } else {
              return of(null);
            }
          })
        );
      })
      .catch((error) => {
        // An error occurred while enabling persistence
        console.error("Error enabling Firebase authentication persistence:", error);
      });
  }



  ngOnInit() {
  }
  getProfileImage(): string {
    const userProfile = this.detProfile; // Replace this with your actual profile data
    return userProfile && userProfile.profileImage
      ? userProfile.profileImage
      : 'assets/avatat.jpg'; // Replace with the path to your default profile image or placeholder
  }



  goToMenuPage() {
    //this.navController.navigateForward('/menu');

    this.router.navigateByUrl("/menu");

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
            console.log('Confirmation cancelled');
          }
        }, {
          text: 'Confirm',
          handler: () => {
            this.auth.signOut().then(() => {
              this.navController.navigateForward("/applicant-login");
              this.presentToast();
            }).catch((error) => {
              console.error('Error signing out:', error);
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

  goToHomePage(): void {
    this.router.navigateByUrl('/dashboard');
  }

  navigateBack(): void {
    this.navController.back();
  }


}