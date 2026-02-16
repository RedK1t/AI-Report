from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, FileResponse
import tempfile
import os
from weasyprint import HTML as WeasyHTML
from dotenv import load_dotenv

from .models import VulnerabilityInput, ReportOutput, CVSSMetrics
from .report_generator import ReportGenerator
from .cvss_calculator import CVSSCalculator

load_dotenv()

app = FastAPI(
    title="PentestAI API",
    description="AI-Powered Penetration Testing Report Generator",
    version="1.0.0"
)

# CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "PentestAI API", "version": "1.0.0", "status": "running"}

@app.post("/api/generate-report", response_model=ReportOutput)
async def generate_report(data: VulnerabilityInput):
    """Generate a vulnerability assessment report"""
    try:
        report = ReportGenerator.generate_report(data)
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/calculate-cvss")
async def calculate_cvss(metrics: CVSSMetrics):
    """Calculate CVSS v3.1 score from metrics"""
    try:
        metrics_dict = {
            'AV': metrics.attack_vector,
            'AC': metrics.attack_complexity,
            'PR': metrics.privileges_required,
            'UI': metrics.user_interaction,
            'S': metrics.scope,
            'C': metrics.confidentiality,
            'I': metrics.confidentiality,  # Using same for simplicity
            'A': 'N'  # Default
        }
        
        score = CVSSCalculator.calculate_base_score(metrics_dict)
        severity = CVSSCalculator.get_severity_from_score(score)
        
        return {
            "score": score,
            "severity": severity,
            "vector_string": f"CVSS:3.1/AV:{metrics.attack_vector}/AC:{metrics.attack_complexity}/PR:{metrics.privileges_required}/UI:{metrics.user_interaction}/S:{metrics.scope}/C:{metrics.confidentiality}/I:{metrics.confidentiality}/A:N"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/export-pdf")
async def export_pdf(report_html: str):
    """Export report as PDF"""
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp:
            WeasyHTML(string=report_html).write_pdf(tmp.name)
            return FileResponse(
                tmp.name, 
                media_type='application/pdf',
                filename=f'vulnerability-report.pdf'
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/owasp-top10")
async def get_owasp_top10():
    """Get OWASP Top 10 2021 data"""
    return {
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
        "A03:2021": {
            "name": "Injection",
            "description": "User-supplied data is not validated, filtered, or sanitized.",
            "risk": "critical",
            "examples": ["SQL Injection", "XSS", "Command Injection"]
        },
        "A04:2021": {
            "name": "Insecure Design",
            "description": "Missing or ineffective security controls in application design.",
            "risk": "high",
            "examples": ["Business Logic Flaws", "Workflow Bypass"]
        },
        "A05:2021": {
            "name": "Security Misconfiguration",
            "description": "Improper configuration of security settings.",
            "risk": "high",
            "examples": ["Default Credentials", "Unnecessary Features", "Verbose Errors"]
        },
        "A06:2021": {
            "name": "Vulnerable Components",
            "description": "Using outdated or vulnerable libraries/frameworks.",
            "risk": "high",
            "examples": ["Outdated Dependencies", "Known CVEs"]
        },
        "A07:2021": {
            "name": "Auth Failures",
            "description": "Authentication weaknesses allowing automated attacks.",
            "risk": "high",
            "examples": ["Brute Force", "Weak Passwords", "Session Hijacking"]
        },
        "A08:2021": {
            "name": "Data Integrity Failures",
            "description": "Software updates and data without verification.",
            "risk": "medium",
            "examples": ["Unsigned Updates", "Insecure Deserialization"]
        },
        "A09:2021": {
            "name": "Logging Failures",
            "description": "Insufficient logging and monitoring.",
            "risk": "medium",
            "examples": ["No Audit Logs", "Missing Alerts"]
        },
        "A10:2021": {
            "name": "SSRF",
            "description": "Server-Side Request Forgery.",
            "risk": "medium",
            "examples": ["Internal Network Access", "Cloud Metadata Theft"]
        }
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("AI_REPORT_PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)