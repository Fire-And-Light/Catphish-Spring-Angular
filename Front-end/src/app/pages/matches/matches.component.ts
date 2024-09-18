import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { StompService } from 'src/app/services/stomp.service';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {
  username : any;
  section : any;
  empty : any;

  constructor(private route : ActivatedRoute, private http : HttpClient, private router : Router, private stomp : StompService) {

  }

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get("username");
    this.section = document.getElementById("section");
    this.empty = document.getElementById("empty");

    this.stomp.subscribe("/" + this.username, (frame : any) : void => {
      let choice = JSON.parse(frame.body).choice;

      if (choice === "Unmatch") {
        window.location.reload();

      } else if (choice === "Delete") {
        window.location.reload();
      }
    });

    this.loadCandidates();
  }

  loadCandidates() : void {
    this.section.innerHTML = "";

    this.http.get("http://localhost:8080/matches/" + this.username).subscribe((response : any) : void => {
      if (response.length === 0) {
        this.empty.className = "empty-on";
        this.empty.innerHTML = "You have no matches"
        
      } else {
        for (let i = 0; i < response.length; i++) {
          let div = document.createElement("div");
          let match = document.createElement("div");
          let img = document.createElement("img");
          let p = document.createElement("p");

          this.section.appendChild(div);
          div.appendChild(match);
          match.appendChild(img);
          div.appendChild(p);

          // For some reason the CSS styling isn't working, so I had to use DOM manipulation
          img.src = "data:image/jpeg;base64," + response[i].pictureBlob;
          img.style.width = "200px";
          img.style.height = "200px";
          img.style.borderRadius = "50%";
          img.style.margin = "10px";
          img.style.boxShadow = "-1px 0 10px black";
          img.style.border = "1px solid black";
          img.style.cursor = "pointer";

          p.innerHTML = response[i].username;
          p.style.textAlign = "center";
          p.style.cursor = "default";
          p.style.margin = "15px";
          p.style.color = "white";
          
          img.addEventListener("click", () : void => {
            window.open("/match-profile/" + this.username + "/" + response[i].username, "_self"); // This is used instead of Angular routing since this also refreshes the next page, which rids redundant subscriptions since this page and the next page subscribes to the same topic. The reason for that is so that the next page can reload and subscribe to the same topic on that page without needing to go through this page again. Also, the next page has information that is needed upon subscribing that this page doesn't have
          });
        }
      }
    });
  }

  enterProfile() : void {
    window.open("/profile/" + this.username, "_self"); // This was the only solution to unsubscribing, since "unsubscribe" doesn't actually work. This enters a new page and refreshes it, meaning any previous subscriptions are disconnected
  }

  enterMatch() : void {
    window.open("/match/" + this.username, "_self");
  }

  reload() : void {
    window.location.reload();
  }

  enterMain() : void {
    window.open("/", "_self");
  }

  enterDelete() : void {
    window.open("/delete/" + this.username, "_self");
  }
}