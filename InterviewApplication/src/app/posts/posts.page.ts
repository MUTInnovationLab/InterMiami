import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { where } from 'firebase/firestore';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';



import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, QueryDocumentSnapshot } from '@angular/fire/compat/firestore';
import {  LoadingController,NavController, ToastController , AlertController} from '@ionic/angular';
import { Observable } from 'rxjs';
import { ViewAcademicRecordModalPage } from '../view-academic-record-modal/view-academic-record-modal.page';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { DeclineModalPage } from '../decline-modal/decline-modal.page';
import { ValidateDocsPage } from '../validate-docs/validate-docs.page';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
})
export class PostsPage implements OnInit {
  // Allposts: Map<string, any[]> = new Map();
  // todayDateString: string;
  // selectedOption: any;
  data: any;
  tables$: any;
  jobfaculty:any;

  constructor(private firestore: AngularFirestore,
    private router:Router,
    private http: HttpClient,
    private loadingController: LoadingController, 
    private navCtrl: NavController,
    private auth: AngularFireAuth,
    private toastController: ToastController,
    private alertController: AlertController,
    private navController: NavController,
    private db: AngularFirestore, private modalController: ModalController
    ) { }

  ngOnInit() {
    this.getAllDocuments();
    this.getAllDocuments2();
  }

  goToView(): void {
    this.router.navigate(['/views']);
  }
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'SIGNED OUT!',
      duration: 1500,
      position: 'top',
    
    });
  
    await toast.present();
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
            console.log('Confirmation canceled');
          }
        }, {
          text: 'Confirm',
          handler: () => {
           
            
            this.auth.signOut().then(() => {
              this.navController.navigateForward("/applicant-login");
              this.presentToast()
        
        
            }).catch((error) => {
            
            });
  
  
  
          }
        }
      ]
    });
    await alert.present();
  }

  getAllDocuments() {
    this.firestore
      .collection('Post')
      .valueChanges()
      .subscribe((data: any[]) => {
        this.tables$ = data;
        for (const item of data) {
          console.log(item.jobfaculty);
          // Now, you can calculate the counter value based on item.jobfaculty and navigate to the "views" page
          const counterValue = item.jobfaculty;
          // this.navigateToViewPage(counterValue);
        }
      });
  }

  navigateToViewPage(jobfaculty: string) {
    // Calculate the counter value by merging jobfaculty with 0000001
    const counterValue = jobfaculty;

    // Navigate to the "views" page and pass the counter value as a parameter
    this.router.navigate(['/views', { counter: counterValue }]);
  }

  getAllDocuments2() {
    this.firestore
      .collection('Post')
      .valueChanges()
      .subscribe((data) => {
        this.tables$ = data;
        console.log();
      });
  }

  
}
