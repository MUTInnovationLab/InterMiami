import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { Observable, map, of } from 'rxjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { DataService } from '../Shared/data.service';

interface User {
  email: string;
  name: string;
  // Add other properties as needed
}

interface Staff {
  email: string;
  Name: string; // Ensure name property is present in the Staff interface
}

interface Interview {
  date: string | number | Date;
  status: string;
  email: string; // Add email property
  name: string;  // Add name property
}

interface Data {
  interview: Interview;
  selectedStaff: Staff[];
}

@Component({
  selector: 'app-score-capture',
  templateUrl: './score-capture.page.html',
  styleUrls: ['./score-capture.page.scss'],
})
export class ScoreCapturePage implements OnInit {
  groupedInterviewees: Map<string, any[]> = new Map();

  userData: User = { email: "default@gmail.com", name: "your name" };

  assignedInterviewers: any[] = [];
  intervieweeEmail!: string;
  int_id!: number;
  name!: string;
  surname!: string;
  email!: string;
  Status!: string;
  Statuss: string = 'Interviewed';
  Statusss: string = 'In Progress';
  introduction: number = 0;
  teamwork: number = 0;
  overallImpression: number = 0;
  leadershipSkills: number = 0;
  adaptability: number = 0;
  communicationSkills: number = 0;
  jobSpecificSkills: number = 0;
  problemSolving: number = 0;
  total: number = 0;
  label1 = Text;
  label2 = Text;

  todayDateString: string;
  selectedOption: any; // Variable to store the selected option
  inProgressInterviewee: any = null; // Store the person with "In Progress" status

