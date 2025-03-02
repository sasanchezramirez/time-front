import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TimeComparisonRequest, TimeComparisonData, ApiResponse } from '../models/time-comparison.model';

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  private apiUrl = 'https://relativistic-time-calculator.onrender.com/time/time-comparision';  // Cambiar por la URL real del backend

  constructor(private http: HttpClient) {}

  getTimeComparison(request: TimeComparisonRequest): Observable<ApiResponse<TimeComparisonData>> {
    return this.http.post<ApiResponse<TimeComparisonData>>(this.apiUrl, request);
  }
}
