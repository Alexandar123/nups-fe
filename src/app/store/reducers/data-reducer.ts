import { Action, createReducer, on, State } from '@ngrx/store';
import * as dataActions from '../actions/data-actions';
import { IData } from 'src/app/models/IAllModels';
import { state } from '@angular/animations';

export const initalState: IData = {
  allAdds: {
    tempAdds: [],
    allAds: [],
    acitiveAdds: [],
    numberOfAdds: 0,
    yearData: false
  },
  cities: [],
  filters: [
    { name: 'rent-sell', filter: null },
    { name: 'table', filter: null, number: null },
    { name: 'location', filter: null },
    { name: 'price', filter: null },
    { name: 'type-of-property', filter: null }
  ],
  towns: [],
  user: {
    authData: null,
    coins: 0,
    ip: null,
    id: null
  },
  location: {
    addsLocations: [],
    mainTown: null,
    radius: 0
  },
  loading: false,
  screenShots: [],
  activeFilter: null
}



const dataReducer = createReducer(
  initalState,
  on(dataActions.SetAddsData, (state, { payload }) => {
    state.allAdds.allAds = payload;
    return ({ ...state })
  }),
  on(dataActions.SetAddsNumber, (state, { payload }) => {
    state.allAdds.numberOfAdds = payload;
    return ({ ...state })
  }),
  on(dataActions.SetCitiesData, (state, { payload }) => ({ ...state, cities: payload })),
  on(dataActions.SetTempAdds, (state, { payload }) => {
    state.allAdds.tempAdds = payload;
    return ({ ...state })
  }),
  on(dataActions.SetCoins, (state, { payload }) => {
    state.user.coins = payload;
    return ({ ...state })
  }),
  on(dataActions.SetUser, (state, { payload }) => {
    state.user.authData = payload;
    return ({ ...state })
  }),
  on(dataActions.SetLocationResponse, (state, { payload }) => {
    state.location.addsLocations = payload;
    return ({ ...state })
  }),
  on(dataActions.SetLoadingSpinner, (state, { payload }) => ({ ...state, loading: payload })),
  on(dataActions.MainPosition, (state, { payload }) => {
    state.location.mainTown = payload.mainTown;
    state.location.radius = JSON.parse(JSON.stringify(payload.radius))
    return ({ ...state })
  }),
  on(dataActions.SetScreenShot, (state, { payload }) => ({ ...state, screenShots: payload })),
  on(dataActions.SetUserId, (state, { payload }) => {
    state.user.id = payload;
    return ({ ...state })
  }),
  on(dataActions.SetYearData, (state, { payload }) => {
    state.allAdds.yearData = payload;
    return ({ ...state })
  }),
  on(dataActions.SetFilter, (state, { payload }) => ({ ...state, activeFilter: payload })),
  on(dataActions.ResetData, (state) => {
    state.allAdds.allAds = state.allAdds.tempAdds;
    state.allAdds.tempAdds = JSON.parse(JSON.stringify(state.allAdds.tempAdds));
    return ({ ...state })
  }),
  on(dataActions.SetActiveAdds, (state, {payload}) => {
    state.allAdds.acitiveAdds = payload;
    return ({...state})
  }),
  on(dataActions.SetTownLocation, (state, {payload}) => {
    state.location.mainTown = payload;
    return ({...state})
  }),
  
);

export function reducer(state: IData | undefined, action: Action) {
  return dataReducer(state, action);
}