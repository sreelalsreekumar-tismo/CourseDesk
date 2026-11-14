import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { Savednav } from './savednav';

@Component({
  imports: [RouterOutlet, RouterLinkWithHref],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
    savedIds = inject(Savednav).savedIds
  protected readonly title = signal('coursedesk');
}
