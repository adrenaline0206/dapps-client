import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MainListComponent } from './quest.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [MainListComponent],
  exports: [MainListComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ]
})
export class MainListModule { }
