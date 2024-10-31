import { Component, OnInit } from '@angular/core';
import { ToastController, NavController, AlertController, LoadingController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-createpost',
  templateUrl: './createpost.page.html',
  styleUrls: ['./createpost.page.scss'],
})
export class CreatepostPage implements OnInit {

  jobpost: any;
  jobfaculty: any;
  jobdepartment: any;
  jobType: any;
  description: any;
  qualification: any;
  required_exp: any;
  date: any;


  constructor(private db: AngularFirestore, private router: Router, private toastController: ToastController,
    private alertController: AlertController, private loadingController: LoadingController,
    public navCtrl: NavController, private auth: AngularFireAuth,
    private route: ActivatedRoute) { }

  ngOnInit() {
  }

  goToView(): void {
    this.router.navigate(['/staff-profile']);
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
              this.presentToast()


            }).catch((error) => {

            });



          }
        }
      ]
    });
    await alert.present();
  }

  goToHomePage(): void {
    this.navCtrl.navigateBack('/dashboard');
  }

  departmentOptions = [
    { value: 'CHEM', text: 'Chemical Engineering' },
    { value: 'ELEC', text: 'Electrical Engineering' },
    { value: 'ICT', text: 'Information Communications & Technology' },
    { value: 'ACC', text: 'Accounting' },
    { value: 'HR', text: 'Human Resources' },
    { value: 'ANIPRO', text: 'Animal Production' },
    { value: 'PLPRO', text: 'Plant Production' },
    { value: 'AGRI', text: 'Agriculture' },
    { value: 'OFT', text: 'Office Technology' },
    { value: 'PA', text: 'Public Admin' }
  ];
  jobTypeOptions = [
    { value: 'Full-time', text: 'Full Time' },
    { value: 'Part-time', text: 'Part Time' },
    { value: 'Contract', text: 'Contract' },
    { value: 'Temporary', text: 'Temporary' },
    { value: 'Internship', text: 'Internship' }
  ];

  updateJobPosition() {
    // Update the jobdepartment variable with the selected department text
    const selectedOption = this.departmentOptions.find(option => option.value === this.jobfaculty);
    this.jobdepartment = selectedOption ? selectedOption.text : '';
  }


  async submit() {

    try {
      // Check if the ID already exists in the Firestore collection


      this.db
        .collection('Post')
        .add({
          jobpost: this.jobpost,
          jobfaculty: this.jobfaculty,
          jobdepartment: this.jobdepartment,
          jobType: this.jobType,
          description: this.description,
          qualification: this.qualification,
          required_exp: this.required_exp,
          date: this.date

        })
        .then((docRef) => {
          //loader.dismiss();
          this.presentToast();

        })
        .catch((error) => {
          // loader.dismiss();
          this.showToast('Error adding document: ' + error);
          alert('failed : ' + error);
        });

    } catch (error) {
      // Handle errors
      this.showToast('Error:' + error);
      // Display appropriate error messages using toastController
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

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Success!',
      duration: 1500,
      position: 'top',
    });

    await toast.present();
  }

}
