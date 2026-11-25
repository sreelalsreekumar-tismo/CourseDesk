import { Routes } from '@angular/router';
import { Home } from './home/home';
import { CourseList } from './course-list/course-list';
import { CourseDetail } from './course-detail/course-detail';
import { SignIn } from './sign-in/sign-in';
import { MyEnrolments } from './my-enrolments/my-enrolments';
import { SavedPage } from './saved-page/saved-page';
import { NotFound } from './not-found/not-found';
import { authGuard } from './auth-guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'courses', component: CourseList },
  { path: 'courses/:id', component: CourseDetail },
  { path: 'my-enrolments', component: MyEnrolments, canActivate: [authGuard] },
  { path: 'saved', component: SavedPage },
  { path: 'sign-in', component: SignIn },
  { path: 'about', loadComponent: () => import('./about/about').then((m) => m.About) },
  { path: '**', component: NotFound },
];
