import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { where } from 'firebase/firestore';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
})
export class PostsPage implements OnInit {
  // Allposts: Map<string, any[]> = new Map();
  // todayDateString: string;
  // selectedOption: any;
  data: any;
  tables$: any;

  constructor(private firestore: AngularFirestore) { }

  ngOnInit() {
    this.getAllDocuments();
    console.log(this.getAllDocuments);
  }

  getAllDocuments() {
    this.firestore
      .collection('Post')
      .valueChanges()
      .subscribe((data) => {
        this.tables$ = data;
      });
  }

  formatTableDate(date: any): Date {
    if (date instanceof Date) {
      return date; // It's already a Date object
    } else if (date.toDate instanceof Function) {
      return date.toDate(); // Firestore Timestamp, convert to Date
    } else {
      // Handle other cases or return a default date
      return new Date();
    }
  }
}
