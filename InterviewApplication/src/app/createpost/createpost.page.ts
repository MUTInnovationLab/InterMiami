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
  description: any;
  qualification: any;
  required_exp: any;
  date: any;


  constructor(private db: AngularFirestore,private router:Router,private toastController: ToastController,
    private alertController: AlertController,private loadingController: LoadingController,
     public navCtrl: NavController, private auth: AngularFireAuth,
     private route: ActivatedRoute) { }

  ngOnInit() {
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

  updateJobPosition() {
    // Update the jobdepartment variable with the selected department text
    const selectedOption = this.departmentOptions.find(option => option.value === this.jobfaculty);
    this.jobdepartment = selectedOption ? selectedOption.text : '';
  }


  async submit(){
    console.log(this.jobpost)

    try 
    {
      // Check if the ID already exists in the Firestore collection
    
      
      this.db
        .collection('Post')
        .add({
                jobpost:this.jobpost,
                jobfaculty:this.jobfaculty,
                jobdepartment:this.jobdepartment,
                description: this.description,
                qualification:this.qualification,
                required_exp:this.required_exp,
                date:this.date

        })
        .then((docRef) => {
          //loader.dismiss();
          this.presentToast();

        })
        .catch((error) => {
         // loader.dismiss();
          console.error('Error adding document: ', error);
          alert('failed : ' + error);
        });
  
  }catch (error) {
    // Handle errors
    console.error('Error:', error);
    // Display appropriate error messages using toastController
  }
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
