package com.auxiliar.server.peer;

import java.time.Clock;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** The chat between people keeps time on its own small scheduler (the wait for a volunteer, forgetting old chats) */
@Configuration
public class PeerChatConfig {

    @Bean(destroyMethod = "shutdownNow")
    ScheduledExecutorService peerChatScheduler() {
        return Executors.newSingleThreadScheduledExecutor(Thread.ofPlatform().name("peer-chat").daemon().factory());
    }

    @Bean
    Clock peerChatClock() {
        return Clock.systemUTC();
    }
}
