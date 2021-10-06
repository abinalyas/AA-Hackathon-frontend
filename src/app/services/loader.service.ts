import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  count = 0;

  constructor() {
    setInterval(() => {
    }, 2000
    );
  }

  enableLoader() {
    this.count = this.count + 1;
  }

  disableLoader() {
    this.count = this.count - 1;
  }

  forceDisableLoader() {
    this.count = 0;
  }
}
