import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { ReactiveFormsModule } from '@angular/forms';
import {   ToastController , AlertController} from '@ionic/angular';

import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.page.html',
  styleUrls: ['./add-user.page.scss'],
})
export class AddUserPage implements OnInit {
  nameError :any;
  positionError :any;
  staffError : any;
  emailError: any;
  emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  name:any;
  email:any;
  position:any;
  staffNumber:any;

  userDocument:any;

  navController: NavController;

  
  role = {
    history: 'off',
    score: 'off',
    allApplicants: 'off',
    addUser: 'off',
    marks: 'off',
    upcomingInterviews: 'off',
    allUsers: 'off',
    scheduleInterview: 'off'
  };

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private db: AngularFirestore,
    private loadingController: LoadingController,
    private auth: AngularFireAuth,
    private navCtrl: NavController
  ) {
    this.navController = navCtrl;
  }

  
  goToView(): void {
    this.navController.navigateBack('/staffprofile');
  }


  ngOnInit() {
    
  }

  // Getter functions to access form control values easily in the template
 

  getAdduserValue(event: any) {
    const toggleValue = event.target.checked ? 'on' : 'off';
    this.role.addUser = toggleValue;
  }

  getHistoryValue(event: any) {
    const toggleValue = event.target.checked ? 'on' : 'off';
    this.role.history = toggleValue;
  }

  getScoreValue(event: any) {
    const toggleValue = event.target.checked ? 'on' : 'off';
    this.role.score = toggleValue;
  }

  getMarksValue(event: any) {
    const toggleValue = event.target.checked ? 'on' : 'off';
    this.role.marks = toggleValue;
  }

  getUpcomingValue(event: any) {
    const toggleValue = event.target.checked ? 'on' : 'off';
    this.role. upcomingInterviews = toggleValue;
    console.log(this.role);
  }
  getApplicantsValue(event: any) {
    const toggleValue = event.target.checked ? 'on' : 'off';
    this.role.allApplicants = toggleValue;
    console.log(this.role);
  }
  getAllUsersValue(event: any) {
    const toggleValue = event.target.checked ? 'on' : 'off';
    this.role.allUsers = toggleValue;
    console.log(this.role);
  }
  getScheduleInterviewValue(event: any) {
    const toggleValue = event.target.checked ? 'on' : 'off';
    this.role.scheduleInterview = toggleValue;
    console.log(this.role);
  }

  goToStaffProfile(): void {
    this.navController.navigateBack('/staffprofile');
  }
  
  
  async Validation() {
    // Check if the specific role is selected
    if (
      this.role.history === 'off' &&
      this.role.score === 'off' &&
      this.role.allApplicants === 'off' &&
      this.role.addUser === 'off' &&
      this.role.marks === 'off' &&
      this.role.upcomingInterviews === 'off' &&
      this.role.allUsers === 'off' &&
      this.role.scheduleInterview === 'off'
    ) {
      alert('Please select at least one role.');
      return;
    }
  
    // Proceed with other validation checks
    this.emailError = null;
    this.staffError = null;
    this.positionError = null;
    this.nameError = null;
  
    if (!this.name) {
      this.nameError = 'Please enter name.';
      alert('Please enter name');
      return;
    }
  
    if (!this.email) {
      this.emailError = 'Please enter email.';
      alert('Please enter email');
      return;
    }
  
    if (!this.emailRegex.test(this.email)) {
      this.emailError = 'Please enter a valid email Address.';
      alert('please enter a valid Address.');
      return;
    }
  
    if (!this.position) {
      this.positionError = 'Please enter position.';
      alert('Please enter position.');
      return;
    }
  
    if (!this.staffNumber) {
      this.staffError = 'Please enter staff number.';
      alert('Please enter staff number.');
      return;
    }
  
    const loader = await this.loadingController.create({
      message: 'Assigning',
      cssClass: 'custom-loader-class'
    });
    await loader.present();
  
   
  
   
    this.auth.createUserWithEmailAndPassword(this.email, this.staffNumber)
    .then(userCredential => {
      if (userCredential.user) {
   
      this.db.collection('registeredStaff').add({
         Name:this.name,
         email:this.email,
         staffNumber:this.staffNumber,
         position:this.position,
         role:this.role
  
      
      }).then(() => {
        loader.dismiss();
        alert("Staff registered successfully");
        // Clear the field values
        this.name = '';
        this.email = '';
        this.position = '';
        this.staffNumber = ''; 
  
      }).catch((error:any) => {
        loader.dismiss();
        const errorMessage = error.message;
        alert(errorMessage);
      });
    } else {
      loader.dismiss();
      alert('User not found');
    }
  }).catch((error) => {
    loader.dismiss();
  });


  }








updateUser() {
  const email = this.email; // Get the email from the input field

  this.db.collection('registeredStaff').ref.where('email', '==', email).get()
    .then((querySnapshot) => {
      const typedSnapshot = querySnapshot as firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>;

      if (typedSnapshot.empty) {
        alert('User not found');
        return;
      }

      const documentId = typedSnapshot.docs[0].id;

      this.db.collection('registeredStaff').doc(documentId).update({
        Name: this.name,
        email: this.email,
        staffNumber: this.staffNumber,
        position: this.position,
        role: this.role
      })
      .then(() => {
        alert('User updated successfully');
      })
      .catch((error: any) => {
        const errorMessage = error.message;
        alert(errorMessage);
      });
    })
    .catch((error: any) => {
      const errorMessage = error.message;
      alert(errorMessage);
    });
}



