import { Component, OnInit } from '@angular/core';
import { DataService } from '../Shared/data.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-display',
  templateUrl: './display.page.html',
  styleUrls: ['./display.page.scss'],
})
export class DisplayPage implements OnInit {

  assignedInterviewers: any[] = [];

  constructor(private data: DataService) {}

  ngOnInit(): void {
    this.loadAssignedInterviewers();
  }

  // Method to fetch assigned interviewers
  loadAssignedInterviewers() {
    this.data.getAllInterviewes().pipe(
      map(actions => actions.map((a: { payload: { doc: { data: () => any; }; }; }) => {
        const data: any = a.payload.doc.data();
        return data.selectedStaff;
      }))
    ).subscribe(assignedInterviewers => {
      this.assignedInterviewers = assignedInterviewers.flat();
    });
  }

}
