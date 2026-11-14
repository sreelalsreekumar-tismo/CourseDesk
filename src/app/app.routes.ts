import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Courses } from './courses/courses';
import { CourseList } from './course-list/course-list';
import { About } from './about/about';
import { CourseDetail } from './course-detail/course-detail';
import { SignIn } from './sign-in/sign-in';
import { MyEnrolments } from './my-enrolments/my-enrolments';
import { authGuard } from './auth-guard';
import { NotFound } from './not-found/not-found';

export const routes: Routes = [
    {path:'',component:Home},
    {path:'courses-list',component:CourseList},
    { path: 'about', loadComponent: () => import('./about/about').then(m => m.About) },
    { path: 'my-enrolments', component: MyEnrolments, canActivate: [authGuard] },
    { path: 'sign-in', component: SignIn },
    {path:'courses/:id',component:CourseDetail} ,
    { path: '**', component: NotFound },
 
];
