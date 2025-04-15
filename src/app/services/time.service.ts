import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { TimeComparisonRequest, TimeComparisonData, ApiResponse } from '../models/time-comparison.model';

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  private apiUrl = 'https://relativistic-time-calculator.onrender.com/time/time-comparision';

  // Constante para la velocidad de la luz en m/s
  private readonly C = 3.0e8;

  // Indica si se debe usar el cálculo local o el backend
  // IMPORTANTE: Cambiar esta constante a false para usar el backend
  private readonly USE_LOCAL_CALCULATION = true;

  constructor(private http: HttpClient) {}

  getTimeComparison(request: TimeComparisonRequest): Observable<ApiResponse<TimeComparisonData>> {
    // Si USE_LOCAL_CALCULATION es true, usar cálculo local
    // Si es false, usar el backend
    if (this.USE_LOCAL_CALCULATION) {
      // MODO LOCAL: Cálculo realizado en el frontend
      return of(this.calculateLocalTimeComparison(request));
    } else {
      // MODO BACKEND: Se envía la solicitud al servidor
      return this.http.post<ApiResponse<TimeComparisonData>>(this.apiUrl, request);
    }
  }

  /**
   * Calcula la dilatación del tiempo localmente basado en los principios de relatividad especial
   */
  private calculateLocalTimeComparison(request: TimeComparisonRequest): ApiResponse<TimeComparisonData> {
    try {
      // Convertir velocidades de km/h a m/s
      const v1Ms = request.v_1 * 1000.0 / 3600.0;
      const v2Ms = request.v_2 * 1000.0 / 3600.0;

      // Tiempo de referencia en segundos
      const tRef = request.t_ref; // ya está en segundos según el código del componente

      // Calcular factores de dilatación
      const gamma1 = this.calculateTimeDilation(v1Ms);
      const gamma2 = this.calculateTimeDilation(v2Ms);

      // Calcular tiempos propios
      const t1 = tRef / gamma1;
      const t2 = tRef / gamma2;
      const deltaT = Math.abs(t1 - t2);

      // Convertir segundos a horas para el resultado
      const result: TimeComparisonData = {
        t_1: t1 / 3600.0,
        t_2: t2 / 3600.0,
        delta_t: deltaT / 3600.0
      };

      return {
        apiCode: 'KO000',
        data: result,
        message: 'Cálculo realizado con éxito',
        status: true
      };
    } catch (error) {
      let errorMessage = 'Error en el cálculo';

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      return {
        apiCode: 'KO001',
        data: { t_1: 0, t_2: 0, delta_t: 0 },
        message: errorMessage,
        status: false
      };
    }
  }

  /**
   * Calcula el factor de dilatación del tiempo para una velocidad dada
   */
  private calculateTimeDilation(velocity: number): number {
    const beta = velocity / this.C;

    if (beta >= 1.0) {
      throw new Error("La velocidad no puede ser igual o mayor a la velocidad de la luz.");
    }

    const gamma = 1.0 / Math.sqrt(1 - Math.pow(beta, 2));
    return gamma;
  }
}
