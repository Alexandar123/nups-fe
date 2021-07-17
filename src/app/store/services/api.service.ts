import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, share } from 'rxjs/operators';
import 'rxjs/add/observable/of';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private headers = new HttpHeaders();
  constructor(private http: HttpClient) {
    this.headers.append("Content-Type", "application/json;charset=UTF-8");
  }

  public getLocation(): Observable<any> {
    return this.http.get(environment.baseApiUrl + 'number');
  }

  public filterByCity(city): Observable<any> {
    return this.http.get(environment.baseApiUrl + 'city/Srbija/' + city);
  }

  public mainFilter(request: any): Observable<any> {
    return this.http.get(environment.baseApiUrl + 'search/' + request.state + '/' + request.address + '/' + request.typeOfProperty + '/' + request.typeOfAd + '/' + request.date_from + '/' + request.date_to, { headers: this.headers });
  }

  public mainFilterAreas(request: any): Observable<any> {
    return this.http.get(environment.baseApiUrl + 'search/' + request.state + '/' + request.address + '/'+ request.minSqare + '/' + request.maxSquare + '/' + request.typeOfProperty + '/' + request.typeOfAd + '/' + request.date_from + '/' + request.date_to);
  }

  public getJSON(): Observable<any> {
    return this.http.get<any>('../../../assets/towns.json');
  }

  public getTest(): Observable<any> {
    return this.http.get<any>('../../../assets/test1.json');
  }

  public addNewUser(payload: any): Observable<any> {
    return this.http.post<any>(environment.baseApiUrl + 'user/new', payload);
  }

  public getUserId(payload): Observable<any> {
    return this.http.post<any>(environment.baseApiUrl + 'user/login', payload, { headers: this.headers });
  }


  public getAddsByKeyword(city: any, key: any): Observable<any> {
    return this.http.get(environment.baseApiUrl + 'search/{' + city + '}/{Serbia}/{' + key + '}')
      .pipe(share());
  }

  public getAllAverage(payload: any) {
    return this.http.get<any>(environment.baseApiUrl + 'get/' + payload.type + '/' + payload.prop, { headers: this.headers })
  }

  public meadianFromTo(payload) {
    return this.http.get<any>(environment.baseApiUrl + 'graphMedian/' + payload.typeOfProperty + '/' + payload.date_from + '/' + payload.date_to + '', { headers: this.headers });
  }

  public getAllUsers() {
    return this.http.get<any>(environment.baseApiUrl + 'user/users', { headers: this.headers })
  }

  public increaseUserPoints(payload) {
    return this.http.post<any>(environment.baseApiUrl + 'user/points/increase/' + payload.id, payload.points, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    })
  }


  public decreaseUserPoints(payload) {
    return this.http.post<any>(environment.baseApiUrl + 'user/points/decrease/' + payload, 1, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    })
  }

  public getUserPoint(payload) {
    return this.http.get<any>(environment.baseApiUrl + 'user/points/' + payload, { headers: this.headers })

  }

  public deleteUserAuth(id) {
    const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJEZENORUZGTWtGRU5VWkdOelV6TnpRek4wRkdNak0xUmpCR1F6VXdSVE00TmpZNE1EUXhRUSJ9.eyJpc3MiOiJodHRwczovL25lZG92aWNtLmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJPaWlZMDdGWUljNXZlRjRyeTk3S2xma0VrRlgwS29XZUBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9uZWRvdmljbS5ldS5hdXRoMC5jb20vYXBpL3YyLyIsImlhdCI6MTU4NzU4NjYyNSwiZXhwIjoxNTg3NjczMDI1LCJhenAiOiJPaWlZMDdGWUljNXZlRjRyeTk3S2xma0VrRlgwS29XZSIsInNjb3BlIjoicmVhZDpjbGllbnRfZ3JhbnRzIGNyZWF0ZTpjbGllbnRfZ3JhbnRzIGRlbGV0ZTpjbGllbnRfZ3JhbnRzIHVwZGF0ZTpjbGllbnRfZ3JhbnRzIHJlYWQ6dXNlcnMgdXBkYXRlOnVzZXJzIGRlbGV0ZTp1c2VycyBjcmVhdGU6dXNlcnMgcmVhZDp1c2Vyc19hcHBfbWV0YWRhdGEgdXBkYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSBkZWxldGU6dXNlcnNfYXBwX21ldGFkYXRhIGNyZWF0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgcmVhZDp1c2VyX2N1c3RvbV9ibG9ja3MgY3JlYXRlOnVzZXJfY3VzdG9tX2Jsb2NrcyBkZWxldGU6dXNlcl9jdXN0b21fYmxvY2tzIGNyZWF0ZTp1c2VyX3RpY2tldHMgcmVhZDpjbGllbnRzIHVwZGF0ZTpjbGllbnRzIGRlbGV0ZTpjbGllbnRzIGNyZWF0ZTpjbGllbnRzIHJlYWQ6Y2xpZW50X2tleXMgdXBkYXRlOmNsaWVudF9rZXlzIGRlbGV0ZTpjbGllbnRfa2V5cyBjcmVhdGU6Y2xpZW50X2tleXMgcmVhZDpjb25uZWN0aW9ucyB1cGRhdGU6Y29ubmVjdGlvbnMgZGVsZXRlOmNvbm5lY3Rpb25zIGNyZWF0ZTpjb25uZWN0aW9ucyByZWFkOnJlc291cmNlX3NlcnZlcnMgdXBkYXRlOnJlc291cmNlX3NlcnZlcnMgZGVsZXRlOnJlc291cmNlX3NlcnZlcnMgY3JlYXRlOnJlc291cmNlX3NlcnZlcnMgcmVhZDpkZXZpY2VfY3JlZGVudGlhbHMgdXBkYXRlOmRldmljZV9jcmVkZW50aWFscyBkZWxldGU6ZGV2aWNlX2NyZWRlbnRpYWxzIGNyZWF0ZTpkZXZpY2VfY3JlZGVudGlhbHMgcmVhZDpydWxlcyB1cGRhdGU6cnVsZXMgZGVsZXRlOnJ1bGVzIGNyZWF0ZTpydWxlcyByZWFkOnJ1bGVzX2NvbmZpZ3MgdXBkYXRlOnJ1bGVzX2NvbmZpZ3MgZGVsZXRlOnJ1bGVzX2NvbmZpZ3MgcmVhZDpob29rcyB1cGRhdGU6aG9va3MgZGVsZXRlOmhvb2tzIGNyZWF0ZTpob29rcyByZWFkOmVtYWlsX3Byb3ZpZGVyIHVwZGF0ZTplbWFpbF9wcm92aWRlciBkZWxldGU6ZW1haWxfcHJvdmlkZXIgY3JlYXRlOmVtYWlsX3Byb3ZpZGVyIGJsYWNrbGlzdDp0b2tlbnMgcmVhZDpzdGF0cyByZWFkOnRlbmFudF9zZXR0aW5ncyB1cGRhdGU6dGVuYW50X3NldHRpbmdzIHJlYWQ6bG9ncyByZWFkOnNoaWVsZHMgY3JlYXRlOnNoaWVsZHMgZGVsZXRlOnNoaWVsZHMgcmVhZDphbm9tYWx5X2Jsb2NrcyBkZWxldGU6YW5vbWFseV9ibG9ja3MgdXBkYXRlOnRyaWdnZXJzIHJlYWQ6dHJpZ2dlcnMgcmVhZDpncmFudHMgZGVsZXRlOmdyYW50cyByZWFkOmd1YXJkaWFuX2ZhY3RvcnMgdXBkYXRlOmd1YXJkaWFuX2ZhY3RvcnMgcmVhZDpndWFyZGlhbl9lbnJvbGxtZW50cyBkZWxldGU6Z3VhcmRpYW5fZW5yb2xsbWVudHMgY3JlYXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRfdGlja2V0cyByZWFkOnVzZXJfaWRwX3Rva2VucyBjcmVhdGU6cGFzc3dvcmRzX2NoZWNraW5nX2pvYiBkZWxldGU6cGFzc3dvcmRzX2NoZWNraW5nX2pvYiByZWFkOmN1c3RvbV9kb21haW5zIGRlbGV0ZTpjdXN0b21fZG9tYWlucyBjcmVhdGU6Y3VzdG9tX2RvbWFpbnMgdXBkYXRlOmN1c3RvbV9kb21haW5zIHJlYWQ6ZW1haWxfdGVtcGxhdGVzIGNyZWF0ZTplbWFpbF90ZW1wbGF0ZXMgdXBkYXRlOmVtYWlsX3RlbXBsYXRlcyByZWFkOm1mYV9wb2xpY2llcyB1cGRhdGU6bWZhX3BvbGljaWVzIHJlYWQ6cm9sZXMgY3JlYXRlOnJvbGVzIGRlbGV0ZTpyb2xlcyB1cGRhdGU6cm9sZXMgcmVhZDpwcm9tcHRzIHVwZGF0ZTpwcm9tcHRzIHJlYWQ6YnJhbmRpbmcgdXBkYXRlOmJyYW5kaW5nIHJlYWQ6bG9nX3N0cmVhbXMgY3JlYXRlOmxvZ19zdHJlYW1zIGRlbGV0ZTpsb2dfc3RyZWFtcyB1cGRhdGU6bG9nX3N0cmVhbXMgY3JlYXRlOnNpZ25pbmdfa2V5cyByZWFkOnNpZ25pbmdfa2V5cyB1cGRhdGU6c2lnbmluZ19rZXlzIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.D9aoJazOcdcHpAI6OnWiF51dEgIIsvmR62XLnkR-E2BOuzgcoXGQ1h_ernFVMVLldv-TEG5L6-m1IO_rctxKn3AIma7P7rWJUcC5i5gx3MgeNglb8c_9XX1Dl2-bpzfecItc7aRbs0mnL7y2eOqvOY24xafuHG32I1_LYeLwzC_mfJ03TvOMGKwxGoZ01-v7YsyADsHWRCerRULAe-bQxcu59LeAFdcp2DGJY5_rBcOmEz9VjljtCnN8IIuZui166YxTFPHL-ZviZ1nAd5SpZGS9CmX-MXdK0Gq3ko-LxdTBX0LDndgNCIjykjFBd5yZo69O3FNoFcY6fo35zvwkDw'
    const headers = { authorization: 'Bearer ' + token};
    return this.http.delete(environment.baseApiUrl + 'https://nedovicm.eu.auth0.com/api/v2/users/' + id, { headers: headers })
  }

  public deleteUser(id) {
    return this.http.delete(environment.baseApiUrl + 'user/delete/' + id, {headers: this.headers})
  }

  updateUser(id, data) {
    return this.http.put(environment.baseApiUrl + 'user/update/' + id, data, {headers: this.headers})
  }

  getTableData(ids) {
    return this.http.post(environment.baseApiUrl + 'table',ids ,{headers: this.headers})
  }

  getAdminAdds(from, to, page) {
    return this.http.get(environment.baseApiUrl + 'admin/showdata/' + from + '/' + to + '?page=' + page + '&size=200', {headers: this.headers});
  }


  deleteBadAdds() {
    return this.http.delete(environment.baseApiUrl + 'admin/delete');
  }

  deleteAdd(id) {
    return this.http.delete(environment.baseApiUrl + 'admin/delete/' + id);
  }

  updateAdd(add) {
    return this.http.put(environment.baseApiUrl + 'admin/edit/' + add.id, add, {headers: this.headers});
  }

  getMedianData(formData: any) {
    return this.http.get(environment.baseApiUrl + 'graphMedian/'+ formData.state + '/'+ formData.city + '/'+ formData.typeOfProperty + '/' + formData.typeOfAd + '/' + formData.date_from + '/' + formData.date_to) ;
  }
}