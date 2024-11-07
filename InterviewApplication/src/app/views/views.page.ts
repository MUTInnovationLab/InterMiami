import { Component, OnInit } from '@angular/core';
import { AngularFirestore, QuerySnapshot } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../Shared/auth.service';

interface PersonalDetails {
  fullName: string;
  lastName: string;
  gender: string;
  dob: string;
  email: string;
  phone: string;
  status: string;
}

interface Application {
  personalDetails: PersonalDetails;
  allDocumentsUrl: string[];
}

@Component({
  selector: 'app-views',
  templateUrl: './views.page.html',
  styleUrls: ['./views.page.scss'],
})
export class ViewsPage implements OnInit {
  currentUser: any;
  userProfile: any = null;
  isEditing: boolean = false;
  editableProfile: any = {};

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  async loadUserProfile() {
    const loader = await this.loadingController.create({
      message: 'Loading profile...',
    });
    await loader.present();

    try {
      const email = this.authService.getCurrentUserEmail();
      if (email) {
        const userRef = this.firestore.collection('applicant-application').doc(email);
        const doc = await userRef.get().toPromise();
        
        if (doc?.exists) {
          this.userProfile = doc.data();
          this.editableProfile = JSON.parse(JSON.stringify(this.userProfile));
        } else {
          this.showToast('Profile not found');
        }
      }
    } catch (error) {
      this.showToast('Error loading profile: ' + error);
    } finally {
      loader.dismiss();
    }
  }

  async updateProfile() {
    const alert = await this.alertController.create({
      header: 'Confirm Update',
      message: 'Are you sure you want to update your profile?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Update',
          handler: async () => {
            const loader = await this.loadingController.create({
              message: 'Updating profile...'
            });
            await loader.present();

            try {
              const email = this.authService.getCurrentUserEmail();
              if (email) {
                await this.firestore.collection('applicant-application')
                  .doc(email)
                  .update(this.editableProfile);
                
                this.userProfile = JSON.parse(JSON.stringify(this.editableProfile));
                this.isEditing = false;
                this.showToast('Profile updated successfully');
              }
            } catch (error) {
              this.showToast('Error updating profile: ' + error);
            } finally {
              loader.dismiss();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteProfile() {
    const alert = await this.alertController.create({
      header: 'Confirm Deletion',
      message: 'Are you sure you want to delete your profile? This action cannot be undone.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: async () => {
            const loader = await this.loadingController.create({
              message: 'Deleting profile...'
            });
            await loader.present();

            try {
              const email = this.authService.getCurrentUserEmail();
              if (email) {
                await this.firestore.collection('applicant-application')
                  .doc(email)
                  .delete();
                
                this.userProfile = null;
                this.editableProfile = {};
                this.showToast('Profile deleted successfully');
              }
            } catch (error) {
              this.showToast('Error deleting profile: ' + error);
            } finally {
              loader.dismiss();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.editableProfile = JSON.parse(JSON.stringify(this.userProfile));
    }
  }

  cancelEdit() {
    this.isEditing = false;
    this.editableProfile = JSON.parse(JSON.stringify(this.userProfile));
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
}