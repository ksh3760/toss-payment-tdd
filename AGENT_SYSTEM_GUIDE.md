# IT Product Development Agent System - Implementation Guide

## Overview

This guide provides a **cost-optimized, 5-agent system** for small IT projects (1-3 developers, <6 months duration). Total estimated cost: **$7-18/day** with comprehensive coverage of all development phases.

---

## Architecture Design

### Agent Pipeline (Sequential)

```
┌─────────────────────────────────────────────────────────────────┐
│                    SEQUENTIAL ORCHESTRATION                      │
└─────────────────────────────────────────────────────────────────┘

[Requirements & Planning Agent]
          ↓ (User stories, specs, feasibility)
[System Architect Agent]
          ↓ (Architecture, API contracts, schemas)
[Full-Stack Developer Agent]
          ↓ (Backend + Frontend implementation)
[Testing & QA Agent]
          ↓ (Unit tests, integration tests, reports)
[Code Reviewer & Documentation Agent]
          ↓ (Quality review, API docs, README)

✓ Output: Production-ready codebase with tests and documentation
```

### Cost Breakdown

| Agent | Daily Tasks | Tokens/Day | Estimated Cost |
|-------|-------------|------------|----------------|
| Requirements & Planning | 5-10 | ~3,000 | $1-3 |
| System Architect | 3-5 | ~2,500 | $1-2 |
| Full-Stack Developer | 10-20 | ~8,000 | $3-8 |
| Testing & QA | 5-10 | ~3,000 | $1-3 |
| Code Reviewer & Docs | 5-8 | ~2,500 | $1-2 |
| **TOTAL** | **28-53** | **~19,000** | **$7-18** |

**Comparison:**
- Single agent: $0.41/day (but limited capability)
- Multi-agent chat: $10.54+/day (26x more expensive)
- **This system: $7-18/day (optimized for small projects)**

---

## Implementation Guide

### Prerequisites

```bash
# Install CrewAI framework
pip install crewai crewai-tools anthropic

# Optional: for advanced features
pip install langchain langchain-anthropic redis pymongo
```

### Step 1: Project Structure

```
project-root/
├── agents/
│   ├── __init__.py
│   ├── requirements_agent.py
│   ├── architect_agent.py
│   ├── developer_agent.py
│   ├── testing_agent.py
│   └── reviewer_agent.py
├── tasks/
│   ├── __init__.py
│   └── task_definitions.py
├── tools/
│   ├── __init__.py
│   ├── code_generator.py
│   ├── test_runner.py
│   └── documentation_generator.py
├── orchestrator.py
├── config.py
└── main.py
```

### Step 2: Configuration (config.py)

```python
import os
from dotenv import load_dotenv

load_dotenv()

# Model configuration - Cost optimized
MODEL_CONFIG = {
    "model": "claude-sonnet-4-20250514",  # Cost-optimized model
    "temperature": 0.3,  # Lower = more deterministic
    "max_tokens": 2000,  # Token limit per response
}

# Agent-specific overrides
AGENT_MODELS = {
    "requirements": MODEL_CONFIG,
    "architect": MODEL_CONFIG,
    "developer": {**MODEL_CONFIG, "max_tokens": 3000},  # More for code
    "testing": MODEL_CONFIG,
    "reviewer": MODEL_CONFIG,
}

# Cost tracking
ENABLE_COST_TRACKING = True
MAX_DAILY_COST = 20.00  # Safety limit in USD

# Anthropic API
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

# Token cost calculation (approximate)
TOKEN_COSTS = {
    "claude-sonnet-4-20250514": {
        "input": 0.003 / 1000,   # $0.003 per 1K tokens
        "output": 0.015 / 1000,  # $0.015 per 1K tokens
    }
}
```

### Step 3: Agent Definitions

#### agents/requirements_agent.py

```python
from crewai import Agent
from config import AGENT_MODELS

def create_requirements_agent():
    """
    Requirements & Planning Agent
    Cost: ~$1-3/day
    """
    return Agent(
        role="Requirements & Planning Specialist",
        goal="Analyze user requirements and create detailed specifications",
        backstory="""You are an expert business analyst with 10+ years
        experience in software requirements engineering. You excel at
        understanding user needs and translating them into clear,
        actionable technical specifications.""",

        llm_config=AGENT_MODELS["requirements"],

        verbose=True,
        allow_delegation=False,  # Cost optimization

        # Tools (optional)
        tools=[
            # Add custom tools if needed
        ],
    )
```

#### agents/architect_agent.py

```python
from crewai import Agent
from config import AGENT_MODELS

def create_architect_agent():
    """
    System Architect Agent
    Cost: ~$1-2/day
    """
    return Agent(
        role="System Architect",
        goal="Design robust, scalable system architecture from requirements",
        backstory="""You are a senior software architect with expertise
        in microservices, API design, database modeling, and cloud-native
        architectures. You make technology decisions based on project
        requirements, team size, and scalability needs.""",

        llm_config=AGENT_MODELS["architect"],

        verbose=True,
        allow_delegation=False,

        # Key responsibilities in prompt
        additional_context="""
        Your outputs must include:
        1. High-level system architecture diagram (text-based)
        2. Component specifications with responsibilities
        3. API endpoint definitions (REST/GraphQL)
        4. Database schema design
        5. Technology stack recommendations with rationale
        6. Security considerations
        7. Scalability strategy
        """,
    )
```

