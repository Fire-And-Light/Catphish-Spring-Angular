import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StompService } from 'src/app/services/stomp.service';

@Component({
  selector: 'app-match-profile',
  templateUrl: './match-profile.component.html',
  styleUrls: ['./match-profile.component.css']
})
export class MatchProfileComponent implements OnInit {
  username : any;
  matchname : any;
  pic : any;
  profileHead : any;
  bio : any;
  chatHead : any;
  chat : any;
  message : any;
  
  constructor(private http : HttpClient, private route : ActivatedRoute, private stomp : StompService, private router : Router) {

  }

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get("username");
    this.matchname = this.route.snapshot.paramMap.get("matchname");
    this.pic = document.getElementById("pic");
    this.profileHead = document.getElementById("profilehead");
    this.bio = document.getElementById("bio");
    this.chatHead = document.getElementById("chathead");
    this.chat = document.getElementById("chatbody");
    this.message = document.getElementById("message");

    // Even though the client was already subscribed in the matches page, this is meant to resubscribe if the webpage is reloaded, since reloading disconnects the subscription. Also, this page needs to resubscribe because "this.loadChat" is not accessible in the matches page, so the subscription in the matches page couldn't handle what to do upon a message being sent
    this.stomp.subscribe("/" + this.username, (frame : any) : void => {      
      let choice = JSON.parse(frame.body).choice;

      if (choice === "Message") {
        this.loadChat(); // This doesn't always work for some reason. It seems like it's due to StompJS

      } else if (choice === "Unmatch") {
        window.open("/matches/" + this.username, "_self");

      } else if (choice === "Delete") {
        window.open("/matches/" + this.username, "_self");
      }
    });

    this.loadMatch();
    this.loadChat();
  }
  
  loadMatch() : void {
    this.http.get("http://localhost:8080/users/" + this.matchname).subscribe((response : any) : void => {
      this.pic.src = "data:image/jpeg;base64," + response.pictureBlob;    
      this.bio.value = response.bio;
    });

    this.profileHead.innerHTML = this.matchname;
    this.chatHead.innerHTML = this.matchname;
  }

  loadChat() : void {
    this.chat.innerHTML = "";
    
    this.http.get("http://localhost:8080/messages/" + this.username + "-and-" + this.matchname).subscribe((response : any) : void => {
      for (let i = 0; i < response.length; i++) {        
        let p = document.createElement("p");
        p.innerHTML = response[i].message;

        // For some reason, CSS styling isn't working again, and it's pissing me off, so I'm using DOM manipulation
        p.style.padding = "10px";
        p.style.color = "white";
        p.style.width = "fit-content";
        p.style.borderRadius = "10px";
        p.style.marginBottom = "15px";
        p.style.wordBreak = "break-word"; // Instead of "p.style.wordWrap", "p.style.wordBreak" is used instead
        p.style.maxWidth = "230px";

        if (response[i].author.username === this.username) {
          p.style.backgroundColor = "rgb(185, 0, 0)";
          p.style.marginLeft = "auto";

        } else {
          p.style.backgroundColor = "rgb(54, 53, 53)";
        }

        this.chat.appendChild(p);
        this.chat.scrollTop = this.chat.scrollHeight - this.chat.clientHeight;
      }
    });
  }

  sendMessage() : void {
    if (this.message.value === "") {
      return;
    }

    let message = {
      author: {username: this.username},
      recipient: {username: this.matchname},
      message: this.message.value
    }

    let webSocketMessage = {
      message: message,
      choice: "Message"
    }

    // Instead of fetching the database messages each time the author sends a message, the message is just added to the DOM. This is more efficient
    let p = document.createElement("p");
    p.innerHTML = this.message.value;

    p.style.backgroundColor = "rgb(185, 0, 0)";
    p.style.padding = "10px";
    p.style.color = "white";
    p.style.width = "fit-content";
    p.style.borderRadius = "10px";
    p.style.marginBottom = "15px";
    p.style.wordBreak = "break-word";
    p.style.maxWidth = "230px";
    p.style.marginLeft = "auto";

    this.chat.appendChild(p);
    this.chat.scrollTop = this.chat.scrollHeight - this.chat.clientHeight;

    this.message.value = "";

    this.stomp.send("/" + this.matchname, {}, JSON.stringify(webSocketMessage));
  }

  unmatchProfile() : void {
    let relationship = {
      user: {username: this.username},
      checked: {username: this.matchname}
    }

    let webSocketMessage = {
      relationship: relationship,
      choice: "Unmatch"
    }

    this.stomp.send("/" + this.matchname, {}, JSON.stringify(webSocketMessage));
    window.open("/matches/" + this.username, "_self");
  }

  enterProfile() : void {
    window.open("/profile/" + this.username, "_self");
  }

  enterMatch() : void {
    window.open("/match/" + this.username, "_self");
  }

  enterMatches() : void {
    window.open("/matches/" + this.username, "_self");
  }

  enterMain() : void {
    window.open("/", "_self");
  }

  enterDelete() : void {
    window.open("/delete/" + this.username, "_self");
  }
}