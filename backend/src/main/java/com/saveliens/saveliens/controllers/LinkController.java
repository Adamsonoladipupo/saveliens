package com.saveliens.saveliens.controllers;

import com.saveliens.saveliens.dtos.requests.AddLinkRequestDto;
import com.saveliens.saveliens.dtos.responses.AddLinkResponseDto;
import com.saveliens.saveliens.services.LinkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@CrossOrigin("http://localhost:5173")
@RestController
@RequestMapping("/api/topic/{topicId}/links")
public class LinkController {
    @Autowired
    private LinkService linkService;

    @GetMapping("/greet")
    public String greet(){
        return "Hey Link!, lets get the party started";
    }

    @PostMapping
    public ResponseEntity<AddLinkResponseDto> addLink(@RequestBody AddLinkRequestDto requestDto, @PathVariable String topicId) {
        AddLinkResponseDto response = linkService.addLink(requestDto, topicId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<AddLinkResponseDto>> getLinks(@PathVariable String topicId) {
        return ResponseEntity.ok(linkService.getAllUserLinks(topicId));
    }

    @DeleteMapping("/{linkId}")
    public ResponseEntity<Void> deleteLink(@PathVariable String topicId, @PathVariable String linkId) {
        linkService.deleteLink(linkId);
        return ResponseEntity.noContent().build();
    }



}
