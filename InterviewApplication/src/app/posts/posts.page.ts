import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoadingController, NavController, ToastController, AlertController, ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

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
  jobfaculty: any;

  constructor(private firestore: AngularFirestore,
    private router: Router,
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
    // this.getAllDocuments2();
  }

  goToView(): void {
    this.router.navigate(['/views']);
  }

  goToApp(): void {
    this.router.navigate(['/track-applications']);
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
        console.log('Posts data:', this.tables$); // For debugging
      });
  }

  navigateToViewPage(jobfaculty: string, jobTitle: string, jobdepartment: string, qualification: string, jobType: string) {
    const navigationExtras = {
      queryParams: {
        counter: jobfaculty,
        title: jobTitle,
        dept: jobdepartment,
        qualify: qualification,
        type: jobType  // Added job type to navigation params

      }
    };

    this.router.navigate(['/home-apply'], navigationExtras);
  }


  // getAllDocuments2() {
  //   this.firestore
  //     .collection('Post')
  //     .valueChanges()
  //     .subscribe((data) => {
  //       this.tables$ = data;
  //     });
  // }


}
