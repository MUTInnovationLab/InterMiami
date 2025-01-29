import { Component } from '@angular/core';
import { ToastController, NavController, AlertController, LoadingController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Params, Router } from '@angular/router';
import emailjs from 'emailjs-com';


@Component({
  selector: 'app-schedule-interview',
  templateUrl: './schedule-interview.page.html',
  styleUrls: ['./schedule-interview.page.scss'],
})
export class ScheduleInterviewPage {

  selectedPosition: any = '';
  int_id:any; // Unique interview ID
  datecode: any;
  code_job: any;
  name:any;
  surname:any;
  email: any;
  position: any;
  date:any;
  status='Waiting';
  emailError:any;
  emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; 
  toast: any;
  fullName: any;
  data: any;


  constructor( private db: AngularFirestore,private router:Router,private toastController: ToastController,
    private alertController: AlertController,private loadingController: LoadingController,
     public navCtrl: NavController, private auth: AngularFireAuth,
     private route: ActivatedRoute
     ) {}

     ngOnInit() {
      this.route.queryParams.subscribe((params: Params) => {
        if (params && params['data']) {
          this.data = params['data'];
          this.populateFormFields();
        }
      });
    }
    
    populateFormFields() {
      this.int_id = this.generateUniqueId();
      this.email = this.data.personalDetails.email;
      this.name = this.data.personalDetails.fullName;
      this.surname = this.data.personalDetails.lastName;
    
      // Get all the unique positions
      this.position = this.data.applications[0].positions.map((p: { codeTitles: any; }) => p.codeTitles);
      this.position = Array.from(new Set(this.position.flat()));
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
            
            }
          }, {
            text: 'Confirm',
            handler: () => {
             
              
              this.auth.signOut().then(() => {
                this.navCtrl.navigateForward("/applicant-login");
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
      this.navCtrl.navigateBack('/dashboard');
    }

   
  
    generateUniqueId(): string {
      const randomDigits = Math.floor(Math.random() * 1000000000000).toString(); 
      return randomDigits;
    }

    checkIfDocumentExist = false;

 
    async cancel() {
      const alert = await this.alertController.create({
        header: 'Confirmation',
        message: 'Are you sure you want to cancel scheduling the interview?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              // No action on cancel
            }
          },
          {
            text: 'Yes',
            handler: async () => {
              try {
                const updatedStatus = 'pending'; // Set the status to "pending"
                this.data.personalDetails.status = updatedStatus; // Update local userApp object
    
                // Query the Firestore collection to find the document by email
                const querySnapshot = await this.db.collection('applicant-application')
                  .ref
                  .where('personalDetails.email', '==', this.email)
                  .get();
    
                if (!querySnapshot.empty) {
                  // Update the status for the matching document
                  const docRef = querySnapshot.docs[0].ref; // Assuming email is unique
                  await docRef.update({ 'personalDetails.status': updatedStatus });
    
                  this.showToast('Application status updated to pending!');
                  this.router.navigate(['/all-applications']);
                } else {
                  this.showToast('Error: No matching application found!');
                }
              } catch (error) {
                console.error('Error updating application status:', error);
                this.showToast('Failed to update application status.');
              }
            }
          }
        ]
      });
    
      await alert.present();
    }
    
    
    async showToast(message: string) {
      const toast = await this.toastController.create({
        message: message,
        duration: 2000, // Duration in milliseconds
        position: 'top' // Toast position: 'top', 'bottom', 'middle'
      });
      toast.present();
    }

    async submit() {
      // Validate email
      if (!this.emailRegex.test(this.email)) {
        const toast = await this.toastController.create({
          message: "Please enter a valid email address.",
          duration: 2000,
          position: 'top'
        });
        toast.present();
        return;
      }
    
      // Validate date
      if (!this.date) { // Check if date is not chosen
        const toast = await this.toastController.create({
          message: "Please choose a date and time.",
          duration: 2000,
          position: 'top'
        });
        toast.present();
        return;
      }
    
      // Validate ID length
      if (this.int_id.toString().length !== 12) {
        const toast = await this.toastController.create({
          message: 'ID must be exactly 12 digits, Refresh the page.',
          duration: 2000,
          position: 'top',
          color: 'danger'
        });
        toast.present();
        return;
      }
    
      // Show loader
      const loader = await this.loadingController.create({
        message: 'Scheduling',
        cssClass: 'custom-loader-class'
      });
    
      await loader.present();
    
      // Simulate a delay
      const delay = 2000;
      await new Promise(resolve => setTimeout(resolve, delay));
    
      try {
        const docId = this.name + this.email + this.date;

        // Add record to Firestore with the custom document ID
        await this.db.collection('Interviewees').doc(docId).set({
          int_id: this.int_id,
          name: this.name,
          email: this.email,
          date: this.date,
          position: this.position,
          status: this.status
        });
    
        await loader.dismiss();
        alert("Recorded");
    
        // Sending email (uncomment if needed)
        const emailParams = {
          name: this.name,
          surname: this.surname,
          email_to: this.email,
          from_email: 'thandekan736@gmail.com',
          subject: 'Interview Invitation from MUTInnovation Lab',
          message: 'You are invited for an interview on ' + this.date
        };
    
        await emailjs.send('interviewEmailsAD', 'template_7x4kjte', emailParams, 'TrFF8ofl4gbJlOhzB');
        this.showToast('Email successfully sent');
        alert('Email successfully sent');
        this.router.navigate(['/dashboard']);
      } catch (error) {
        this.showToast('Error: ' + error);
        await loader.dismiss();
      }
    }
  }