import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-scheduled-interviews',
  templateUrl: './scheduled-interviews.page.html',
  styleUrls: ['./scheduled-interviews.page.scss'],
})
export class ScheduledInterviewsPage implements OnInit {
  groupedInterviewees: Map<string, any[]> = new Map();
  todayDateString: string;

  constructor(
    private firestore: AngularFirestore, 
    private toastController: ToastController
  ) {
    this.todayDateString = new Date().toDateString();
  }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.firestore.collection('Interviewees').valueChanges().subscribe((data: any[]) => {
      this.groupedInterviewees = data.reduce((result, interviewee) => {
        const itemDate = new Date(interviewee.date);
        const dateKey = itemDate.toDateString();
        
        if (!result.has(dateKey)) {
          result.set(dateKey, []);
        }
        result.get(dateKey).push(interviewee);
        
        return result;
      }, new Map<string, any[]>());

      // Sort the grouped interviewees by date
      this.groupedInterviewees = new Map([...this.groupedInterviewees.entries()].sort());
    });
  }

  async updateField(int_id: any, selectedOption: any) {
    try {
      const querySnapshot = await this.firestore.collection('Interviewees', ref => ref.where('int_id', '==', int_id)).get().toPromise();
 
      if (!querySnapshot?.empty) {
        const documentId = querySnapshot?.docs[0].id;
 
        await this.firestore.collection('Interviewees').doc(documentId).update({
          Status: selectedOption,
        });
  
        this.showToast('Document updated successfully');
      } else {
        this.showToast('No matching document found');
      }
    } catch (error) {
      this.showToast('Error updating document: ' + error);
    }
  } 

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
}