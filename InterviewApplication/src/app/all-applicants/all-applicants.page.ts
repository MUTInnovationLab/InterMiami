import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';



import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, QueryDocumentSnapshot } from '@angular/fire/compat/firestore';
import {  LoadingController,NavController, ToastController , AlertController} from '@ionic/angular';
import { Observable } from 'rxjs';
import { ViewAcademicRecordModalPage } from '../view-academic-record-modal/view-academic-record-modal.page';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { DeclineModalPage } from '../decline-modal/decline-modal.page';
import { ValidateDocsPage } from '../validate-docs/validate-docs.page';



@Component({
  selector: 'app-all-applicants',
  templateUrl: './all-applicants.page.html',
  styleUrls: ['./all-applicants.page.scss'],
})

export class AllApplicantsPage implements OnInit {

  tableData: any[]=[];

  userData:any;
  currentPage: number = 1;
  rowsPerPage: number = 10;
  recipient:any;
  userEmailArray: string[] = [];
  userDocument:any;
  selectedExperience: string = '';


  constructor(private http: HttpClient,private firestore: AngularFirestore, 
    private loadingController: LoadingController, 
    private navCtrl: NavController,
    private auth: AngularFireAuth,
    private toastController: ToastController,
    private alertController: AlertController,
    private navController: NavController,
    private db: AngularFirestore, private modalController: ModalController) {

      this.tableData.sort((a, b) => {
        console.log(`Sorting: ${a.tTotalExperience} vs ${b.tTotalExperience}`);
        return b.tTotalExperience - a.tTotalExperience;
      });

      this.getAllData();
      this.sortByCerticate();
     }

     filterTableData() {
      if (this.selectedExperience === '') {
        // Show all rows if no experience filter is selected
        return this.tableData;
      } else {
        // Filter rows based on the selected experience
        return this.tableData.filter(data => data.tTotalExperience >= parseInt(this.selectedExperience));
      }
    }

     onClickerr(email: string , fullName: string) {
      this.navCtrl.navigateForward(['/schedule-interview'], { queryParams: { email , fullName } });
    }


     goToView(): void {
      this.navController.navigateBack('/staffprofile');
    }
  
     getAllData() {
      this.db.collection('applicant-application', ref => ref.where('status', '==', 'pending'))
        .snapshotChanges()
        .subscribe(data => {
          this.userData = data.map(d => {
            const id = d.payload.doc.id;
            const docData = d.payload.doc.data() as any; // Cast docData as any type
            return { id, ...docData };
          });
          console.log(this.userData);
          this.tableData = this.userData;

          this.sortByGradeAverage();
          this.sortByCerticate();
        });
    }

    sortByGradeAverage() {
      // Sort the tableData array by gradeAverage in descending order
      this.tableData.sort((a, b) => b.tTotalExperience - a.tTotalExperience);
    }
    
    getQualificationValue(qualification: string): number {
      switch (qualification.toLowerCase()) {
        case 'Doctorate':
          return 1;
        case 'Masters':
          return 2;
        case 'Honors':
          return 3;
        case 'Bachelor/advanced':
          return 4;
        case 'Diploma':
          return 5;
        default:
          return 6;
      }
    }
     
    sortByCerticate(){
      this.tableData.forEach((data) => {
        data.sortValue = this.getQualificationValue(data.certicate);
      });
      
      // Sort the tableData array based on the sorting value
      this.tableData.sort((a, b) => a.sortValue - b.sortValue);

    }
    
    
    


  async openViewAcademicRecordModal(pdfUrl:any) {
    const modal = await this.modalController.create({
      component: ViewAcademicRecordModalPage,
      componentProps: {
        pdfUrl: pdfUrl
      }
    });
  
    await modal.present();
  }

  // Update the status value to "active"

  async decline(studentId: string, email: string) {

    const modal = await this.modalController.create({
      component: DeclineModalPage,
      componentProps: {
        studentId: studentId,
        email: email
      },
      cssClass: 'modal-ion-content' // Add your desired CSS class here
    });
    
    return await modal.present();
    
  }

