import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchTableComponent } from './switch-table.component';

describe('SwitchTableComponent', () => {
  let component: SwitchTableComponent;
  let fixture: ComponentFixture<SwitchTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SwitchTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
