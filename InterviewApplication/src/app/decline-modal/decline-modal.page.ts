import { Component, Input, OnInit } from '@angular/core';
import { IonicModule,ModalController, ToastController ,NavController} from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import emailjs from 'emailjs-com';

@Component({
  selector: 'app-decline-modal',
  templateUrl: './decline-modal.page.html',
  styleUrls: ['./decline-modal.page.scss'],
})
export class DeclineModalPage implements OnInit {
  // @Input()  email= "";
  // @Input()studentId="";
 reason:any;
  email:any;

  constructor(private http: HttpClient,private navController: NavController,private modalController: ModalController, private db: AngularFirestore,private toastController: ToastController) {}

  ngOnInit() {}


  async Send() {
    const emailParams={ 
      email_to: 'thandekan736@gmail.com',
      from_email:'thandekan736@gmail.com',
      subject:'Regret Unsuccessful',
      message:this.reason
    };

    try{
       await emailjs.send('service_8ept2vs','template_315hlk4',
       emailParams,'XX8rNKm_N2YCpntSv'
       );
       console.log('email successfully sent');
       alert('email successfully sent');
    }
  catch(error){
    console.error('error sending email', error);
    alert('error sending email');
  }
   
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


 








  
  
