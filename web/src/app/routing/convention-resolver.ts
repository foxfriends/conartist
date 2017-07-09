import { Injectable, Inject } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import StorageService from '../data/storage.service';
import { FullConvention } from '../../../../conartist';

@Injectable()
export default class ConventionResolver implements Resolve<Observable<FullConvention> | null> {
  constructor(
    @Inject(StorageService) private storage: StorageService,
    @Inject(Router) private router: Router,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Promise<Observable<FullConvention> | null> {
    const code = route.paramMap.get('code');

    return this.storage.fillConvention(code!).then(con => {
      if (con) {
        return con;
      } else {
        this.router.navigate(['/conventions']);
        return null;
      }
    });
  }
}
