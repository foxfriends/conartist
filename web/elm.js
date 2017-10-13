import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import { Main } from './Main.elm';

const app = Main.fullscreen();

app.ports.get.subscribe(key => app.ports.retrieve.send([key, localStorage.getItem(key)]));
app.ports.set.subscribe(([key, value]) => localStorage.setItem(key, value));
app.ports.remove.subscribe(key => localStorage.removeItem(key));

app.ports.read.subscribe(key => {
  const fi = document.createElement('input');
  const fr = new FileReader();
  fi.setAttribute('type', 'file');
  Observable.fromEvent(fi, 'change')
    .map(() => fr.readAsText(fi.files[0]))
    .switchMap(() => Observable.fromEvent(fr, 'loadend'))
    .filter(() => fr.readyState === FileReader.DONE)
    .subscribe( () => app.ports.didRead.send([key, fr.result])
              , () => app.ports.didRead.send([key, null]));
  fi.click();
});
