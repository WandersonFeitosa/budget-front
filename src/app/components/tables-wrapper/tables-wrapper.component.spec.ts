import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablesWrapperComponent } from './tables-wrapper.component';

describe('TablesWrapperComponent', () => {
  let component: TablesWrapperComponent;
  let fixture: ComponentFixture<TablesWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablesWrapperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TablesWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
