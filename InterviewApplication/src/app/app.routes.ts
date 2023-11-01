import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'sign-in',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
 
  {
    path: 'log-in',
    loadChildren: () => import('./log-in/log-in.module').then( m => m.LogInPageModule)
  },
  {
    path: 'reset',
    loadChildren: () => import('./reset/reset.module').then( m => m.ResetPageModule)
  },

  

  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'score-capture',
    loadChildren: () => import('./score-capture/score-capture.module').then( m => m.ScoreCapturePageModule)
  },
  {
    path: 'hrlogin',
    loadChildren: () => import('./hrlogin/hrlogin.module').then( m => m.HrloginPageModule)
  },
  {
    path: 'apply',
    loadChildren: () => import('./applicant/apply/apply.module').then( m => m.ApplyPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./applicant/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'apply',
    loadChildren: () => import('./applicant/apply/apply.module').then( m => m.ApplyPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./applicant/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'schedule-interview',
    loadChildren: () => import('./schedule-interview/schedule-interview.module').then( m => m.ScheduleInterviewPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'applicant-resgister',
    loadChildren: () => import('./applicant-resgister/applicant-resgister.module').then( m => m.ApplicantResgisterPageModule)
  },
  {
    path: 'applicant-login',
    loadChildren: () => import('./applicant-login/applicant-login.module').then( m => m.ApplicantLoginPageModule)
  }, 
 





];