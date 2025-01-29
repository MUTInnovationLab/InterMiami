import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore, QuerySnapshot } from '@angular/fire/compat/firestore';
import { LoadingController, ModalController, NavController, ToastController } from '@ionic/angular';
import { DeclineModalPage } from '../decline-modal/decline-modal.page';
import { Router } from '@angular/router';

// Update the interfaces to better represent the data structure
interface PersonalDetails {
  fullName: string;
  lastName: string;
  gender: string;
  dob: string;
  email: string;
  phone: string;
  status: string;
}



interface UserApplications {
  personalDetails: PersonalDetails;
  applications: ApplicationData[];
}


interface ApplicationData {
  positions: Position[];
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  references: Reference[];
  allDocumentsUrl: string[];
}

// New interface to represent user with multiple applications
interface UserApplications {
  personalDetails: PersonalDetails;
  applications: ApplicationData[];
}

// Keep other interfaces the same...
interface Position {
  codeDept: string;
  codeTitles: string;
  code_job: string;
  codeQualify: string;
  status: string;
}

interface Education {
  qualification: string;
  fieldOfStudy: string;
  institution: string;
  graduationYear: string;
  average: number;
}

interface Experience {
  company: string;
  jobTitle: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Skill {
  skillName: string;
  skillLevel: string;
  description: string;
}

interface Reference {
  name: string;
  relationship: string;
  phone: string;
  email: string;
  company: string;
}

@Component({
  selector: 'app-all-applications',
  templateUrl: './all-applications.page.html',
  styleUrls: ['./all-applications.page.scss'],
})
export class AllApplicationsPage implements OnInit {
  @ViewChild('filterType') filterType!: ElementRef;
  @ViewChild('searchInput') searchInput!: ElementRef;
  userApplications: UserApplications[] = [];
  filteredApplications: UserApplications[] = [];
  isExpanded: boolean[] = [];

  constructor(
    private toastController: ToastController,
    private db: AngularFirestore,
    private loadingController: LoadingController,
    private navCtrl: NavController,
    private modalController: ModalController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUserApplications();
  }

  async loadUserApplications() {
    try {
      console.log('Starting to load applications...');
      
      const querySnapshot = await this.db.collection('applicant-application')
        .get()
        .toPromise() as QuerySnapshot<any>;
  
      console.log('QuerySnapshot received:', querySnapshot?.size, 'documents');
  
      if (!querySnapshot || querySnapshot.empty) {
        console.log('No applications found');
        this.userApplications = [];
        this.filteredApplications = [];
        this.isExpanded = [];
        return;
      }
  
      const userApplicationsMap = new Map<string, UserApplications>();
  
      querySnapshot.forEach(doc => {
        console.log('Processing document ID:', doc.id);
        const data = doc.data();
        console.log('Document data:', JSON.stringify(data, null, 2));
  
        // Extract personal details
        const personalDetails: PersonalDetails = {
          fullName: data.personalDetails?.fullName || '',
          lastName: data.personalDetails?.lastName || '',
          gender: data.personalDetails?.gender || '',
          dob: data.personalDetails?.dob || '',
          email: data.personalDetails?.email || '',
          phone: data.personalDetails?.phone || '',
          status: data.personalDetails?.status || '',
        };
  
        // Only process if status is "pending"
        if (personalDetails.status.toLowerCase() !== 'pending') {
          console.log(`Skipping document ${doc.id} because status is not pending.`);
          return;
        }
  
        // Use email as unique identifier for each user
        const userKey = personalDetails.email.toLowerCase();
  
        // Get or create user entry
        let userEntry = userApplicationsMap.get(userKey);
        if (!userEntry) {
          userEntry = {
            personalDetails,
            applications: [],
          };
          userApplicationsMap.set(userKey, userEntry);
        }
  
        // Process applications
        const applicationsToProcess = data.applications || [data];
        
        applicationsToProcess.forEach((app: any) => {
          if (!app) return;
  
          const applicationData: ApplicationData = {
            positions: Array.isArray(app.positions || app.position) ? 
              (app.positions || app.position).map((pos: any) => ({
                codeDept: pos.codeDept || '',
                codeTitles: pos.codeTitles || '',
                code_job: pos.code_job || '',
                codeQualify: pos.codeQualify || '',
                status: pos.status || '',
              })) : [],
            education: Array.isArray(app.education) ? app.education.map((edu: any) => ({
              qualification: edu.qualification || '',
              fieldOfStudy: edu.fieldOfStudy || '',
              institution: edu.institution || '',
              graduationYear: edu.graduationYear || '',
              average: edu.average || 0,
            })) : [],
            experience: Array.isArray(app.experience) ? app.experience.map((exp: any) => ({
              company: exp.company || '',
              jobTitle: exp.jobTitle || '',
              startDate: exp.startDate || '',
              endDate: exp.endDate || '',
              description: exp.description || '',
            })) : [],
            skills: Array.isArray(app.skills) ? app.skills.map((skill: any) => ({
              skillName: skill.skillName || '',
              skillLevel: skill.skillLevel || '',
              description: skill.description || '',
            })) : [],
            references: Array.isArray(app.references) ? app.references.map((ref: any) => ({
              name: ref.name || '',
              relationship: ref.relationship || '',
              phone: ref.phone || '',
              email: ref.email || '',
              company: ref.company || '',
            })) : [],
            allDocumentsUrl: Array.isArray(app.allDocumentsUrl) ? app.allDocumentsUrl : [],
          };
  
          userEntry!.applications.push(applicationData);
        });
      });
  
      this.userApplications = Array.from(userApplicationsMap.values());
      this.filteredApplications = this.userApplications;
      this.isExpanded = new Array(this.userApplications.length).fill(false);
  
      console.log('Processed users:', this.userApplications.length);
      
    } catch (error) {
      console.error('Error loading applications:', error);
      await this.showToast('Error loading applications');
      this.userApplications = [];
      this.filteredApplications = [];
      this.isExpanded = [];
    }
  }
  

  async done(userApp: UserApplications, applicantId: string) {
    try {
      const updatedStatus = 'application complete'; // Set the status to "approved"
      userApp.personalDetails.status = updatedStatus; // Update local userApp object
  
      // Update the status in the database
      await this.db.collection('applicant-application').doc(applicantId).update({ 'personalDetails.status': updatedStatus });
  
      this.showToast('Application complete!');
  
     

    } catch (error) {
      console.error('Error updating status to approved:', error);
      this.showToast('Error approving application: ' + error);
    }
  }
  
  async notConsider(userApp: UserApplications, applicantId: string) {
    try {
      const updatedStatus = 'Not considered'; // Set the status to "approved"
      userApp.personalDetails.status = updatedStatus; // Update local userApp object
  
      // Update the status in the database
      await this.db.collection('applicant-application').doc(applicantId).update({ 'personalDetails.status': updatedStatus });
  
      this.showToast('Application not considered!');
  

    } catch (error) {
      console.error('Error updating status to approved:', error);
      this.showToast('Error approving application: ' + error);
    }
  }
  
  async approve(userApp: UserApplications, applicantId: string) {
    try {
      const updatedStatus = 'interview scheduled';
      
      // Update only the positions status in each application
      userApp.applications.forEach(application => {
        application.positions.forEach(position => {
          position.status = updatedStatus;
        });
      });
  
      // Update the positions status in the database
      await this.db.collection('applicant-application').doc(applicantId).update({
        'applications': userApp.applications.map(app => ({
          ...app,
          positions: app.positions.map(pos => ({
            ...pos,
            status: updatedStatus
          }))
        }))
      });
  
      this.showToast('Application approved!');
  
      // Navigate to the next page and pass data using queryParams
      this.navCtrl.navigateForward('/schedule-interview', {
        queryParams: { data: userApp, source: 'cards' },
      });
  
      this.sendApproveNotification(userApp.personalDetails.email);
    } catch (error) {
      console.error('Error updating position status:', error);
      this.showToast('Error approving application: ' + error);
    }
  }
  
  async decline(userApp: UserApplications, applicantId: string) {
    try {
      const modal = await this.modalController.create({
        component: DeclineModalPage,
        componentProps: {
          studentId: applicantId,
          personalDetails: userApp.personalDetails,
        },
        cssClass: 'modal-ion-content',
      });
  
      modal.onDidDismiss().then(async (data) => {
        if (data.data && data.data.reason) {
          const updatedStatus = 'declined';
          
          // Update only the positions status in each application
          userApp.applications.forEach(application => {
            application.positions.forEach(position => {
              position.status = updatedStatus;
            });
          });
  
          // Update the positions status and decline reason in the database
          await this.db.collection('applicant-application').doc(applicantId).update({
            'applications': userApp.applications.map(app => ({
              ...app,
              positions: app.positions.map(pos => ({
                ...pos,
                status: updatedStatus
              }))
            })),
            declineReason: data.data.reason
          });
  
          this.showToast('Application declined.');
        }
      });
  
      await modal.present();
    } catch (error) {
      console.error('Error presenting modal or declining application:', error);
      this.showToast('Error declining application: ' + error);
    }
  }

