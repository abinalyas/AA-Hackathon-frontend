import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
@Injectable()
export class SharedDataService {
    public data: any[] = [];

    setData(key: string, value: any) {


        this.data[key] = value;
    }

    getData(key: string) {

        if (this.data[key] === undefined) { return null; }
        else { return this.data[key]; }
    }

    clearData() {
      this.data = [];
    }
}
