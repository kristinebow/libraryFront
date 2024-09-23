// @ts-ignore

import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatSidenavModule, MatSidenavContainer, MatSidenav} from "@angular/material/sidenav";
import {MatList, MatListItem, MatNavList} from "@angular/material/list";
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatFormField, MatInput} from "@angular/material/input";
import {MatPaginator} from "@angular/material/paginator";
import {ApiService} from "../api.service";
import {AuthService} from "../service/auth.service";
import {DatePipe, NgIf} from "@angular/common";
import {MatOption, MatSelect} from "@angular/material/select";
import {animate} from "@angular/animations";
import {NotificationService} from "../service/notification.service";
import {LoginService} from "../service/login.service";
import {MatDialog} from "@angular/material/dialog";
import {BookAddComponent} from "../book-add/book-add.component";

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    MatToolbar,
    MatIcon,
    MatIconButton,
    MatSidenavContainer,
    MatNavList,
    RouterOutlet,
    MatListItem,
    MatSidenavModule,
    RouterLink,
    MatList,
    MatHeaderRow,
    MatTable,
    MatHeaderCell,
    MatCell,
    MatColumnDef,
    MatSort,
    MatInput,
    MatFormField,
    MatRow,
    MatPaginator,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatButton,
    NgIf,
    MatSelect,
    MatOption,
    DatePipe,
    RouterLinkActive
  ],
  providers: [ApiService],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})
export class BookListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  isCollapsed = false;
  displayedColumns = ['id', 'name', 'bookedUntil', 'reserve'];
  books: MatTableDataSource<BookData>;
  selectedRole: string;
  filteredBooks: BookData[] = [];
  searchTerm: string = '';

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(private bookService: ApiService, protected authService: AuthService,
              protected notifications: NotificationService, protected loginService: LoginService, protected dialog: MatDialog) {
    let allBooks: any[] | undefined = [];
    this.books = new MatTableDataSource(allBooks);
    this.selectedRole = this.authService.getRole();
    if (this.authService.isAdmin()) {
      this.displayedColumns.push('actions');
    }
  }

  openAddBookDialog(): void {
    const dialogRef = this.dialog.open(BookAddComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchBooks();
      }
    });
  }

  toggleMenu() {
    if (this.isCollapsed) {
      this.sidenav.open();
      this.isCollapsed = !this.isCollapsed;
    } else {
      this.sidenav.close();
      this.isCollapsed = !this.isCollapsed;
    }
  }

  onRoleChange(newRole: string) {
    this.authService.setRole(newRole);
  }


  updateDisplayedColumns(): void {
    this.displayedColumns = ['id', 'title', 'author', 'bookedUntil', 'reserve'];
    if (this.authService.isAdmin()) {
      this.displayedColumns.push('actions');
    }
  }

  fetchBooks(): void {
    let allBooks: any[] | undefined = [];
    this.bookService.findAllBooks().forEach(value => {
      this.books.data = value.sort((a: { id: number; }, b: { id: number; }) => a.id - b.id); // Sort by ID
      // @ts-ignore
      this.books.paginator = this.paginator; // Set paginator
      // @ts-ignore
      this.books.sort = this.sort; // Set sort
      this.books.data = value
      value.forEach((book: any) => {
        allBooks.push(createBook(book));
        this.filteredBooks = this.books.data;
      })
    }).then(() =>  this.books = new MatTableDataSource(allBooks));
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    this.filteredBooks = this.books.data.filter(book =>
      book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  ngAfterViewInit() {
    // @ts-ignore
    this.books.paginator = this.paginator; // Ensure paginator is set
    // @ts-ignore
    this.books.sort = this.sort; // Ensure sort is set
  }

  deleteBook(id: number): void {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(id).subscribe({
        next: () => {
          this.books.data = this.books.data.filter(book => book.id !== id);
          this.notifications.showSuccess('Raamat edukalt kustutatud!')
        },
        error: (err) => {
          console.error('Error deleting book', err);
          this.notifications.showError('Ei saanud raamatut kustutada! Proovi hiljem uuesti!')
        }
      });
    }
  }

  reserveBook(id: number): void {
    this.bookService.reserveBook(id).subscribe({
      next: () => {
        this.notifications.showSuccess('Raamat edukalt broneeritud!');
        this.fetchBooks();
        },
        error: (err) => {
        console.error('Error reserving book', err);
        this.notifications.showError('Ei saanud raamatut broneerida! Proovi hiljem uuesti!')
      }
    });
  }

  cancelBookReservation(id: number): void {
    this.bookService.cancelBookReservation(id).subscribe({
      next: () => {
        this.notifications.showSuccess('Broneering edukalt tühistatud!')
        this.fetchBooks();
      },
      error: (err) => {
        console.error('Error cancelling reservation', err);
        this.notifications.showError('Ei saanud broneeringut tühistada! Proovi hiljem uuesti!')
      }
    });
  }

  receiveBook(id: number): void {
    this.bookService.receiveBook(id).subscribe({
      next: () => {
        this.notifications.showSuccess('Raamat edukalt kättesaaduks märgitud!')
        this.fetchBooks();
      },
      error: (err) => {
        console.error('Error cancelling reservation', err);
        this.notifications.showError('Raamatut ei õnnestunud kättesaaduks märkida! Proovi hiljem uuesti!')
      }
    });
  }

  returnBook(id: number): void {
    this.bookService.returnBook(id).subscribe({
      next: () => {
        this.notifications.showSuccess('Raamat edukalt tagastatud!')
        this.fetchBooks();
      },
      error: (err) => {
        console.error('Error returning book', err);
        this.notifications.showError('Raamatu tagastatuks märkimine ebaõnnestus! Proovi hiljem uuesti')
      }
    });
  }

  ngOnInit(): void {
    this.updateDisplayedColumns();
    this.fetchBooks();
    this.authService.roleChanged.subscribe(() => {
      this.updateDisplayedColumns();
    });
  }
}

function createBook(book: any): BookData {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    bookedUntil: book.bookedUntil,
    received: book.received
  };
}


export interface BookData {
  id: number;
  title: string;
  author: string;
  bookedUntil: string;
  received: boolean;
}

