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

  availabilityStatus: boolean = false;

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
                    return of(userProfile);
                  } else {
                    this.showToast('No matching documents.');
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
        this.showToast("Could'nt connect"+ error);
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

  onToggleChange(event: any) {
    const status = event.detail.checked;
    console.log('Availability Status:', status);
    
    // Update the status in Firestore
    this.auth.currentUser.then(user => {
      if (user) {
        const userEmail = user.email; // Get the current user's email
        
        if (userEmail) { // Check if userEmail is not null
          const userRef = this.afs.collection('registeredStaff').doc(userEmail); // Reference to the user's document
  
          // Update the availability status
          userRef.update({ availabilityStatus: status })
            .then(() => {
              this.showToast('Availability status updated successfully.');
            })
            .catch(error => {
              this.showToast('Error updating availability status: ' + error);
            });
        } else {
          this.showToast('User email is not available.');
        }
      } else {
        this.showToast('User not found.');
      }
    });
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
              this.showToast('Error signing out:'+ error);
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

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Duration in milliseconds
      position: 'top' // Toast position: 'top', 'bottom', 'middle'
    });
    toast.present();
  }


}