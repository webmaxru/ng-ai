import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SentimentAnalysisComponent } from "./sentiment-analysis/sentiment-analysis.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SentimentAnalysisComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ng-ai';
}