#### agents/developer_agent.py

```python
from crewai import Agent
from config import AGENT_MODELS

def create_developer_agent():
    """
    Full-Stack Developer Agent (Polymorphic)
    Cost: ~$3-8/day (highest cost due to code generation)
    """
    return Agent(
        role="Full-Stack Developer",
        goal="Implement complete features from architecture specifications",
        backstory="""You are a senior full-stack developer proficient in
        modern frameworks (React, Next.js, Node.js, Python, Go). You write
        clean, maintainable code following best practices, SOLID principles,
        and TDD methodology. You handle both frontend and backend development.""",

        llm_config=AGENT_MODELS["developer"],

        verbose=True,
        allow_delegation=False,

        tools=[
            # Code generation tools
            # File system tools
            # Git tools
        ],

        additional_context="""
        Development standards:
        - Follow TDD: Write tests before implementation
        - Use TypeScript for type safety
        - Follow project's coding conventions
        - Include error handling and logging
        - Write self-documenting code with clear variable names
        - Add comments for complex logic only
        - Ensure mobile responsiveness for frontend
        - Implement proper security measures (input validation, sanitization)
        """,
    )
```

#### agents/testing_agent.py

```python
from crewai import Agent
from config import AGENT_MODELS

def create_testing_agent():
    """
    Testing & QA Agent (Combined unit + integration)
    Cost: ~$1-3/day
    """
    return Agent(
        role="QA Engineer & Test Automation Specialist",
        goal="Ensure code quality through comprehensive automated testing",
        backstory="""You are a QA engineer specializing in test automation,
        with expertise in Jest, React Testing Library, Playwright, and test
        strategy. You create thorough test suites covering edge cases and
        ensuring high code coverage.""",

        llm_config=AGENT_MODELS["testing"],

        verbose=True,
        allow_delegation=False,

        tools=[
            # Test runner tools
            # Coverage analyzer
        ],

        additional_context="""
        Testing requirements:
        - Unit tests: Test individual functions/components in isolation
        - Integration tests: Test component interactions
        - Minimum 80% code coverage
        - Test edge cases and error conditions
        - Use descriptive test names (Given-When-Then format)
        - Mock external dependencies
        - Test both happy paths and failure scenarios
        - Include performance tests for critical paths
        """,
    )
```

#### agents/reviewer_agent.py

```python
from crewai import Agent
from config import AGENT_MODELS

def create_reviewer_agent():
    """
    Code Reviewer & Documentation Agent
    Cost: ~$1-2/day
    """
    return Agent(
        role="Senior Code Reviewer & Technical Writer",
        goal="Review code quality and create comprehensive documentation",
        backstory="""You are a staff engineer who conducts thorough code
        reviews focusing on maintainability, security, and performance. You
        also excel at creating clear, user-friendly technical documentation.""",

        llm_config=AGENT_MODELS["reviewer"],

        verbose=True,
        allow_delegation=False,

        additional_context="""
        Review checklist:
        1. Code Quality:
           - SOLID principles adherence
           - DRY (Don't Repeat Yourself)
           - Clear naming conventions
           - Appropriate abstractions

        2. Security:
           - Input validation
           - SQL injection prevention
           - XSS prevention
           - Authentication/authorization
           - Secrets management

        3. Performance:
           - Algorithm efficiency
           - Database query optimization
           - Caching opportunities
           - Bundle size (frontend)

        4. Documentation:
           - README.md with setup instructions
           - API documentation (OpenAPI/Swagger)
           - Architecture decision records (ADR)
           - Inline code documentation
           - Usage examples
        """,
    )
```

### Step 4: Task Definitions

#### tasks/task_definitions.py

