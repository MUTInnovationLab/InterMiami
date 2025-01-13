import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AngularFireUploadTask } from '@angular/fire/compat/storage';
// import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private afs : AngularFirestore,
    private auth: AngularFireAuth,
   
    )
     { }

     getAllInterviewes(): Observable<any> {
      return this.afs.collection('interviews').snapshotChanges();
    }

   
     submitInterview(interviewConduct: any, candidateUid: string) {
      return this.afs.collection('interviews').doc(candidateUid).set(interviewConduct);
    }
    
    addUser(user : User) {
      user.id = this.afs.createId();
      return this.afs.collection('/Users').add(user);
    }

  // get all students
  getAllUser() {
    return this.afs.collection('/User').snapshotChanges();
  }

  getAllStaff() {
    return this.afs.collection('/registeredStaff').snapshotChanges();
  }

  getAllInterviews() {
    return this.afs.collection('/Interviewees').snapshotChanges();
  }

  // delete student
  deleteUser(user : User) {
     this.afs.doc('/User/'+user.id).delete();
  }

  // update student
  updateUser(user : User) {
    this.deleteUser(user);
    this.addUser(user);
  }

  updateStaffAvailability(staffId: string, availabilityStatus: boolean) {
    return this.afs.collection('registeredStaff').doc(staffId).update({
      availabilityStatus: availabilityStatus.toString() // Convert to string if needed
    });
  }

  removeInterviewee(interviewId: string) {
    return this.afs.collection('Interviewees').doc(interviewId).delete();
  }

  
}
