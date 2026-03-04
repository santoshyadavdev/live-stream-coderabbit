import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Resorts } from './resorts';

describe('Resorts', () => {
  let component: Resorts;
  let fixture: ComponentFixture<Resorts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Resorts],
    }).compileComponents();

    fixture = TestBed.createComponent(Resorts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
