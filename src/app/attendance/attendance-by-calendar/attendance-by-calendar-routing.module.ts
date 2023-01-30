import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AttendanceByCalendarPage } from './attendance-by-calendar.page';

const routes: Routes = [
  {
    path: '',
    component: AttendanceByCalendarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttendanceByCalendarPageRoutingModule {}
