import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AttendanceByCalendarPageRoutingModule } from './attendance-by-calendar-routing.module';

import { AttendanceByCalendarPage } from './attendance-by-calendar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AttendanceByCalendarPageRoutingModule
  ],
  declarations: [AttendanceByCalendarPage]
})
export class AttendanceByCalendarPageModule {}
