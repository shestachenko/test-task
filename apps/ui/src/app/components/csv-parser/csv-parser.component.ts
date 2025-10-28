import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from '../login/login.component';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-csv-parser',
  standalone: true,
  imports: [CommonModule, LoginComponent],
  templateUrl: './csv-parser.component.html',
  styleUrl: './csv-parser.component.scss',
})
export class CsvParserComponent {
  private authService = inject(AuthService);

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}

