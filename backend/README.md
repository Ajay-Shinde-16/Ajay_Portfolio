# Backend — Spring Boot API

```bash
mvn spring-boot:run     # http://localhost:8080
mvn clean package       # runnable jar -> target/
```

Requires JDK 17+.

## Endpoints

- `GET  /api/projects` — featured projects as JSON (consumed by the frontend)
- `POST /api/contact`  — `{ "name": "...", "email": "...", "message": "..." }`
- `GET  /api/contact`  — list stored messages (requires header `X-Admin-Token`)
- `GET  /h2-console`   — browse the in-memory DB (JDBC: `jdbc:h2:mem:portfolio`, user `sa`)

## Structure

```
src/main/java/com/ajayshinde/portfolio/
├── PortfolioApplication.java
├── config/WebConfig.java              CORS for the React dev server
├── controller/ProjectController.java
├── controller/ContactController.java  + validation error handling
├── model/Project.java                 JSON POJO
├── model/ContactMessage.java          JPA entity
├── repository/ContactMessageRepository.java
└── service/ProjectService.java        edit your projects here
```

Data is stored in an in-memory H2 database (resets on restart). To persist to a
file, see the note in `src/main/resources/application.properties`.
