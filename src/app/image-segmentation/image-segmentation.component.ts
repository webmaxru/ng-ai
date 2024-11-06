import {
  Component,
  ViewChild,
  AfterViewInit,
  signal,
  ElementRef,
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
import {
  runPipeline,
  setOptions,
} from './../transformers.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { showError, showSuccess, processCompletion } from './../ui.utils';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-image-segmentation',
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
  templateUrl: './image-segmentation.component.html',
  styleUrl: './image-segmentation.component.css',
})
export class ImageSegmentationComponent implements AfterViewInit {
  @ViewChild(SettingsComponent) settingsComponent!: SettingsComponent;

  imageName = signal('');
  fileSize = signal(0);
  uploadProgress = signal(0);
  imagePreview = signal('');
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  selectedFile: File | null = null;
  uploadSuccess: boolean = false;
  uploadError: boolean = false;

  options: any;
  result: any;
  isPipelineRunning: boolean = false;

  // https://github.com/microsoft/webnn-developer-preview/blob/main/demos/image-classification/index.js

  model: string = '';
  freeDimensionOverridesValue = {
    batch_size: 1,
    num_channels: 1,
    height: 890,
    width: 1333,
  };

  segmentationPipelineParams = {
    threshold: 0.5,
  };
  classificationPipelineParams = {
    top_k: 0.5,
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

  async run(pipelineName:any) {
    this.isPipelineRunning = true;
    this.result = {};

    if (!this.settingsComponent.isRunInWorker) {
      const completion = await runPipeline(
        pipelineName,
        this.imagePreview(),
        this.model,
        this.options,
        pipelineName == 'image-segmentation' ? this.segmentationPipelineParams : this.classificationPipelineParams,
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
        pipeline: pipelineName,
        input: this.imagePreview(),
        model: this.model,
        options: this.options,
        pipelineParams: pipelineName == 'image-segmentation' ? this.segmentationPipelineParams : this.classificationPipelineParams,
      });
    }
  }

  // Handler for file input change
  onFileChange(event: any): void {
    const file = event.target.files[0] as File | null;
    this.uploadFile(file);
  }

  // Handler for file drop
  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0] as File | null;
    this.uploadFile(file);
  }

  // Prevent default dragover behavior
  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  // Method to handle file upload
  uploadFile(file: File | null): void {
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;
      this.fileSize.set(Math.round(file.size / 1024)); // Set file size in KB

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview.set(e.target?.result as string); // Set image preview URL
      };
      reader.readAsDataURL(file);

      this.uploadSuccess = true;
      this.uploadError = false;
      this.imageName.set(file.name); // Set image name
    } else {
      this.uploadSuccess = false;
      this.uploadError = true;
      this.snackBar.open('Only image files are supported!', 'Close', {
        duration: 3000,
        panelClass: 'error',
      });
    }
  }

  // Method to remove the uploaded image
  removeImage(): void {
    this.selectedFile = null;
    this.imageName.set('');
    this.fileSize.set(0);
    this.imagePreview.set('');
    this.uploadSuccess = false;
    this.uploadError = false;
    this.uploadProgress.set(0);
  }
}
