import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTypeModalComponent } from './add-type-modal.component';

describe('AddTypeModalComponent', () => {
  let component: AddTypeModalComponent;
  let fixture: ComponentFixture<AddTypeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTypeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
