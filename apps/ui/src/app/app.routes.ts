import {Route} from '@angular/router';
import {ReservationSearchComponent} from './components/reservation-search/reservation-search.component';
import {CsvParserComponent} from './components/csv-parser/csv-parser.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: ReservationSearchComponent,
  },
  {
    path: 'csv-parser',
    component: CsvParserComponent,
  },
];
