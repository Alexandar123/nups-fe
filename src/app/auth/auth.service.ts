import { Injectable } from '@angular/core';
import createAuth0Client from '@auth0/auth0-spa-js';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import { from, of, Observable, BehaviorSubject, combineLatest, throwError, Subject, ReplaySubject } from 'rxjs';
import { tap, catchError, concatMap, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from "@angular/router";
import { Store, select } from '@ngrx/store';

import * as UserActions from '../store/actions/data-actions';
import * as fromStore from '../store/reducers';
import Auth0Lock from 'auth0-lock';
import { ApiService } from '../store/services/api.service';
import { IUserData } from '../models/IAllModels';
declare var require: any;

const img = require('../../assets/user.png');
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private accesToken: string;
  private userData: IUserData;
  userRole$: BehaviorSubject<any> = new BehaviorSubject<string>('');
  auth0Options = {
    theme: {
      logo: img,
      primaryColor: '#DFA612',
    },
    languageDictionary: {
      title: 'Dobrodošli'
    },
    auth: {
      redirectUrl: environment.auth0.redirect_uri,
      responseType: 'token id_token',
      audience: `https://${environment.auth0.domain}/userinfo`,
      params: {
        scope: 'openid profile'
      },
      sso: false,
    },
    additionalSignUpFields: [
      {
        id: 'name',
        name: "name",
        placeholder: "Unesi ime"
      },
      {
        id: 'lastname',
        name: "lastname",
        placeholder: "Unesi prezime"
      },
      {
        id: 'city',
        name: "city",
        placeholder: "Unesi grad"
      },
      {
        id: 'country',
        name: "country",
        placeholder: "Unesi državu"
      },
      {
        id: 'phone',
        name: "phone",
        placeholder: "Unesi broj telefona"
      }
    ],
    autoclose: true,
    oidcConformant: true,
  };

  lock = new Auth0Lock(
    environment.auth0.client_id,
    environment.auth0.domain,
    this.auth0Options
  );

  auth0Client$ = (from(
    createAuth0Client({
      domain: "nedovicm.eu.auth0.com",
      client_id: "F5AcvKlIkDbvUVjYNFCaglzkdKn76bs3",
      redirect_uri: `${window.location.origin}`,
      scope: 'user_metadata'

    })
  ) as Observable<Auth0Client>).pipe(
    shareReplay(1),
    catchError(err => throwError(err))
  );
  // isAuthenticated$ = this.auth0Client$.pipe(
  //   concatMap((client: Auth0Client) => from(client.isAuthenticated())),
  //   tap(res => this.loggedIn = res)
  // );
  isAuthenticated$: Subject<boolean> = new BehaviorSubject<boolean>(false);
  currentUser$: Subject<any> = new BehaviorSubject<any>(null);

  handleRedirectCallback$ = this.auth0Client$.pipe(
    concatMap((client: Auth0Client) => from(client.handleRedirectCallback()))
  );
  private userProfileSubject$ = new BehaviorSubject<any>(null);
  userProfile$ = this.userProfileSubject$.asObservable();
  loggedIn: boolean = null;

  constructor(public router?: Router,
    public store?: Store<fromStore.AppState>,
    private api?: ApiService) {
    this.handleAuthCallback();
    this.lock.on('authenticated', (authResult: any) => {
      this.isAuthenticated$.next(true);
      this.accesToken = authResult.accessToken;
      this.lock.getUserInfo(authResult.accessToken, (error, profile) => {
        if (error) {
          this.logout()
          this.login()
          throw new Error(error);
        }
        this.userData = profile['https://nedovicm:eu:auth0:com/user_metadata'];
        let count = profile['https://geoapp.nedovicm.com/count'];
        // if (count == undefined) {
        //   let userObj = {
        //     name: this.userData.name,
        //     lastname: this.userData.lastname,
        //     email: this.userData.email,
        //     mobile: this.userData.phone,
        //     country: this.userData.country,
        //     city: this.userData.city,
        //     password: this.userData.password
        //   }
        // }
        // this.userData.email = profile.name;
        localStorage.setItem('token', authResult.idToken);
        localStorage.setItem('accestoken', authResult.accessToken);
        this.localAuthSetup()
      });
    });
    this.localAuthSetup()
  }

  getUser$(options?): Observable<any> {
    return this.auth0Client$.pipe(
      concatMap((client: Auth0Client) => from(client.getUser(options))),
      tap(user => this.userProfileSubject$.next(user))
    );
  }

  private localAuthSetup() {
    let url = window.location.href;
    if (!url.includes('access_token')) {
      let user = localStorage.getItem('accestoken')
      if (user != null) {
        this.isAuthenticated$.next(true)
        this.lock.getUserInfo(user, (error, profile) => {
          if (error) {
            this.logout()
            this.login()
            throw new Error(error);
          }
          let role = profile['https://geoapp.nedovicm.com/user_authorization'][0];
          let user_id = profile['https://geoapp.nedovicm.com/user_id'];
          this.userRole$.next(role)
          let numOfLoads = profile['https://geoapp.nedovicm.com/count'];
          let wholeData = {
            email: profile.name,
            nickname: profile.nickname,
            other: profile['https://nedovicm:eu:auth0:com/user_metadata']
          }
          if (role == 'admin') {
            this.router.navigate(['/admin'])
          }
          this.store.dispatch(UserActions.SetUser({ payload: wholeData }))
          // this.store.dispatch(UserActions.SetCoins({ payload: 15 }))
          if (numOfLoads == undefined) {
            this.api.addNewUser({
              name: wholeData.other.name,
              lastname: wholeData.other.lastname,
              email: wholeData.email,
              mobile: wholeData.other.phone,
              points: 0,
              country: wholeData.other.country,
              city: wholeData.other.city,
              auth_id: user_id
            })
            .subscribe(
              (res) => {
                if(res) {
                  this.store.dispatch(UserActions.SetUserId({ payload: res }))
                  this.store.dispatch(UserActions.CheckCoins({payload: res}))
                }
              }
            );
          } else {
            this.api.getUserId(wholeData.email)
            .subscribe(
              (res) => {
                if (res) {
                  this.store.dispatch(UserActions.SetUserId({ payload: res }))
                  this.store.dispatch(UserActions.CheckCoins({payload: res}))
                }

              }
            )
          }
          this.currentUser$.next(profile.nickname)
        })
      } else {
        this.currentUser$.next('User')
        this.isAuthenticated$.next(false)
        this.login()
      }
    } else {
      this.currentUser$.next('User');
      this.isAuthenticated$.next(false);
    }
  }

  login() {
    this.lock.show();
  }

  private handleAuthCallback() {
  }

  logout() {
    this.store.dispatch(UserActions.SetCoins({ payload: 0 }))
    this.isAuthenticated$.next(false)
    localStorage.removeItem('accestoken');
    localStorage.removeItem('token');
    this.currentUser$.next('User')
    this.router.navigate(['/'])
  }
}