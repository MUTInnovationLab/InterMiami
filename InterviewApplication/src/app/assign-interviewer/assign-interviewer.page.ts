// import { Component, OnInit } from '@angular/core';
// import { DataService } from '../Shared/data.service';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { daysToWeeks, format } from 'date-fns';

// @Component({
//   selector: 'app-assign-interviewer',
//   templateUrl: './assign-interviewer.page.html',
//   styleUrls: ['./assign-interviewer.page.scss'],
// })
// export class AssignInterviewerPage implements OnInit {

//   staffList: any[] = [];
//   interviews: any[] = [];
//   filteredInterviews: any[] = []; // Add a new array to hold filtered interviews
//   selectedCandidate: any = { interview: {}, date: '' };
//   selectedStaff: any[] = [];
//   groupedInterviews: Record<string, any[]> = {};
//   search: string = "";

//   showCard: boolean = true; // Variable to control card visibility

//   constructor(private data: DataService) { }

//   ngOnInit() {
//     this.loadStaff();
//     this.loadInterviewees();
//   }

//   dateformat(datetime: any) {
//     const timeString = datetime;
//     const dateObject: Date = new Date(timeString);

//     const formattedDate: string = format(dateObject, 'yyyy-MM-dd HH:mm:ss');
//     return formattedDate;
//   }

//   loadStaff() {
//     this.data.getAllStaff().pipe(
//       map(actions => actions.map(a => {
//         const data: any = a.payload.doc.data();
//         const id = a.payload.doc.id;
//         return { id, ...data };
//       }))
//     ).subscribe(staff => {
//       this.staffList = staff;
//     });
//   }

//   loadInterviewees() {
//     let count = 0;
//     const DateConstructor = Date;
//     this.data.getAllInterviews().pipe(
//       map(actions => actions.map(a => {
//         const data: any = a.payload.doc.data();
//         const id = a.payload.doc.id;
//         return { id, ...data };
//       }))
//     ).subscribe(interviews => {
//       this.interviews = [];
//       for (const interview of interviews) {
//         const date = interview.date;
//         interview.date = this.dateformat(date);
//         this.interviews.push(interview);
//         count++;
//       }
//       this.interviews.sort((a, b) => {
//         const dateA = new DateConstructor(a.date);
//         const dateB = new DateConstructor(b.date);
//         if (dateA < dateB) {
//           return -1;
//         }
//         if (dateA > dateB) {
//           return 1;
//         }
//         return 0;
//       });

//       this.filteredInterviews = this.interviews; // Initialize filteredInterviews
//       this.groupInterviewsByDate();
//     });
//   }

//   groupInterviewsByDate() {
//     this.groupedInterviews = this.filteredInterviews.reduce((acc, interview) => {
//       const [date, time] = interview.date.split(' ');
//       interview.datetime = time; // Assign the time part to a new property

//       if (!acc[date]) {
//         acc[date] = [];
//       }
//       acc[date].push(interview);

//       return acc;
//     }, {} as Record<string, any[]>);
//   }

//   getKeys(obj: Record<string, any>): string[] {
//     return Object.keys(obj);
//   }

//   onInterviewClick(interview: any, date: string) {
//     this.selectedCandidate = { interview, date };
//   }

//   onInterviewerClick(staff: any) {
//     if (!this.selectedStaff.includes(staff)) {
//       this.selectedStaff.push(staff);
//       this.showCard = false;
//     }
//     else {
//       alert("Already exists");
//     }
//   }

//   deleteStaff(staff: any) {
//     const index = this.selectedStaff.findIndex((s: any) => s === staff);
//     if (index !== -1) {
//       this.selectedStaff.splice(index, 1);
//     }
//     else {
//       alert("Not exists");
//     }
//   }

//   submitFunction() {
//     const interviewConduct: any = {
//       Interviewee: this.selectedCandidate,
//       selectedStaff: this.selectedStaff
//     };

