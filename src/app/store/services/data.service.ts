import { Injectable } from '@angular/core';
import { Subject, ReplaySubject } from 'rxjs';
import { IData } from '../../models/IAllModels';
import { Store } from '@ngrx/store';

import * as UserActions from '../actions';
import * as fromStore from '../reducers';
import { ApiService } from './api.service';
import 'rxjs/add/operator/map'

export interface RentSaleM2 {
  date?: any;
  price?: any
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  addsData: Subject<any> = new ReplaySubject<any>(null);
  wholeNumber$: Subject<any> = new ReplaySubject<any>(null);
  adminAdds$: Subject<any> = new ReplaySubject<any>(null);
  pages$: Subject<number> = new ReplaySubject<number>(null);
  newSearch$: Subject<boolean> = new ReplaySubject<boolean>(null);
  wholeData = [];
  tempAdds = [];
  yearData = [];
  activeTab$: Subject<any> = new ReplaySubject<any>(null);

  constructor(private store: Store<fromStore.AppState>,
    private api: ApiService) {
    this.store.select(fromStore.selectFeature)
      .subscribe(
        (res) => {
          if (res != undefined) {
            this.addsData.next(res);
            this.wholeData = res
          }
        }
      )

    this.store.select(fromStore.selectTemp)
      .subscribe(
        (res) => {
          this.tempAdds = res;
        }
      )
        this.checkRoute()
  }

  getData() {

  }

  addActiveStatus(data: Array<any>): Array<any> {
    for (let i = 0; i < data.length; i++) {
      data[i].active = false;
    }
    return data;
  }
  pricePerGivenReq(request: string, adds: Array<any>): any {
    let data = [];
    let numberOfFound;
    if (adds.length > 0) {
      if (request == 'average-price-list') {
        const addLen = adds.length;
        for (let i = 0; i < addLen; i++) {
          let parsedNum = adds[i].pricePerMeter
          data.push(parsedNum)
          // }
        }
        let avg = 0;
        if (data.length > 0) {
          let sum = data.reduce(function (a, b) { return a + b; });
          avg = sum / data.length;
        }
        return avg.toFixed(2);

      } else if (request == 'median-price-list') {
        let fullData = JSON.parse(JSON.stringify(adds))
        const addLen = fullData.length;
        if (addLen > 1) {
          let nums = [...fullData].sort((a, b) => a.pricePerMeter - b.pricePerMeter);
          const mid = Math.round(fullData.length / 2);
          let sum = fullData.reduce((a, b) => a + b, 0)
          let a = addLen % 2 !== 0 ? nums[mid].pricePerMeter : (nums[mid - 1].pricePerMeter + nums[mid].pricePerMeter) / 2;
          return a.toFixed(2);
        } else {
          return fullData[0].pricePerMeter.toFixed(2)
        }
      } else if (request == 'rent-median') {
        const addLen = adds.length;
        for (let i = 0; i < addLen; i++) {
          if (adds[i].typeOfAd == 'RENT') {
            let parsedNum = adds[i].pricePerMeter
            data.push(parsedNum)
          }
        }
        let avg = 0;
        if (data.length > 0) {
          let sum = data.reduce(function (a, b) { return a + b; });
          avg = sum / data.length;
        }
        return avg.toFixed(2);
      } else if (request == 'rent-m2') {
        const addLen = adds.length;
        for (let i = 0; i < addLen; i++) {
          if (adds[i].typeOfAd == 'RENT') {
            let parsedNum = adds[i].pricePerMeter
            data.push(parsedNum)
          }
        }
        let avg = 0;
        if (data.length > 0) {
          let sum = data.reduce(function (a, b) { return a + b; });
          avg = sum / data.length;
        }
        return avg.toFixed(2);
      }
    } else {
      return 0;
    }

  }


  typeOfProperty(name): any {
    let type;
    if (name == 'type-of-property') {
      type = 'Type of property'
      let allProps = [
        { name: 'Houses', value: 0 },
        { name: 'Flats', value: 0 },
        { name: 'Land', value: 0 },
        { name: 'Spaces', value: 0 }
      ];
      const addLen = this.wholeData.length;
      for (let i = 0; i < addLen; i++) {
        if (this.wholeData[i].description.includes('kuć')) {
          allProps[0].value = allProps[0].value + 1
        } else if (this.wholeData[i].description.includes('stan')) {
          allProps[1].value = allProps[1].value + 1
        } else if (this.wholeData[i].description.includes('zem')) {
          allProps[2].value = allProps[2].value + 1
        } else if (this.wholeData[i].description.includes('prost')) {
          allProps[3].value = allProps[3].value + 1
        }
      }
      return { data: allProps, type: type };
    } else if (name == 'rent-sell') {
      type = 'Type of add'
      let allProps = [
        { name: 'Sell', value: 0 },
        { name: 'Rent', value: 0 }
      ];
      const addLen = this.wholeData.length;
      for (let i = 0; i < addLen; i++) {
        if (this.wholeData[i].description.includes('Proda')) {
          allProps[0].value = allProps[0].value + 1
        } else if (this.wholeData[i].description.includes('Izda')) {
          allProps[1].value = allProps[1].value + 1
        }
      }
      return { data: allProps, type: type };
    }
  }

  rentSaleM2(type: string, addsData: Array<any>) {
    let data = [];
    addsData = this.deepCopy(addsData);
    let prop = type.substr(0, type.indexOf("-"))
    if (type == 'rent-median') {
      let type = 'Medijan zakupna cena po kvadratu'
      let times = [];
      let addLen = addsData.length;
      if (addLen > 0) {
        for (let i = 0; i < addLen; i++) {
          let currentAdd = addsData[i];
          let curr = [];
            for (let y = 0; y < addLen; y++) {
              let nextAdd = addsData[y];
              if (currentAdd.id != nextAdd.id && currentAdd.areas == nextAdd.areas) {
                curr.push(Object.assign({}, nextAdd));
                addsData.splice(y, 1);
                addLen--;
                y--;
              }
            }
            times.push({ currentAdd: currentAdd, times: curr })
        }
        let fullData = [];
        const timesLen = times.length;
        for (let i = 0; i < timesLen; i++) {
          if (times[i].times.length > 0) {
            times[i].times.push(times[i].currentAdd)
            let arr = times[i].times
            let nums = [...arr].sort((a, b) => a.pricePerMeter - b.pricePerMeter);
            const mid = Math.round(arr.length / 2);
            let sum = arr.reduce((a, b) => a + b, 0)
            let a = arr.length % 2 !== 0 ? nums[mid].pricePerMeter : (nums[mid - 1].pricePerMeter + nums[mid].pricePerMeter) / 2;
            if (a == 0) {
              for (let i = 0; i < arr.length; i++) {
                if (arr[i].price != 0) {
                  a = arr[i].pricePerMeter;
                  // return;
                }
              }
            }
            if (a > 0) {
              fullData.push({ price: a, sqare: arr[0].areas })
            }
          } else {
            if (times[i].currentAdd.pricePerMeter > 0) {
              fullData.push({ price: times[i].currentAdd.pricePerMeter, sqare: times[i].currentAdd.areas })
            }
          }
        }
        fullData = [...fullData].sort((a, b) => a.sqare - b.sqare);
        return { data: fullData, type: type };
      } else {
        return { data: addsData, type: type };
      }

    }
    if (type == 'sell-median') {
      let type = 'Medijan prodajna cena po m2'
      let times = [];
      let addLen = addsData.length;
      if (addLen > 0) {
        for (let i = 0; i < addLen; i++) {
          let currentAdd = addsData[i];
          let curr = [];
            for (let y = 0; y < addLen; y++) {
              let nextAdd = addsData[y];
              if (currentAdd.id != nextAdd.id && currentAdd.areas == nextAdd.areas) {
                curr.push(Object.assign({}, nextAdd));
                addsData.splice(y, 1);
                addLen--;
                y--;
              }
            }
            times.push({ currentAdd: currentAdd, times: curr })
        }
        let fullData = [];
        const timesLen = times.length;
        for (let i = 0; i < timesLen; i++) {
          if (times[i].times.length > 0) {
            times[i].times.push(times[i].currentAdd)
            let arr = times[i].times
            const mid = Math.round(arr.length / 2);
            let sum = arr.reduce((a, b) => a + b, 0)
            let nums = [...arr].sort((a, b) => a.pricePerMeter - b.pricePerMeter);
            let a = arr.length % 2 !== 0 ? nums[mid].pricePerMeter : (nums[mid - 1].pricePerMeter + nums[mid].pricePerMeter) / 2;
            if (a == 0) {
              for (let i = 0; i < arr.length; i++) {
                if (arr[i].pricePerMeter != 0) {
                  a = arr[i].pricePerMeter;
                  // return;
                }
              }
            }
            if (a > 0) {
              fullData.push({ price: a, sqare: arr[0].areas })
            }
          } else {
            if (times[i].currentAdd.pricePerMeter > 0) {
              fullData.push({ price: times[i].currentAdd.pricePerMeter, sqare: times[i].currentAdd.areas })
            }
          }
        }
        fullData = [...fullData].sort((a, b) => a.sqare - b.sqare);
        return { data: fullData, type: type };
      }
    }
    return { data: addsData, type: type };
  }