  async openDeclineModal() {
    const modal = await this.modalController.create({
      component: DeclineModalPage,
      componentProps: {
      
      }
    });
    return await modal.present();
  }

  goToApp(): void {
    this.router.navigate(['/track-applications']);
  }

  sendApproveNotification(email: string) {
    
  }

  onClickerr(email: string, fullName: string) {
    // Navigate to the schedule-interview page with queryParams
    this.navCtrl.navigateForward(['/schedule-interview'], { queryParams: { email, fullName } });
  
    const updatedStatus = 'active';
  
    // Use a query to find the document based on the email
    this.db.collection('applicant-application', ref => ref.where('email', '==', email))
      .get()
      .toPromise()
      .then(async querySnapshot => {
        if (querySnapshot && !querySnapshot.empty) {
          // Assuming there is only one document for the given email
          const doc = querySnapshot.docs[0];
  
          // Update the status in the found document
          doc.ref.update({ status: updatedStatus })
            .then(() => {
              
              this.showToast('Approved!!!');
              this.sendApproveNotification(email);
            })
            .catch(async error => {
              const toast = await this.toastController.create({
                message: 'Error updating status:'+ error,
                duration: 2000,
                position: 'top'
              });
              toast.present();
            });
        } else {
          const toast = await this.toastController.create({
            message: 'No document found for he given email'+ email,
            duration: 2000,
            position: 'top'
          });
          toast.present();
        }
      })
      .catch(async error => {
        const toast = await this.toastController.create({
          message: 'Error querying the database:'+ error,
          duration: 2000,
          position: 'top'
        });
        toast.present();
      });
  }
  

  filterApplications() {
    const filterValue = this.filterType.nativeElement.value;
    const searchText = this.searchInput.nativeElement.value.toLowerCase();
    
    this.filteredApplications = this.userApplications.filter(userApp => {
      if (filterValue === 'all') {
        return this.searchAllFields(userApp, searchText);
      }
      
      return userApp.applications.some(app => {
        switch (filterValue) {
          case 'experience':
            return app.experience.some(exp => 
              exp.jobTitle.toLowerCase().includes(searchText) ||
              exp.company.toLowerCase().includes(searchText) ||
              exp.description.toLowerCase().includes(searchText)
            );
          case 'education':
            return app.education.some(edu =>
              edu.qualification.toLowerCase().includes(searchText) ||
              edu.fieldOfStudy.toLowerCase().includes(searchText) ||
              edu.institution.toLowerCase().includes(searchText)
            );
          case 'skills':
            return app.skills.some(skill =>
              skill.skillName.toLowerCase().includes(searchText) ||
              skill.description.toLowerCase().includes(searchText)
            );
          case 'references':
            return app.references.some(ref =>
              ref.name.toLowerCase().includes(searchText) ||
              ref.company.toLowerCase().includes(searchText)
            );
          default:
            return true;
        }
      });
    });
  }

  searchAllFields(userApp: UserApplications, searchText: string): boolean {
    return (
      // Personal Details
      userApp.personalDetails.fullName.toLowerCase().includes(searchText) ||
      userApp.personalDetails.email.toLowerCase().includes(searchText) ||
      // Search through all applications
      userApp.applications.some(app => (
        // Experience
        app.experience.some(exp => 
          exp.jobTitle.toLowerCase().includes(searchText) ||
          exp.company.toLowerCase().includes(searchText)
        ) ||
        // Education
        app.education.some(edu =>
          edu.qualification.toLowerCase().includes(searchText) ||
          edu.institution.toLowerCase().includes(searchText)
        ) ||
        // Skills
        app.skills.some(skill =>
          skill.skillName.toLowerCase().includes(searchText)
        ) ||
        // References
        app.references.some(ref =>
          ref.name.toLowerCase().includes(searchText) ||
          ref.company.toLowerCase().includes(searchText)
        )
      ))
    );
  }

  toggleExpand(index: number) {
    this.isExpanded[index] = !this.isExpanded[index];
  }

  async showToast(message: string) {
    try {
      const toast = await this.toastController.create({
        message,
        duration: 2000,
        position: 'top',
      });
      await toast.present();
    } catch (e) {
      console.error('Error showing toast:', e);
    }
  }
}