//     this.data.submitInterview(interviewConduct, this.selectedCandidate.interview.id)
//       .then(() => {
//         alert("Interviewers assigned Successfully" + this.selectedCandidate.interview.id);
//         this.selectedStaff = [];
//         this.selectedCandidate = null;
//         this.showCard = true;
//       })
//       .catch((error) => {
//         console.error('Error submitting interview: ', error);
//         alert("Assignation was unsuccessfully");
//       });
//   }

//   filterInterviews() {
//     const searchTerm = this.search.toLowerCase();
//     alert(searchTerm);
//     this.filteredInterviews = this.interviews.filter(interview => 
//       interview.candidateName.toLowerCase().includes(searchTerm) ||
//       interview.date.includes(searchTerm)
//     );
//     alert(JSON.stringify(this.filteredInterviews));
//     this.groupInterviewsByDate();
//   }
// }
import { Component, OnInit } from '@angular/core';
import { DataService } from '../Shared/data.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { daysToWeeks, format } from 'date-fns';

@Component({
  selector: 'app-assign-interviewer',
  templateUrl: './assign-interviewer.page.html',
  styleUrls: ['./assign-interviewer.page.scss'],
})
export class AssignInterviewerPage implements OnInit {

  staffList: any[] = [];
  filteredStaff: any[] = [];
  interviews: any[] = [];
  filteredInterviews: any[] = []; // Add a new array to hold filtered interviews
  selectedCandidate: any = { interview: {}, date: '' };
  selectedStaff: any[] = [];
  groupedInterviews: Record<string, any[]> = {};
  search: string = "";
  showIcon:boolean = true;
  showCard: boolean = true; // Variable to control card visibility

  constructor(private data: DataService) { }

  ngOnInit() {
    this.loadStaff();
    this.loadInterviewees();
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
      }))
    ).subscribe(staff => {
      this.staffList = staff;
      this.filteredStaff = this.staffList;
    });
  }

  loadInterviewees() {
    let count = 0;
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
        count++;
      }
      this.interviews.sort((a, b) => {
        const dateA = new DateConstructor(a.date);
        const dateB = new DateConstructor(b.date);
        if (dateA < dateB) {
          return -1;
        }
        if (dateA > dateB) {
          return 1;
        }
        return 0;
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
    }
    else {
      alert("Already exists");
    }
  }

  deleteStaff(staff: any) {
    const index = this.selectedStaff.findIndex((s: any) => s === staff);
    if (index !== -1) {
      this.selectedStaff.splice(index, 1);
    }
    else {
      alert("Not exists");
    }
  }

  submitFunction() {
    const interviewConduct: any = {
      Interviewee: this.selectedCandidate,
      selectedStaff: this.selectedStaff
    };

    this.data.submitInterview(interviewConduct, this.selectedCandidate.interview.id)
      .then(() => {
        alert("Interviewers assigned Successfully" + this.selectedCandidate.interview.id);
        this.selectedStaff = [];
        this.selectedCandidate = null;
        this.showCard = true;
      })
      .catch((error) => {
        console.error('Error submitting interview: ', error);
        alert("Assignation was unsuccessfully");
      });
  }

  filterInterviews() {
    const searchTerm = this.search.toLowerCase();
    alert(searchTerm);
    alert(JSON.stringify(this.interviews));
    this.filteredInterviews = this.interviews.filter(interview => 
      (interview.name?.toLowerCase().includes(searchTerm) || 
      interview.date.includes(searchTerm))
    );
    alert(JSON.stringify(this.filteredInterviews));
    this.groupInterviewsByDate();
    if (this.filteredInterviews.length === 0) {
      alert("Search name not found");
      this.loadInterviewees();
    } else {
      this.showIcon = false;
    }
  }
  
  hide(){
    this.loadInterviewees();
    this.showIcon=true;
  }

  filterStaff() {
    const searchTerm = this.search.toLowerCase();
    alert(searchTerm);
    this.filteredStaff = this.staffList.filter(staff =>
      staff.Name?.toLowerCase().includes(searchTerm) ||
      staff.email?.toLowerCase().includes(searchTerm)
    );
    if (this.filteredStaff.length === 0) {
      this.loadStaff();
      alert("-----------------------------------")
    } else {
      this.showIcon = false;
    }
    
  }
}