  fullYearData(payload, type?) {
    let prop = payload.substr(0, payload.indexOf("-"))
    let request;
    if (type == undefined) {
      request = {
        type: 'apartment',
        prop: prop
      }
    } else {
      request = {
        type: type,
        prop: prop
      }
    }
    this.api.getAllAverage(request)
      .subscribe(
        (res) => {
          let a = res;
          let first = [];
          let second = [];
          first.push(res.firstHalfOfYear);
          second.push(res.secondHalfOfYear);
          for (let [key, value] of Object.entries(res.firstHalfOfYear)) {
            if (value > 0) {
              first.push({ year: '01/06/' + key, price: value })
            }
          }
          for (let [key, value] of Object.entries(res.secondHalfOfYear)) {
            if (value > 0) {
              second.push({ year: '06/12/' + key, price: value })
            }
          }
          first.splice(0, 1)
          second.splice(0, 1)
          let third = [];
          for (let i = 0; i < first.length; i++) {
            third.push(first[i])
            third.push(second[i])
          }
          return third;
        })
  }

  rentSale(type: string, addsData: any) {
    let data = [];
    let resp = {}
    if (type == 'RENT') {
      return resp = { data: addsData, type: 'Prodaja' };
    } else {
      return resp = { data: addsData, type: 'Zakupnina' };
    }
  }

  propFilter(type) {
    let dataFilters = [];
    if (type == 'Flats') {
      for (let i = 0; i < this.wholeData.length; i++) {
        if (this.wholeData[i].description.includes('stan')) {
          dataFilters.push(this.wholeData[i])
        }
      }
      this.wholeData = dataFilters;
      this.wholeNumber$.next(this.wholeData.length)
    } else if (type == 'Houses') {
      for (let i = 0; i < this.wholeData.length; i++) {
        if (this.wholeData[i].description.includes('kuća')) {
          dataFilters.push(this.wholeData[i])
        }
      }
      this.wholeData = dataFilters;
      this.wholeNumber$.next(this.wholeData.length)

    } else if (type == 'Land') {
      for (let i = 0; i < this.wholeData.length; i++) {
        if (this.wholeData[i].description.includes('zemlj')) {
          dataFilters.push(this.wholeData[i])
        }
      }
      this.wholeData = dataFilters;
      this.wholeNumber$.next(this.wholeData.length)
    } else if (type == 'Space') {
      for (let i = 0; i < this.wholeData.length; i++) {
        if (this.wholeData[i].description.includes('prost')) {
          dataFilters.push(this.wholeData[i])
        }
      }
      this.wholeData = dataFilters;
      this.wholeNumber$.next(this.wholeData.length)
    }
  }

  checkForMax() {
    let max = +this.wholeData[0].price;
    for (let i = 0; i < this.wholeData.length; i++) {
      let parsedNum = +this.wholeData[i].price;
      if (parsedNum > max) {
        max = parsedNum;
      }
    }
    return max;
  }

  checkRange(start, end) {
    let adds = [];
    for (let i = 0; i < this.wholeData.length; i++) {
      let parsedNum = +this.wholeData[i].price;
      if (parsedNum >= start && parsedNum <= end) {
        adds.push(this.wholeData[i])
      }
    }
    this.wholeData = adds;
    this.wholeNumber$.next(this.wholeData.length)
    this.store.dispatch(UserActions.actions.SetAddsData({ payload: adds }))

  }

  filterByActiveStatus(id, status) {
    for (let i = 0; i < this.wholeData.length; i++) {
      if (this.wholeData[i].id_ad == id) {
        this.wholeData[i].selected = status;
      }
    }
    this.wholeNumber$.next(this.wholeData.length)
  }

  checkStreet(adds, street) {
    let parsed = [];
    for (let i = 0; i < adds.length; i++) {
      if (adds[i].address.includes(street)) {
        parsed.push(adds[i])
      }
    }
    return parsed;
  }

