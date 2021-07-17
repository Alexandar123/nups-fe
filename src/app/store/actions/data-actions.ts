import {createAction, props} from '@ngrx/store';
import { ICity } from 'src/app/models/IAllModels';

export const getData = createAction(
    '[Data actions]'
    )

export const SetAddsData = createAction(
    '[Data actions] Set response data',
    props<{payload: Array<any>}>()
    
)

export const GetCitiesFromCountry = createAction(
    '[Data actions] Get cities Data',
)

export const SetCitiesData = createAction(
    '[Data actions] Set cities data',
    props<{payload: Array<any>}>()
)

export const CheckFilter = createAction(
    '[Data actions] Check filter status',
    props<{payload: any}>()
)

export const SetTempAdds = createAction(
    '[Data actions] Set towns data',
    props<{payload: Array<any>}>()
)

export const setUserData = createAction(
    '[User actions] Set user data',
    props<{payload: any}>()
)

export const ApplyFilter = createAction(
    '[Data actions] Apply filter',
    props<{payload: any}>()
)

export const CoinSpent = createAction(
    '[User actions] Coin spent'
)

export const SetCoins = createAction(
    '[User actions] Set coins',
    props<{payload: any}>()
)

export const CheckCoins = createAction(
    '[User actions] Check coins',
    props<{payload: any}>()
)

export const GetUserIp = createAction(
    '[User actions] Get user ip'
)

export const SetUser = createAction(
    '[User actions] Set user ip',
    props<{payload: any}>()
)

export const InserNewUser = createAction(
    '[User actions] Insert new user',
    props<{payload: any}>()
)

export const GetEncodedLocation = createAction(
    '[User actions] Get new location',
    props<{payload: any}>()
)

export const SetLocationResponse = createAction(
    '[User actions] Set new location',
    props<{payload: any}>()
)

export const GetAddsByKeyword = createAction(
    '[User actions] Get adds by key',
    props<{payload: any}>()
)

export const SetAddsNumber = createAction(
    '[User actions] SetAddsNumber',
    props<{payload: any}> ()
)

export const FilterByCity = createAction(
    '[User actions] Filter by city',
    props<{payload: any}>()
)

export const SetLoadingSpinner = createAction(
    '[User actions] Set loading spinner',
    props<{payload: any}>()
)

export const SetTownLocation = createAction(
    '[User actions] Set town location',
    props<{payload: any}> ()
)

export const MainPosition = createAction(
    '[User actions] Set main position',
    props<{payload: any}> ()
)

export const SetUserId = createAction(
    '[User actions] Set user id',
    props<{payload: any}> ()
)

export const GetYearData = createAction(
    '[User action] Get inital graph data',
)

export const SetYearData = createAction(
    '[User actions] Set year data',
    props<{payload: any}> ()
)

export const CheckScreenShot = createAction(
    '[User actions] Check screenshots',
    props<{payload: any}>()
)

export const SetScreenShot = createAction(
    '[User actions] Set screenshots',
    props<{payload: any}>()
)


export const SetFilter = createAction(
    '[User actions] SetFilter',
    props<{payload: any}>()
)

export const ResetData = createAction(
    '[User actions] Reset data'
)

export const SetActiveAdds = createAction(
    '[User actions] Set active adds',
    props<{payload: any}>()
)