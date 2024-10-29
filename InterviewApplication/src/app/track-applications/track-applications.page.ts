import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { ToastController } from "@ionic/angular";

// Interfaces
interface Position {
  codeDept: string;
  codeQualify: string;
  codeTitles: string;
  code_job: string;
}

interface TimelineEntry {
  date: Date;
  status: ApplicationStatus;
  notes?: string;
}

export enum ApplicationStatus {
  SUBMITTED = 'Submitted',
  UNDER_REVIEW = 'Under Review',
  INTERVIEW_SCHEDULED = 'Interview Scheduled',
  INTERVIEWED = 'Interviewed',
  OFFER_MADE = 'Offer Made',
  ACCEPTED = 'Accepted',
  REJECTED = 'Rejected'
}

export interface Application {
  companyName: string;
  jobTitle: string;
  jobLocation: string;
  jobType: string;
  submissionDate: Date;
  status: ApplicationStatus;
  isArchived: boolean;
  timeline: TimelineEntry[];
  position: Position[];
}

interface DashboardStats {
  totalActive: number;
  totalArchived: number;
  recentUpdates: number;
}

@Component({
  selector: 'app-track-applications',
  templateUrl: './track-applications.page.html',
  styleUrls: ['./track-applications.page.scss'],
})
export class TrackApplicationsPage implements OnInit {
  userApplications: Application[] = [];
  filteredApplications: Application[] = [];
  dashboardStats: DashboardStats = {
    totalActive: 0,
    totalArchived: 0,
    recentUpdates: 0
  };

  searchTerm: string = '';
  statusFilter: string = 'all';
  showArchived: boolean = false;
  showTimeline: boolean = false;
  selectedApplication?: Application;
  userEmail: string | null = null;

