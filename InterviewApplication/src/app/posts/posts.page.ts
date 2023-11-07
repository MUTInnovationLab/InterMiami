import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
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
  jobfaculty:any;

  constructor(private firestore: AngularFirestore,
    private router:Router
    ) { }

  ngOnInit() {
    this.getAllDocuments();
    this.getAllDocuments2();
  }

  getAllDocuments() {
    this.firestore
      .collection('Post')
      .valueChanges()
      .subscribe((data: any[]) => {
        this.tables$ = data;
        for (const item of data) {
          console.log(item.jobfaculty);
          // Now, you can calculate the counter value based on item.jobfaculty and navigate to the "view" page
          const counterValue = item.jobfaculty + '0000001';
          // this.navigateToViewPage(counterValue);
        }
      });
  }

  navigateToViewPage(jobfaculty: string) {
    // Calculate the counter value by merging jobfaculty with 0000001
    const counterValue = jobfaculty + '0000001';

    // Navigate to the "view" page and pass the counter value as a parameter
    this.router.navigate(['/view', { counter: counterValue }]);
  }

  getAllDocuments2() {
    this.firestore
      .collection('Post')
      .valueChanges()
      .subscribe((data) => {
        this.tables$ = data;
        console.log();
      });
  }

  
}
