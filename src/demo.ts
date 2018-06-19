// The usual bootstrapping imports
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './demo/app.module';
import { StaticInjector } from './app/launcher/shared/telemetry.decorator';

if (process.env.ENV === 'production') {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule).then((moduleRef) => {
  StaticInjector.setInjector(moduleRef.injector);
});
