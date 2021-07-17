import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, Effect } from '@ngrx/effects';
import * as dataActions from '../actions/data-actions';
import { withLatestFrom, map, switchMap, catchError, flatMap } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { of, forkJoin } from 'rxjs';
import { GeoDbService } from 'wft-geodb-angular-client';
import { GeoResponse } from 'wft-geodb-angular-client/lib/model/geo-response.model';
import { PlaceSummary } from 'wft-geodb-angular-client/lib/model/place-summary.model';
import { ICity } from 'src/app/models/IAllModels';
import * as fromStore from '../reducers'
import { Store } from '@ngrx/store';
import { DataService } from '../services/data.service';
@Injectable()
export class DataEffects {

  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private geoDbService: GeoDbService,
    public store: Store<fromStore.AppState>,
    public dataService: DataService
  ) { }

  @Effect()
  getCustomers = this.actions$.pipe(ofType(dataActions.getData),
    switchMap(() =>
      this.apiService.getLocation()
        .pipe(
          flatMap(adds => {
            return [dataActions.SetAddsNumber({ payload: adds }),
            dataActions.SetYearData({ payload: true })]
          }
          ),
        ),
    ),
  );


  @Effect()
  checkCoins = this.actions$.pipe(ofType(dataActions.CheckCoins),
    withLatestFrom(this.store),
    switchMap(([action, state]) => {
      let id = action.payload;
      if (action.payload == undefined) {
        id = state.data.user.id
      }
      return this.apiService.getUserPoint(id)
        .pipe(
          map(res => {
            return dataActions.SetCoins({ payload: res })
          })
        )
    })
  )

  @Effect()
  coinSpent = this.actions$.pipe(ofType(dataActions.CoinSpent),
    withLatestFrom(this.store),
    switchMap(([action, state]) => {
      return this.apiService.decreaseUserPoints(state.data.user.id)
        .pipe(
          map(res => {
            return dataActions.CheckCoins({ payload: state.data.user.id })
          })
        )
    })
  )

  @Effect()
  getAddsByKeyword$ = this.actions$.pipe(ofType(dataActions.GetAddsByKeyword),
    withLatestFrom(this.store),
    switchMap(([action, state]) => {
      let city = action.payload.city;
      let key = action.payload.key;
      return this.apiService.getAddsByKeyword(city, key)
        .pipe(
          map(res => {
            return dataActions.SetAddsData({ payload: res })
          })
        )
    }))

  @Effect()
  filterByTown$ = this.actions$.pipe(ofType(dataActions.FilterByCity),
    switchMap((action) => {
      let city = action.payload.city;
      return this.apiService.filterByCity(city)
        .pipe(
          map(res => {
            return dataActions.SetAddsData({ payload: res })
          })
        )
    }))

  @Effect()
  checkScreenshot$ = this.actions$.pipe(ofType(dataActions.CheckScreenShot),
    withLatestFrom(this.store),
    flatMap(([action, state]) => {
      let screenShots = state.data.screenShots;
      let current = action.payload;
      if (screenShots.length == 0) {
        screenShots.push(current)
        return [dataActions.SetScreenShot({ payload: screenShots })]
      } else {
        let exist;
        for (let i = 0; i < screenShots.length; i++) {
          if (screenShots[i].origin == current.origin) {
            exist = true;
            screenShots[i] = current;
          }
        }
        for (let i = 0; i < screenShots.length; i++) {
          if (screenShots[i].origin == current.origin) {
            return [dataActions.SetScreenShot({ payload: screenShots })]
          } else {
            exist = false;
          }
        }
        if (!exist) {
          screenShots.push(current)
          return [dataActions.SetScreenShot({ payload: screenShots })]
        } else {
          return [dataActions.SetScreenShot({ payload: screenShots })]
        }
      }

    })
  )
}

