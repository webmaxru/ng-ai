import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { RouterOutlet } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { showError, showSuccess } from './../ui.utils';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterOutlet,
  ],
})
export class NavigationComponent {
  private breakpointObserver = inject(BreakpointObserver);
  constructor(private snackBar: MatSnackBar) {}

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  sharePage() {
    if (navigator.share) {
      navigator
        .share({
          title: document.title,
          text: 'Example of WebNN using Transformers.js',
          url: window.location.href,
        })
        .catch((error) => {
          showError(this.snackBar, `Error sharing the page: ${error}`);
        });
    } else {
      showError(
        this.snackBar,
        'Web Share API is not supported in this browser.'
      );
    }
  }
}
