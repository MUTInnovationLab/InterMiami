import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-today-interviews',
  templateUrl: './today-interviews.page.html',
  styleUrls: ['./today-interviews.page.scss'],
})
export class TodayInterviewsPage implements OnInit {
  todayItems: any[] = [];
  todayDateString: string;
  selectedOption: string='';

  constructor(private firestore: AngularFirestore) {
    this.todayDateString = formatDate(new Date(), 'yyyy-MM-dd', 'en-US'); // Get today's date in 'YYYY-MM-DD' format
  }

  ngOnInit() {
    this.fetchTodayData();
  }

  fetchTodayData() {
    this.firestore.collection('Interviewees').valueChanges().subscribe((data: any[]) => {
      this.todayItems = data.filter(item => {
        const itemDate = new Date(item.date);
        const dateKey = itemDate.toISOString().substr(0, 10);
        return dateKey === this.todayDateString;
      });
    });
  }
  toggleSelect(item: any) {
    item.showSelect = !item.showSelect;
  }
  
  onSelectOption(item: any) {
    item.showSelect = false; // Hide the select after an option is selected
  }

  async updateField(int_id:any,selectedOption:any) {
    // const newValue = this.selectedOption;
 
     try {
       // Find the document with the matching int_id
       const querySnapshot = await this.firestore.collection('Interviewees', ref => ref.where('int_id', '==', int_id)).get().toPromise();
    console.log(querySnapshot);
       // If a matching document is found, update its fields
       if (!querySnapshot?.empty) {
         const documentId = querySnapshot?.docs[0].id;
  
         await this.firestore.collection('Interviewees').doc(documentId).update({
        
           Status: selectedOption,
           // Update other fields as needed
         });
   
         console.log('Document updated successfully');
       } else {
         console.log('No matching document found');
       }
     } catch (error) {
       console.error('Error updating document:', error);
       // Display appropriate error message using toastController
     }
   } 
}
