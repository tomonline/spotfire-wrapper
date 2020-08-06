/*
* Copyright (c) 2019-2020. TIBCO Software Inc.
* This file is subject to the license terms contained
* in the license file that is distributed with this file.
*/
import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { SpotfireReporting, SpotfireViewerModule } from '@tibco/spotfire-wrapper';

@Component({
  selector: 'app-root',
  template: `
<h2>Angular app "{{title|uppercase}}"
<button (click)="toggleFullsize()">FullSize</button></h2>
<button (click)="setFilters()">Change filters</button>
<div *ngIf="reporting">
  <button (click)="doPrint()">Print...</button>
  <button (click)="doPdf()">Export to PDF...</button>
  <button (click)="doImage()">Save as Image</button>
</div>
<h1>{{filterNames[b]}}</h1>
<div style='display:flex'>
  <spotfire-viewer [class.normsize]="!fullsize" [class.fullsize]="fullsize"
      [url]="url"
      [path]="path"
      [customization]="cust"
      [markingOn]="{ SalesAndMarketing: ['*'] }"
      [maxRows]="10"
      (markingEvent)="onMarking($event)"
      (reportingEvent)="onReporting($event)"
      (filteringEvent)="onFiltering($event)"
      [filters]='filters'
      [parameters]="param"
      [debug]="true">
    </spotfire-viewer>
    <pre style='border-right:1px solid #bbb; padding:5px; font-size:10px'>what we send to <code>filter</code>={{filtersOut|json}}</pre>
 <pre style='font-size:10px;  padding:5px;'>what we mark ({{buffersize}} o): {{markedData|json}}</pre>

</div>
`, styles: [`
.normsize { width:50%; height:600px}
.fullsize { position: absolute; top: 60px; left:0; right:0; bottom:0; width:100%; height:100%} `]
})
class AppComponent {
  title = 'demo1';
  url = 'https://spotfire-next.cloud.tibco.com';
  path = 'Samples/Sales and Marketing';
  cust = { showAuthor: true, showFilterPanel: true, showToolBar: true };
  markedData = {};
  param = 'ApplyBookmark(bookmarkName="Book2");';
  filterNames = ['No filters', 'Florida', 'Colorado', 'Arizona'];
  b = 0;
  buffersize = 0;
  filters: any = null;
  fullsize = false;
  reporting: SpotfireReporting = null;
  filters1 = [
    { dataTableName: 'SalesAndMarketing', dataColumnName: 'State', filterSettings: { values: ['Florida'] } },
    { dataTableName: 'SalesAndMarketing', dataColumnName: 'City', filterSettings: { values: ['Fort Lauderdale'] } },
    { dataTableName: 'SalesAndMarketing', dataColumnName: 'BCG segmentation', filterSettings: { values: ['Dogs', 'Stars'] } },
    { dataTableName: 'SalesAndMarketing', dataColumnName: 'Class Sales', filterSettings: { 'highValue': '123', 'lowValue': '67' } }
  ];
  filters2 = [
    { dataTableName: 'SalesAndMarketing', dataColumnName: 'State', filterSettings: { values: ['Colorado'] } },
    { dataTableName: 'SalesAndMarketing', dataColumnName: 'Class Sales', filterSettings: { 'highValue': '60', 'lowValue': '10' } }
  ];
  // filters3 = [{ dataTableName: 'SalesAndMarketing', dataColumnName: 'State', filterSettings: { values: ['Arizona'] } }];
  filters3 = '[{"dataTableName":"SalesAndMarketing","dataColumnName":"State","filterSettings":{"values":["Arizona"]}}]';

  filtersOut = {};

  // Marking can be subscribed outside component
  onMarking = (e: Event) => {
    console.log('[AppComponent] MARKING MySpot returns', e);
    this.buffersize = JSON.stringify(e).length;
    this.markedData = e;
  }

  setFilters = () => {
    this.b = (this.b + 1) % 4;
    // this.b = this.b === 3 ? 1 : this.b + 1;
    switch (this.b) {
      case 0: this.filters = null; break;
      case 1: this.filters = this.filters1; break;
      case 2: this.filters = this.filters2; break;
      case 3: this.filters = this.filters3; break;
    }
    //    this.filters = this.b === 1 ? [] : (this.b === 2 ? this.filters1 : this.filters2);
    console.log('[AppComponent] set params to', this.b, this.filters);
  }
  onReporting = (e: SpotfireReporting) => {
    console.log('[AppComponent] onReporting MySpot returns', e);
    this.reporting = e;
  }
  onFiltering = (e: Event) => {
    console.log('[AppComponent] FILTERING MySpot returns', e);
    this.filtersOut = e;
  }
  doPdf = () => {
    console.log('doPdf', this.reporting);
    this.reporting.exportToPdf();
  }
  doPrint = () => {
    console.log('doPrint', this.reporting);
    this.reporting.print();
  }
  doImage = () => {
    console.log('doImage', this.reporting);
    this.reporting.exportActiveVisualAsImage();
  }
  toggleFullsize = () => this.fullsize = !this.fullsize;
}

@NgModule({
  bootstrap: [AppComponent],
  imports: [BrowserModule, SpotfireViewerModule],
  declarations: [AppComponent],
})
class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
