import { Injectable, Inject } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import StorageService from './storage.service';

@Injectable()
export default class SaveService {
  visible = true;
  saving = false;

  constructor(
    @Inject(StorageService) private storage: StorageService,
    @Inject(Router) private router: Router,
  ) {
    this.router.events
      .filter((event): event is NavigationStart => event instanceof NavigationStart)
      .subscribe(({ url }) => this.visible = !url.includes('sign-in'));
  }

  async save() {
    if(this.saving) { return; }
    this.saving = true;
    await this.storage.commit();
    this.saving = false;
  }
}
