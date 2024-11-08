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
    MatCheckboxModule,
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

  models: Models[] = [
    {
      value: 'Xenova/Phi-3-mini-4k-instruct',
      viewValue: 'Phi-3-mini-4k-instruct',
    },
    {
      value: 'Xenova/gpt2',
      viewValue: 'gpt2',
    },
    { value: 'Xenova/llama2.c-stories15M', viewValue: 'llama2.c-stories15M' },
    {
      value: 'onnx-community/MobileLLM-125M',
      viewValue: 'MobileLLM-125M - set fp32',
    },
    {
      value: 'onnx-community/AMD-OLMo-1B-SFT-DPO',
      viewValue: 'AMD-OLMo-1B-SFT-DPO - set q4',
    },
  ];

  model: string = this.models[0].value;

  freeDimensionOverridesValue = {
    batch_size: 1,
    num_channels: 3,
    height: 224,
    width: 224,
  };

  pipelineParams = {
    max_new_tokens: 30,
    //temperature: 2,
    //max_new_tokens: 10,
    //repetition_penalty: 1.5,
    //no_repeat_ngram_size: 2,
    //num_beams: 2,
    //num_return_sequences: 2,
  };

  // 'text-generation': options.use_external_data_format = true;

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
        'text-generation',
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
        pipelineName: 'text-generation',
        input: this.textSeedValue,
        model: this.model,
        options: this.options,
        pipelineParams: this.pipelineParams,
      });
    }
  }
}
