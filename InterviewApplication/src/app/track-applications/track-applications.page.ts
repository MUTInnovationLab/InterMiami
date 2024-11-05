import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';

export interface ApplicationData {
  jobType: string;
  position: string[];
  education: any[];
  experience: any[];
  skills: string[];
  references: any[];
  allDocumentsUrl: string;
  submittedAt: Date;
}

export interface Application {
  id: string;
  codeJob: string;
  jobTitle: string;
  jobLocation: string;
  jobType: string;
  status: ApplicationStatus;
  submissionDate: Date;
  isArchived: boolean;
  timeline: TimelineEvent[];
  personalDetails: any;
  applicationData: ApplicationData;
}

export interface TimelineEvent {
  status: ApplicationStatus;
  date: Date;
  notes?: string;
}

export enum ApplicationStatus {
  SUBMITTED = 'Submitted',
  UNDER_REVIEW = 'Under Review',
  INTERVIEW_SCHEDULED = 'Interview Scheduled',
  INTERVIEW_COMPLETED = 'Interview Completed',
  OFFER_MADE = 'Offer Made',
  ACCEPTED = 'Accepted',
  REJECTED = 'Rejected'
}

@Component({
  selector: 'app-track-applications',
  templateUrl: './track-applications.page.html',
  styleUrls: ['./track-applications.page.scss']
})
export class TrackApplicationsPage implements OnInit {
  applications: Application[] = [];
  filteredApplications: Application[] = [];
  applicationStatuses = Object.values(ApplicationStatus);
  searchTerm: string = '';
  statusFilter: string = 'all';
  showArchived: boolean = false;
  showTimeline: boolean = false;
  selectedApplication: Application | null = null;
  
  dashboardStats = {
    totalActive: 0,
    recentUpdates: 0,
    scheduledInterviews: 0,
    offersReceived: 0
  };

  constructor(
    private firestore: AngularFirestore,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadApplications();
  }

  async loadApplications() {
    this.firestore.collection('applications').snapshotChanges().subscribe(actions => {
      this.applications = actions.map(action => {
        const data = action.payload.doc.data() as any;
        const id = action.payload.doc.id;
        
        // Convert Firestore timestamp to Date
        const submissionDate = data.submissionDate?.toDate() || new Date();
        
        // Create timeline array if it doesn't exist
        const timeline = data.timeline || [{
          status: ApplicationStatus.SUBMITTED,
          date: submissionDate
        }];

        return {
          id,
          codeJob: data.personalDetails?.company || 'Unknown Company',
          jobTitle: Array.isArray(data.applicationData?.position) ? 
            data.applicationData.position[0] : data.applicationData?.position || 'Unknown Position',
          jobLocation: data.personalDetails?.location || 'Unknown Location',
          jobType: data.applicationData?.jobType || 'Unknown Type',
          status: data.status || ApplicationStatus.SUBMITTED,
          submissionDate,
          isArchived: data.isArchived || false,
          timeline,
          personalDetails: data.personalDetails,
          applicationData: data.applicationData
        };
      });

      this.updateDashboardStats();
      this.filterApplications();
    });
  }

  updateDashboardStats() {
    this.dashboardStats.totalActive = this.applications.filter(app => !app.isArchived).length;
    this.dashboardStats.scheduledInterviews = this.applications.filter(app => 
      app.status === ApplicationStatus.INTERVIEW_SCHEDULED && !app.isArchived).length;
    this.dashboardStats.offersReceived = this.applications.filter(app =>
      app.status === ApplicationStatus.OFFER_MADE && !app.isArchived).length;
      
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    
    this.dashboardStats.recentUpdates = this.applications.filter(app => {
      const lastUpdate = app.timeline[app.timeline.length - 1].date;
      return lastUpdate >= oneWeekAgo;
    }).length;
  }

  filterApplications() {
    this.filteredApplications = this.applications.filter(app => {
      const matchesSearch = this.searchTerm ? 
        (app.codeJob.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
         app.jobTitle.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
         app.jobLocation.toLowerCase().includes(this.searchTerm.toLowerCase())) : true;

      const matchesStatus = this.statusFilter === 'all' || app.status === this.statusFilter;
      const matchesArchived = this.showArchived || !app.isArchived;

      return matchesSearch && matchesStatus && matchesArchived;
    });
  }

  getStatusCount(status: ApplicationStatus): number {
    return this.applications.filter(app => app.status === status && !app.isArchived).length;
  }

  getStatusColor(status: ApplicationStatus): string {
    const colorMap = {
      [ApplicationStatus.SUBMITTED]: 'primary',
      [ApplicationStatus.UNDER_REVIEW]: 'secondary',
      [ApplicationStatus.INTERVIEW_SCHEDULED]: 'tertiary',
      [ApplicationStatus.INTERVIEW_COMPLETED]: 'warning',
      [ApplicationStatus.OFFER_MADE]: 'success',
      [ApplicationStatus.ACCEPTED]: 'success',
      [ApplicationStatus.REJECTED]: 'danger'
    };
    return colorMap[status] || 'medium';
  }

  async archiveApplication(application: Application) {
    const newStatus = !application.isArchived;
    await this.firestore.collection('applications').doc(application.id).update({
      isArchived: newStatus
    });
  }

  viewTimeline(application: Application) {
    this.selectedApplication = application;
    this.showTimeline = true;
  }

  viewApplication(application: Application) {
    // Implement detailed view navigation
    console.log('Viewing application:', application);
  }

  getStatusIcon(status: ApplicationStatus): string {
    const iconMap = {
      [ApplicationStatus.SUBMITTED]: 'paper-plane',
      [ApplicationStatus.UNDER_REVIEW]: 'hourglass',
      [ApplicationStatus.INTERVIEW_SCHEDULED]: 'calendar',
      [ApplicationStatus.INTERVIEW_COMPLETED]: 'checkmark-circle',
      [ApplicationStatus.OFFER_MADE]: 'mail',
      [ApplicationStatus.ACCEPTED]: 'trophy',
      [ApplicationStatus.REJECTED]: 'close-circle'
    };
    return iconMap[status] || 'ellipse';
  }

  isStatusReached(status: ApplicationStatus): boolean {
    if (!this.selectedApplication) return false;
    const statusIndex = this.applicationStatuses.indexOf(status);
    const currentStatusIndex = this.applicationStatuses.indexOf(this.selectedApplication.status);
    return statusIndex <= currentStatusIndex;
  }

  getStatusDate(status: ApplicationStatus): Date | null {
    if (!this.selectedApplication) return null;
    const event = this.selectedApplication.timeline.find(e => e.status === status);
    return event ? event.date : null;
  }
}