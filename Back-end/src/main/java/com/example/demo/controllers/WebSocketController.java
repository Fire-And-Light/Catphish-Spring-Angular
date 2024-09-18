package com.example.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.models.WebSocketMessage;
import com.example.demo.services.MessageService;
import com.example.demo.services.RelationshipService;

// The reason for creating this class is because the front-end doesn't work correctly when subscribing to two topics at the same time, so this class is used to handle both topics while only needing the front-end to subscribe to one topic
@RestController
@CrossOrigin
public class WebSocketController {
    private RelationshipService rs;
    private MessageService ms;

    @Autowired
    public WebSocketController(RelationshipService rs, MessageService ms) {
        super();
        this.rs = rs;
        this.ms = ms;
    }

    @MessageMapping("{username}")
    @SendTo("{username}")
    public void update(@RequestBody WebSocketMessage wsm) { // The return value can also be sent to the front-end, but in this case it's unneccesary
        if (wsm.getChoice().equals("Unmatch")) {
            this.rs.unmatch(wsm.getRelationship());

        } else if (wsm.getChoice().equals("Message")) {
            this.ms.sendMessage(wsm.getMessage());

        } else if (wsm.getChoice().equals("Delete")) {
            return;
        }
    }
}