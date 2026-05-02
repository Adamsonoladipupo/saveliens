package com.saveliens.saveliens.controllers;

import com.saveliens.saveliens.dtos.requests.LoginRequestDto;
import com.saveliens.saveliens.dtos.requests.UserRegistrationRequestDto;
import com.saveliens.saveliens.dtos.responses.LoginResponseDto;
import com.saveliens.saveliens.dtos.responses.UserRegistrationResponseDto;
import com.saveliens.saveliens.services.UserServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:5173")
@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserServiceImp userService;

    @GetMapping("/greet")
    public String greet(){
        return "Hey User! Let's get the party started";
    }

    @PostMapping("/register")
    public ResponseEntity<UserRegistrationResponseDto> register(@RequestBody UserRegistrationRequestDto requestDto){
        UserRegistrationResponseDto responseDto = userService.register(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto requestDto){
        LoginResponseDto responseDto = userService.login(requestDto);
        return ResponseEntity.ok(responseDto);
    }
}
