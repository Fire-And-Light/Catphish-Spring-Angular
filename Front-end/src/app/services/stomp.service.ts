import { Injectable } from '@angular/core';
import * as SockJS from "sockjs-client";
import * as Stomp from "stompjs";

@Injectable({
  providedIn: 'root'
})
export class StompService {
  socket = new SockJS("http://localhost:8080/ws");
  client = Stomp.over(this.socket);

  constructor() {

  }

  connect() : void {
    this.client.connect();
  }

  subscribe(topic : string, callback? : any, headers? : any) : void {
    const connected : boolean = this.client.connected;

    if (connected) {
      this.subscribeToTopic(topic, callback, headers);

    } else {
      this.client.connect({}, () : void => {
        this.subscribeToTopic(topic, callback, headers);
      });
    }
  }

  private subscribeToTopic(topic : string, callback? : any, headers? : any) : void {
    this.client.subscribe(topic, (frame : any): any => { // "frame" is metadata sent to the subscriber when "send" is called by a client that can be accessed by the subscriber. This data includes the body sent in the "send" function
      callback(frame);
    }, headers);
  }

  send(topic : string, headers? : any, json? : string) {
    this.client.send(topic, headers, json);
  }

  unsubscribe(topic : string) : void {
    this.client.unsubscribe(topic);
  }

  disconnect() : void {
    this.client.disconnect();
  }
}