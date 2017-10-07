import { Main } from './Main.elm';
import { Subject } from 'rxjs/Subject';

const app = Main.fullscreen();

app.ports.get.subscribe(key => app.ports.retrieve.send([key, localStorage.getItem(key)]));
app.ports.set.subscribe(([key, value]) => localStorage.setItem(key, value));
app.ports.remove.subscribe(key => localStorage.removeItem(key));
