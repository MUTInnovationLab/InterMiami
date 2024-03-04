import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
//import { Observable } from 'rxjs';

@Component({
  selector: 'app-marks',
  templateUrl: './marks.page.html',
  styleUrls: ['./marks.page.scss'],
})
export class MarksPage implements OnInit {
  interviewData: any[] = [];

  constructor(//private menuCtrl: MenuController,
    private firestore: AngularFirestore,
     private db: AngularFirestore) 
     {
      this.getScoreData();
      }
  

  ngOnInit() {
  }
  
  getScoreData() {
    this.firestore.collection('feedback').valueChanges().subscribe((data: any[]) => {
      this.interviewData = data.map(item => ({
        id: item.id,
        intervieweeName: item.intervieweeName,
        // intervieweeSurname: item.intervieweeSurname,
        emailAddress: item.emailAddress,
        score: item.score
      }));
    });
  
}}
