import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainWrapComponent } from './main-wrap.component';

describe('MainWrapComponent', () => {
  let component: MainWrapComponent;
  let fixture: ComponentFixture<MainWrapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainWrapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainWrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
