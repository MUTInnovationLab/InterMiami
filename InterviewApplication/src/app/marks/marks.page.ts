import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
//import { Observable } from 'rxjs';

@Component({
  selector: 'app-marks',
  templateUrl: './marks.page.html',
  styleUrls: ['./marks.page.scss'],
})
export class MarksPage implements OnInit {
  interviewData: any[] = []; // Ensure interviewData is initialized

  constructor(
    private firestore: AngularFirestore,
    private db: AngularFirestore
  ) {
    this.getScoreData();
  }

  ngOnInit() {}

  getScoreData() {
    this.firestore.collection('feedback').valueChanges().subscribe((data: any[]) => {
        this.interviewData = data.map(item => ({
            int_id: item.stringData.int_id,
            name: item.stringData.name,
            email: item.stringData.email,
            status: item.stringData.Status,
            total: item.numericData.total
        }));
           });
}
}
