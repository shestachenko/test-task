import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

interface BaseResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ParsedRow {
  [key: string]: string | number;
}

@Injectable({
  providedIn: 'root',
})
export class CsvParserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/csv-parser';

  parseCsv(file: File): Observable<BaseResponse<ParsedRow[]>> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<BaseResponse<ParsedRow[]>>(`${this.apiUrl}/parse`, formData);
  }
}

