import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddsTabComponent } from './adds-tab.component';

describe('AddsTabComponent', () => {
  let component: AddsTabComponent;
  let fixture: ComponentFixture<AddsTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
