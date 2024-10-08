import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import emailjs from 'emailjs-com';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-marks',
  templateUrl: './marks.page.html',
  styleUrls: ['./marks.page.scss'],
})
export class MarksPage implements OnInit {
  interviewData: any[] = []; 
  message: any = 'Congratulations on passing your interview';
 
  constructor(
    private firestore: AngularFirestore,
    private db: AngularFirestore,
    private toastController: ToastController
  ) {
    this.getScoreData();
  }

  ngOnInit() {}
  getScoreData() {
    const uniqueIntIds = new Set(); 
    this.firestore.collection('IntervieweeAverage').valueChanges().subscribe((data: any[]) => {
      this.interviewData = data
        .filter(item => {
          if (!uniqueIntIds.has(item.int_id)) {
            uniqueIntIds.add(item.int_id);
            return true; // Include the item if it's not a duplicate
          }
          return false; // Exclude the item if it's a duplicate
        })
        .map(item => ({
          int_id: item.int_id,
          name: item.name,
          email: item.email,
          status: item.Status, // Corrected property name from 'Status' to 'status'
          total: item.total,
          average: item.averageTotalScore // Corrected property name from 'averageTotalScore' to 'average'
        }));
    });
  }
  
  
  async Send(email: string, name: string, average: number) {
    if (!email) {
      this.showToast('Recipient email address is empty');
      return;
    }
  
    let message: string;
  
    if (average >= 40) {
      message = 'Congratulations on passing your interview';
    } else if (average >= 0 && average < 35) {
      message = 'Thank you for your time. Unfortunately, you did not pass the interview.';
    } else {
      this.showToast('Invalid score:'+ average);
      return; 
    }
  
    const emailParams = {
      email_to: email,
      subject: 'Your Subject Here',
      message: `Dear ${name},
      
  ${message}
  
  Best wishes,
  HR Recruitment Team`
    };
  
    try {
      await emailjs.send('interviewEmailsAD', 'template_7x4kjte', emailParams, 'TrFF8ofl4gbJlOhzB');
      this.showToast('email successfully sent');
      alert('email successfully sent');
    } catch (error) {
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
}  