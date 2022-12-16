import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AttendanceMonthlyPage } from './attendance-monthly.page';

const routes: Routes = [
  {
    path: '',
    component: AttendanceMonthlyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttendanceMonthlyPageRoutingModule {}
