import { MatchProfileComponent } from './pages/match-profile/match-profile.component';
import { MatchesComponent } from './pages/matches/matches.component';
import { MatchComponent } from './pages/match/match.component';
import { DeleteComponent } from './pages/delete/delete.component';
import { MainComponent } from './pages/main/main.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: "", component: MainComponent},
  {path: "profile/:username", component: ProfileComponent},
  {path: "match/:username", component: MatchComponent},
  {path: "matches/:username", component: MatchesComponent},
  {path: "match-profile/:username/:matchname", component: MatchProfileComponent},
  {path: "delete/:username", component: DeleteComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
