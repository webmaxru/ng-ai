import {
  Component,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

declare const MLGraphBuilder: any;

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonToggleModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements AfterViewInit {
  private _settings: any;

  @Output() settingsChange = new EventEmitter<any>();

  get settings(): any {
    return this._settings;
  }

  set settings(value: any) {
    this._settings = value;
    this.settingsChange.emit(this._settings);
  }

  updateSettings(key: string, value: any) {
    this.settings = { ...this.settings, [key]: value };
  }

  isWebNNEnabled: boolean = false;
  isWebGPUEnabled: boolean = false;
  isNPUEnabled: boolean = false;
  isFp16Enabled: boolean = false;
  isWorkerEnabled: boolean = false;

  ngAfterViewInit() {}

  ngOnInit(): void {
    this.settings = {
      api: 'webnn',
      webnnDevice: '',
      quantization: 'fp16',
      isFreeDimensionOverrides: false,
      isRunInWorker: false,
    };

    this.isWebNN().then((res) => {
      this.isWebNNEnabled = res;
    });
    this.isWebGPU().then((res) => {
      this.isWebGPUEnabled = res;
    });
    this.isNPU().then((res) => {
      this.isNPUEnabled = res;
    });
    this.isFp16().then((res) => {
      this.isFp16Enabled = res;
    });

    this.isWorker().then((res) => {
      this.isWorkerEnabled = res;

      if (this.isWorkerEnabled) {
        this.settings.isRunInWorker = true;
      }
    });
  }

  async isWebNN() {
    let navigatorObj = <any>navigator;

    if (typeof (<any>MLGraphBuilder) !== 'undefined') {
      const context = await navigatorObj.ml.createContext();
      return !context.tf;
    } else {
      return false;
    }
  }

  async isWebGPU() {
    let navigatorObj = <any>navigator;

    if (navigatorObj.gpu) {
      try {
        await navigatorObj.gpu.requestAdapter();
        return true;
      } catch (e) {
        return false;
      }
    } else {
      return false;
    }
  }

  async isNPU() {
    let navigatorObj = <any>navigator;

    try {
      await navigatorObj.ml.createContext({ deviceType: 'npu' });
      return true;
    } catch (e) {
      return false;
    }
  }

  async isFp16() {
    let navigatorObj = <any>navigator;

    try {
      const adapter = await navigatorObj.gpu.requestAdapter();
      return adapter.features.has('shader-f16');
    } catch (e) {
      return false;
    }
  }

  async isWorker() {
    if (typeof Worker !== 'undefined') {
      return true;
    } else {
      return false;
    }
  }
}
