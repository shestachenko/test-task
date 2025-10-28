import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {LoginComponent} from '../login/login.component';
import {AuthService} from '../../services/auth.service';
import {CsvParserService, ParsedRow} from '../../services/csv-parser.service';

@Component({
  selector: 'app-csv-parser',
  standalone: true,
  imports: [CommonModule, FormsModule, LoginComponent],
  templateUrl: './csv-parser.component.html',
  styleUrl: './csv-parser.component.scss',
})
export class CsvParserComponent {
  private authService = inject(AuthService);
  private csvParserService = inject(CsvParserService);

  selectedFile: File | null = null;
  parsedData: ParsedRow[] | null = null;
  error: string | null = null;
  isLoading = false;
  jsonString = '';

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.error = null;
      this.parsedData = null;
      this.jsonString = '';
    }
  }

  onSubmit(): void {
    if (!this.selectedFile) {
      this.error = 'Please select a file';
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.parsedData = null;
    this.jsonString = '';

    this.csvParserService.parseCsv(this.selectedFile).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.data) {
          this.parsedData = response.data;
          this.jsonString = JSON.stringify(response.data, null, 2);
        } else {
          this.error = response.error || 'Failed to parse CSV';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.error = error.error?.error || error.message || 'An error occurred while parsing the CSV';
      },
    });
  }

  reset(): void {
    this.selectedFile = null;
    this.parsedData = null;
    this.error = null;
    this.jsonString = '';
    this.isLoading = false;
  }

  copyToClipboard(): void {
    if (this.jsonString) {
      navigator.clipboard.writeText(this.jsonString).then(() => {
        // Optional: show a toast message
        alert('JSON copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy:', err);
      });
    }
  }
}