  approve(data: any, applicantId: string, email: string) {
    const updatedStatus = 'active';
 
    this.db.collection('applicant-application').doc(applicantId).update({ status: updatedStatus })
      .then(() => {
        console.log('Approved!!!');
        this.showToast('Approved!!!');
        this.navCtrl.navigateForward('/schedule-interview', {
          queryParams: { data: data, source: 'cards' },
        });
        // Navigate to the next page and pass data using queryParams
        
      

        this.sendApproveNotification(email); // Pass the email to sendDeclineNotification method
      })
      .catch(error => {
        console.error('Error updating status:', error);
      });
  }


  sendApproveNotification(email: string) {
    const url = 'http://localhost/Co-op-project/co-operation/src/send_approve_notification.php';
    const recipient = encodeURIComponent(email);
    const subject = encodeURIComponent('Application Approval Notice');
    const body = encodeURIComponent('Thank you for submitting your cv, it is now on our database. We will forward it to companies when relevant opportunities arises.');

    // Include the parameters in the query string
    const query = `recipient=${recipient}&subject=${subject}&body=${body}`;
 
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
 
    this.http.get(url + '?' + query, { headers: headers })
      .subscribe(
        response => {
          console.log(response + ' (notification)');
          // Handle the response from the PHP file
        },
        error => {
          console.error('Error:', error + ' (notification)');
        }
      );
  }



  
  previousPage() {
    this.currentPage--;
  }
  
  nextPage() {
    this.currentPage++;
  }
  
  totalPages(): number {
    return Math.ceil(this.tableData.length / this.rowsPerPage);
  }

  // Update the status value to "active"
  /*approve(studentId: string) {
 
    const updatedStatus = 'active';
    
    // Make the update in the database
    this.db.collection('studentProfile').doc(studentId).update({ status: updatedStatus })
      .then(() => {
        console.log('Successfully Updated');
        this.showToast('Successfully updated');
      })
      .catch(error => {
        console.error('Error updating status:', error);
      });
  }*/
  
  
  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Duration in milliseconds
      position: 'top' // Toast position: 'top', 'bottom', 'middle'
    });
    toast.present();
  }
  

  ngOnInit() {
    
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

async goToScore(): Promise<void> {
  try {
    await this.getUser();

    if (this.userDocument && this.userDocument.role && this.userDocument.role.employment === 'on') {
      // Navigate to the desired page
      this.navController.navigateForward('/score-capture');
    } else {
      const toast = await this.toastController.create({
        message: 'Unauthorized user.',
        duration: 2000,
        position: 'top'
      });
      toast.present();
    }
  } catch (error) {
    console.error('Error navigating to score capture Page:', error);
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
    console.error('Error navigating All Applicants Page:', error);
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

    if (this.userDocument && this.userDocument.role && this.userDocument.role.statistic === 'on') {
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

    if (this.userDocument && this.userDocument.role && this.userDocument.role.wil === 'on') {
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

    if (this.userDocument && this.userDocument.role && this.userDocument.role.wil === 'on') {
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
    console.error('Error navigating to Scheduled interviews Page:', error);
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
            this.navController.navigateForward("/applicant-login");
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
  this.navController.navigateBack('/dashboard');
}

   





async openDeclineModal() {
  const modal = await this.modalController.create({
    component: DeclineModalPage,
    componentProps: {
    
    }
  });
  return await modal.present();
}


  async openValidateModal(academicRecordURl:any,cvUrl:any,idURL:any,letterURL:any){

console.log(academicRecordURl);
  const modal = await this.modalController.create({
    component: ValidateDocsPage,
    componentProps: {
    
      academicRecordURl:academicRecordURl,
      cvUrl:cvUrl,
      idURL:idURL,
      letterURL:letterURL

    }
  });
  return await modal.present();



}

}
  
