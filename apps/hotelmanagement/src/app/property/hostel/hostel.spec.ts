import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Hostel } from './hostel';

describe('Hostel', () => {
  let component: Hostel;
  let fixture: ComponentFixture<Hostel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hostel],
    }).compileComponents();

    fixture = TestBed.createComponent(Hostel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
