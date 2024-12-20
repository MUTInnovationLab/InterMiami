import { Component, OnInit } from '@angular/core';
import { DataService } from '../Shared/data.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { format } from 'date-fns';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-assign-interviewer',
  templateUrl: './assign-interviewer.page.html',
  styleUrls: ['./assign-interviewer.page.scss'],
})
export class AssignInterviewerPage implements OnInit {
  staffList: any[] = [];
  filteredStaff: any[] = [];
  interviews: any[] = [];
  filteredInterviews: any[] = [];
  selectedCandidate: any = { interview: {}, date: '' };
  selectedStaff: any[] = [];
  groupedInterviews: Record<string, any[]> = {};
  search: string = "";
  showIcon: boolean = true;
  showCard: boolean = true;
  navController: NavController;
  userDocument: any;

  constructor(
    private data: DataService,
    private alertController: AlertController,
    private toastController: ToastController,
    private navCtrl: NavController,
    private auth: AngularFireAuth,
    private db: AngularFirestore
  ) {
    this.getUser();
    this.navController = navCtrl;
  }

  ngOnInit() {
    this.loadStaff();
    this.loadInterviewees();
  }

  ionViewDidEnter() {
    this.getUser();
  }

  async getUser(): Promise<void> {
    const user = await this.auth.currentUser;

    if (user) {
      try {
        const querySnapshot = await this.db
          .collection('registeredStaff')
          .ref.where('email', '==', user.email)
          .get();

        if (!querySnapshot.empty) {
          this.userDocument = querySnapshot.docs[0].data();
        }
      } catch (error) {
        this.showToast('Error getting user document: ' + error);
      }
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

  dateformat(datetime: any) {
    const timeString = datetime;
    const dateObject: Date = new Date(timeString);
    const formattedDate: string = format(dateObject, 'yyyy-MM-dd HH:mm:ss');
    return formattedDate;
  }

  loadStaff() {
    this.data.getAllStaff().pipe(
      map(actions => actions.map(a => {
        const data: any = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      })),
      map(staff => staff.filter(s => s.availabilityStatus === "true")) // Filter for available staff
    ).subscribe(staff => {
      this.staffList = staff;
      this.filteredStaff = this.staffList;
    });
  }

  loadInterviewees() {
    const DateConstructor = Date;
    this.data.getAllInterviews().pipe(
      map(actions => actions.map(a => {
        const data: any = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    ).subscribe(interviews => {
      this.interviews = [];
      for (const interview of interviews) {
        const date = interview.date;
        interview.date = this.dateformat(date);
        this.interviews.push(interview);
      }
      this.interviews.sort((a, b) => {
        const dateA = new DateConstructor(a.date);
        const dateB = new DateConstructor(b.date);
        return dateA > dateB ? 1 : -1;
      });
      this.filteredInterviews = this.interviews;
      this.groupInterviewsByDate();
    });
  }

  groupInterviewsByDate() {
    this.groupedInterviews = this.filteredInterviews.reduce((acc, interview) => {
      const [date, time] = interview.date.split(' ');
      interview.datetime = time;

      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(interview);

      return acc;
    }, {} as Record<string, any[]>);
  }

  getKeys(obj: Record<string, any>): string[] {
    return Object.keys(obj);
  }

  onInterviewClick(interview: any, date: string) {
    this.selectedCandidate = { interview, date };
  }

  onInterviewerClick(staff: any) {
    if (!this.selectedStaff.includes(staff)) {
      this.selectedStaff.push(staff);
      this.showCard = false;
    } else {
      this.showToast("Already exists");
    }
  }

  deleteStaff(staff: any) {
    const index = this.selectedStaff.findIndex((s: any) => s === staff);
    if (index !== -1) {
      this.selectedStaff.splice(index, 1);
    } else {
      this.showToast("Not exists");
    }
  }

  async submitFunction() {
    const selectedStaffEmails = this.selectedStaff.map(staff => staff.email);
  
    const interviewConduct: any = {
      Interviewee: this.selectedCandidate,
      selectedStaff: this.selectedStaff,
      staffNumber: this.selectedStaff.length,
      selectedStaffEmails: selectedStaffEmails
    };
  
    this.data.submitInterview(interviewConduct, this.selectedCandidate.interview.id)
      .then(async () => {
        await Promise.all(this.selectedStaff.map(staff => {
          return this.data.updateStaffAvailability(staff.id, false);
        }));
        
        await this.data.removeInterviewee(this.selectedCandidate.interview.id);
        
        this.showToast("Interviewers assigned Successfully: " + this.selectedCandidate.interview.id);
        this.selectedStaff = [];
        this.selectedCandidate = null;
        this.showCard = true;
        this.loadInterviewees(); // Refresh the interviewee list
      })
      .catch((error) => {
        this.showToast('Error submitting interview: ' + error);
      });
  }

  filterInterviews() {
    const searchTerm = this.search.toLowerCase();
  
    this.filteredInterviews = this.interviews.filter(interview => 
      (interview.name?.toLowerCase().includes(searchTerm) || 
      interview.date.includes(searchTerm))
    );
   
    this.groupInterviewsByDate();
    if (this.filteredInterviews.length === 0) {
      this.showToast("Search name not found");
      this.loadInterviewees();
    } else {
      this.showIcon = false;
    }
  }
  
  hide() {
    this.loadInterviewees();
    this.loadStaff();
    this.showIcon = true;
  }

  filterStaff() {
    const searchTerm = this.search.toLowerCase();
   
    this.filteredStaff = this.staffList.filter(staff =>
      staff.Name?.toLowerCase().includes(searchTerm) ||
      staff.email?.toLowerCase().includes(searchTerm)
    );
    if (this.filteredStaff.length === 0) {
      this.loadStaff();
    } else {
      this.showIcon = false;
    }
  }
}
