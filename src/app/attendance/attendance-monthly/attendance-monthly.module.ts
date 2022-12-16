import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AttendanceMonthlyPageRoutingModule } from './attendance-monthly-routing.module';

import { AttendanceMonthlyPage } from './attendance-monthly.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AttendanceMonthlyPageRoutingModule
  ],
  declarations: [AttendanceMonthlyPage]
})
export class AttendanceMonthlyPageModule {}
