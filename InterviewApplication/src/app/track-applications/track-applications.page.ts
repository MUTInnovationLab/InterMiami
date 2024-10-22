import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-track-applications',
  templateUrl: './track-applications.page.html',
  styleUrls: ['./track-applications.page.scss'],
})
export class TrackApplicationsPage implements OnInit {
  userApplications: any[] = []; // Initialize as an array to hold user applications
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
        // this.loadUserApplications();
      } else {
        this.showToast('User not found');
      }
    });
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
