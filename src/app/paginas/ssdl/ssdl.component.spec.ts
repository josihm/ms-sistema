import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SsdlComponent } from './ssdl.component';

describe('SsdlComponent', () => {
  let component: SsdlComponent;
  let fixture: ComponentFixture<SsdlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SsdlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SsdlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
