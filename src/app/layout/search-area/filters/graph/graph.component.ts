import { Component, OnInit, ViewChild, Input, ElementRef, Renderer2, ChangeDetectionStrategy, SimpleChanges, OnChanges, AfterViewInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import * as Chart from 'chart.js';
import { DataService } from 'src/app/store/services/data.service';
import { MatDialog } from '@angular/material';
import { AddTypeModalComponent } from '../add-type-modal/add-type-modal.component';
import { ApiService } from 'src/app/store/services/api.service';
import { Store } from '@ngrx/store';
import * as fromStore from '../../../../store/reducers';
import * as UserActions from '../../../../store/actions/data-actions';
import { MainService } from 'src/app/store/services/main.service';
import { Subject, BehaviorSubject } from 'rxjs';
import { GraphService } from 'src/app/store/services/graph.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraphComponent  {
  propType: BehaviorSubject<any> = new BehaviorSubject<any>(0);
  @Input() name: any;
  @Input() set number(data) {

  }

  @Input('data') set setData(done) {
    this.addsData = done;
    if (done != null && (this.name != 'sell-full-average-m2' && this.name != 'rent-full-average-m2')) {
      let name = this.graph.chosedAddOrigin$.value;
      if (this.name.includes(name)) {
        this.createCharts(this.data.rentSaleM2(this.name, this.graph.priceData$.value))
      } else {
        this.createCharts(this.data.rentSaleM2(this.name, []))
      }
    }
  }
  third = [];
  allCharts = [];
  addsData: Array<any>
  @ViewChild('chart', { read: ElementRef, static: false })
  public searchTextInput: ElementRef;
  @ViewChild('chartWrap', { read: ElementRef, static: false })
  public chartWrap: ElementRef;

  constructor(private data: DataService,
    public main: MainService,
    public dialog: MatDialog,
    public api: ApiService,
    public graph: GraphService,
    private store: Store<fromStore.AppState>,
    public render: Renderer2) {
  }

  typeOf: Subject<any> = new BehaviorSubject<any>(0);
  typeOfS: Subject<any> = new BehaviorSubject<any>(0);


  checkFullCharts(addType) {
    if (this.name == 'sell-full-average-m2' || this.name == 'rent-full-average-m2') {
      // this.fullYearData(this.name, addType);
    }
  }

  createCharts(data) {
    if (this.searchTextInput == undefined) {
      setTimeout(() => {
        this.createCharts(data);
      }, 250)
    }
    if (data != undefined && this.searchTextInput != undefined) {
      this.checkName()
      if (this.allCharts.length > 0) {
        let chart = this.allCharts[0];
        chart.destroy();
      }
      let ctx = this.searchTextInput.nativeElement.getContext("2d")
      let chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',
        // The data for our dataset
        data: {
          datasets: [{
            label: data.type,
            fill: true,
            backgroundColor: 'rgba(255, 10, 13, 0.1)',
            borderColor: '#8426ff',
            pointRadius: 2,
            pointHoverRadius: 4,
            data: []
          }]
        },

        // Configuration options go here
        options: {
          scales: {
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'price per m2'
              }
            }],
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'sqare meters'
              }
            }]
          },
          responsive: true,
          maintainAspectRatio: false,
          events: ['mousemove'],
          animation: {
            onComplete: (e) => {
              e.chart.options.animation.onComplete = null;
              // this.screenShotChart()
            }
          }
        }
      });
      if (this.name == 'rent-full-average-m2' || this.name == 'sell-full-average-m2') {
        for (let i = 0; i < data.data.length; i++) {
          if (data.data[i].price != 'NaN') {
            chart.config.data.datasets[0].data.push(data.data[i].price)
            chart.config.data.labels.push(data.data[i].year)
          }
        }
        chart.config.options.scales.xAxes[0].scaleLabel.labelString = 'date'
      }
      else if (this.name == 'average') {
        for (let i = 0; i < data.data.length; i++) {
          chart.config.data.datasets[0].data.push(data.data[i].price)
        }
        chart.config.data.labels.push(data.data[0].date)
        chart.config.data.labels.push(data.data[data.data.length - 1].date)
      } else {
        for (let i = 0; i < data.data.length; i++) {
          chart.config.data.datasets[0].data.push(data.data[i].price)
          chart.config.data.labels.push(data.data[i].sqare)
        }
        // chart.config.data.labels.push(data.data[data.data.length - 1].year)
      }
      chart.update();
      this.allCharts = [];
      this.allCharts.push(chart);
      // this.screenShotChart()
    }
  }

  openDialog(origin?) {
    let org = origin;
    const dialogRef = this.dialog.open(AddTypeModalComponent, {
      width: '250px',
      data: { name: this.name, origin: origin }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.propType = result;
        if (this.name == 'rent-full-average-m2' || this.name == 'sell-full-average-m2') {
          this.fullYearData(this.name, result.toLowerCase())
        } else {
          this.createCharts(this.data.rentSaleM2(this.name, this.addsData))
        }
      }
    });
  }

  checkName() {
    if (this.name == 'rent-full-average-m2') {
      this.typeOf.next('Average rent price per m2 by date');
      // this.typeOfS.next('Prosecna cena iznajmljivanja');
      if (this.propType) {
        // this.propType.next('Apartment');
      }
    } else if (this.name == 'sell-full-average-m2') {
      this.typeOf.next('Prosecna cena prodaje po m2');
      // this.typeOf.next('Average sell price per m2 by date');
      if (this.propType) {
        // this.propType.next('Apartment');
      }
    } else if (this.name == 'sell-median') {
      this.typeOf.next('Prosecna median cena prodaje po m2');
      // this.typeOf.next('Median sell price per m2');
      if (this.propType) {
        // this.propType.next('Apartment');
      }
    } else if (this.name == 'rent-median') {
      this.typeOf.next('Prosecna median cena iznajmljivanja')
      // this.typeOf.next('Median rent price per m2');
      if (this.propType) {
        // this.propType.next('Apartment');
      }
    }
  }




  screenShotChart(): any {
    const canvas = <HTMLCanvasElement>document.getElementById('myChart');
    const parsed = canvas.toDataURL();
    const chart = this.allCharts[0];
    const graph = {
      origin: this.name,
      graph: chart.toBase64Image(),
      desc: this.typeOfS
    };
    this.store.dispatch(UserActions.CheckScreenShot({ payload: graph }))
  }

  fullYearData(payload, type?) {
    let prop = payload.substr(0, payload.indexOf("-"));
    let graph;
    if (prop == 'SELL') {
      graph = 'Average sell price per half of year'
    } else {
      graph = 'Average rent price per half of year'
    }
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
    this.checkName()
    this.api.getAllAverage(request)
      .subscribe(
        (res) => {
          this.main.dataPresent$.next(true);
          let a = res;
          let first = [];
          let second = [];
          first.push(res.firstHalfOfYear);
          second.push(res.secondHalfOfYear);
          for (let [key, value] of Object.entries(res.firstHalfOfYear)) {
            first.push({ year: '01/06/' + key, price: value })
          }
          for (let [key, value] of Object.entries(res.secondHalfOfYear)) {
            second.push({ year: '06/12/' + key, price: value })
          }
          first.splice(0, 1)
          second.splice(0, 1)
          let third = [];
          for (let i = 0; i < first.length; i++) {
            third.push(first[i])
            third.push(second[i])

          }
          this.createCharts({ data: third, type: graph + ' (' + request.type + ')' })
        })
  }
}
