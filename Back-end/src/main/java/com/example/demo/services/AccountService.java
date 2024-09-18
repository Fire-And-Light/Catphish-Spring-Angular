package com.example.demo.services;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.time.LocalDate;
import java.util.Base64;
import java.util.Optional;

import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.models.Account;
import com.example.demo.models.Relationship;
import com.example.demo.repositories.AccountRepository;
import com.example.demo.repositories.MessageRepository;
import com.example.demo.repositories.RelationshipRepository;
import com.example.demo.utils.Hash;
import com.example.demo.utils.Salt;

@Service
public class AccountService {
    private AccountRepository ar;
    private RelationshipRepository rr;
    private MessageRepository mr;

    @Autowired
    public AccountService(AccountRepository ar, RelationshipRepository rr, MessageRepository mr) {
        super();
        this.ar = ar;
        this.rr = rr;
        this.mr = mr;
    }

    @Transactional
    public String signUp(String username, String password) {
        Optional<Account> optional = this.ar.findById(username);

        if (!optional.isEmpty()) {
            return "An account with that username already exists";
            
        } else if (username.length() > Account.MAX_NAM_LEN) {
            return "Username exceeds " + Account.MAX_NAM_LEN + " characters";

        } else if (username.contains(" ")) {
            return "Username must not include spaces";

        } else if (username.equals("")) {
            return "Username must not be empty";
            
        } else {
            String passwordSalt = Salt.generate();
            String passwordHash = Hash.SHA384toString(password + passwordSalt);
            String picturePath = "src/main/resources/default.jpg";
            Account user = new Account(username, passwordSalt, passwordHash, picturePath, null, LocalDate.now(), null, null);
            this.ar.save(user);

            Relationship rel = new Relationship(0, user, user, false);
            this.rr.save(rel);

            return "Account created!";
        }
    }

    @Transactional
    public String signIn(String username, String password) {
        Optional<Account> optional = this.ar.findById(username);

        if (optional.isEmpty()) {
            return "No account with that username exists";

        } else {
            Account user = optional.get();
            String passwordSalt = user.getPasswordSalt();
            String passwordHash = Hash.SHA384toString(password + passwordSalt);

            if (!passwordHash.equals(user.getPasswordHash())) {
                return "Invalid password";
    
            } else {
                return "Signed in!";
            }
        }
    }

    @Transactional
    public Account getProfile(String username) {
        Account user = this.ar.findById(username).get();
        Account userJSON = new Account(); // The point of using another object is to prevent sending the extra account information, especially the password hash

        userJSON.setBio(user.getBio());
        
        try {
            File file = new File(user.getPicturePath());
            byte[] fileContent = Files.readAllBytes(file.toPath());
            userJSON.setPictureBlob(Base64.getEncoder().encodeToString(fileContent));
            
        } catch (IOException e) {
            e.printStackTrace();
        }

        return userJSON;
    }

    @Transactional
    public void saveProfile(Account user) {
        Account outdatedUser = this.ar.findById(user.getUsername()).get();

        user.setDateCreated(outdatedUser.getDateCreated());
        user.setPasswordHash(outdatedUser.getPasswordHash());
        user.setPasswordSalt(outdatedUser.getPasswordSalt());

        try {
            String base64Data = user.getPictureBlob().split(",")[1];
            byte[] decodedBytes = Base64.getDecoder().decode(base64Data);
            ByteArrayInputStream bis = new ByteArrayInputStream(decodedBytes);
            BufferedImage image = ImageIO.read(bis);
            String picturePath = "src/main/resources/pictures/" + user.getUsername() + ".png";
            File pictureFile = new File(picturePath);
            System.out.println(ImageIO.write(image,"png", pictureFile)); // For some reason, saving pictures as ".png" files works with more images than as ".jpg" files
            user.setPicturePath(picturePath);

        } catch (IOException e) {
            e.printStackTrace();
        }

        this.ar.save(user);
    }

    @Transactional
    public void deleteAccount(String username) {
        Account user = this.ar.findById(username).get();

        if (!user.getPicturePath().equals("src/main/resources/default.jpg")) {
            File file = new File(user.getPicturePath());
            file.delete();
        }

        this.mr.deleteMessages(username);
        this.rr.deleteRelationships(username);
        this.ar.deleteById(username);
    }
}