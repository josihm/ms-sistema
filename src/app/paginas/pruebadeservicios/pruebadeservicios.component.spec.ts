import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PruebadeserviciosComponent } from './pruebadeservicios.component';

describe('PruebadeserviciosComponent', () => {
  let component: PruebadeserviciosComponent;
  let fixture: ComponentFixture<PruebadeserviciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PruebadeserviciosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PruebadeserviciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
