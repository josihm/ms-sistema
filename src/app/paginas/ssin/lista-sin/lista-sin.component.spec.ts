import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaScComponent } from './lista-sc.component';

describe('ListaScComponent', () => {
  let component: ListaScComponent;
  let fixture: ComponentFixture<ListaScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
