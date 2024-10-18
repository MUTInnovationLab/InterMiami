import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-track-applications',
  templateUrl: './track-applications.page.html',
  styleUrls: ['./track-applications.page.scss'],
})
export class TrackApplicationsPage implements OnInit {
  userData: any = {};
  userEmail: string | null = null;

  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.auth.currentUser.then(user => {
      if (user) {
        this.userEmail = user.email;
        this.loadUserApplication();
      } else {
        this.showToast('User not found');
      }
    });
  }

  async loadUserApplication() {
    if (!this.userEmail) {
      this.showToast('No email found for the user');
      return;
    }

    const querySnapshot = await this.db.collection('applicant-application').ref.where('email', '==', this.userEmail).get();

    if (!querySnapshot.empty) {
      const documentId = querySnapshot.docs[0].id;

      // Get the document and use the 'data()' method to access the data
      this.db.collection('applicant-application').doc(documentId).get().subscribe(snapshot => {
        if (snapshot.exists) {
          this.userData = snapshot.data(); // This is where you get the document data
        } else {
          this.showToast('Application not found');
        }
      });
    } else {
      this.showToast('Application not found');
    }
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }
}