  applicationStatuses = Object.values(ApplicationStatus);
  ApplicationStatus = ApplicationStatus; // Make enum available to template

  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.auth.currentUser.then(user => {
      if (user) {
        this.userEmail = user.email;
        this.loadUserApplications();
      } else {
        this.showToast('User not found');
      }
    });
  }

  async loadUserApplications() {
    if (!this.userEmail) {
      console.log('No user email found');
      return;
    }

    try {
      const docRef = this.db.collection('applicant-application').doc(this.userEmail);
      const doc = await docRef.get().toPromise();

      if (doc?.exists) {
        const data = doc.data() as any;

        // Safely handle the case where position array might be undefined
        if (!data || !Array.isArray(data.applications)) {
          console.log('No applications data found');
          this.userApplications = [];
          this.updateDashboardStats();
          this.filterApplications();
          return;
        }

        // Transform applications data with safety checks
        this.userApplications = data.applications.map((app: any) => {
          // Safely access nested position array
          const positions = Array.isArray(app.position) ? app.position : [];
          const position = positions[0] || {};

          return {
            companyName: position.codeDept || 'Not Specified',
            jobTitle: position.codeTitles || 'Not Specified',
            jobLocation: 'Not Specified', // Add this field to your database if needed
            jobType: position.codeQualify || 'Not Specified',
            submissionDate: new Date(), // Consider adding actual submission dates
            status: ApplicationStatus.SUBMITTED, // Default status
            isArchived: false,
            timeline: [{
              date: new Date(),
              status: ApplicationStatus.SUBMITTED,
              notes: 'Application submitted'
            }],
            position: positions
          };
        }).filter(Boolean); // Remove any null/undefined entries

        console.log('Loaded applications:', this.userApplications);

      } else {
        console.log('No document found for user');
        this.userApplications = [];
      }

      this.updateDashboardStats();
      this.filterApplications();

    } catch (error) {
      console.error('Error loading applications:', error);
      this.showToast('Error loading applications');
      this.userApplications = [];
      this.updateDashboardStats();
      this.filterApplications();
    }
  }

  updateDashboardStats() {
    try {
      this.dashboardStats = {
        totalActive: this.userApplications.filter(app => !app.isArchived).length,
        totalArchived: this.userApplications.filter(app => app.isArchived).length,
        recentUpdates: this.userApplications.filter(app => {
          try {
            const lastUpdate = app.timeline[app.timeline.length - 1]?.date;
            if (!lastUpdate) return false;
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            return lastUpdate >= oneWeekAgo;
          } catch (e) {
            console.error('Error calculating recent updates:', e);
            return false;
          }
        }).length
      };
    } catch (e) {
      console.error('Error updating dashboard stats:', e);
      this.dashboardStats = {
        totalActive: 0,
        totalArchived: 0,
        recentUpdates: 0
      };
    }
  }

  filterApplications() {
    try {
      this.filteredApplications = this.userApplications.filter(app => {
        if (!app) return false;

        const searchTerm = this.searchTerm?.toLowerCase() || '';
        const matchesSearch = !searchTerm ||
          (app.companyName?.toLowerCase()?.includes(searchTerm)) ||
          (app.jobTitle?.toLowerCase()?.includes(searchTerm)) ||
          (app.jobLocation?.toLowerCase()?.includes(searchTerm));

        const matchesStatus = this.statusFilter === 'all' || app.status === this.statusFilter;
        const matchesArchived = this.showArchived || !app.isArchived;

        return matchesSearch && matchesStatus && matchesArchived;
      });
    } catch (e) {
      console.error('Error filtering applications:', e);
      this.filteredApplications = [];
    }
  }

  getStatusCount(status: ApplicationStatus): number {
    try {
      return this.userApplications.filter(app => app?.status === status).length;
    } catch (e) {
      console.error('Error getting status count:', e);
      return 0;
    }
  }

  getStatusColor(status: ApplicationStatus): string {
    const colorMap: { [key in ApplicationStatus]: string } = {
      [ApplicationStatus.SUBMITTED]: 'primary',
      [ApplicationStatus.UNDER_REVIEW]: 'secondary',
      [ApplicationStatus.INTERVIEW_SCHEDULED]: 'tertiary',
      [ApplicationStatus.INTERVIEWED]: 'warning',
      [ApplicationStatus.OFFER_MADE]: 'success',
      [ApplicationStatus.ACCEPTED]: 'success',
      [ApplicationStatus.REJECTED]: 'danger'
    };
    return colorMap[status] || 'medium';
  }

  getStatusIcon(status: ApplicationStatus): string {
    const iconMap: { [key in ApplicationStatus]: string } = {
      [ApplicationStatus.SUBMITTED]: 'paper-plane',
      [ApplicationStatus.UNDER_REVIEW]: 'eye',
      [ApplicationStatus.INTERVIEW_SCHEDULED]: 'calendar',
      [ApplicationStatus.INTERVIEWED]: 'people',
      [ApplicationStatus.OFFER_MADE]: 'mail-unread',
      [ApplicationStatus.ACCEPTED]: 'checkmark-circle',
      [ApplicationStatus.REJECTED]: 'close-circle'
    };
    return iconMap[status] || 'ellipse';
  }

  isStatusReached(status: ApplicationStatus): boolean {
    if (!this.selectedApplication) return false;

    const statusOrder = this.applicationStatuses;
    const currentIndex = statusOrder.indexOf(this.selectedApplication.status);
    const statusIndex = statusOrder.indexOf(status);

    return statusIndex <= currentIndex;
  }

  getStatusDate(status: ApplicationStatus): Date | null {
    if (!this.selectedApplication?.timeline) return null;

    const event = this.selectedApplication.timeline.find(e => e.status === status);
    return event ? event.date : null;
  }

  async updateApplicationStatus(newStatus: ApplicationStatus) {
    if (!this.selectedApplication) return;

    const now = new Date();

    // Add new timeline event
    this.selectedApplication.timeline.push({
      date: now,
      status: newStatus,
      notes: `Status updated to ${newStatus}`
    });

    // Update current status
    this.selectedApplication.status = newStatus;

    // Here you would typically update the database

    this.updateDashboardStats();
    this.filterApplications();

    await this.showToast(`Application status updated to ${newStatus}`);
  }

  viewTimeline(application: Application) {
    if (!application) return;
    this.selectedApplication = application;
    this.showTimeline = true;
  }

  async archiveApplication(application: Application) {
    if (!application) return;

    try {
      application.isArchived = !application.isArchived;
      // Here you would typically update the database
      this.updateDashboardStats();
      this.filterApplications();

      await this.showToast(
        `Application ${application.isArchived ? 'archived' : 'unarchived'}`
      );
    } catch (e) {
      console.error('Error archiving application:', e);
      this.showToast('Error updating application status');
    }
  }

  viewApplication(application: Application) {
    if (!application) return;
    console.log('Viewing application:', application);
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
