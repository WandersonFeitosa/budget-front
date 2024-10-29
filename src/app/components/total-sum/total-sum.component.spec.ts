import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalSumComponent } from './total-sum.component';

describe('TotalSumComponent', () => {
  let component: TotalSumComponent;
  let fixture: ComponentFixture<TotalSumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalSumComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TotalSumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
