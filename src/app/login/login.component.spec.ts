import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing'; // Import RouterTestingModule
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import {HttpClientTestingModule} from "@angular/common/http/testing"; // Import ReactiveFormsModule if using reactive forms

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, // Use HttpClientTestingModule for testing HTTP
        RouterTestingModule, // Add RouterTestingModule
        ReactiveFormsModule,
        LoginComponent// Add this if you're using reactive forms
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
