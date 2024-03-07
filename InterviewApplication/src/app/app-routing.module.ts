import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PreventUrlEntryGuard } from './prevent-url-entry.guard';


const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [PreventUrlEntryGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'reset',
    loadChildren: () => import('./reset/reset.module').then( m => m.ResetPageModule),
    canActivate: [PreventUrlEntryGuard]
  },
  {
    path: 'hr-modal',
    loadChildren: () => import('./hr-modal/hr-modal.module').then( m => m.HrModalPageModule)
  },

  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [PreventUrlEntryGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'score-capture',
    loadChildren: () => import('./score-capture/score-capture.module').then( m => m.ScoreCapturePageModule),
    canActivate: [PreventUrlEntryGuard]
  },
 
  {
    path: 'apply',
    loadChildren: () => import('./applicant/apply/apply.module').then( m => m.ApplyPageModule),
    canActivate: [PreventUrlEntryGuard]
  },
  {
    path: 'apply',
    loadChildren: () => import('./applicant/apply/apply.module').then( m => m.ApplyPageModule),
    canActivate: [PreventUrlEntryGuard]
  },
  {
    path: 'schedule-interview',
    loadChildren: () => import('./schedule-interview/schedule-interview.module').then( m => m.ScheduleInterviewPageModule),
    canActivate: [PreventUrlEntryGuard]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule),
    canActivate: [PreventUrlEntryGuard]
  },
  {
    path: 'applicant-resgister',
    loadChildren: () => import('./applicant-resgister/applicant-resgister.module').then( m => m.ApplicantResgisterPageModule),
    canActivate: [PreventUrlEntryGuard]
  },
  {
    path: 'applicant-login',
    loadChildren: () => import('./applicant-login/applicant-login.module').then( m => m.ApplicantLoginPageModule)
},
  {
    path: 'all-applicants',
    loadChildren: () => import('./all-applicants/all-applicants.module').then( m => m.AllApplicantsPageModule)
  },
  {
    path: 'add-user',
    loadChildren: () => import('./add-user/add-user.module').then( m => m.AddUserPageModule)
  },
  {
    path: 'view',
    loadChildren: () => import('./view/view.module').then( m => m.ViewPageModule)
  },
  {
    path: 'staffprofile',
    loadChildren: () => import('./staffprofile/staffprofile.module').then( m => m.StaffprofilePageModule)
  },
  {
    path: 'interview-history',
    loadChildren: () => import('./interview-history/interview-history.module').then( m => m.InterviewHistoryPageModule)
  },
  {
    path: 'scheduled-interviews',
    loadChildren: () => import('./scheduled-interviews/scheduled-interviews.module').then( m => m.ScheduledInterviewsPageModule)
  },
  {
    path: 'decline-modal',
    loadChildren: () => import('./decline-modal/decline-modal.module').then( m => m.DeclineModalPageModule)
  },
  {
    path: 'validate-docs',
    loadChildren: () => import('./validate-docs/validate-docs.module').then( m => m.ValidateDocsPageModule)
  },
  {
    path: 'view-academic-record-modal',
    loadChildren: () => import('./view-academic-record-modal/view-academic-record-modal.module').then( m => m.ViewAcademicRecordModalPageModule)
  },
  {
    path: 'all-users',
    loadChildren: () => import('./all-users/all-users.module').then( m => m.AllUsersPageModule)
  },
  {
    path: 'cv-modal',
    loadChildren: () => import('./cv-modal/cv-modal.module').then( m => m.CvModalPageModule)
  },
  {
    path: 'marks',
    loadChildren: () => import('./marks/marks.module').then( m => m.MarksPageModule)
  },
  {
    path: 'posts',
    loadChildren: () => import('./posts/posts.module').then( m => m.PostsPageModule)
  },
  {
    path: 'createpost',
    loadChildren: () => import('./createpost/createpost.module').then( m => m.CreatepostPageModule)
  },
  {
    path: 'createpost',
    loadChildren: () => import('./manageposts/manageposts.module').then( m => m.ManagepostsPageModule)
  },
  {
    path: 'today-interviews',
    loadChildren: () => import('./today-interviews/today-interviews.module').then( m => m.TodayInterviewsPageModule),
    canActivate: [PreventUrlEntryGuard] // Add the guard here
  },




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }



