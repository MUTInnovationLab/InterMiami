import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  navController: NavController;
  userDocument: any;

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private navCtrl: NavController,
    private auth: AngularFireAuth,
    private db: AngularFirestore
  ) {
    this.getUser();
    this.navController = navCtrl;
  }

  ngOnInit() {
    //this.Interviwees=this.firestore.collection('Interviwees').valueChanges();
  }

  async onViewChange(event: any) {
    const selectedView = event.detail.value;

    // Navigate to another page based on the selected view
    if (selectedView === 'all') {
      this.navCtrl.navigateForward('/scheduled-interviews'); // Replace with your desired route
    } else if (selectedView === 'today') {
      this.navCtrl.navigateForward('/today-interviews'); // Replace with your desired route
    }
  }

  async nav() {
    this.navCtrl.navigateForward('/schedule-interview');
  }

  async retrieveData() {
    this.navCtrl.navigateForward('/scheduled');
  }
  
  goToView(): void {
    this.navController.navigateBack('/staffprofile');
  }

 

  ionViewDidEnter() {
    this.getUser();
  }

  async getUser(): Promise<void> {
    const user = await this.auth.currentUser;

    if (user) {
      try {
        const querySnapshot = await this.db
          .collection('registeredStaff')
          .ref.where('email', '==', user.email)
          .get();

        if (!querySnapshot.empty) {
          this.userDocument = querySnapshot.docs[0].data();
        }
      } catch (error) {
        this.showToast('Error getting user document:'+ error);
      }
    }
  }

  async navigateBasedOnRole(page: string): Promise<void> {
    try {
      await this.getUser();

      let authorized = false;
      let message = '';

      if (this.userDocument && this.userDocument.role) {
        switch (page) {
          case 'all-applicants':
            authorized = this.userDocument.role.allApplicants === 'on';
            message = 'Unauthorized user for all applicants page.';
            break;
          case 'marks':
            authorized = this.userDocument.role.marks === 'on';
            message = 'Unauthorized user for graded Interviews page.';
            break;
          case 'add-user':
            authorized = this.userDocument.role.addUser === 'on';
            message = 'Access denied add user page.';
            break;
          case 'all-users':
            authorized = this.userDocument.role.allUsers === 'on';
            message = 'Unauthorized user for all users page.';
            break;
          case 'interview-history':
            authorized = this.userDocument.role.history === 'on';
            message = 'Unauthorized user for history page.';
            break;
          case 'scheduled-interviews':
            authorized = this.userDocument.role.upcomingInterviews === 'on';
            message = 'Unauthorized user for scheduled interviews page.';
            break;
          case 'score-capture':
            authorized = this.userDocument.role.score === 'on';
            message = 'Unauthorized user for score capture page.';
            break;
          case 'schedule-interview':
            authorized = this.userDocument.role.scheduleInterview === 'on';
            message = 'Unauthorized user for Schedule Interview page.';
            break;
          case 'createpost':
            authorized = this.userDocument.role.createpost === 'on';
            message = 'Unauthorized user for create post page.';
            break;
          case 'assign-interviewer':
            authorized = this.userDocument.position === 'HR';
            message = 'Unauthorized user for create post page.';
            break;
          default:
            authorized = false;
            message = 'Invalid page.';
            break;
        }
      }

      if (authorized) {
        this.navController.navigateForward('/' + page);
      } else {
        const toast = await this.toastController.create({
          message: 'Unauthorized Access:You do not have the necessary permissions to access this page. Please contact the administrator for assistance.',
          duration: 2000,
          position: 'top'
        });
        toast.present();
      }
    } catch (error) {
      this.showToast('Error navigating based on role:'+ error);
    }
  }

  goToSchedule(): Promise<void> {
    return this.navigateBasedOnRole('schedule-interview');
  }

  goToAllApplicants(): Promise<void> {
    return this.navigateBasedOnRole('all-applicants');
  }

  goToScheduledInterviews(): Promise<void> {
    return this.navigateBasedOnRole('scheduled-interviews');
  }

  goToScores(): Promise<void> {
    return this.navigateBasedOnRole('score-capture');
  }
  goToAssignInterviewers(): Promise<void>{
    // this.navController.navigateForward('/assign-interviewer');
    return this.navigateBasedOnRole('assign-interviewer');
  }

  goToAddUser(): Promise<void> {
    return this.navigateBasedOnRole('add-user');
  }

  goToInterviewHistory(): Promise<void> {
    return this.navigateBasedOnRole('interview-history');
  }

  goToCreatePost(): Promise<void> {
    return this.navigateBasedOnRole('createpost');
  }

  goToGraded(): Promise<void> {
    return this.navigateBasedOnRole('marks');
  }
  admin(): Promise<void> {
    return this.navigateBasedOnRole('marks');
  }
  goToAllUsers(): Promise<void> {
    return this.navigateBasedOnRole('all-users');
  }

  goToScheduleInterview(): Promise<void> {
    return this.navigateBasedOnRole('schedule-interview');
  }

  goToStaffProfile() {
    this.navController.navigateForward('/staffprofile');
  }

  goToHomePage(): void {
    this.navController.navigateBack('/home');
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
              this.navCtrl.navigateForward("/applicant-login");
              this.presentToast();
            }).catch(() => {
            });
          }
        }
      ]
    });
    await alert.present();
    
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Duration in milliseconds
      position: 'top' // Toast position: 'top', 'bottom', 'middle'
    });
    toast.present();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'SIGNED OUT!',
      duration: 1500,
      position: 'top',
    });

    await toast.present();
  }
}