deleteUser() {
  const email = this.email; // Get the email from the input field

  this.db.collection('registeredStaff').ref.where('email', '==', email).get()
    .then((querySnapshot) => {
      const typedSnapshot = querySnapshot as firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>;

      if (typedSnapshot.empty) {
        alert('User not found');
        return;
      }

      const documentId = typedSnapshot.docs[0].id;

      this.db.collection('registeredStaff').doc(documentId).delete()
        .then(() => {
          alert('User deleted successfully');
        })
        .catch((error: any) => {
          const errorMessage = error.message;
          alert(errorMessage);
        });
    })
    .catch((error: any) => {
      const errorMessage = error.message;
      alert(errorMessage);
    });
}








//Previlages

ionViewDidEnter() {
  this.getUser();
}

async getUser(): Promise<void> {
  const user = await this.auth.currentUser;

  if (user) {
    try {
      const querySnapshot = await this.db
        .collection('registeredStaff')
        .ref.where('email', '==', user.email)
        .get();

      if (!querySnapshot.empty) {
        this.userDocument = querySnapshot.docs[0].data();
        console.log(this.userDocument);
      }
    } catch (error) {
      console.error('Error getting user document:', error);
    }
  }
}





async goToAllUsers(): Promise<void> {
  try {
    await this.getUser();

    if (this.userDocument && this.userDocument.role && this.userDocument.role.allUsers === 'on') {
      // Navigate to the desired page
      this.navController.navigateForward('/all-users');
    } else {
      const toast = await this.toastController.create({
        message: 'Unauthorized user.',
        duration: 2000,
        position: 'top'
      });
      toast.present();
    }
  } catch (error) {
    console.error('Error navigating to All Users Page:', error);
  }
}


async goToAllApplicants(): Promise<void> {
  try {
    await this.getUser();

    if (this.userDocument && this.userDocument.role && this.userDocument.role.validation === 'on') {
      // Navigate to the desired page
      this.navController.navigateForward('/all-applicants');
    } else {
      const toast = await this.toastController.create({
        message: 'Unauthorized user.',
        duration: 2000,
        position: 'top'
      });
      toast.present();
    }
  } catch (error) {
    console.error('Error navigating to All Applicants Page:', error);
  }
}

async goToHistory(): Promise<void> {
  try {
    await this.getUser();

    if (this.userDocument && this.userDocument.role && this.userDocument.role.history === 'on') {
      // Navigate to the desired page
      this.navController.navigateForward('/history');
    } else {
      const toast = await this.toastController.create({
        message: 'Unauthorized user.',
        duration: 2000,
        position: 'top'
      });
      toast.present();
    }
  } catch (error) {
    console.error('Error navigating to History Page:', error);
  }
}

async  goToStaff(): Promise<void> {
  try {
    await this.getUser();

    if (this.userDocument && this.userDocument.role && this.userDocument.role.allUsers === 'on') {
      // Navigate to the desired page
      this.navController.navigateForward('/all-users');
    } else {
      const toast = await this.toastController.create({
        message: 'Unauthorized user.',
        duration: 2000,
        position: 'top'
      });
      toast.present();
    }
  } catch (error) {
    console.error('Error navigating to All Staff members Page:', error);
  }
}

async goToGraded(): Promise<void> {

  try {
    await this.getUser();

    if (this.userDocument && this.userDocument.role && this.userDocument.role.marks === 'on') {
      // Navigate to the desired page
      this.navController.navigateForward('/marks');
    } else {
      const toast = await this.toastController.create({
        message: 'Unauthorized user.',
        duration: 2000,
        position: 'top'
      });
      toast.present();
    }
  } catch (error) {
    console.error('Error navigating to Graded interviews Page:', error);
  }
}

async goToScheduled(): Promise<void> {

  try {
    await this.getUser();

    if (this.userDocument && this.userDocument.role && this.userDocument.role.upcomingInterviews === 'on') {
      // Navigate to the desired page
      this.navController.navigateForward('/scheduled-interviews');
    } else {
      const toast = await this.toastController.create({
        message: 'Unauthorized user.',
        duration: 2000,
        position: 'top'
      });
      toast.present();
    }
  } catch (error) {
    console.error('Error navigating to Scheduled interviews Page:', error);
  }
}

async goToScheduleInterview(): Promise<void> {

  try {
    await this.getUser();

    if (this.userDocument && this.userDocument.role && this.userDocument.role.scheduleInterview === 'on') {
      // Navigate to the desired page
      this.navController.navigateForward('/schedule-interviews');
    } else {
      const toast = await this.toastController.create({
        message: 'Unauthorized user.',
        duration: 2000,
        position: 'top'
      });
      toast.present();
    }
  } catch (error) {
    console.error('Error navigating to Schedule interview Page:', error);
  }
}


goToMenuPage(): void {
  this.navController.navigateForward('/dashboard').then(() => {
    window.location.reload();
  });
}

async presentConfirmationAlert() {
  const alert = await this.alertController.create({
    header: 'Confirmation',
    message: 'Are you sure you want to SIGN OUT?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
       cssClass: 'my-custom-alert',
        handler: () => {
          console.log('Confirmation canceled');
        }
      }, {
        text: 'Confirm',
        handler: () => {
         
          
          this.auth.signOut().then(() => {
            this.navController.navigateForward("/sign-in");
            this.presentToast()
      
      
          }).catch((error) => {
          
          });



        }
      }
    ]
  });
  await alert.present();
}

async presentToast() {
  const toast = await this.toastController.create({
    message: 'SIGNED OUT!',
    duration: 1500,
    position: 'top',
  
  });

  await toast.present();
}

goToHomePage(): void {
  this.navController.navigateBack('/home');
}


}
  