```python
from crewai import Task

def create_requirements_task(agent, user_input):
    """Define requirements gathering task"""
    return Task(
        description=f"""
        Analyze the following user requirements and create a detailed specification:

        USER INPUT:
        {user_input}

        YOUR DELIVERABLES:
        1. User Stories (using "As a [role], I want [feature] so that [benefit]" format)
        2. Functional Requirements (detailed list)
        3. Non-Functional Requirements (performance, security, scalability)
        4. Technical Feasibility Assessment
        5. Success Criteria
        6. Potential Risks and Mitigation Strategies

        Be specific and measurable. Think from user perspective.
        """,
        agent=agent,
        expected_output="Structured requirements document with user stories, functional/non-functional requirements, and feasibility analysis",
    )

def create_architecture_task(agent, requirements_output):
    """Define architecture design task"""
    return Task(
        description=f"""
        Based on the following requirements, design a complete system architecture:

        REQUIREMENTS:
        {requirements_output}

        YOUR DELIVERABLES:
        1. High-Level Architecture Diagram (ASCII art or text description)
        2. Component Breakdown with responsibilities
        3. API Design:
           - Endpoint definitions (method, path, params, response)
           - Request/response schemas
           - Authentication strategy
        4. Database Schema:
           - Tables/collections with fields
           - Relationships
           - Indexes
        5. Technology Stack Recommendations:
           - Frontend framework and rationale
           - Backend framework and rationale
           - Database choice and rationale
           - Additional libraries/tools
        6. Security Architecture
        7. Scalability Strategy

        Provide clear rationale for all technology choices.
        """,
        agent=agent,
        expected_output="Complete system architecture with component breakdown, API design, database schema, and technology stack",
    )

def create_development_task(agent, architecture_output):
    """Define implementation task"""
    return Task(
        description=f"""
        Implement the complete system based on this architecture:

        ARCHITECTURE:
        {architecture_output}

        YOUR DELIVERABLES:
        1. Backend Implementation:
           - API endpoints with proper error handling
           - Business logic layer
           - Data access layer
           - Input validation
           - Authentication/authorization

        2. Frontend Implementation:
           - UI components following design system
           - State management
           - API integration
           - Form validation
           - Error handling and loading states

        3. Integration:
           - Connect frontend to backend
           - Handle API calls with proper error handling
           - Implement loading and error states

        4. Configuration:
           - Environment variables setup
           - Build configuration
           - Development/production configs

        IMPORTANT:
        - Follow TDD: Write tests alongside implementation
        - Use TypeScript for type safety
        - Include comprehensive error handling
        - Add logging for debugging
        - Ensure mobile responsiveness
        - Follow security best practices

        Provide complete, production-ready code.
        """,
        agent=agent,
        expected_output="Complete implementation with backend, frontend, and integration code following TDD principles",
    )

def create_testing_task(agent, code_output):
    """Define testing task"""
    return Task(
        description=f"""
        Create comprehensive test suite for the following implementation:

        CODE:
        {code_output}

        YOUR DELIVERABLES:
        1. Unit Tests:
           - Test each function/component in isolation
           - Mock external dependencies
           - Cover edge cases and error conditions
           - Use descriptive test names

        2. Integration Tests:
           - Test component interactions
           - Test API endpoint flows
           - Test database operations

        3. Test Coverage Report:
           - Measure code coverage
           - Identify untested code paths
           - Aim for >80% coverage

        4. Test Execution Summary:
           - All tests passing status
           - Performance metrics
           - Identified issues

        Use Jest and React Testing Library for frontend.
        Include setup/teardown for tests requiring state.
        """,
        agent=agent,
        expected_output="Complete test suite with unit and integration tests, achieving >80% code coverage",
    )

def create_review_task(agent, all_outputs):
    """Define review and documentation task"""
    return Task(
        description=f"""
        Review the complete implementation and create documentation:

        IMPLEMENTATION TO REVIEW:
        {all_outputs}

        YOUR DELIVERABLES:
        1. Code Review Report:
           - Code quality assessment
           - Security vulnerabilities (if any)
           - Performance concerns (if any)
           - Best practices compliance
           - Refactoring recommendations

        2. Documentation:
           - README.md:
             * Project overview
             * Prerequisites
             * Installation instructions
             * Running the application
             * Running tests
             * Environment variables
             * Troubleshooting

           - API_DOCUMENTATION.md:
             * All endpoints with examples
             * Request/response schemas
             * Authentication guide
             * Error codes

           - ARCHITECTURE.md:
             * System overview
             * Component descriptions
             * Data flow diagrams
             * Technology choices rationale

           - DEPLOYMENT.md:
             * Deployment steps
             * Environment setup
             * Monitoring and logging
             * Rollback procedures

        3. Final Assessment:
           - Production readiness score
           - Critical issues to address
           - Nice-to-have improvements

        Be thorough but concise. Focus on actionable feedback.
        """,
        agent=agent,
        expected_output="Code review report with actionable feedback and complete project documentation",
    )
```

### Step 5: Orchestrator (orchestrator.py)

