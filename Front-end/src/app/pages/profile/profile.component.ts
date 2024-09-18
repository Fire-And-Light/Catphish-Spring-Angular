import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username : any;
  pic : any;
  headName : any;
  bio : any;
  uploadBtn : any;
  saved : any;
  reader : any;

  constructor(private route : ActivatedRoute, private http : HttpClient) {

  }

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get("username");
    this.pic = document.getElementById("pic");
    this.headName = document.getElementById("username");
    this.bio = document.getElementById("bio");
    this.uploadBtn = document.getElementById("upload-btn");
    this.saved = document.getElementById("saved");
    this.reader = new FileReader();

    this.loadProfile();
  }

  loadProfile() : void {
    this.headName.innerHTML = this.username;

    this.http.get("http://localhost:8080/users/" + this.username).subscribe((response : any) : void => {
      this.pic.src = "data:image/jpeg;base64," + response.pictureBlob;    
      this.bio.value = response.bio;      
    });
  }

  uploadPicPrompt() : void {
    this.uploadBtn.style.display = "block";
  }

  removeUploadPicPrompt() : void {
    this.uploadBtn.style.display = "none";
  }

  uploadPic(event : any) : void {
    let file = event.target.files[0];

    this.reader.addEventListener("load", (event : any) : void => { // I would prefer passing in a callback function rather than a lambda, but I can't because the component object's context isn't preserved
      this.pic.src = event.target.result;
    });
    
    this.reader.readAsDataURL(file);
  }

  saveProfile() : void {
    let account = {
        username: this.username,
        pictureBlob: this.pic.src,
        bio: this.bio.value
    }

    this.http.put("http://localhost:8080/users/" + this.username, account).subscribe();
    this.showConfirmation();
  }

  showConfirmation() : void {
      this.saved.innerHTML = "Saved!";
      setTimeout(this.hideConfirmation, 5000);
  }

  hideConfirmation() : void {
      this.saved.innerHTML = "";
  }

  reload() : void {
    window.location.reload();
  }
}