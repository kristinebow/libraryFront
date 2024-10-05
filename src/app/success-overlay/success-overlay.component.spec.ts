import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuccessOverlayComponent } from './success-overlay.component';
import { MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('SuccessOverlayComponent', () => {
  let component: SuccessOverlayComponent;
  let fixture: ComponentFixture<SuccessOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessOverlayComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: { close: jasmine.createSpy('close') } // Mock the MatDialogRef
        },
        {
          provide: ActivatedRoute,
          useValue: { params: of({}) } // Mock the ActivatedRoute
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SuccessOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
