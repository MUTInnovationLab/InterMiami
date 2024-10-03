import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';
import { where } from 'firebase/firestore';

@Component({
  selector: 'app-today-interviews',
  templateUrl: './today-interviews.page.html',
  styleUrls: ['./today-interviews.page.scss'],
})
export class TodayInterviewsPage implements OnInit {
  groupedInterviewees: Map<string, any[]> = new Map();
  todayDateString: string;
  selectedOption: any;// Variable to store the selected option

  constructor(private firestore: AngularFirestore,  private toastController: ToastController) {
    this.todayDateString = new Date().toDateString();
  }

  ngOnInit() {
    this.fetchData();
  }

  sortIntervieweesByDate() {
    // Sort the grouped interviewees by date (keys)
    this.groupedInterviewees = new Map([...this.groupedInterviewees.entries()].sort());
  }

  // this method filters out data that it date does not match todays date
  fetchData() {
    this.firestore.collection('Interviewees').valueChanges().subscribe((data: any[]) => {
      this.groupedInterviewees = data.reduce((result, interviewee) => {
        const itemDate = new Date(interviewee.date);
        const dateKey = itemDate.toDateString();
        
        if (dateKey === this.todayDateString) {
          if (!result.has(dateKey)) {
            result.set(dateKey, []);
          }
          result.get(dateKey).push(interviewee);
        }
        
        return result;
      }, new Map<string, any[]>());
  
      // Sort the grouped interviewees by date
      this.sortIntervieweesByDate();
    });
  }
  

  toggleSelect(item: any) {
    item.showSelect = !item.showSelect;
  }
  
  onSelectOption(item: any) {
    item.showSelect = false; // Hide the select after an option is selected
  }

  async updateField(int_id:any,selectedOption:any) {

    try {
      // Find the document with the matching int_id
      const querySnapshot = await this.firestore.collection('Interviewees', ref => ref.where('int_id', '==', int_id)).get().toPromise();
      // If a matching document is found, update its fields
      if (!querySnapshot?.empty) {
        const documentId = querySnapshot?.docs[0].id;
 
        await this.firestore.collection('Interviewees').doc(documentId).update({
       
          Status: selectedOption,
          // Update other fields as needed
        });
  
      } else {
        this.showToast('No matching data found');
      }
    } catch (error) {
      this.showToast('Error updating document:'+ error);
      // Display appropriate error message using toastController
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