  checkMinSqare(adds, sqare) {
    let parsed = [];
    for (let i = 0; i < adds.length; i++) {
      if (adds[i].areas > sqare) {
        parsed.push(adds[i])
      }
    }
    return parsed;
  }

  checkMaxSqare(adds, sqare) {
    let parsed = [];
    for (let i = 0; i < adds.length; i++) {
      if (adds[i].areas < sqare) {
        parsed.push(adds[i])
      }
    }
    return parsed;
  }

  checkProperty(adds, type) {
    let parsed = [];
    for (let i = 0; i < adds.length; i++) {
      if (adds[i].typeOfProperty == type) {
        parsed.push(adds[i])
      }
    }
    return parsed;
  }

  checkType(adds, type) {
    let parsed = [];
    for (let i = 0; i < adds.length; i++) {
      if (adds[i].typeOfAd == type) {
        parsed.push(adds[i])
      }
    }
    return parsed;
  }


  tableFilter(activeAdds: Array<any>) {
    let tempData = JSON.parse(JSON.stringify(this.tempAdds));
    let newData = [];
    for (let i = 0; i < tempData.length; i++) {
      for (let y = 0; y < activeAdds.length; y++) {
        if (tempData[i].id_ad == activeAdds[y].id_ad) {
          newData.push(tempData[i])
        }
      }
    }
    this.store.dispatch(UserActions.actions.SetAddsData({ payload: newData }))
  }

  resetTableFilters() {
    this.store.dispatch(UserActions.actions.SetAddsData({ payload: this.tempAdds }))
  }

  medianPriceSingle(value, side) {
    let fullData = [];
    for (let i = 0; i < this.wholeData.length; i++) {
      if (side == '<') {
        if (this.wholeData[i].areas <= value) {
          fullData.push(this.wholeData[i])
        }
      } else if (side == '>') {
        if (this.wholeData[i].areas >= value) {
          fullData.push(this.wholeData[i])
        }
      } else {
        if (this.wholeData[i].areas == value) {
          fullData.push(this.wholeData[i])
        }
      }
    }
    let a = 0;
    if (fullData.length > 0) {
      if (fullData.length > 1) {
        const mid = Math.round(fullData.length / 2);
        let sum = fullData.reduce((a, b) => a + b, 0)
        let nums = [...fullData].sort((a, b) => a.price - b.price);
        a = fullData.length % 2 !== 0 ? nums[mid].price : (nums[mid - 1].price + nums[mid].price) / 2;
      } else {
        a = fullData[0].price
      }
    }
    return a;
  }

  medianPrieceMulti(from, to) {
    let fullData = [];
    for (let i = 0; i < this.wholeData.length; i++) {
      if (this.wholeData[i].areas >= from && this.wholeData[i].areas <= to) {
        fullData.push(this.wholeData[i])
      }
    }
    let a = 0;
    if (fullData.length > 0) {
      if (fullData.length > 1) {
        const mid = Math.round(fullData.length / 2);
        let sum = fullData.reduce((a, b) => a + b, 0)
        let nums = [...fullData].sort((a, b) => a.price - b.price);
        a = fullData.length % 2 !== 0 ? nums[mid].price : (nums[mid - 1].price + nums[mid].price) / 2;
      } else {
        a = fullData[0].price
      }
    }
    return a;
  }

  deepCopy(data: any) {
    return JSON.parse(JSON.stringify(data));
  }

  checkRoute() {
    const currentRoute = window.location.pathname;
    if (currentRoute.includes('main')) {
      this.activeTab$.next('Main tab');
    } else if (currentRoute.includes('graphs')) {
      this.activeTab$.next('Graphs tab');

    } else if (currentRoute.includes('tables')) {
      this.activeTab$.next('Tables tab');

    } else if (currentRoute.includes('map')) {
      this.activeTab$.next('Map tab');
    }
  }

  getAdminAdds(from, to, page) {
    this.api.getAdminAdds(from, to, page)
    .subscribe(
      (res) => {
        this.adminAdds$.next(res['content']);
        this.pages$.next(res['totalPages'] - 1)
      }
    )
  }


  updateAdd(add) {
    this.api.updateAdd(add)
    .subscribe(
      (res) => {
        console.log(res)
      }
    )
  }

  deleteAdd(id) {
    this.api.deleteAdd(id)
    .subscribe(
      (res) => {
        console.log(res)
      }
    )
  }
}
