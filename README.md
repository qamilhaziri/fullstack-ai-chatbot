# ChatStudent

ChatStudent is a Java-focused AI tutoring chatbot built with Spring Boot, Spring AI, Ollama, and a lightweight browser UI. The application helps students ask Java programming questions and receive conversational, streamed responses from a local language model.

## Business Problem Solved

Students learning Java often get stuck on syntax errors, object-oriented programming concepts, tooling, and debugging questions outside classroom hours. ChatStudent addresses that gap by providing an always-available AI tutor focused specifically on Java and Java-related tools.

The project demonstrates how an education-focused chatbot can:

- Reduce friction for beginners who need fast programming help.
- Provide instant feedback without requiring an instructor to be available.
- Keep answers scoped to the learning domain instead of acting as a general-purpose chatbot.
- Use a local model through Ollama, making the prototype easier to run without relying on external API keys.

## Key Features

- Java tutoring assistant focused on Java programming and related tools.
- Real-time streamed chatbot responses for a smoother user experience.
- Conversation memory window that keeps recent chat context available to the model.
- Simple web interface with a responsive chat layout.
- Retry handling on the frontend for failed streaming requests.
- Spring Boot backend serving both REST endpoints and static frontend assets.
- Local AI model integration through Spring AI and Ollama.

## Technical Architecture

```text
Browser UI
  |
  |  GET /stream?message=...
  v
Spring Boot Web Layer
  |
  |  ChatController
  v
Spring AI ChatClient
  |
  |  MessageWindowChatMemory, max 20 messages
  v
Ollama Local Model
  |
  |  phi3
  v
AI-generated Java tutoring response
```

### Backend

The backend is a Spring Boot application with a `ChatController` that exposes two chat endpoints:

- `POST /chat` returns a complete chatbot response.
- `GET /stream` streams the chatbot response incrementally to the frontend.

The controller uses Spring AI's `ChatClient` with `MessageWindowChatMemory` so the assistant can retain short-term conversation context. A system prompt constrains the assistant to behave as an AI student tutor for Java programming and Java-related tools.

### Frontend

The frontend is served from `src/main/resources/static` and uses:

- `index.html` for the chat interface.
- Tailwind CSS through CDN for styling.
- `script.js` for form handling, streamed response reading, retry logic, and DOM updates.

The browser sends the user's question to `/stream`, reads the response with the Streams API, and updates the chat window as tokens arrive.

## Technologies

- Java 21
- Spring Boot 4
- Spring Web MVC
- Spring AI
- Ollama
- Phi-3 local model
- Maven
- HTML
- Tailwind CSS
- JavaScript Fetch API
- Browser Streams API

## Challenges Solved

- Integrated a local LLM into a Spring Boot application using Spring AI.
- Added streaming responses so users do not have to wait for the full answer before seeing progress.
- Implemented short-term chat memory with a message window to preserve recent conversation context.
- Designed a prompt that keeps the assistant focused on Java tutoring instead of unrelated topics.
- Built a minimal full-stack prototype with one deployable Spring Boot application serving both backend endpoints and frontend files.
- Added frontend retry behavior to improve resilience when a stream request fails.

## What I Learned

- How to connect Spring Boot applications to local AI models with Spring AI and Ollama.
- How `ChatClient` abstracts prompting, calling, streaming, and model configuration.
- How chat memory improves the quality of multi-turn AI conversations.
- How to stream model output from the backend and consume it in the browser.
- How to structure a simple AI application around a clear user need instead of only experimenting with model calls.
- How prompt design can enforce product boundaries and keep an assistant aligned with a specific use case.

## Getting Started

### Prerequisites

- Java 21
- Maven or the included Maven wrapper
- Ollama installed and running
- Phi-3 model pulled locally

Pull the model with:

```bash
ollama pull phi3
```

### Run the Application

Start Ollama, then run the Spring Boot app:

```bash
./mvnw spring-boot:run
```

Open the application in a browser:

```text
http://localhost:8080
```

## Project Structure

```text
src/main/java/com/chatApp/chatStudent
  ChatStudentApplication.java   # Spring Boot entry point
  ChatController.java           # Chat endpoints and Spring AI integration

src/main/resources/static
  index.html                    # Chat UI
  script.js                     # Streaming frontend behavior

src/main/resources
  application.properties        # App and Ollama model configuration
```

