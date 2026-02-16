# PentestAI API Documentation

AI-Powered Penetration Testing Report Generator

**Base URL:** `http://localhost:8000`

---

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Health Check](#1-health-check)
  - [Generate Report](#2-generate-report)
  - [Calculate CVSS](#3-calculate-cvss)
  - [Export PDF](#4-export-pdf)
  - [OWASP Top 10](#5-owasp-top-10)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [CORS](#cors)

---

## Overview

PentestAI API provides endpoints for generating professional vulnerability assessment reports, calculating CVSS v3.1 scores, and accessing OWASP Top 10 data.

**Tech Stack:** FastAPI + Python 3.10

---

## Authentication

Currently, the API does not require authentication. CORS is enabled for:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (React dev server)

---

## Endpoints

### 1. Health Check

Check if the API is running.

**Endpoint:** `GET /`

**Response:**
```json
{
  "message": "PentestAI API",
  "version": "1.0.0",
  "status": "running"
}
```

**Status Codes:**
- `200` - API is running

---

### 2. Generate Report

Generate a vulnerability assessment report in HTML and Markdown formats.

**Endpoint:** `POST /api/generate-report`

**Content-Type:** `application/json`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Vulnerability name (3-200 chars) |
| `target_url` | string | Yes | Target URL or endpoint |
| `severity` | string | No | One of: `critical`, `high`, `medium`, `low`, `info` (default: `medium`) |
| `cvss_score` | float | Yes | CVSS score (0-10) |
| `cwe_id` | string | No | CWE identifier (default: "CWE-79") |
| `description` | string | Yes | Vulnerability description (min 10 chars) |
| `poc` | string | Yes | Proof of Concept |
| `impact` | string | Yes | Impact description (min 10 chars) |
| `remediation` | string | Yes | Remediation steps (min 10 chars) |
| `references` | string | No | Reference URLs (default: OWASP Top 10) |
| `reporter_name` | string | No | Reporter name (default: "Security Researcher") |
| `owasp_category` | string | No | OWASP category (e.g., "A01:2021-Broken Access Control") |
| `cvss_metrics` | object | No | Detailed CVSS metrics |

**CVSS Metrics Object:**

| Field | Type | Default | Values |
|-------|------|---------|--------|
| `attack_vector` | string | "N" | N (Network), A (Adjacent), L (Local), P (Physical) |
| `attack_complexity` | string | "L" | L (Low), H (High) |
| `privileges_required` | string | "N" | N (None), L (Low), H (High) |
| `user_interaction` | string | "N" | N (None), R (Required) |
| `scope` | string | "U" | U (Unchanged), C (Changed) |
| `confidentiality` | string | "H" | H (High), L (Low), N (None) |

**Example Request:**
```json
{
  "name": "SQL Injection in Login Form",
  "target_url": "https://example.com/login",
  "severity": "critical",
  "cvss_score": 9.8,
  "cwe_id": "CWE-89",
  "description": "The login form is vulnerable to SQL injection attacks allowing authentication bypass.",
  "poc": "Username: admin' OR '1'='1' --\nPassword: anything",
  "impact": "Complete database compromise and unauthorized access to all user accounts.",
  "remediation": "Use parameterized queries and input validation. Implement prepared statements.",
  "references": "https://owasp.org/www-community/attacks/SQL_Injection, https://cwe.mitre.org/data/definitions/89.html",
  "reporter_name": "John Doe",
  "owasp_category": "A03:2021-Injection",
  "cvss_metrics": {
    "attack_vector": "N",
    "attack_complexity": "L",
    "privileges_required": "N",
    "user_interaction": "N",
    "scope": "U",
    "confidentiality": "H"
  }
}
```

**Example Response:**
```json
{
  "id": "a1b2c3d4",
  "generated_at": "2024-01-15T10:30:00",
  "html_content": "<!DOCTYPE html>...",
  "markdown_content": "# Vulnerability Report: SQL Injection...",
  "metadata": {
    "severity": "critical",
    "cvss_score": 9.8,
    "report_type": "vulnerability_assessment"
  }
}
```

**Status Codes:**
- `200` - Report generated successfully
- `422` - Validation error (invalid input)
- `500` - Server error

---

### 3. Calculate CVSS

Calculate CVSS v3.1 base score from metrics.

**Endpoint:** `POST /api/calculate-cvss`

**Content-Type:** `application/json`

**Request Body:**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `attack_vector` | string | "N" | Attack vector (N/A/L/P) |
| `attack_complexity` | string | "L" | Attack complexity (L/H) |
| `privileges_required` | string | "N" | Privileges required (N/L/H) |
| `user_interaction` | string | "N" | User interaction (N/R) |
| `scope` | string | "U" | Scope (U/C) |
| `confidentiality` | string | "H" | Confidentiality impact (H/L/N) |

**Example Request:**
```json
{
  "attack_vector": "N",
  "attack_complexity": "L",
  "privileges_required": "N",
  "user_interaction": "N",
  "scope": "U",
  "confidentiality": "H"
}
```

**Example Response:**
```json
{
  "score": 9.8,
  "severity": "critical",
  "vector_string": "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N"
}
```

**Status Codes:**
- `200` - Score calculated successfully
- `422` - Validation error
- `500` - Server error

---

### 4. Export PDF

Export a generated report as PDF.

**Endpoint:** `POST /api/export-pdf`

**Content-Type:** `application/json`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `report_html` | string | Yes | HTML content of the report |

**Example Request:**
```json
{
  "report_html": "<!DOCTYPE html><html>...</html>"
}
```

**Response:**
- Content-Type: `application/pdf`
- File downloaded as: `vulnerability-report.pdf`

**Status Codes:**
- `200` - PDF generated successfully
- `422` - Validation error
- `500` - Server error

---

### 5. OWASP Top 10

Get OWASP Top 10 2021 vulnerability categories.

**Endpoint:** `GET /api/owasp-top10`

**Response:**
```json
{
  "A01:2021": {
    "name": "Broken Access Control",
    "description": "Restrictions on authenticated users are not properly enforced.",
    "risk": "critical",
    "examples": ["IDOR", "Path Traversal", "Privilege Escalation"]
  },
  "A02:2021": {
    "name": "Cryptographic Failures",
    "description": "Sensitive data exposed due to weak or missing encryption.",
    "risk": "high",
    "examples": ["Weak SSL/TLS", "Hardcoded Keys", "Plaintext Storage"]
  },
  ...
}
```

**Categories:**
- A01:2021 - Broken Access Control
- A02:2021 - Cryptographic Failures
- A03:2021 - Injection
- A04:2021 - Insecure Design
- A05:2021 - Security Misconfiguration
- A06:2021 - Vulnerable Components
- A07:2021 - Auth Failures
- A08:2021 - Data Integrity Failures
- A09:2021 - Logging Failures
- A10:2021 - SSRF

**Status Codes:**
- `200` - Data retrieved successfully

---

## Data Models

### Severity Enum

```
critical - Critical severity (CVSS 9.0-10.0)
high     - High severity (CVSS 7.0-8.9)
medium   - Medium severity (CVSS 4.0-6.9)
low      - Low severity (CVSS 0.1-3.9)
info     - Informational (CVSS 0.0)
```

### CVSS Score Mapping

| Score Range | Severity |
|-------------|----------|
| 9.0 - 10.0 | Critical |
| 7.0 - 8.9 | High |
| 4.0 - 6.9 | Medium |
| 0.1 - 3.9 | Low |
| 0.0 | Info |

---

## Error Handling

All errors follow this format:

```json
{
  "detail": "Error message description"
}
```

**Common HTTP Status Codes:**

| Code | Meaning |
|------|---------|
| `200` | Success |
| `422` | Validation Error - Invalid input data |
| `500` | Internal Server Error |

---

## CORS

Cross-Origin Resource Sharing is enabled for the following origins:
- `http://localhost:5173`
- `http://localhost:3000`

All methods and headers are allowed.

---

## Running the API

### Development Mode (with auto-reload):
```bash
cd /home/hanafi/Documents/RedKit/AI-Report/backend
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Production Mode:
```bash
cd /home/hanafi/Documents/RedKit/AI-Report/backend
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Background Mode:
```bash
cd /home/hanafi/Documents/RedKit/AI-Report/backend
source venv/bin/activate
nohup uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload > backend.log 2>&1 &
```

---

## Interactive Documentation

When the server is running, you can access:

- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

---

## Dependencies

- FastAPI 0.104.1
- Uvicorn 0.24.0
- Pydantic 2.5.0
- WeasyPrint 60.2 (for PDF generation)

---

## License

Internal Use Only - PentestAI Project