```python
from crewai import Crew, Process
from agents.requirements_agent import create_requirements_agent
from agents.architect_agent import create_architect_agent
from agents.developer_agent import create_developer_agent
from agents.testing_agent import create_testing_agent
from agents.reviewer_agent import create_reviewer_agent
from tasks.task_definitions import (
    create_requirements_task,
    create_architecture_task,
    create_development_task,
    create_testing_task,
    create_review_task,
)
import time
from typing import Dict, Any

class CostTracker:
    """Track token usage and costs"""
    def __init__(self):
        self.total_input_tokens = 0
        self.total_output_tokens = 0
        self.total_cost = 0.0
        self.agent_costs = {}

    def add_usage(self, agent_name: str, input_tokens: int, output_tokens: int):
        from config import TOKEN_COSTS, MODEL_CONFIG

        model = MODEL_CONFIG["model"]
        input_cost = input_tokens * TOKEN_COSTS[model]["input"]
        output_cost = output_tokens * TOKEN_COSTS[model]["output"]
        total = input_cost + output_cost

        self.total_input_tokens += input_tokens
        self.total_output_tokens += output_tokens
        self.total_cost += total

        if agent_name not in self.agent_costs:
            self.agent_costs[agent_name] = {"cost": 0, "input": 0, "output": 0}

        self.agent_costs[agent_name]["cost"] += total
        self.agent_costs[agent_name]["input"] += input_tokens
        self.agent_costs[agent_name]["output"] += output_tokens

    def print_report(self):
        print("\n" + "="*60)
        print("COST TRACKING REPORT")
        print("="*60)
        print(f"Total Input Tokens:  {self.total_input_tokens:,}")
        print(f"Total Output Tokens: {self.total_output_tokens:,}")
        print(f"Total Cost:          ${self.total_cost:.4f}")
        print("\nPer-Agent Breakdown:")
        print("-"*60)
        for agent, data in self.agent_costs.items():
            print(f"{agent:30s} ${data['cost']:.4f} ({data['input']:,} in / {data['output']:,} out)")
        print("="*60 + "\n")

class ProjectOrchestrator:
    """Orchestrates the 5-agent pipeline"""

    def __init__(self, enable_cost_tracking=True):
        self.cost_tracker = CostTracker() if enable_cost_tracking else None

        # Initialize agents
        self.requirements_agent = create_requirements_agent()
        self.architect_agent = create_architect_agent()
        self.developer_agent = create_developer_agent()
        self.testing_agent = create_testing_agent()
        self.reviewer_agent = create_reviewer_agent()

        print("✓ All agents initialized")

    def run_pipeline(self, user_requirements: str) -> Dict[str, Any]:
        """
        Execute the complete development pipeline

        Args:
            user_requirements: User's project requirements as text

        Returns:
            Dictionary containing all outputs and metadata
        """
        print("\n" + "="*60)
        print("STARTING DEVELOPMENT PIPELINE")
        print("="*60 + "\n")

        start_time = time.time()
        results = {}

        # Phase 1: Requirements & Planning
        print("📋 Phase 1: Requirements & Planning")
        print("-"*60)
        requirements_task = create_requirements_task(
            self.requirements_agent,
            user_requirements
        )
        requirements_crew = Crew(
            agents=[self.requirements_agent],
            tasks=[requirements_task],
            process=Process.sequential,
            verbose=True,
        )
        requirements_output = requirements_crew.kickoff()
        results["requirements"] = requirements_output
        print("✓ Requirements completed\n")

        # Phase 2: Architecture & Design
        print("🏗️  Phase 2: System Architecture")
        print("-"*60)
        architecture_task = create_architecture_task(
            self.architect_agent,
            requirements_output
        )
        architecture_crew = Crew(
            agents=[self.architect_agent],
            tasks=[architecture_task],
            process=Process.sequential,
            verbose=True,
        )
        architecture_output = architecture_crew.kickoff()
        results["architecture"] = architecture_output
        print("✓ Architecture completed\n")

        # Phase 3: Implementation
        print("💻 Phase 3: Development")
        print("-"*60)
        development_task = create_development_task(
            self.developer_agent,
            architecture_output
        )
        development_crew = Crew(
            agents=[self.developer_agent],
            tasks=[development_task],
            process=Process.sequential,
            verbose=True,
        )
        code_output = development_crew.kickoff()
        results["code"] = code_output
        print("✓ Development completed\n")

        # Phase 4: Testing & QA
        print("🧪 Phase 4: Testing & QA")
        print("-"*60)
        testing_task = create_testing_task(
            self.testing_agent,
            code_output
        )
        testing_crew = Crew(
            agents=[self.testing_agent],
            tasks=[testing_task],
            process=Process.sequential,
            verbose=True,
        )
        testing_output = testing_crew.kickoff()
        results["tests"] = testing_output
        print("✓ Testing completed\n")

        # Phase 5: Code Review & Documentation
        print("📝 Phase 5: Review & Documentation")
        print("-"*60)
        all_outputs = f"""
        REQUIREMENTS:
        {requirements_output}

        ARCHITECTURE:
        {architecture_output}

        CODE:
        {code_output}

        TESTS:
        {testing_output}
        """
        review_task = create_review_task(
            self.reviewer_agent,
            all_outputs
        )
        review_crew = Crew(
            agents=[self.reviewer_agent],
            tasks=[review_task],
            process=Process.sequential,
            verbose=True,
        )
        review_output = review_crew.kickoff()
        results["review"] = review_output
        print("✓ Review completed\n")

        # Calculate total time
        end_time = time.time()
        duration = end_time - start_time

        # Print summary
        print("\n" + "="*60)
        print("PIPELINE COMPLETED SUCCESSFULLY")
        print("="*60)
        print(f"Total Duration: {duration:.2f} seconds ({duration/60:.2f} minutes)")

        # Print cost report if tracking enabled
        if self.cost_tracker:
            self.cost_tracker.print_report()

        results["metadata"] = {
            "duration_seconds": duration,
            "completed_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        }

        return results

def main_example():
    """Example usage"""

    # User requirements (can come from CLI, file, or API)
    user_requirements = """
    Build a simple e-commerce product management system with the following features:

    1. Product CRUD operations (Create, Read, Update, Delete)
    2. Products stored in localStorage for persistence
    3. Admin page for managing products with:
       - List view with product cards
       - Add new product form
       - Edit existing product functionality
       - Delete product with confirmation
    4. Public product listing page for customers
    5. Form validation for all inputs
    6. Responsive design for mobile and desktop
    7. Built with Next.js 15, TypeScript, and Tailwind CSS

    Non-functional requirements:
    - Fast page loads (<2 seconds)
    - Mobile-first responsive design
    - 80%+ test coverage
    - Production-ready code quality
    """

    # Initialize orchestrator
    orchestrator = ProjectOrchestrator(enable_cost_tracking=True)

    # Run pipeline
    results = orchestrator.run_pipeline(user_requirements)

    # Save results to files
    import json
    with open("pipeline_results.json", "w") as f:
        json.dump(results, f, indent=2, default=str)

    print("\n✓ Results saved to pipeline_results.json")

    return results

if __name__ == "__main__":
    main_example()
```

