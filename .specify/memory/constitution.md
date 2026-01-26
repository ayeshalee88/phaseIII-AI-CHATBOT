/sp.constitution

## Project
Multi-Phase Todo Application: From Python Console App to AI-Powered Cloud-Native System

---

## Vision
To design and incrementally evolve a Todo application that demonstrates:
- strong software engineering fundamentals,
- modern full-stack development,
- AI-native interaction patterns,
- and cloud-native deployment practices.

Each phase must stand independently while also serving as a foundation for the next, ensuring technical continuity and learning depth.

---

## Core Principles

### 1. Correctness Before Complexity
- Functionality must be correct, testable, and understandable before optimization or feature expansion.
- No premature abstractions or over-engineering.

### 2. Incremental Evolution
- Each phase builds **directly** on the previous phase’s concepts.
- Architectural decisions must justify future scalability or AI integration.

### 3. Clarity & Maintainability
- Code must be readable to a developer with basic-to-intermediate Python knowledge.
- Clear naming, modular structure, and inline documentation are mandatory.

### 4. Reproducibility
- Every phase must be reproducible from documented steps.
- Setup instructions must be deterministic and platform-agnostic where possible.

### 5. Real-World Alignment
- Tools and patterns used must reflect industry-standard practices.
- No toy abstractions that cannot scale to production-like systems.

### 6. AI-Native Readiness
- Design choices must anticipate AI augmentation:
  - structured data
  - clean APIs
  - clear domain boundaries
- AI is an enhancement, not a replacement for core logic.

---

## Key Standards

### General Standards (All Phases)
- Language and frameworks must be used according to official documentation.
- All non-trivial logic must be explainable in plain language.
- Errors must be handled explicitly (no silent failures).

### Phase I – In-Memory Python Console App
- Pure Python (standard library only unless justified).
- State stored in memory (no files or databases).
- CRUD operations must be explicit and deterministic.
- Separation between:
  - data model
  - business logic
  - user interaction (console I/O).

### Phase II – Full-Stack Web Application
- Backend: FastAPI + SQLModel
- Frontend: Next.js
- Database: Neon (PostgreSQL)
- RESTful API design with proper status codes.
- Schema-first approach for data models.
- Clear boundary between frontend and backend responsibilities.

### Phase III – AI-Powered Todo Chatbot
- AI must interact via defined tools/APIs, not direct database access.
- Use OpenAI ChatKit and Agents SDK according to official specs.
- Agent behavior must be:
  - deterministic where possible,
  - explainable,
  - safely constrained.
- No hallucinated actions (all actions map to real system operations).

### Phase IV – Local Kubernetes Deployment
- Every service must be containerized.
- Kubernetes manifests or Helm charts must be readable and minimal.
- Local deployment (Minikube) must mirror production topology.
- Observability and service boundaries must be explicit.

### Phase V – Advanced Cloud Deployment
- Event-driven components (Kafka, Dapr) must have clear justification.
- Cloud resources must be cost-aware and documented.
- System must degrade gracefully under partial failure.
- Infrastructure choices must be explainable in architectural terms.

---

## Constraints

- No skipping phases.
- No AI-generated code used blindly without understanding.
- No proprietary abstractions that block portability.
- Each phase must be:
  - runnable,
  - testable,
  - and reviewable independently.

---

## Documentation Requirements

- README for each phase explaining:
  - purpose
  - architecture
  - setup steps
  - key design decisions
- Inline comments only where they add clarity (not noise).
- Diagrams encouraged for Phases II–V.

---

## Success Criteria

### Phase-Level Success
- Phase goals met without breaking prior guarantees.
- Code passes basic functional tests.
- Setup works from scratch on a clean environment.

### Project-Level Success
- Clear evolutionary path from console app to AI-driven cloud system.
- Demonstrates mastery of:
  - Python fundamentals
  - web APIs
  - AI agent integration
  - cloud-native deployment
- System can be explained end-to-end without hidden magic.

---

## Non-Goals

- Building the fastest or most feature-rich Todo app.
- Using tools without understanding their trade-offs.
- Treating AI as a shortcut instead of a capability multiplier.

---

## Guiding Metaphor
This project is a **ladder, not an elevator**.  
Every rung must hold your weight before you climb higher.
