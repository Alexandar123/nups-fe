import { Injectable } from '@angular/core';
import * as UserActions from '../../store/actions/data-actions';
import * as fromStore from '../../store/reducers';
import { Store } from '@ngrx/store';
import { Subject, ReplaySubject, BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  addsData$: Subject<Array<any>> = new BehaviorSubject<Array<any>>(null);
  wholeNumber$: ReplaySubject<any> = new ReplaySubject<any>(0);
  screnshots$: Subject<any> = new ReplaySubject<Array<any>>(null);
  numberOfAdds$: Subject<any> = new ReplaySubject<Array<any>>(null);
  dataPresent$: Subject<boolean> = new ReplaySubject<boolean>(1);

  tempAdds = [];
  screenshots = [];
  activeFilter;
  allAdsCount: number;

  constructor(private store: Store<fromStore.AppState>,
    private api: ApiService) {

    this.addsData$.next([])
    this.store.select(fromStore.selectFeature)
      .subscribe(
        (res) => {
          if (res != undefined && res.length > 0) {
            this.wholeNumber$.next(res.length)
          }
          if (res != undefined && this.allAdsCount != undefined) {
            this.addsData$.next(res);
          }
        }
      )



    this.store.select(fromStore.GetNumberOfAdds)
      .subscribe(
        (res) => {
          this.allAdsCount = res;
          this.numberOfAdds$.next(res);
        }
      )

    this.store.select(fromStore.GetScreenshost)
      .subscribe(
        (res) => {
          this.screnshots$.next(res)
        }
      )

    // this.api.getTest()
    // .subscribe(
    //   (res) => {
    //     if (res != undefined && res.length > 0) {
    //       this.store.dispatch(UserActions.SetTempAdds({ payload: res }))
    //     }
    //   }
    // )
  }


}
