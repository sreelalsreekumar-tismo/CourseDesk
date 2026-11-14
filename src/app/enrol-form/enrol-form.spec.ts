import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnrolForm } from './enrol-form';

describe('EnrolForm', () => {
  let component: EnrolForm;
  let fixture: ComponentFixture<EnrolForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrolForm],
    }).compileComponents();

    fixture = TestBed.createComponent(EnrolForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