  data: any;
  tables$: any;
  jobfaculty: any;

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
  userEmail: any;
  staffName: string = ''; // Add staffName property

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
    private router: Router,
    private dataService: DataService) {

    this.todayDateString = new Date().toDateString();
  }

  ngOnInit() {
    // this.getAllDocuments2();
    this.fetchData();
    // getUserData();
    this.auths();
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

  logBack() {
    this.deleteCurrentUserFromUserEmails();
  }

  async auths() {
    const currentUser = await this.auth.currentUser;
    if (currentUser) {
      this.userEmail = currentUser.email;

      // Check if the user's email has an interview scheduled for today
      const todayDateString = new Date().toDateString();
      let hasInterviewToday = false;

      // Fetch interview data
      this.dataService.getAllInterviewes().pipe(
        map(actions => actions.map((a: any) => {
          const data: any = a.payload.doc.data();
          return {
            interview: data.Interviewee.interview,
            selectedStaff: data.selectedStaff
          } as Data;
        }))
      ).subscribe((data: Data[]) => {
        // Check if there is an interview scheduled for today with the user's email
        hasInterviewToday = data.some((item: Data) => {
          return item.interview.email === this.userEmail && new Date(item.interview.date).toDateString() === todayDateString;
        });

        if (hasInterviewToday) {
          // Add the user's email to the database
          this.firestore.collection('UserEmails').doc(currentUser.uid).set({
            email: this.userEmail
          })
            .then(() => {
            
            })
            .catch(error => {
              
            });
        } else {
          // Display alert when no interview is scheduled for today
          this.showToast("You do not have interview scheduled for today");
        }
      });
    }
  }

 

  submitForm() {
    this.calculateTotal();

    alert(`Introduction: ${this.introduction}\nTeamwork: ${this.teamwork}\n...\nName: ${this.name}`);

    const stringData = {
      name: this.name,
      email: this.email,
      staffName: this.staffName, // Use the stored staff name
      Status: this.Statuss,
      int_id: this.int_id,
      userEmail: this.userEmail,
      date: new Date().toISOString()
    };

    // Include averageTotalScore in numericData
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
        this.deleteCurrentUserFromUserEmails(); // Call function to delete current user from UserEmails

      })
      .catch((error) => {
        this.showToast('Error adding form data to Firestore:'+ error);
      });
  }

  async deleteCurrentUserFromUserEmails() {
    const currentUser = await this.auth.currentUser;
    if (currentUser) {
      const currentUserEmail = currentUser.email;
      this.firestore.collection('UserEmails').doc(currentUser.uid).delete()
        .then(() => {
          this.checkAndSetInterviewedStatus(); // Call the function to check and update status
        })
        .catch(error => {
        });
    }
  }

  checkAndSetInterviewedStatus() {
    // Get all users from UserEmails collection
    this.firestore.collection('UserEmails').get().subscribe((querySnapshot: firebase.firestore.QuerySnapshot<any>) => {
      const userEmailsCount = querySnapshot.size; // Get the count of user emails

      // If only one user left, update statuses
      if (userEmailsCount === 0) {
        this.totalScore();
        this.updateStatusForAll(); // Call function to update status for all users
      }
    });
  }

  totalScore() {
    const intervieweeRef = this.firestore.collection('feedback', ref => ref.where('stringData.email', '==', this.intervieweeEmail));

    intervieweeRef.get().subscribe((querySnapshot: firebase.firestore.QuerySnapshot<any>) => {
      let total = 0;
      let count = 0;
      querySnapshot.forEach(doc => {
        // Retrieve the total from each document and add it to the total
        const data = doc.data();
        total += data.numericData.total;
        count++;
      });

      // Calculate the average total score
      const averageTotalScore = count > 0 ? total / count : 0;
      this.showToast('Average Total Score for Interviewee:'+ averageTotalScore);

      // Add average total score to Firestore
      this.firestore
        .collection('IntervieweeAverage')
        .add({
          averageTotalScore: averageTotalScore,
          email: this.intervieweeEmail,
          int_id: this.int_id,
          Status: this.Statuss,
          name: this.name

        })
        .then(() => {
    
        })
        .catch((error) => {
          this.showToast('Error adding Average data to Firestore:'+ error);
        });
    });
  }

  executeBothMethods() {
    this.submitForm();
  }

  updateStatusForAll() {
    this.firestore.collection('interviews', ref => ref.where('Interviewee.interview.email', '==', this.intervieweeEmail))
      .get()
      .subscribe(querySnapshot => {
        querySnapshot.forEach(doc => {
          doc.ref.update({ 'Interviewee.interview.status': this.Statuss }) // Update status to Interviewed
            .then(() => {
            })
            .catch(error => {
              this.showToast('Error updating status:'+ error);
            });
        });
      });
  }

  updateStatuss() {
    this.firestore.collection('interviews', ref => ref.where('Interviewee.interview.name', '==', this.name))
      .get()
      .subscribe(querySnapshot => {
        querySnapshot.forEach(doc => {
          doc.ref.update({ 'Interviewee.interview.status': this.Statusss }) // Update status to In Progress
            .then(() => {
              
            })
            .catch(error => {
              this.showToast('Error updating status:'+ error);
            });
        });
      });
  }

  loadAssignedInterviewers() {
    this.dataService.getAllInterviewes().pipe(
      map(actions => actions.map((a: any) => {
        const data: any = a.payload.doc.data();
        return data.selectedStaff;
      }))
    ).subscribe(assignedInterviewers => {
      this.assignedInterviewers = assignedInterviewers.flat();
    });
  }

  fetchData() {
    this.dataService.getAllInterviewes().pipe(
      map(actions => actions.map((a: any) => {
        const data: any = a.payload.doc.data();
        return {
          interview: data.Interviewee.interview,
          selectedStaff: data.selectedStaff
        } as Data;
      }))
    ).subscribe((data: Data[]) => {
      const filteredInterviews = data
        .filter((item: Data) => {
          // Filter only interviews with status 'Waiting' or 'In Progress'
          return item.interview.status === 'Waiting' || item.interview.status === 'In Progress';
        })
        .filter((item: Data) => item.selectedStaff.some((staff: Staff) => staff.email === this.userEmail))
        .map((item: Data) => {
          // Store the staff name in the class variable
          this.staffName = item.selectedStaff.find((staff: Staff) => staff.email === this.userEmail)?.Name || '';

          return item.interview;
        });

      this.groupedInterviewees = filteredInterviews.reduce((result: Map<string, Interview[]>, interviewee: Interview) => {
        const itemDate = new Date(interviewee.date);
        const dateKey = itemDate.toDateString();

        if (dateKey === this.todayDateString) {
          interviewee.date = dateKey;

          if (!result.has(dateKey)) {
            result.set(dateKey, []);
          }

          const intervieweesForDate = result.get(dateKey);
          if (intervieweesForDate) {
            intervieweesForDate.push(interviewee);
          }

          // Check for "In Progress" status
          if (interviewee.status === 'Waiting') {
            this.inProgressInterviewee = interviewee;
          }
        }

        return result;
      }, new Map<string, Interview[]>());

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

  async start() {
    if (this.inProgressInterviewee) {
      const { name, surname, email, Status, int_id } = this.inProgressInterviewee;
      this.int_id = int_id;
      this.name = name;
      this.surname = surname;
      this.email = email;
      this.Status = Status;

      // Store the email in the class variable
      this.intervieweeEmail = email;

      const alert = await this.alertController.create({
        header: 'Start Interview',
        message: `Start interview with ${name} ${surname} (${email})?`,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              
            }
          }, {
            text: 'Start',
            handler: () => {
              // Proceed with saving the data to the database
              this.updateStatuss();
              this.fetchData();
            }
          }
        ]
      });

      await alert.present();
    } else {
      alert('No person with "In Progress" status found.');
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

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
}
