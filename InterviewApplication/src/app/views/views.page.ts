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
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-views',
  templateUrl: './views.page.html',
  styleUrls: ['./views.page.scss'],
})
export class ViewsPage implements OnInit {
  

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
    private toastController: ToastController,private route: ActivatedRoute) {


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
                    console.log(userProfile);
                    return of(userProfile);
                  } else {
                    console.log('No matching documents.');
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
        
        console.error("Error enabling Firebase authentication persistence:", error);
      });
    
    

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
 
      this.route.paramMap.subscribe(params => {
        this.counter = params.get('counter');
      });

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
  
  
  
  goToCreate(){
    const counterValue = this.counter;

    this.navCtrl.navigateForward(['/apply', { counter: counterValue }]);
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
          console.log('File deleted:', url);
      
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
            console.log('Confirmation canceled');
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
      console.log('Status updated successfully');
    } else {
      console.log('No matching documents found');
    }
  } else {
    console.log('User not logged in');
  }
}

}