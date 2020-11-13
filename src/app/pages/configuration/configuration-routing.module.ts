import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConfigurationComponent } from './configuration.component';
import { TurnComponent } from './turn/turn.component';
import { TubeComponent } from './tube/tube.component';
import { TestComponent } from './test/test.component';


const routes: Routes = [
  {
    path: '',
    component: ConfigurationComponent,
    children: [

      {
        path: 'turn',
        component: TurnComponent,
      },

      {
        path: 'tube',
        component: TubeComponent,
      },
      {
        path: 'test',
        component: TestComponent,
      },

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigurationRoutingModule {
}
