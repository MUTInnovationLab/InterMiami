import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import * as firebase from 'firebase/compat';
import 'firebase/auth';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-score-capture',
  templateUrl: './score-capture.page.html',
  styleUrls: ['./score-capture.page.scss'],
})
export class ScoreCapturePage implements OnInit {

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

  groupedInterviewees: Map<string, any[]> = new Map();
  todayDateString: string;
  selectedOption: any;// Variable to store the selected option

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

  userData: any;
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
    this.getAllDocuments2();
  }

  

  getAllDocuments2() {
    this.firestore
      .collection('Interviewees')
      .valueChanges()
      .subscribe((data) => {
        this.tables$ = data;
        console.log(this.tables$);
      });
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
     const selectedTable = this.tables$[this.selectedRowIndex];

     if (!selectedTable) {
      alert('Please select interview candidate.');
    }else{

      this.calculateTotal();

    alert('Introduction:'+ this.introduction + '\n'
    + 'Teamwork:'+ this.teamwork + '\n'
     + 'Overall Impression:'+ this.overallImpression + '\n' 
     + 'Leadership Skills:'+ this.leadershipSkills + '\n'
     + 'Adaptability:'+ this.adaptability + '\n'
     + 'Communication Skills:'+ this.communicationSkills + '\n'
     + 'Job Specific Skills:'+ this.jobSpecificSkills + '\n'
     + 'Problem-Solving:'+ this.problemSolving + '\n'
     + 'Total:'+ this.total);

     const {int_id, name} = selectedTable;

     const label1Element = document.getElementById("label_1");
     const label2Element = document.getElementById("label_2");

      const label1 = label1Element ? label1Element.textContent : null;
      const label2 = label2Element ? label2Element.textContent : null;

    // Now you can proceed with adding the data to Firestore if needed
    const formData = {
      introduction: this.introduction,
      teamwork: this.teamwork,
      overallImpression: this.overallImpression,
      leadershipSkills: this.leadershipSkills,
      adaptability: this.adaptability,
      communicationSkills: this.communicationSkills,
      jobSpecificSkills: this.jobSpecificSkills,
      problemSolving: this.problemSolving,
      total: this.total,
      ID: int_id,
      name: name,
      panelMember: label1,
      panelEmail: label2
      
    };

    this.firestore
      .collection('feedback')
      .add(formData)
      .then(() => {
        
        // Data added successfully
        console.log('Form data added to Firestore!');
      })
      .catch((error) => {
        console.error('Error adding form data to Firestore:', error);
      });
    }
  }

  fetchData() {
    this.firestore.collection('Interviewees').valueChanges().subscribe((data: any[]) => {
      this.groupedInterviewees = data.reduce((result, interviewee) => {
        const itemDate = new Date(interviewee.date);
        const dateKey = itemDate.toDateString();
        
        if (dateKey === this.todayDateString) {
          //interviewee.date = 'Today';
        } else {
          interviewee.date = dateKey;
        }
  
        if (!result.has(dateKey)) {
          result.set(dateKey, []);
        }
        result.get(dateKey).push(interviewee);
        
        return result;
      }, new Map<string, any[]>());
  
      // Sort the grouped interviewees by date
      this.sortIntervieweesByDate();
    });
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
