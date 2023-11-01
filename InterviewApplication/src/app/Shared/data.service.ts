import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore} from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private afs : AngularFirestore,
    private auth: AngularFireAuth
    )
     { }
  
  
    
    addUser(user : User) {
      user.id = this.afs.createId();
      return this.afs.collection('/Users').add(user);
    }

  // get all students
  getAllUser() {
    return this.afs.collection('/User').snapshotChanges();
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
}
