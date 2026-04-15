import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HotelmanagementData } from './hotelmanagement-data';

describe('HotelmanagementData', () => {
  let component: HotelmanagementData;
  let fixture: ComponentFixture<HotelmanagementData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelmanagementData],
    }).compileComponents();

    fixture = TestBed.createComponent(HotelmanagementData);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
