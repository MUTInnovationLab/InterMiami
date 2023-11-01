import { Component, Input, OnInit } from '@angular/core';
import { IonicModule,ModalController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-decline-modal',
  templateUrl: './decline-modal.page.html',
  styleUrls: ['./decline-modal.page.scss'],
})
export class DeclineModalPage implements OnInit {
  @Input()  email= "";
  @Input()studentId="";
  reason="";

  constructor(private http: HttpClient,private modalController: ModalController, private db: AngularFirestore,private toastController: ToastController) {}

  ngOnInit() {}


  send() {
    this.db.collection('studentProfile').doc(this.studentId).update({ status: 'declined' })
    .then(() => {
      console.log('Declined false information!!!');
      this.showToast('Declined false information!!!');

      this.sendDeclineNotification(this.email); // Pass the email to sendDeclineNotification method
    })
    .catch(error => {
      console.error('Error updating status:', error);
    });
  
    this.modalController.dismiss();
  }

  formatBody() {
    this.reason = this.reason.replace(/\n/g, '<br>');
  }

 

sendDeclineNotification(email: string) {
const url = 'https://test149ionic.000webhostapp.com/send_decline_notifictaion.php';
const recipient = encodeURIComponent(email);
const subject = encodeURIComponent('Application Rejection Notice');
const body = encodeURIComponent(this.reason);

// Include the parameters in the query string
const query = `recipient=${recipient}&subject=${subject}&body=${body}`;

const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

this.http.get(url + '?' + query, { headers: headers })
  .subscribe(
    response => {
      console.log(response + ' (notification)');
      // Handle the response from the PHP file
    },
    error => {
      console.error('Error:', error + ' (notification)');
    }
  );
}





  dismiss() {
    this.modalController.dismiss();
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