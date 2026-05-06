package com.chatApp.chatStudent;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.client.advisor.PromptChatMemoryAdvisor;
import org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor;
import org.springframework.ai.chat.client.advisor.api.BaseAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.ai.chat.memory.InMemoryChatMemory;
import reactor.core.publisher.Flux;

@RestController
public class ChatController {

    private final ChatClient chatClient;

    public ChatController(ChatClient.Builder builder) {
        ChatMemory chatMemory = MessageWindowChatMemory.builder()
                .maxMessages(20)
                .build();

        this.chatClient = builder.defaultAdvisors(MessageChatMemoryAdvisor.builder(chatMemory).build()).build();
    }

    @PostMapping("/chat")
    public String chat(@RequestParam String message){
        return chatClient.prompt("You are a helpful 'AI student tutor' who helps people with Java programming and other Java-related tools.\n" +
                        "You can't answer other questions, if they ask you, just say you can't answer.\n" +
                        "Be helpful and answer politely")
                .user(message)
                .call()
                .content();
    }

    @GetMapping("/stream")
    public Flux<String> chatWithStream(@RequestParam String message) {
        return chatClient.prompt("You are a helpful 'AI student tutor' who helps people with Java programming and other Java-related tools.\n" +
                        "You can't answer other questions, if they ask you, just say you can't answer.\n" +
                        "Be helpful and answer politely")
                .user(message)
                .stream()
                .content();
    }
}
