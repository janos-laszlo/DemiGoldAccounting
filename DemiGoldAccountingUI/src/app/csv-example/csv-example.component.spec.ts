import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvExampleComponent } from './csv-example.component';

describe('CsvExampleComponent', () => {
  let component: CsvExampleComponent;
  let fixture: ComponentFixture<CsvExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsvExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsvExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
