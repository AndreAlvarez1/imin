import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiseventosComponent } from './miseventos.component';

describe('MiseventosComponent', () => {
  let component: MiseventosComponent;
  let fixture: ComponentFixture<MiseventosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiseventosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiseventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
