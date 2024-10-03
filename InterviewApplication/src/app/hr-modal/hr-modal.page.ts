import { Component, OnInit } from '@angular/core';
import emailjs from 'emailjs-com';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IonicModule,ModalController, ToastController ,NavController} from '@ionic/angular';

@Component({
  selector: 'app-hr-modal',
  templateUrl: './hr-modal.page.html',
  styleUrls: ['./hr-modal.page.scss'],
})
export class HrModalPage implements OnInit {


    email: string = '';
    subject: string = '';
    message: any = 'Congratulations on passing your interview';

  constructor(private http: HttpClient,
    private navController: NavController,
    private modalController: ModalController,
     private db: AngularFirestore,
     private toastController: ToastController) {}

  ngOnInit() {}


async Send() {
    const emailParams={
     
       email_to: this.email,
      //from_email:'',
      subject:this.subject,
      message:this.message,
    };

    try{
       await emailjs.send('interviewEmailsAD','template_7x4kjte',
       emailParams,'TrFF8ofl4gbJlOhzB'
       );
       this.showToast('email successfully sent');
       alert('email successfully sent');
    }
  catch(error){
    this.showToast('error sending email'+ error);
    alert('error sending email');
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

  public alertButtons = [
    {
      text: 'No',
      cssClass: 'alert-button-cancel',
    },
    {
      text: 'Yes',
      cssClass: 'alert-button-confirm',
      handler: () => {
        this.navController.navigateForward("/all-applicants");
      }

    },
  ];
 }


 






    

