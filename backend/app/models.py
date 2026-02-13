from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class Severity(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INFO = "info"

class CVSSMetrics(BaseModel):
    attack_vector: str = "N"  # N, A, L, P
    attack_complexity: str = "L"  # L, H
    privileges_required: str = "N"  # N, L, H
    user_interaction: str = "N"  # N, R
    scope: str = "U"  # U, C
    confidentiality: str = "H"  # H, L, N

class VulnerabilityInput(BaseModel):
    name: str = Field(..., min_length=3, max_length=200)
    target_url: str = Field(..., description="Target URL or endpoint")
    severity: Severity = Severity.MEDIUM
    cvss_score: float = Field(..., ge=0, le=10)
    cwe_id: Optional[str] = "CWE-79"
    description: str = Field(..., min_length=10)
    poc: str = Field(..., description="Proof of Concept")
    impact: str = Field(..., min_length=10)
    remediation: str = Field(..., min_length=10)
    references: Optional[str] = "https://owasp.org/www-project-top-ten/"
    reporter_name: str = "Security Researcher"
    owasp_category: Optional[str] = None
    cvss_metrics: Optional[CVSSMetrics] = None

class ReportOutput(BaseModel):
    id: str
    generated_at: datetime
    html_content: str
    markdown_content: str
    metadata: dict

class SavedReport(BaseModel):
    id: str
    created_at: datetime
    input_data: VulnerabilityInput
    report_html: str