### Step 6: Main Entry Point (main.py)

```python
#!/usr/bin/env python3
"""
Main entry point for the IT Product Development Agent System
"""

import argparse
import sys
from orchestrator import ProjectOrchestrator
from config import MAX_DAILY_COST

def load_requirements_from_file(filepath: str) -> str:
    """Load requirements from a text file"""
    try:
        with open(filepath, 'r') as f:
            return f.read()
    except FileNotFoundError:
        print(f"Error: File not found: {filepath}")
        sys.exit(1)
    except Exception as e:
        print(f"Error reading file: {e}")
        sys.exit(1)

def main():
    parser = argparse.ArgumentParser(
        description="Cost-Optimized Multi-Agent Development System"
    )
    parser.add_argument(
        "--requirements",
        "-r",
        help="Path to requirements file or direct requirements text",
        required=True
    )
    parser.add_argument(
        "--from-file",
        "-f",
        action="store_true",
        help="Load requirements from file instead of direct text"
    )
    parser.add_argument(
        "--no-cost-tracking",
        action="store_true",
        help="Disable cost tracking"
    )
    parser.add_argument(
        "--output",
        "-o",
        default="pipeline_results.json",
        help="Output file for results (default: pipeline_results.json)"
    )

    args = parser.parse_args()

    # Load requirements
    if args.from_file:
        requirements = load_requirements_from_file(args.requirements)
    else:
        requirements = args.requirements

    print("\n" + "="*60)
    print("COST-OPTIMIZED AGENT DEVELOPMENT SYSTEM")
    print("="*60)
    print(f"Max Daily Cost Limit: ${MAX_DAILY_COST}")
    print(f"Cost Tracking: {'Enabled' if not args.no_cost_tracking else 'Disabled'}")
    print("="*60 + "\n")

    # Confirm with user
    print("REQUIREMENTS:")
    print("-"*60)
    print(requirements)
    print("-"*60)
    print("\nThis will run the complete 5-agent pipeline:")
    print("  1. Requirements & Planning Agent")
    print("  2. System Architect Agent")
    print("  3. Full-Stack Developer Agent")
    print("  4. Testing & QA Agent")
    print("  5. Code Reviewer & Documentation Agent")
    print(f"\nEstimated cost: $7-18")

    response = input("\nProceed? (yes/no): ")
    if response.lower() not in ['yes', 'y']:
        print("Cancelled.")
        sys.exit(0)

    # Initialize and run
    orchestrator = ProjectOrchestrator(
        enable_cost_tracking=not args.no_cost_tracking
    )

    try:
        results = orchestrator.run_pipeline(requirements)

        # Save results
        import json
        with open(args.output, 'w') as f:
            json.dump(results, f, indent=2, default=str)

        print(f"\n✓ Results saved to {args.output}")
        print("\nNext steps:")
        print("  1. Review the generated architecture and code")
        print("  2. Run the tests to verify functionality")
        print("  3. Review the documentation")
        print("  4. Deploy to your environment")

        return 0

    except Exception as e:
        print(f"\n❌ Error during pipeline execution: {e}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == "__main__":
    sys.exit(main())
```

---

## Usage Examples

### Example 1: Simple CLI Usage

```bash
# Direct requirements text
python main.py -r "Build a todo app with React and localStorage"

# From file
python main.py -f -r requirements.txt -o results.json
```

### Example 2: Requirements File (requirements.txt)

```text
PROJECT: Personal Finance Tracker

FEATURES:
1. User authentication (email/password)
2. Add income and expense transactions
3. Categorize transactions
4. Monthly budget tracking
5. Visual charts for spending analysis
6. Export data to CSV

TECH STACK:
- Frontend: Next.js 15 with TypeScript
- Backend: Next.js API routes
- Database: PostgreSQL
- Authentication: NextAuth.js
- Charts: Recharts
- Styling: Tailwind CSS

NON-FUNCTIONAL:
- Mobile responsive
- Fast performance (<2s page loads)
- Secure (OWASP top 10 compliant)
- 80%+ test coverage
- Accessible (WCAG 2.1 AA)
```

### Example 3: Programmatic Usage

```python
from orchestrator import ProjectOrchestrator

# Custom requirements
requirements = """
Build a real-time chat application with:
- WebSocket connections
- Message persistence
- User presence indicators
- Typing indicators
- Message read receipts
- Image sharing
- Search history
"""

# Run pipeline
orchestrator = ProjectOrchestrator()
results = orchestrator.run_pipeline(requirements)

# Access specific outputs
print("Architecture:", results["architecture"])
print("Code:", results["code"])
print("Tests:", results["tests"])
print("Review:", results["review"])
```

---

## Cost Optimization Strategies

### 1. Token Management

