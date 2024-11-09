# Angular AI: WebNN using Transformers.js

Offline-ready, privacy-first application that leverages the most suitable hardware available on the edge to run AI workloads.

![Logo](https://github.com/webmaxru/ng-ai/raw/main/public/icons/icon-512x512.png)

## Features

- Feature detection: WebGPU, WebNN, NPU
- Running AI inference in the worker thread, off the main thread
- Installable, offline-ready PWA
- Multiple use cases: image classification, sentiment analysis, and more

## Technologies used

- Angular 18 + Angular Material 3
- Workbox: offline-readiness, precaching, runtime caching, smart update flow
- Transformers.js: AI pipelines, models caching. Using ONNX Web Runtime and WebNN, WebGPU under the hood

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
