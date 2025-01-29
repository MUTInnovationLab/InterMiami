import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../Shared/auth.service';

export interface ApplicationData {
  positions: Position[];
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  references: Reference[];
  allDocumentsUrl: string[];
}

export interface Position {
  codeDept: string;
  codeTitles: string;
  code_job: string;
  codeQualify: string;
  status: string;
}

export interface Education {
  qualification: string;
  fieldOfStudy: string;
  institution: string;
  graduationYear: string;
  average: number;
}

export interface Experience {
  company: string;
  jobTitle: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Skill {
  skillName: string;
  skillLevel: string;
  description: string;
}

export interface Reference {
  name: string;
  relationship: string;
  phone: string;
  email: string;
  company: string;
}

export interface Application {
  id: string;
  personalDetails: {
    fullName: string;
    lastName: string;
    gender: string;
    dob: string;
    email: string;
    phone: string;
    status: string;
  };
  applicationData: ApplicationData;
  isArchived: boolean;
  timeline: TimelineEvent[];  // No longer optional
  submissionDate: Date;      // No longer optional
}

export interface TimelineEvent {
  status: string;
  date: Date;
  notes?: string;
}

@Component({
  selector: 'app-track-applications',
  templateUrl: './track-applications.page.html',
  styleUrls: ['./track-applications.page.scss']
})
export class TrackApplicationsPage implements OnInit {
  applications: Application[] = [];
  filteredApplications: Application[] = [];
  applicationStatuses = [
    'pending',
    'interview scheduled',
    'application complete',
    'declined',
    'Not considered'
  ];
  searchTerm: string = '';
  statusFilter: string = 'all';
  showArchived: boolean = false;
  showTimeline: boolean = false;
  selectedApplication: Application | null = null;
  
  dashboardStats = {
    totalActive: 0,
    scheduledInterviews: 0,
    completedApplications: 0,
    declined: 0,
    notConsidered: 0,
    recentUpdates: 0
  };


  constructor(
    private firestore: AngularFirestore,
    private alertController: AlertController,
    private authService: AuthService
  ) {}

  async checkUserPermissions(): Promise<boolean> {
    const currentEmail = this.authService.getCurrentUserEmail();
    if (!currentEmail) return false;

    const registeredStudentsQuery = await firstValueFrom(
      this.firestore.collection('registeredStudents', ref => 
        ref.where('email', '==', currentEmail)
      ).get()
    );

    return !registeredStudentsQuery.empty;
  }

  async loadApplications() {
    const isRegisteredStudent = await this.checkUserPermissions();
    const currentEmail = this.authService.getCurrentUserEmail();

    let query = this.firestore.collection('applicant-application');
    
    if (isRegisteredStudent) {
      // If user exists in registeredStudents, only show their applications
      query = this.firestore.collection('applicant-application', ref => 
        ref.where('personalDetails.email', '==', currentEmail)
      );
    }

    query.snapshotChanges().subscribe(actions => {
      this.applications = actions.map(action => {
        const data = action.payload.doc.data() as any;
        const id = action.payload.doc.id;
        
        const submissionDate = data.submittedAt?.toDate() || new Date();
        
        const positions = data.applications?.[0]?.positions || [];
        const currentStatus = positions[0]?.status || 'pending';
        
        const timeline = data.timeline || [{
          status: currentStatus,
          date: submissionDate,
          notes: 'Application submitted'
        }];

        const personalDetails = {
          fullName: data.personalDetails?.fullName || '',
          lastName: data.personalDetails?.lastName || '',
          gender: data.personalDetails?.gender || '',
          dob: data.personalDetails?.dob || '',
          email: data.personalDetails?.email || '',
          phone: data.personalDetails?.phone || '',
          status: currentStatus
        };

        const applicationData = {
          positions: positions,
          education: data.applications?.[0]?.education || [],
          experience: data.applications?.[0]?.experience || [],
          skills: data.applications?.[0]?.skills || [],
          references: data.applications?.[0]?.references || [],
          allDocumentsUrl: data.applications?.[0]?.allDocumentsUrl || []
        };

        return {
          id,
          personalDetails,
          applicationData,
          isArchived: data.isArchived || false,
          timeline,
          submissionDate
        };
      });

      this.updateDashboardStats();
      this.filterApplications();
    });
  }

