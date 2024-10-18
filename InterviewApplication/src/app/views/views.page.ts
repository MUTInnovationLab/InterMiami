import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, LoadingController, NavController, ToastController } from '@ionic/angular';
import { Observable, of } from 'rxjs';


import { finalize, switchMap } from 'rxjs/operators';
import { AngularFirestore, QuerySnapshot } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Certificate } from 'crypto';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-views',
  templateUrl: './views.page.html',
  styleUrls: ['./views.page.scss'],
})
export class ViewsPage implements OnInit {
  
  qualification:any
  jobTitle:any;
  jobdepartment:any;
    user$: Observable<any> = of(null);
  showAll: boolean = false;
  detProfile:any;
  pdfUrl: any;
  status='';
  user = {
    status: 'pending', 
  };
  counter:any;
  tables$:any;
  data:any;
  jobfaculty:any;

  constructor(private loadingController: LoadingController,private storage: AngularFireStorage , private auth:AngularFireAuth,private navCtrl: NavController ,private afs: AngularFirestore,private alertController: AlertController,
    private toastController: ToastController,private route: ActivatedRoute,  private router:Router) {


      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        
    
        this.user$ = of(firebase.auth().currentUser).pipe(
          switchMap((user) => {
            if (user) {
              const query = this.afs.collection('applicant-application', ref => ref.where('email', '==', user.email));
              return query.valueChanges().pipe(
                switchMap((documents: any[]) => {
                  if (documents.length > 0) {
                    const userProfile = documents[0];
                    this.detProfile = documents[0];
                    this.pdfUrl = userProfile.AllInOnePdfURL;
                    this.status=userProfile.status;
                    return of(userProfile);
                  } else {
                    this.showToast('No matching documents.');
                    return of(null);
                  }
                })
              );
            } else {
              return of(null);
            }
          })
        );
      })
      .catch((error) => {
        
        this.showToast("Error connecting:"+ error);
      });
    
    

    }

    async showToast(message: string) {
      const toast = await this.toastController.create({
        message: message,
        duration: 2000, // Duration in milliseconds
        position: 'top' // Toast position: 'top', 'bottom', 'middle'
      });
      toast.present();
    }
    getStatusBoxStyle(status: string): string {
      let statusClass = 'status-box';
  
      switch (status) {
        case 'pending':
          statusClass += ' pending-box';
          break;
        case 'active':
          statusClass += ' active-box';
          break;
        case 'recommended':
          statusClass += ' recommended-box';
          break;
        case 'placed':
          statusClass += ' placed-box';
          break;
        case 'declined':
          statusClass += ' declined-box';
          break;
        default:
          break;
      }
  
      return statusClass;
    }
  
    getStatusTextColor(status: string): string {
      
      switch (status) {
        case 'pending':
        case 'recommended':
          return '#000'; 
        case 'active':
        case 'placed':
        case 'declined':
          return '#fff'; 
        default:
          return '#000'; 
      }
    }

    ngOnInit() {
 
   

      this.getAllDocuments();

      
    }

    getAllDocuments() {
      this.afs
        .collection('Post')
        .valueChanges()
        .subscribe((data) => {
          this.tables$ = data;
        });
    }
    
isButtonDisabled(): boolean {
  return this.status === "placed";
}

  goToHomePage(): void {
    this.navCtrl.navigateBack('/posts');
  }
  toggleAllDetails() {
    this.showAll = !this.showAll;
  }
  

  
  goToCreate(jobfaculty: string, jobTitle: string, jobdepartment: string, qualification: string) {
    // Prepare the parameters as an object
    const navigationExtras = {
      queryParams: {
        counter: jobfaculty,
        title: jobTitle,
        dept: jobdepartment,
        qualify: qualification
      }
    };
  
    // Navigate to the "apply" page and pass the parameters
    this.router.navigate(['/apply'], navigationExtras);

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
              this. navCtrl.navigateForward("/applicant-login");
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



 async deleteProfile(){

  const loader = await this.loadingController.create({
    message: 'Deleting',
    cssClass: 'custom-loader-class'
  });
  await loader.present();
  
    const user = await this.auth.currentUser;

    if ( user) {
      
      
       
     
         
        if (this.detProfile?.cvUrl !== null && this.detProfile?.cvUrl !== undefined && this.detProfile?.cvUrl !== "" ) {
          this.deleteFile( this.detProfile.cvUrl );
       }
    
        
        if ( this.detProfile?.certicatesUrl !== null && this.detProfile?.certicatesUrl !== undefined && this.detProfile?.certicatesUrl !== "") {
             this.deleteFile( this.detProfile.certicatesUrl);
        
        }
   
   
        
        if (this.detProfile && this.detProfile.academicRecordURl !== null && this.detProfile.academicRecordURl !== undefined && this.detProfile.academicRecordURl !=="" ) {
          this.deleteFile(this.detProfile.academicRecordURl);
        }
        
        if (this.detProfile && this.detProfile.AllInOnePdfURL !== null && this.detProfile.AllInOnePdfURL !== undefined && this.detProfile.AllInOnePdfURL !=="" ) {
          this.deleteFile(this.detProfile.AllInOnePdfURL);
        }
      

        if (this.detProfile && this.detProfile.letterURL !== null && this.detProfile.letterURL !== undefined && this.detProfile. letterURL !=="" ) {
           this.deleteFile(this.detProfile.letterURL);
        }

        if (this.detProfile && this.detProfile.idURL !== null && this.detProfile.idURL !== undefined && this.detProfile.idURL !=="" ) {
           this.deleteFile(this.detProfile.idURL);
        }





     if(this.detProfile){
    
     this.afs.collection('applicant-application', ref => ref.where('email', '==', user.email)).get()
      .subscribe(querySnapshot => {
        querySnapshot.forEach(doc => {
          doc.ref.delete();
          this.detProfile=null;
          loader.dismiss();
          alert("profile deleted successfully");
        });
      });
      
     }else{
      loader.dismiss();
      alert("you don't have a profile");
     }
    
     
    } else {
      
      
      loader.dismiss();
      throw new Error('User not found');
    }

  }

  


  deleteFile(url: string): void {
  
    const fileRef = this.storage.refFromURL(url);
  
    fileRef
      .delete()
      .pipe(
        finalize(() => {
          this.showToast('File deleted:'+ url);
      
        })
      )
      .subscribe(
        () => {}, 
        (error) => {
          alert('An error occurred while deleting the file: ' + error.message);
        }
      );
  }



  
  async confermDelete() {
    const alert = await this.alertController.create({
      header: 'Confirmation',
      message: 'Are you sure you want to DELETE your profile?',
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
           
              this.deleteProfile();

          }
        }
      ]
    });
    await alert.present();
  }
  openPDF() {
    
      window.open(this.pdfUrl, '_blank');
    
  }
  
  async updateStatus(status: string) {
  const user = firebase.auth().currentUser;
  if (user) {
    const email = user.email;
    const query = this.afs.collection('applicant-application', ref => ref.where('email', '==', email));
    const snapshot = await query.get().toPromise();



    if (snapshot && snapshot.docs.length > 0) {
      const docRef = snapshot.docs[0].ref;
      await docRef.update({ status });
     
    } else {
      this.showToast('No matching documents found');
    }
  } else {
    this.showToast('User not logged in');
  }
}

}