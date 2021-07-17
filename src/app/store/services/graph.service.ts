import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { ApiService } from './api.service';
import { SubSink } from 'subsink'

@Injectable({
  providedIn: 'root'
})
export class GraphService implements OnDestroy {

  chosenAddType$: Subject<any> = new ReplaySubject<any>(null);
  chosedAddOrigin$: BehaviorSubject<any> = new BehaviorSubject<any>(0);

  priceData$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  subs = new SubSink();

  constructor(private api: ApiService) { }

  createCharts(data: Object) {
  }

  getMeadianByPros(formData) {
    this.priceData$.next([])
    this.subs.sink = this.api.getMedianData(formData).subscribe(
      (res) => {
        this.priceData$.next(res)
      }
    )
  }

  ngOnDestroy() {
    this.subs.unsubscribe()
  }
}

