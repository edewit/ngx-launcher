import * as _ from 'lodash';
import { Broadcaster } from 'ngx-base';
import { Injector, Optional } from '@angular/core';

export function broadcast(event: string, properties: any): MethodDecorator {
    return function (target: Function, methodName: string, descriptor: any) {

        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {

            const broadcast: Broadcaster = StaticInjector.getInjector().get(Broadcaster);
            if (!broadcast) {
              return originalMethod.apply(this, args);
            }

            const mapKeys = (props: any, base?: string): any => {
                Object.keys(props).forEach(key => {
                    if (typeof properties[key] === 'object') {
                        mapKeys(properties[key], key);
                    } else {
                        properties[key] = _.get(this, (base || '') + '.' + properties[base][key]);
                    }
                });
            };

            let props = _.cloneDeep(properties);
            mapKeys(props);
            broadcast.broadcast(event, props);
            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}

export class StaticInjector {
  private static injector: Injector;
  static setInjector(injector: Injector) {
    StaticInjector.injector = injector;
  }

  static getInjector(): Injector {
    return StaticInjector.injector;
  }
}
