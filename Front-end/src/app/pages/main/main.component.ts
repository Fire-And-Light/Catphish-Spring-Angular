import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  logo : any;
  slogan : any;
  signInButton : any;
  popup: any;
  popupError : any;
  usernameInput : any;
  passwordInput : any;
  popupHeader : any;
  popupSubmit : any;
  popupTimes : any;
  faTimes = faTimes;
  canSignIn = true;
  signUp = true;

  constructor(private http : HttpClient, private router : Router) {

  }

  ngOnInit(): void {
    this.logo = document.getElementById("logo");
    this.slogan = document.getElementById("slogan");
    this.signInButton = document.getElementById("signin");
    this.popup = document.getElementById("popup");
    this.popupError = document.getElementById("popup-error");
    this.usernameInput = <HTMLInputElement> document.getElementById("popup-username");
    this.passwordInput = <HTMLInputElement> document.getElementById("popup-password");
    this.popupHeader = document.getElementById("popup-header");
    this.popupSubmit = document.getElementById("popup-submit");
    this.popupTimes = document.getElementById("popup-times");
  }

  openPopup() : void {
    this.popup.style.display = "block";
    this.slogan.style.filter = "brightness(78%)";
    this.logo.style.filter = "brightness(78%)";
    this.signInButton.style.filter = "brightness(78%)";
    this.signInButton.style.cursor = "default";
    this.popupTimes.style.display = "block";
    
    let css = "button#signin:hover { background: white; }";
    let style = <any> document.createElement("style");

    if (style.styleSheet) {
        style.styleSheet.cssText = css;

    } else {
        style.appendChild(document.createTextNode(css));
    }

    document.getElementsByTagName("head")[0].appendChild(style);
  }

  validateSignIn() : void {
    let username = this.usernameInput!.value;
    let password = this.passwordInput!.value;
    let account = {
        username: username,
        password: password
    }

    this.http.post("http://localhost:8080/users/" + username, account, {responseType: "text"}).subscribe((response : any) : void => {
      let success = response === "Signed in!";
      
      if (success) {
        this.router.navigate(["/profile", username]);

      } else {
        this.popupError = document.getElementById("popup-error");
        this.popupError.innerHTML = response;
      }
    });
  }
  
  configureSignIn() : void {
    if (this.canSignIn) {
      this.popupHeader.innerHTML = "Log in";
      this.signUp = false;
      this.openPopup();
      this.canSignIn = false;
    }
  }

  configureSignUp() : void {
    this.popupHeader.innerHTML = "Create account";
    this.signUp = true;
    this.openPopup();
    this.canSignIn = false;
  }

  validateSignUp() : void {
    let username = this.usernameInput.value;
    let password = this.passwordInput.value;
    let account = {
        username: username,
        password: password
    }

    this.http.post("http://localhost:8080/users", account, {responseType: "text"}).subscribe((response : any) : void => {
      let success = response === "Account created!";

      if (success) {
        this.router.navigate(["/profile", username]);

      } else {
        this.popupError = document.getElementById("popup-error");
        this.popupError.innerHTML = response;
      }
    });
  }

  validate() : void {
    if (this.signUp) {
      this.validateSignUp();

    } else {
      this.validateSignIn();
    }
  }

  closePopup() : void {
    this.popup.style.display = "none";
    this.slogan.style.filter = "brightness(100%)";
    this.logo.style.filter = "brightness(100%)";
    this.signInButton.style.filter = "brightness(100%)";
    this.signInButton.style.cursor = "pointer";
    this.canSignIn = true;
    this.popupSubmit.removeEventListener("click", this.validateSignIn);
    this.popupSubmit.removeEventListener("click", this.validateSignUp);
    this.usernameInput.value = "";
    this.passwordInput.value = "";
    this.popupError.innerHTML = "";
    
    let css = "button#signin:hover { background: rgb(185, 185, 185); }";
    let style = <any> document.createElement("style");

    if (style.styleSheet) {
        style.styleSheet.cssText = css;

    } else {
        style.appendChild(document.createTextNode(css));
    }

    document.getElementsByTagName("head")[0].appendChild(style);
  }
}