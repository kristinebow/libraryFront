import {Component, OnInit} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatToolbar} from "@angular/material/toolbar";
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from "@angular/material/table";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ApiService} from "../api.service";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {NgIf} from "@angular/common";
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";

@Component({
  selector: 'app-book-add',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    MatListItem,
    MatNavList,
    MatToolbar,
    RouterLink,
    RouterOutlet,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatFormField,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatInput,
    MatRow,
    MatRowDef,
    MatTable,
    MatLabel,
    ReactiveFormsModule,
    MatCardHeader,
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatButton,
    NgIf,
    FormsModule,
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions
  ],
  providers: [ApiService],
  templateUrl: './book-add.component.html',
  styleUrls: ['./book-add.component.css']
})
export class BookAddComponent implements OnInit {

  bookAddForm = new FormGroup({
    title: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)]
    }),
    author: new FormControl('', { validators: [Validators.required] }),
    publication_year: new FormControl('', { validators: [Validators.required] })
  });

  constructor(private fb: FormBuilder, private bookService: ApiService, private router: Router,
              public dialogRef: MatDialogRef<BookAddComponent>,) {
  }

  ngOnInit(): void {
    // @ts-ignore
    this.bookAddForm = this.fb.group({
      title: ['', [Validators.required]],
      author: ['', [Validators.required]],
      publication_year: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]]
    });
  }

  onSubmit(): void {
    // @ts-ignore
   if (this.bookAddForm.valid) {
      this.bookService.createBook(this.bookAddForm.value).subscribe(response => {
        console.log('Book saved successfully', response);
        this.dialogRef.close(true);
      }, (error: any) => {
        console.error('Error saving book', error);
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
