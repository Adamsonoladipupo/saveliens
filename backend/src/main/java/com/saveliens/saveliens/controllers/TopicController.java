package com.saveliens.saveliens.controllers;

import com.saveliens.saveliens.dtos.requests.CreateTopicRequestDto;
import com.saveliens.saveliens.dtos.requests.DeleteTopicRequestDto;
import com.saveliens.saveliens.dtos.responses.CreateTopicResponseDto;
import com.saveliens.saveliens.dtos.responses.TopicWithLinksResponseDto;
import com.saveliens.saveliens.services.TopicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/topic")
public class TopicController {
    @Autowired
    private TopicService topicService;

    @GetMapping("/greet")
    public String greet(){
        return "Hey Topic!, Let's get the party started";
    }

    @PostMapping
    public ResponseEntity<CreateTopicResponseDto> createTopic(@RequestBody CreateTopicRequestDto requestDto) {
        CreateTopicResponseDto responseDto = topicService.createTopic(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @GetMapping("/me")
    public ResponseEntity<List<CreateTopicResponseDto>> getUserTopics() {
        return ResponseEntity.ok(topicService.getUserTopics());
    }

    @GetMapping("/{topicId}")
    public ResponseEntity<TopicWithLinksResponseDto> getTopicWithLinks(
            @PathVariable String topicId) {

        return ResponseEntity.ok(topicService.getTopicWithLinks(topicId));
    }

    @DeleteMapping("{topicId}")
    public ResponseEntity<Void> deleteTopic(@PathVariable String topicId) {
        DeleteTopicRequestDto requestDto = new DeleteTopicRequestDto();
        requestDto.setTopicId(topicId);

        topicService.deleteTopic(requestDto);
        return ResponseEntity.noContent().build();
    }

}
