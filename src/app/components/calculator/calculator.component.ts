import { Component } from '@angular/core';
import { TimeService } from '../../services/time.service';
import { TimeComparisonRequest, TimeComparisonData } from '../../models/time-comparison.model';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent {
  v1: number = 0;
  v2: number = 0;
  time: number = 0;
  comparisonResult?: TimeComparisonData;
  errorMessage?: string;

  selectedIcon1: string = 'person';
  selectedIcon2: string = 'person_outline';
  showIconSelector: boolean = false;
  currentIconTarget: number = 0;

  availableIcons: string[] = [
    'person', 'person_outline', 'face', 'sentiment_very_satisfied',
    'directions_bike', 'directions_run', 'directions_walk', 'pedal_bike',
    'sports_score', 'emoji_events', 'military_tech', 'workspace_premium',
    'psychology', 'sports', 'hiking', 'skateboarding',
    'snowboarding', 'surfing', 'sports_tennis', 'sports_basketball'
  ];

  timeUnit: 'hours' | 'minutes' = 'hours';

  constructor(private timeService: TimeService) {}

  onlyNumbers(event: KeyboardEvent): boolean {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);

    if (event.key === 'Backspace' || event.key === 'Delete' ||
        event.key === 'ArrowLeft' || event.key === 'ArrowRight' ||
        event.key === 'Tab') {
      return true;
    }

    if (!pattern.test(inputChar)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  calculateTime() {
    if (!this.validateInputs()) {
      this.errorMessage = 'Por favor, ingrese valores válidos en todos los campos';
      return;
    }

    const timeInHours = this.timeUnit === 'minutes' ? this.time / 60 : this.time;

    const request: TimeComparisonRequest = {
      is_logged: false,
      v_1: this.v1,
      v_2: this.v2,
      t_ref: timeInHours * 3600 // Convertir horas a segundos
    };

    this.timeService.getTimeComparison(request).subscribe({
      next: (response) => {
        if (response.apiCode === 'KO000') {
          this.comparisonResult = response.data;
          this.errorMessage = undefined;
        } else {
          this.errorMessage = response.message;
          this.comparisonResult = undefined;
        }
      },
      error: (error) => {
        this.errorMessage = 'Error al procesar la solicitud';
        this.comparisonResult = undefined;
      }
    });
  }

  validateInputs(): boolean {
    return this.v1 > 0 && this.v2 > 0 && this.time > 0;
  }

  changeIcon(userNumber: number) {
    this.showIconSelector = true;
    this.currentIconTarget = userNumber;
  }

  selectIcon(icon: string) {
    if (this.currentIconTarget === 1) {
      this.selectedIcon1 = icon;
    } else {
      this.selectedIcon2 = icon;
    }
    this.closeIconSelector();
  }

  closeIconSelector() {
    this.showIconSelector = false;
  }

  getTimeComparisonClass(timeNumber: number): string {
    if (!this.comparisonResult) return '';

    const t1 = this.comparisonResult.t_1;
    const t2 = this.comparisonResult.t_2;

    if (t1 === t2) return 'equal-time';

    if (timeNumber === 1) {
      return t1 > t2 ? 'higher-time' : 'lower-time';
    } else {
      return t2 > t1 ? 'higher-time' : 'lower-time';
    }
  }

  getSlowerObserver(): string {
    if (!this.comparisonResult) return '';
    return this.comparisonResult.t_1 > this.comparisonResult.t_2 ?
      '1 (izquierda)' : '2 (derecha)';
  }

  getFasterObserver(): string {
    if (!this.comparisonResult) return '';
    return this.comparisonResult.t_1 < this.comparisonResult.t_2 ?
      '1 (izquierda)' : '2 (derecha)';
  }
}
