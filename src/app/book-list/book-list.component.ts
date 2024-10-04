// @ts-ignore
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatSidenav, MatSidenavContainer, MatSidenavModule} from "@angular/material/sidenav";
import {MatList, MatListItem, MatNavList} from "@angular/material/list";
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatFormField, MatInput} from "@angular/material/input";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {ApiService} from "../api.service";
import {DatePipe, NgIf} from "@angular/common";
import {MatOption, MatSelect} from "@angular/material/select";
import {NotificationService} from "../service/notification.service";
import {LoginService} from "../service/login.service";
import {MatDialog} from "@angular/material/dialog";
import {BookAddComponent} from "../book-add/book-add.component";
import {FormsModule} from "@angular/forms";

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
    RouterLinkActive,
    FormsModule
  ],
  providers: [ApiService],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})
export class BookListComponent implements OnInit {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  isCollapsed = false;
  displayedColumns = ['id', 'name', 'bookedUntil', 'reserve'];
  books: MatTableDataSource<BookData>;
  selectedRole: string | null;
  author: string = '';
  title: string = '';
  pageSize: number = 10;
  currentPage: number = 0;
  totalElements: number = 0;
  pageSizeOptions: number[] = [5, 10, 20, 50];

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator | null = null;
  @ViewChild(MatSort, { static: false }) sort: MatSort | null = null;

  constructor(private bookService: ApiService, protected notifications: NotificationService,
              protected loginService: LoginService, protected dialog: MatDialog) {
    this.selectedRole = localStorage.getItem('role')
    console.log(this.selectedRole, 'role')
    this.books = new MatTableDataSource<BookData>();
    if (this.loginService.isAdmin()) {
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

  updateDisplayedColumns(): void {
    this.displayedColumns = ['id', 'title', 'author', 'bookedUntil', 'reserve'];
    if (this.loginService.isAdmin()) {
      this.displayedColumns.push('actions');
    }
  }

  fetchBooks(): void {
    this.bookService.searchBooks(this.author, this.title, this.currentPage, this.pageSize).subscribe((value) => {
      this.books.data = value.content.map(createBook);
      this.totalElements = value.totalElements;
    }, err => {
      console.error('Error fetching books:', err);
    });
  }

  deleteBook(id: number): void {
    if (confirm('Oled kindel, et soovid selle raamatu kustutada?')) {
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
    const userId = localStorage.getItem('userId');
    // @ts-ignore
    this.bookService.reserveBook(id, userId).subscribe({
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


  search(author: string, title: string) {
    this.author = author;
    this.title = title;
    this.currentPage = 0;
    this.fetchBooks();
  }


  clearFilters() {
    this.author = '';
    this.title = '';
    this.fetchBooks();
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchBooks();
  }

  isLoggedInUserBooked(bookedByUserId: number) {
    const userId = Number(localStorage.getItem('userId'));
    if (isNaN(userId)) {
      return false;
    }
    return Number(userId) === bookedByUserId;
  }

  ngOnInit(): void {
    this.updateDisplayedColumns();
    this.fetchBooks();
  }
}

function createBook(book: any): BookData {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    bookedUntil: book.bookedUntil,
    received: book.received,
    bookedByUserId: book.bookedByUserId
  };
}

export interface BookData {
  id: number;
  title: string;
  author: string;
  bookedUntil: string;
  received: boolean;
  bookedByUserId: number;
}