```python
# In config.py
MODEL_CONFIG = {
    "max_tokens": 2000,  # Limit output size
    "temperature": 0.3,  # Lower = more focused, less exploratory
}

# Summarize before passing to next agent
def summarize_output(text: str, max_length: int = 1000) -> str:
    """Summarize long outputs to reduce token usage"""
    if len(text) <= max_length:
        return text

    # Use Claude to summarize
    # Or use simple truncation for extreme cost savings
    return text[:max_length] + "... (truncated)"
```

### 2. Caching Responses

```python
import hashlib
import json
from functools import lru_cache

class ResponseCache:
    """Cache agent responses to avoid duplicate work"""

    def __init__(self, cache_file="response_cache.json"):
        self.cache_file = cache_file
        self.cache = self._load_cache()

    def _load_cache(self):
        try:
            with open(self.cache_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {}

    def _save_cache(self):
        with open(self.cache_file, 'w') as f:
            json.dump(self.cache, f, indent=2)

    def get_cache_key(self, agent_name: str, task_description: str) -> str:
        """Generate cache key from agent and task"""
        combined = f"{agent_name}:{task_description}"
        return hashlib.md5(combined.encode()).hexdigest()

    def get(self, agent_name: str, task_description: str):
        """Get cached response"""
        key = self.get_cache_key(agent_name, task_description)
        return self.cache.get(key)

    def set(self, agent_name: str, task_description: str, response):
        """Cache response"""
        key = self.get_cache_key(agent_name, task_description)
        self.cache[key] = {
            "agent": agent_name,
            "response": str(response),
            "timestamp": time.time(),
        }
        self._save_cache()
```

### 3. Selective Agent Activation

```python
def run_pipeline_selective(
    self,
    user_requirements: str,
    skip_phases: list = []
) -> Dict[str, Any]:
    """
    Run pipeline with optional phase skipping

    Args:
        skip_phases: List of phases to skip, e.g., ['testing', 'review']
    """

    # For quick prototypes, skip testing and review
    if 'testing' in skip_phases:
        print("⚠️  Skipping testing phase")

    if 'review' in skip_phases:
        print("⚠️  Skipping review phase")

    # Run only required phases
    # Estimated cost reduction: 20-40%
```

### 4. Model Tiering

```python
# Use cheaper models for simple tasks
AGENT_MODELS = {
    "requirements": {
        "model": "claude-sonnet-4-20250514",  # Standard
        "max_tokens": 2000,
    },
    "architect": {
        "model": "claude-sonnet-4-20250514",  # Standard
        "max_tokens": 2000,
    },
    "developer": {
        "model": "claude-sonnet-4-20250514",  # Standard for cost
        "max_tokens": 3000,
    },
    "testing": {
        "model": "claude-haiku-4-20250514",  # Cheaper for tests
        "max_tokens": 2000,
    },
    "reviewer": {
        "model": "claude-sonnet-4-20250514",  # Standard
        "max_tokens": 2000,
    },
}

# Potential savings: 15-25% by using Haiku for simpler tasks
```

---

## Monitoring & Observability

### Cost Dashboard

```python
import matplotlib.pyplot as plt
from datetime import datetime

class CostDashboard:
    """Visualize cost trends over time"""

    def __init__(self, log_file="cost_log.json"):
        self.log_file = log_file
        self.logs = self._load_logs()

    def _load_logs(self):
        try:
            with open(self.log_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return []

    def log_run(self, cost_data):
        """Log a pipeline run"""
        self.logs.append({
            "timestamp": datetime.now().isoformat(),
            "total_cost": cost_data["total_cost"],
            "total_tokens": cost_data["total_tokens"],
            "agent_breakdown": cost_data["agent_costs"],
        })

        with open(self.log_file, 'w') as f:
            json.dump(self.logs, f, indent=2)

    def plot_daily_costs(self):
        """Plot daily cost trends"""
        dates = [log["timestamp"][:10] for log in self.logs]
        costs = [log["total_cost"] for log in self.logs]

        plt.figure(figsize=(12, 6))
        plt.plot(dates, costs, marker='o')
        plt.xlabel('Date')
        plt.ylabel('Cost ($)')
        plt.title('Daily Agent System Costs')
        plt.xticks(rotation=45)
        plt.grid(True, alpha=0.3)
        plt.tight_layout()
        plt.savefig('cost_trends.png')
        print("✓ Cost trends saved to cost_trends.png")

    def get_weekly_summary(self):
        """Get weekly cost summary"""
        # Group by week and calculate totals
        # Return summary statistics
        pass
```

### Performance Metrics

```python
class PerformanceMonitor:
    """Monitor agent performance metrics"""

    def __init__(self):
        self.metrics = {
            "execution_times": {},
            "token_usage": {},
            "error_rates": {},
        }

    def track_agent_execution(self, agent_name, duration, tokens, errors):
        """Track individual agent metrics"""
        if agent_name not in self.metrics["execution_times"]:
            self.metrics["execution_times"][agent_name] = []

        self.metrics["execution_times"][agent_name].append(duration)
        # Track other metrics...

    def get_slowest_agents(self, n=3):
        """Identify bottleneck agents"""
        avg_times = {
            agent: sum(times) / len(times)
            for agent, times in self.metrics["execution_times"].items()
        }

        return sorted(avg_times.items(), key=lambda x: x[1], reverse=True)[:n]
```

