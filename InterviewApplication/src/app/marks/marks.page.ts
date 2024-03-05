import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
//import { Observable } from 'rxjs';
import emailjs from 'emailjs-com';

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
    private db: AngularFirestore
  ) {
    this.getScoreData();
  }

  ngOnInit() {}

  getScoreData() {
    this.firestore.collection('feedback').valueChanges().subscribe((data: any[]) => {
        this.interviewData = data.map(item => ({
            int_id: item.stringData.int_id,
            name: item.stringData.name,
            email: item.stringData.email,
            status: item.stringData.Status,
            total: item.numericData.total
        }));
           });

        
           
}
async Send(email: string, name: string) {
  const emailParams = {
    email_to: email,
    subject: 'Your Subject Here', 
    message: 'Congratulations on passing your interview', 
  };

  try{
    await emailjs.send('interviewEmailsAD','template_7x4kjte',
    emailParams,'TrFF8ofl4gbJlOhzB'
    );
    console.log('email successfully sent');
    alert('email successfully sent');
 }
catch(error){
 console.error('error sending email', error);
 alert('error sending email');
}

}

}
