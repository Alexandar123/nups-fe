import { createSelector } from '@ngrx/store';
import { IData, ICity } from 'src/app/models/IAllModels';

 
export interface AppState {
  data: IData;
  cities: ICity;
  filters: any;
  location: any;
}

//adds data

export const selectFeature = (state: AppState) => state.data.allAdds.allAds;
export const selectTemp = (state: AppState) => state.data.allAdds.tempAdds;

export const selectCoutries = (state: AppState) => state.data.cities;
export const selectFilters = (state: AppState) => state.data.filters;

// user

export const getUserData = (state: AppState) => state.data.user.authData;
export const getCoinsData = (state: AppState) => state.data.user.coins;

export const getLocationProps = (state: AppState) => state.data.location.addsLocations;

export const getMainLocation = (state: AppState) => state.data.location.mainTown;
export const getRadius = (state: AppState) => state.data.location.radius;


export const GetNumberOfAdds = (state: AppState) => state.data.allAdds.numberOfAdds;
export const getLoadingStatus = (state: AppState) => state.data.loading;

export const GetAllAverage = (state: AppState) => state.data.allAdds.yearData;

export const GetScreenshost = (state: AppState) => state.data.screenShots;

export const GetActiveFilter = (state: AppState) => state.data.activeFilter;

export const GetActiveAdds = (state: AppState) => state.data.allAdds.acitiveAdds;