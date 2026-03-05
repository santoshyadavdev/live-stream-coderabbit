import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Motels } from './motels';

describe('Motels', () => {
  let component: Motels;
  let fixture: ComponentFixture<Motels>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Motels],
    }).compileComponents();

    fixture = TestBed.createComponent(Motels);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
