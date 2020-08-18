/*
* Copyright (c) 2019-2020. TIBCO Software Inc.
* This file is subject to the license terms contained
* in the license file that is distributed with this file.
*/

// https://medium.com/@tomsu/how-to-build-a-library-for-angular-apps-4f9b38b0ed11
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { SpotfireViewerComponent } from './spotfire-viewer.component';

import { SpotfireServerInterceptor } from '../spotfire-server.interceptor';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  declarations: [SpotfireViewerComponent],
  exports: [SpotfireViewerComponent],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: SpotfireServerInterceptor, multi: true }]
})
export class SpotfireViewerModule { }
