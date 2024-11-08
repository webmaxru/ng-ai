import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { SettingsComponent } from '../settings/settings.component';
import { runPipeline, setOptions } from './../transformers.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { processCompletion, copyFromBuffer } from './../ui.utils';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Models } from './../types';

@Component({
  selector: 'app-sentiment-analysis',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBar,
    SettingsComponent,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatSnackBarModule,
    CommonModule,
    MatCardModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
  templateUrl: './sentiment-analysis.component.html',
  styleUrl: './sentiment-analysis.component.css',
})
export class SentimentAnalysisComponent implements AfterViewInit {
  @ViewChild(SettingsComponent) settingsComponent!: SettingsComponent;

  textSeedValue: string = '';

  options: any;
  result: any;

  isPipelineRunning: boolean = false;

  models: Models[] = [
    {
      value: 'Xenova/bert-base-multilingual-uncased-sentiment',
      viewValue: 'bert-base-multilingual-uncased-sentiment',
    },
    {
      value: 'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
      viewValue: 'distilbert-base-uncased-finetuned-sst-2-english',
    },
  ];

  model: string = this.models[0].value;

  freeDimensionOverridesValue = {
    batch_size: 1,
    num_channels: 3,
    height: 224,
    width: 224,
  };

  pipelineParams = {};

  constructor(private snackBar: MatSnackBar) {}

  ngAfterViewInit() {
    this.options = setOptions(
      this.settingsComponent,
      this.freeDimensionOverridesValue
    );
    this.settingsComponent.settingsChange.subscribe(() => {
      this.options = setOptions(
        this.settingsComponent,
        this.freeDimensionOverridesValue
      );
    });
  }

  async copyFromBuffer() {
    await copyFromBuffer(this.snackBar, (text: string) => {
      this.textSeedValue = text;
    });
  }

  async run() {
    this.isPipelineRunning = true;
    this.result = {};

    if (!this.settingsComponent.settings.isRunInWorker) {
      const completion = await runPipeline(
        'sentiment-analysis',
        this.textSeedValue,
        this.model,
        this.options,
        this.pipelineParams
      );

      this.result = processCompletion(this.snackBar, completion);
      this.isPipelineRunning = false;
    } else {
      const worker = new Worker(
        new URL('./../transformers.worker', import.meta.url)
      );
      worker.onmessage = ({ data }) => {
        this.result = processCompletion(this.snackBar, data);
        this.isPipelineRunning = false;
      };
      worker.postMessage({
        pipelineName: 'sentiment-analysis',
        input: this.textSeedValue,
        model: this.model,
        options: this.options,
        pipelineParams: this.pipelineParams,
      });
    }
  }
}