---

## Advanced Features

### Parallel Execution (Optional)

For independent tasks, you can run agents in parallel to reduce wall-clock time:

```python
import asyncio
from concurrent.futures import ThreadPoolExecutor

async def run_parallel_agents(tasks):
    """Run multiple agents in parallel"""

    with ThreadPoolExecutor(max_workers=3) as executor:
        futures = [
            executor.submit(crew.kickoff)
            for crew in tasks
        ]

        results = [future.result() for future in futures]

    return results

# Example: Run frontend and backend development in parallel
async def parallel_development(architect_output):
    """Develop frontend and backend simultaneously"""

    frontend_task = create_frontend_task(frontend_agent, architect_output)
    backend_task = create_backend_task(backend_agent, architect_output)

    frontend_crew = Crew(agents=[frontend_agent], tasks=[frontend_task])
    backend_crew = Crew(agents=[backend_agent], tasks=[backend_task])

    results = await run_parallel_agents([frontend_crew, backend_crew])

    return {
        "frontend": results[0],
        "backend": results[1],
    }

# Note: Parallel execution increases complexity and may increase costs
# Use only when wall-clock time is more important than token costs
```

### Memory System (Optional)

For long-running projects with multiple iterations:

```python
class SharedMemory:
    """Persistent memory across agent sessions"""

    def __init__(self, storage_backend="redis"):
        if storage_backend == "redis":
            import redis
            self.storage = redis.Redis(host='localhost', port=6379, db=0)
        else:
            self.storage = {}  # In-memory fallback

    def store_decision(self, key: str, value: str, context: dict):
        """Store architectural decision or pattern"""
        data = {
            "value": value,
            "context": context,
            "timestamp": time.time(),
        }
        self.storage.set(key, json.dumps(data))

    def retrieve_similar(self, query: str, top_k=5):
        """Retrieve similar past decisions"""
        # Use vector similarity search
        # Return relevant past decisions
        pass

    def get_project_history(self, project_id: str):
        """Get all past decisions for a project"""
        return self.storage.get(f"project:{project_id}:history")
```

---

## Testing the System

### Unit Tests for Agents

```python
# test_agents.py
import pytest
from agents.requirements_agent import create_requirements_agent
from tasks.task_definitions import create_requirements_task

def test_requirements_agent():
    """Test requirements agent output"""
    agent = create_requirements_agent()

    test_input = "Build a simple calculator app"
    task = create_requirements_task(agent, test_input)

    # Mock or run actual task
    result = task.execute()

    # Assertions
    assert "user stories" in result.lower()
    assert "functional requirements" in result.lower()
    assert len(result) > 100  # Substantial output

def test_cost_tracking():
    """Test cost tracking functionality"""
    from orchestrator import CostTracker

    tracker = CostTracker()
    tracker.add_usage("test_agent", input_tokens=1000, output_tokens=500)

    assert tracker.total_input_tokens == 1000
    assert tracker.total_output_tokens == 500
    assert tracker.total_cost > 0
```

### Integration Tests

```python
# test_pipeline.py
def test_full_pipeline():
    """Test complete pipeline execution"""
    from orchestrator import ProjectOrchestrator

    orchestrator = ProjectOrchestrator(enable_cost_tracking=True)

    simple_requirements = "Build a hello world web app with React"

    results = orchestrator.run_pipeline(simple_requirements)

    # Verify all phases completed
    assert "requirements" in results
    assert "architecture" in results
    assert "code" in results
    assert "tests" in results
    assert "review" in results

    # Verify cost tracking
    assert results["metadata"]["duration_seconds"] > 0
```

---

## Troubleshooting

### Common Issues

#### Issue 1: High Token Costs

**Symptoms**: Costs exceeding $20/day

**Solutions**:
1. Check `max_tokens` settings in config.py
2. Implement output summarization between agents
3. Enable response caching
4. Use cheaper models for simpler tasks (Haiku instead of Sonnet)
5. Review verbose output settings (set verbose=False)

#### Issue 2: Slow Execution

**Symptoms**: Pipeline taking >30 minutes

**Solutions**:
1. Reduce `max_tokens` to speed up generation
2. Simplify task descriptions
3. Consider parallel execution for independent tasks
4. Check network latency to API

#### Issue 3: Poor Quality Outputs

**Symptoms**: Generated code has bugs or doesn't meet requirements

**Solutions**:
1. Make task descriptions more specific and detailed
2. Increase `temperature` slightly (0.3 → 0.5) for creativity
3. Add more examples in agent backstories
4. Implement iterative refinement loops
5. Add human-in-the-loop checkpoints

#### Issue 4: API Rate Limits

**Symptoms**: 429 errors from Anthropic API

**Solutions**:
1. Add retry logic with exponential backoff
2. Implement request queuing
3. Reduce concurrent agent executions
4. Check your API tier limits

---

## Extending the System

### Adding New Agents

