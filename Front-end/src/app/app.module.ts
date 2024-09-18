import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './pages/main/main.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProfileComponent } from './pages/profile/profile.component';
import { DeleteComponent } from './pages/delete/delete.component';
import { MatchComponent } from './pages/match/match.component';
import { MatchesComponent } from './pages/matches/matches.component';
import { StompService } from './services/stomp.service';
import { MatchProfileComponent } from './pages/match-profile/match-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    ProfileComponent,
    DeleteComponent,
    MatchComponent,
    MatchesComponent,
    MatchProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule
  ],
  providers: [StompService],
  bootstrap: [AppComponent]
})
export class AppModule { }
