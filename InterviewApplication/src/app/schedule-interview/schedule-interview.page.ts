import { Component } from '@angular/core';
import { ToastController, NavController, AlertController, LoadingController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Params, Router } from '@angular/router';
import emailjs from 'emailjs-com';
//import{EmailComposer} from '@ionic-native/email-composer/ngx';
//import { EmailComposerOptions } from '@ionic-native/email-composer';
//import { IonicNativePlugin } from '@ionic-native/core';

@Component({
  selector: 'app-schedule-interview',
  templateUrl: './schedule-interview.page.html',
  styleUrls: ['./schedule-interview.page.scss'],
})
export class ScheduleInterviewPage {

  // Initialize properties with default values
  int_id:any; // Unique interview ID
  datecode: any;
  code_job: any;
  name:any;
  surname:any;
  email: any;
  date:any;
  status='Waiting';
  emailError:any;
  emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; 
  toast: any;
  fullName: any;
  data: any;
  tables$: any;
  oneDocData: any;
  


    counter: number = 1;

    counters: number = 0;

    
  constructor( private db: AngularFirestore,private router:Router,private toastController: ToastController,
    private alertController: AlertController,private loadingController: LoadingController,
     public navCtrl: NavController, private auth: AngularFireAuth,
     private route: ActivatedRoute
     ) {}

     ngOnInit() {

      this.route.queryParams.subscribe((params:Params) => {
        if (params && params['email']) {
          this.email = params['email'];
          // Fetch data for the specified email
          this.getOneDocumentData();
        }
      });
      // Retrieve the data passed from the previous page
      //const data = this.navCtrl.get('queryParams');
      
      // Now you can use the 'data' object in this component as needed
      this.getOneDocumentData;
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



    getOneDocumentData() {
      if (this.email) {
        this.db
          .collection('applicant-application', (ref) =>
            ref.where('email', '==', this.email)
          )
          .valueChanges()
          .subscribe((data: any[]) => {
            if (data && data.length > 0) {
              const docData = data[0];
              this.oneDocData = docData;
              this.email = docData.email;
              this.name = docData.fullName;
              this.surname = docData.surname;
              this.code_job = docData.code_job;
  
              const currentDate = new Date();
              const day = currentDate.getDate().toString().padStart(2, '0');
              const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
              const year = currentDate.getFullYear().toString();
              const hours = currentDate.getHours().toString().padStart(2, '0');
              const minutes = currentDate.getMinutes().toString().padStart(2, '0');
              const seconds = currentDate.getSeconds().toString().padStart(2, '0');
              const milliseconds = currentDate.getMilliseconds().toString().padStart(3, '0');
              const formattedDate = `${hours}${minutes}${seconds}${milliseconds}${year}`;
  
              // Generate a unique ID
              const uniqueId = this.generateUniqueId();
  
              // Combine date and unique ID to create a unique code
              this.datecode = `${uniqueId}`;
              this.int_id = this.datecode;
  
              // Increment the counter for the next unique ID
              this.counters++;
            }
          });
      }
    }
  
    generateUniqueId(): string {
      const randomDigits = Math.floor(Math.random() * 1000000000000).toString(); // Generate random 12-digit number
      return randomDigits;
    }

    checkIfDocumentExist = false;

    private formatCounter(counter: number): string {
      return counter.toString().padStart(3, '0');
    }

    getAllDocuments() 
    {
      this.db
        .collection('applicant-application')
        .valueChanges()
        .subscribe((data:any) => {
          this.tables$ = data;
        });
    }

    getPasedData() {
      this.route.queryParams.subscribe((params: Params) => {
        if (params && params['userData']) {
          // Use the correct query parameter name (userData) to extract the data
          const userData = params['userData'];
         
  
          // Assuming email is a key in the userData object, you can extract it like this:
          this.email = userData.email;
          
          // Now call the getOneDocumentData method to fetch the specific document
          this.getOneDocumentData();
        }
      });
    }

    getPassedData() {
      this.route.queryParams.subscribe((params: Params) => {
        if (params && params['userData']) {
          // Assuming you passed 'userData' as the query parameter
          const userData = params['userData'];
          this.email = userData.email; // Extract the email from userData (adjust this according to your data structure)
        
          this.getOneDocumentData();
        }
      });
    }

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
              
            }
          }, {
            text: 'Yes',
            handler: () => {
              
              // Navigate back to the dashboard
              this.router.navigate(['/all-applicants']);
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
        // Add record to Firestore
        await this.db.collection('Interviewees').add({
          int_id: this.int_id,
          name: this.name,
          email: this.email,
          date: this.date,
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
      } catch (error) {
        this.showToast('Error: ' + error);
        await loader.dismiss();
      }
    }
    

   
    
  }

  
      
function presentToast(message: any, string: any) {
  throw new Error('Function not implemented.');
}

  

function isValidInput(input: any, any: any) {
  throw new Error('Function not implemented.');
}
  // You can implement the checkScheduledInterviews() method here
 
  
  


