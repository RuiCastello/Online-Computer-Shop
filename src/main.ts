import { LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule, {
  providers: [{provide: LOCALE_ID, useValue: 'pt-PT' }, {provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' }]
})
  .catch(err => console.error(err));
