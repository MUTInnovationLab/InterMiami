import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoadingController, NavController, ToastController, AlertController, ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
})
export class PostsPage implements OnInit {
  data: any;
  tables$: any;
  jobfaculty: any;
  isModalOpen = false;
  selectedJob: any;
  filteredTables$!: any[];
  searchTerm: string = '';
  selectedFilter: string = 'all';

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private http: HttpClient,
    private loadingController: LoadingController,
    private navCtrl: NavController,
    private auth: AngularFireAuth,
    private toastController: ToastController,
    private alertController: AlertController,
    private navController: NavController,
    private socialSharing: SocialSharing,
    private db: AngularFirestore,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.getAllDocuments();
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
          handler: () => { }
        }, {
          text: 'Confirm',
          handler: () => {
            this.auth.signOut().then(() => {
              this.navController.navigateForward("/applicant-login");
              this.presentToast();
            }).catch((error) => { });
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
        this.filterPosts();
        console.log('Posts data:', this.tables$); // For debugging
      });
  }

  filterPosts() {
    interface Job {
      jobfaculty: string;
      jobpost: string;
      jobdepartment: string;
      qualification: string;
      jobType: string;
    }

    this.filteredTables$ = this.tables$.filter((table: Job) => {
      return (this.selectedFilter === 'all' || table.jobType === this.selectedFilter) &&
             (table.jobpost.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
              table.jobdepartment.toLowerCase().includes(this.searchTerm.toLowerCase()));
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

  openJobDetails(job: any) {
    this.selectedJob = job;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  applyForJob(job: any) {
    this.navigateToViewPage(job.jobfaculty, job.jobpost, job.jobdepartment, job.qualification, job.jobType);
    this.closeModal();
  }

  shareJobOnPlatform(platform: string, job: any) {
    const message = `Check out this job: ${job.jobpost} in ${job.jobdepartment}`;
    const url = 'https://your-job-post-url.com'; // Replace with the actual job post URL

    switch (platform) {
      case 'facebook':
        this.socialSharing.shareViaFacebook(message, undefined, url);
        break;
      case 'twitter':
        this.socialSharing.shareViaTwitter(message, undefined, url);
        break;
      case 'linkedin':
        this.socialSharing.share(message, undefined, undefined, url);
        break;
      default:
        this.socialSharing.share(message, undefined, undefined, url);
        break;
    }
  }
}