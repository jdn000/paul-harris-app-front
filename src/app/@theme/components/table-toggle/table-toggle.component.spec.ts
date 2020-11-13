import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableToggleComponent } from './table-toggle.component';

describe('TableToggleComponent', () => {
  let component: TableToggleComponent;
  let fixture: ComponentFixture<TableToggleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableToggleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
