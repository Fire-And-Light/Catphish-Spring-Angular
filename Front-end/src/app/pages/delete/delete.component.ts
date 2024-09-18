import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { StompService } from 'src/app/services/stomp.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {
  username : any;
  nav : any;
  confirmBox : any;
  section : any;
  canClick : any;

  constructor(private http : HttpClient, private route : ActivatedRoute, private router : Router, private stomp : StompService) {

  }

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get("username");
    this.nav = document.getElementById("nav");
    this.confirmBox = document.getElementById("confirm");
    this.section = document.getElementById("section");
    this.canClick = false;
  }

  deleteAccount() : void {
    let matches = new Array();

    this.http.get("http://localhost:8080/matches/" + this.username).subscribe((response : any) : void => {
      for (let i = 0; i < response.length; i++) {
        matches[i] = response[i].username;
      }

      this.http.delete("http://localhost:8080/users/" + this.username).subscribe();

      for (let i = 0; i < matches.length; i++) {
        let webSocketMessage = {
          choice: "Delete"
        }
    
        this.stomp.send("/" + matches[i], {}, JSON.stringify(webSocketMessage));
      }
    });

    this.router.navigate(["/"]);
  }

  removeConfirmation() : void {
    let options = document.getElementsByTagName("a");

    for (let i = 0; i < options.length; i++) {
        options[i].style.cursor = "pointer";
    }

    let css = "a:hover { background: rgb(185, 0, 0); color: white; }";
    let style = <any> document.createElement("style");

    if (style.styleSheet) {
        style.styleSheet.cssText = css;

    } else {
        style.appendChild(document.createTextNode(css));
    }

    document.getElementsByTagName("head")[0].appendChild(style);
    
    this.nav.style.filter = "brightness(100%)";
    this.section.style.filter = "brightness(100%)";
    this.confirmBox.style.display = "none";
    this.canClick = true;
  }

  enterProfile() : void {
    // The following conditional can be set in the HTML file, but it looks sloppy, so stick with event-binding in the HTML file
    if (this.canClick) {
      this.router.navigate(["/profile", this.username]);
    }
  }

  enterMatch() : void {
    if (this.canClick) {
      this.router.navigate(["/match", this.username]);
    }
  }

  enterMatches() : void {
    if (this.canClick) {
      this.router.navigate(["/matches", this.username]);
    }
  }

  enterMain() : void {
    if (this.canClick) {
      this.router.navigate(["/"]);
    }
  }

  reload() : void {
    if (this.canClick) {
      window.location.reload();
    }
  }
}