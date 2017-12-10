import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule, MatTableModule, MatSlideToggleModule, MATERIAL_SANITY_CHECKS } from '@angular/material';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTableModule,
    MatSlideToggleModule,
    BrowserAnimationsModule
  ],
  providers: [
  	{
  		provide: MATERIAL_SANITY_CHECKS,
  		useValue: false
  	}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
