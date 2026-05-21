package com.example.demo.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.List;

import com.example.demo.model.Task;

@Service
public class AIService {

        @Value("${groq.api.key}")
        private String apiKey;

        public String analyzeTask(
                        String task) {

                WebClient client = WebClient.create();

                String prompt = """
                                Analyze this task.

                                Return only:

                                Priority:
                                Reason:
                                Suggested Deadline:

                                Task:
                                """
                                + task;

                Map response =

                                client

                                                .post()

                                                .uri(
                                                                "https://api.groq.com/openai/v1/chat/completions")

                                                .header(
                                                                "Authorization",
                                                                "Bearer " + apiKey)

                                                .contentType(
                                                                MediaType.APPLICATION_JSON)

                                                .bodyValue(

                                                                Map.of(

                                                                                "model",

                                                                                "llama-3.3-70b-versatile",

                                                                                "messages",

                                                                                new Object[] {

                                                                                                Map.of(

                                                                                                                "role",

                                                                                                                "user",

                                                                                                                "content",

                                                                                                                prompt)

                                                                                }

                                                                )

                                                )

                                                .retrieve()

                                                .bodyToMono(
                                                                Map.class)

                                                .block();

                Map choice =

                                (Map)

                                ((java.util.List)

                                response.get(
                                                "choices"))

                                                .get(
                                                                0);

                Map message =

                                (Map)

                                choice.get(
                                                "message");

                return

                message

                                .get(
                                                "content")

                                .toString();

        }

        public String generateSchedule(

                        List<Task>

                        tasks

        ) {

                WebClient client = WebClient.create();

                StringBuilder taskData =

new StringBuilder();

for(

Task task

:

tasks

)
{

    taskData.append(

            "Title: "

    )

    .append(

            task.getTitle()

    )

    .append(

            "\nDue Date: "

    )

    .append(

            task.getDueDate()

    )

    .append(

            "\nPriority: "

    )

    .append(

            task.getPriority()

    )

    .append(

            "\nStatus: "

    )

    .append(

            task.getStatus()

    )

    

    .append(

            "\n\n"

    );

}

String prompt =

"""
You are an AI schedule planner.

Create schedule for ALL tasks.

Rules:

1. Ignore completed tasks

2. Prioritize using:
   - due date
   - task priority

3. Add realistic durations

4. Include small breaks

5. Keep response SHORT

Return EXACTLY in this format:


09:00–10:30 → Task 🔴
Priority: HIGH
Duration: 1h 30m
Reason: short reason

10:30–10:45 → Break


Icons:

🔴 HIGH
🟡 MEDIUM
🟢 LOW


Keep maximum 4 lines per task.

Tasks:

"""

+

taskData;

                Map response =

                                client

                                                .post()

                                                .uri(
                                                                "https://api.groq.com/openai/v1/chat/completions")

                                                .header(
                                                                "Authorization",
                                                                "Bearer " + apiKey)

                                                .contentType(
                                                                MediaType.APPLICATION_JSON)

                                                .bodyValue(

                                                                Map.of(

                                                                                "model",

                                                                                "llama-3.3-70b-versatile",

                                                                                "messages",

                                                                                new Object[] {

                                                                                                Map.of(

                                                                                                                "role",

                                                                                                                "user",

                                                                                                                "content",

                                                                                                                prompt)

                                                                                }

                                                                )

                                                )

                                                .retrieve()

                                                .bodyToMono(
                                                                Map.class)

                                                .block();

                Map choice =

                                (Map)

                                ((java.util.List)

                                response.get(
                                                "choices"))

                                                .get(
                                                                0);

                Map message =

                                (Map)

                                choice.get(
                                                "message");

                return

                message

                                .get(
                                                "content")

                                .toString();

        }

}