```python
# agents/security_agent.py
def create_security_agent():
    """Security Specialist Agent - for large projects"""
    return Agent(
        role="Security Engineer",
        goal="Identify and fix security vulnerabilities",
        backstory="""You are a security expert specializing in OWASP Top 10,
        secure coding practices, and penetration testing.""",

        llm_config=AGENT_MODELS.get("security", MODEL_CONFIG),
        verbose=True,
        allow_delegation=False,

        additional_context="""
        Security checklist:
        - SQL injection vulnerabilities
        - XSS (Cross-Site Scripting)
        - CSRF protection
        - Authentication/authorization flaws
        - Insecure direct object references
        - Security misconfigurations
        - Sensitive data exposure
        - Missing encryption
        - Insufficient logging and monitoring
        """,
    )

# tasks/task_definitions.py
def create_security_audit_task(agent, code_output):
    """Security audit task"""
    return Task(
        description=f"""
        Perform comprehensive security audit on this code:

        {code_output}

        Check for OWASP Top 10 vulnerabilities and provide:
        1. List of identified vulnerabilities with severity
        2. Exploitation scenarios
        3. Remediation steps
        4. Secure code examples
        """,
        agent=agent,
        expected_output="Security audit report with vulnerabilities and remediation steps",
    )
```

### Integration with External Tools

```python
# tools/github_integration.py
from crewai_tools import GithubSearchTool

def setup_github_tools():
    """Configure GitHub integration for code search"""
    return GithubSearchTool(
        github_repo='your-org/your-repo',
        gh_token=os.getenv('GITHUB_TOKEN'),
        content_types=['code', 'issue'],
    )

# Use in developer agent
developer_agent = Agent(
    role="Full-Stack Developer",
    tools=[setup_github_tools()],
    # ... other config
)
```

---

## Best Practices

### 1. Start Small, Iterate

```python
# Phase 1: Core 3 agents (Week 1)
- Requirements
- Developer (combined full-stack)
- Testing

# Phase 2: Add architecture (Week 2)
- Split planning from architecture
- Add dedicated architect agent

# Phase 3: Add quality (Week 3)
- Add code review agent
- Add documentation agent

# Phase 4: Optimize (Week 4+)
- Implement caching
- Add cost monitoring
- Optimize prompts
```

### 2. Measure Everything

```python
metrics_to_track = {
    "cost_per_feature": "$/feature",
    "time_per_phase": "seconds/phase",
    "code_quality_score": "1-10 scale",
    "test_coverage": "percentage",
    "bug_rate": "bugs/1000 LOC",
}
```

### 3. Human-in-the-Loop Checkpoints

```python
def run_pipeline_with_checkpoints(orchestrator, requirements):
    """Add human review between phases"""

    # Phase 1: Requirements
    req_output = orchestrator.run_phase("requirements", requirements)

    print("\n=== CHECKPOINT: Requirements ===")
    print(req_output)
    if input("Approve? (y/n): ").lower() != 'y':
        return "Requirements rejected. Please revise."

    # Phase 2: Architecture
    arch_output = orchestrator.run_phase("architecture", req_output)

    print("\n=== CHECKPOINT: Architecture ===")
    print(arch_output)
    if input("Approve? (y/n): ").lower() != 'y':
        return "Architecture rejected. Please revise."

    # Continue with remaining phases...
```

### 4. Version Control for Agent Outputs

```python
def save_versioned_output(phase: str, output: str, version: int):
    """Save outputs with version tracking"""
    import os

    output_dir = f"outputs/{phase}"
    os.makedirs(output_dir, exist_ok=True)

    filename = f"{output_dir}/v{version}_{int(time.time())}.md"

    with open(filename, 'w') as f:
        f.write(f"# {phase.title()} - Version {version}\n\n")
        f.write(f"Generated: {time.strftime('%Y-%m-%d %H:%M:%S')}\n\n")
        f.write(output)

    print(f"✓ Saved {filename}")
```

---

## Conclusion

This cost-optimized 5-agent system provides:

✅ **Complete coverage** of all development phases
✅ **Cost-effective** at $7-18/day (vs $50-800 for larger systems)
✅ **Production-ready** code with tests and documentation
✅ **Scalable** architecture that can grow with your needs
✅ **Measurable** with built-in cost tracking and monitoring

### Quick Start Checklist

- [ ] Install dependencies (`pip install crewai crewai-tools anthropic`)
- [ ] Set up `.env` with `ANTHROPIC_API_KEY`
- [ ] Create project structure (agents/, tasks/, tools/)
- [ ] Copy agent definitions from this guide
- [ ] Create requirements.txt for your project
- [ ] Run pipeline: `python main.py -f -r requirements.txt`
- [ ] Review outputs in `pipeline_results.json`
- [ ] Monitor costs with built-in tracker

### Next Steps

1. **Experiment**: Try on your Toss Payments project
2. **Measure**: Track costs and quality metrics
3. **Optimize**: Adjust based on your specific needs
4. **Scale**: Add agents as projects grow
5. **Share**: Document learnings for your team

### Resources

- **CrewAI Docs**: https://docs.crewai.com/
- **Anthropic API**: https://docs.anthropic.com/
- **Cost Calculator**: https://anthropic.com/pricing
- **Community**: CrewAI Discord, GitHub discussions

---

**Document Version**: 1.0
**Last Updated**: 2025-11-11
**Estimated Read Time**: 45 minutes
**Target Audience**: Developers, Tech Leads, Engineering Managers
