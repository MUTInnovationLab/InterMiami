import { Component, OnInit } from '@angular/core';
interface Interview {
  name: string;
  datetime: string;
}
@Component({
  selector: 'app-interview-list',
  templateUrl: './interview-list.page.html',
  styleUrls: ['./interview-list.page.scss'],
})
export class InterviewListPage implements OnInit {

  interviews: Interview[] = [
    { name: 'Interview 1', datetime: '2024-05-20 10:15:00' },
    { name: 'Interview 2', datetime: '2024-05-20 14:00:00' },
    { name: 'Interview 3', datetime: '2024-05-21 09:30:00' },
    // more interviews
  ];
  groupedInterviews: Record<string, Interview[]> = {};

  constructor() { }

  ngOnInit() {
    this.groupInterviewsByDate();
  }

  groupInterviewsByDate() {
    this.groupedInterviews = this.interviews.reduce((acc, interview) => {
      const date = interview.datetime.split(' ')[0]; // Extract the date part
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(interview);
      return acc;
    }, {} as Record<string, Interview[]>);
  }

  getKeys(obj: Record<string, any>): string[] {
    return Object.keys(obj);
  }
  
}