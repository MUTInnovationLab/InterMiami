import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
//import * as firebase from 'firebase/compat';
import 'firebase/auth';
import { Observable, of } from 'rxjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

interface User {
  email: string;
  name: string;
  // Add other properties as needed
}

@Component({
  selector: 'app-score-capture',
  templateUrl: './score-capture.page.html',
  styleUrls: ['./score-capture.page.scss'],
})
export class ScoreCapturePage implements OnInit {
  groupedInterviewees: Map<string, any[]> = new Map();

  userData: User = {email:"default@gmail.com",name:"your name"} ;


  int_id! :number;
  name!:string;
  surname!: string;
  email!: string;
  Status!: string;
  Statuss: string = 'Interviewed';
  introduction: number = 0;
  teamwork: number = 0;
  overallImpression: number = 0;
  leadershipSkills: number = 0;
  adaptability: number = 0;
  communicationSkills: number = 0;
  jobSpecificSkills: number = 0;
  problemSolving: number = 0;
  total: number = 0;
  label1= Text;
  label2=Text;


  todayDateString: string;
  selectedOption: any;// Variable to store the selected option
  inProgressInterviewee: any = null; // Store the person with "In Progress" status


  data: any;
  tables$: any;
  jobfaculty:any;

  selectedRowIndex: number = -1;

  user$: Observable<any> = of(null);
  detProfile: any;
  role = {
    history: 'off',
    score: 'off',
    allApplicants: 'off',
    addUser: 'off',
    marks: 'off',
    upcomingInterviews: 'off'
  };

  tableData: any[] = [];

  // userData: any;
  currentPage: number = 1;
  rowsPerPage: number = 10;
  recipient: any;
  userEmailArray: string[] = [];
  userDocument: any;
  navController: any;

  sortIntervieweesByDate() {
    // Sort the grouped interviewees by date (keys)
    this.groupedInterviewees = new Map([...this.groupedInterviewees.entries()].sort());
  }


  constructor(private firestore: AngularFirestore,
    private loadingController: LoadingController,
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private navCtrl: NavController,
    private afs: AngularFirestore,
    private alertController: AlertController,
    private db: AngularFirestore,
    private toastController: ToastController,
    private router: Router) {

    this.todayDateString = new Date().toDateString();

    

  }

  ngOnInit() {
    // this.getAllDocuments2();
    this.fetchData();
    // getUserData();
    
  }


  

  

  

 

  calculateTotal() {
    this.total =
      this.limitToTen(this.introduction) +
      this.limitToTen(this.teamwork) +
      this.limitToTen(this.overallImpression) +
      this.limitToTen(this.leadershipSkills) +
      this.limitToTen(this.adaptability) +
      this.limitToTen(this.communicationSkills) +
      this.limitToTen(this.jobSpecificSkills) +
      this.limitToTen(this.problemSolving);
  }

  limitToTen(value: number): number {
    return value > 10 ? 10 : value;
  }

  checkMaxValue(event: any) {
    const value = parseInt(event.target.value, 10);
    if (isNaN(value)) return; 
    if (value > 10) {
      event.preventDefault(); 
      event.stopPropagation(); 
    }
  }

  handleItemClick(index: number) {
    this.selectedRowIndex = index;

  }



  submitForm() {
    this.calculateTotal();
    
    
    alert(`Introduction: ${this.introduction}\nTeamwork: ${this.teamwork}\n...\nName: ${this.name}`);
    
   
    const stringData = {
      name: this.name,
      email: this.email,
      Status: this.Statuss,
      int_id: this.int_id
      
    };
  
    // Separate numeric values
    const numericData = {
      introduction: this.introduction,
      teamwork: this.teamwork,
      overallImpression: this.overallImpression,
      leadershipSkills: this.leadershipSkills,
      adaptability: this.adaptability,
      communicationSkills: this.communicationSkills,
      jobSpecificSkills: this.jobSpecificSkills,
      problemSolving: this.problemSolving,
      total: this.total,
      // Include other numeric fields as needed
    };
  
    // Now, you can proceed with adding the data to Firestore
    this.firestore
      .collection('feedback')
      .add({
        stringData,
        numericData,
      })
      .then(() => {
        // Data added successfully
        console.log('Form data added to Firestore!');
      })
      .catch((error) => {
        console.error('Error adding form data to Firestore:', error);
      });
      this.updateStatus();
  }
 

  updateStatus() {
    const intervieweeRef = this.firestore.collection('Interviewees', ref => ref.where('name', '==', this.name));
    
    intervieweeRef.get().subscribe((querySnapshot: firebase.firestore.QuerySnapshot<any>) => {
      querySnapshot.forEach(doc => {
        // Update the "Status" field
        doc.ref.update({ Status: this.Statuss }) // Replace 'New Status' with the desired status
          .then(() => {
            alert('Status updated successfully');
          })
          .catch(error => {
            console.error('Error updating status:', error);
          });
      });
    });
  }
  
  
  fetchData() {
    this.firestore.collection('Interviewees', ref => ref.where('Status', 'in', ['Waiting', 'In Progress'])).valueChanges().subscribe((data: any[]) => {
      this.groupedInterviewees = data.reduce((result, interviewee) => {
        const itemDate = new Date(interviewee.date);
        const dateKey = itemDate.toDateString();
  
        if (dateKey === this.todayDateString) {
          interviewee.date = dateKey;
  
          if (!result.has(dateKey)) {
            result.set(dateKey, []);
          }
          result.get(dateKey).push(interviewee);
  
          // Check for "In Progress" status
          if (interviewee.Status === 'Waiting') {
            this.inProgressInterviewee = interviewee;
          }
        }
  
        return result;
      }, new Map<string, any[]>());
  
      // Sort the grouped interviewees by date
      this.sortIntervieweesByDate();
    });
  }
  

  handleCardClick(item: any) {
    this.inProgressInterviewee = item;
    this.start();
  }
  

  // Function to filter only today's data
  getTodayData(): any[] {
    return this.groupedInterviewees.get(this.todayDateString) || [];
  }

  start() {
    if (this.inProgressInterviewee) {
      const { name, surname, email, Status, int_id } = this.inProgressInterviewee;
      this.int_id = int_id;
      this.name = name;
      this.surname= surname;
      this.email = email;
      this.Status = Status;
      // Display a message box with the details of the person with "In Progress" status
      const confirmation = window.confirm(`Start interview with ${name} ${surname} (${email})?`);
      if (confirmation) {
        // Proceed with saving the data to the database
        // this.submitForm();
        this.Status = 'In Progress';
        console.log('The interview has started');
      }
    } else {
      alert('No person with "In Progress" status found.');
    }
  }

  Clear() {
    this.introduction = 0;
    this.teamwork = 0;
    this.overallImpression = 0;
    this.leadershipSkills = 0;
    this.adaptability = 0;
    this.communicationSkills = 0;
    this.jobSpecificSkills = 0;
    this.problemSolving = 0;
    this.total = 0;
  }


  
}