  ngOnInit() {
    this.loadApplications();
  }
  getApplicationStatus(application: Application): string {
    // Get status from the first position, fallback to 'pending' if no positions
    return application.applicationData.positions?.[0]?.status || 'pending';
  }

  
  updateDashboardStats() {
    this.dashboardStats.totalActive = this.applications.filter(app => 
      !app.isArchived && this.getApplicationStatus(app) === 'pending').length;
    
    this.dashboardStats.scheduledInterviews = this.applications.filter(app => 
      this.getApplicationStatus(app) === 'interview scheduled' && !app.isArchived).length;
    
    this.dashboardStats.completedApplications = this.applications.filter(app =>
      this.getApplicationStatus(app) === 'application complete' && !app.isArchived).length;

      this.dashboardStats.declined = this.applications.filter(app =>
      this.getApplicationStatus(app) === 'declined' && !app.isArchived).length;

      this.dashboardStats.notConsidered = this.applications.filter(app =>
        this.getApplicationStatus(app) === 'not considered' && !app.isArchived).length;
      
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    this.dashboardStats.recentUpdates = this.applications.filter(app => {
      const lastUpdate = app.timeline?.[app.timeline.length - 1]?.date || app.submissionDate;
      return lastUpdate >= oneWeekAgo;
    }).length;
  }

  filterApplications() {
    this.filteredApplications = this.applications.filter(app => {
      const currentStatus = this.getApplicationStatus(app);
      
      const matchesSearch = this.searchTerm ? 
        (app.personalDetails.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
         app.applicationData.positions?.[0]?.codeTitles.toLowerCase().includes(this.searchTerm.toLowerCase())) : true;

      const matchesStatus = this.statusFilter === 'all' || currentStatus === this.statusFilter;
        
      const matchesArchived = this.showArchived || !app.isArchived;

      return matchesSearch && matchesStatus && matchesArchived;
    });
  }

  isStatusReached(status: string): boolean {
    if (!this.selectedApplication) return false;
    const statusIndex = this.applicationStatuses.indexOf(status);
    const currentStatusIndex = this.applicationStatuses.indexOf(
      this.getApplicationStatus(this.selectedApplication)
    );
    return statusIndex <= currentStatusIndex;
  }

  getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      'pending': 'primary',
      'interview scheduled': 'tertiary',
      'application complete': 'success',
      'declined': 'danger',
      'Not considered': 'medium'
    };
    return colorMap[status] || 'medium';
  }

  async archiveApplication(application: Application) {
    const newStatus = !application.isArchived;
    await this.firestore.collection('applicant-application').doc(application.id).update({
      isArchived: newStatus
    });
  }
  getLastTimelineEvent(application: Application): TimelineEvent {
    return application.timeline[application.timeline.length - 1] || {
      status: 'pending',
      date: application.submissionDate,
      notes: 'No updates'
    };
  }

  viewTimeline(application: Application) {
    this.selectedApplication = application;
    this.showTimeline = true;
  }

  getStatusIcon(status: string): string {
    const iconMap: { [key: string]: string } = {
      'pending': 'hourglass',
      'interview scheduled': 'calendar',
      'application complete': 'checkmark-circle',
      'declined': 'close-circle',
      'Not considered': 'ban'
    };
    return iconMap[status] || 'ellipse';
  }


  getStatusDate(status: string): Date | null {
    if (!this.selectedApplication?.timeline) return null;
    const event = this.selectedApplication.timeline.find(e => e.status === status);
    return event ? event.date : null;
  }
}