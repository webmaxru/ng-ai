import {
  Component,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { SettingsComponent } from '../settings/settings.component';
import { generateText, setOptions } from './../transformers.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { showError, showSuccess, copyFromBuffer } from './../ui.utils';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-text-generation',
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
  ],
  templateUrl: './text-generation.component.html',
  styleUrl: './text-generation.component.css',
})
export class TextGenerationComponent implements AfterViewInit {
  @ViewChild(SettingsComponent) settingsComponent!: SettingsComponent;

  textSeedValue: string = '';

  options: any;
  result: any;

  isPipelineRunning: boolean = false;

  model: string = 'Xenova/Phi-3-mini-4k-instruct';

  freeDimensionOverridesValue = {
    batch_size: 1,
    num_channels: 3,
    height: 224,
    width: 224,
  };

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

    const result = await generateText(
      this.textSeedValue,
      this.model,
      this.options,
    );

    this.isPipelineRunning = false;

    if (!result.error) {
      showSuccess(this.snackBar, `Completed in ${result.duration} ms`);
      console.log(result.result);
      this.result = result.result;
    } else {
      showError(this.snackBar, result.error);
    }
  }

  runWorker() {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker(
        new URL('./text-generation.worker', import.meta.url)
      );
      worker.onmessage = ({ data }) => {
        if (!data.error) {
          showSuccess(this.snackBar, `Completed in ${data.duration} ms`);

          this.result = data.result;

        } else {
          showError(this.snackBar, data.error);
        }

        this.isPipelineRunning = false;
      };
      worker.postMessage({
        text: this.textSeedValue,
        model: this.model,
        options: this.options,
      });
      this.isPipelineRunning = true;
      this.result = {};
    } else {
      showError(
        this.snackBar,
        'Web Workers are not supported in this environment. Running in the main thread.'
      );
      this.run();
    }
  }
}
