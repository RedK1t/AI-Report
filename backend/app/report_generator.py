from datetime import datetime
from typing import Dict
import uuid
from .models import VulnerabilityInput, ReportOutput

class ReportGenerator:
    OWASP_DATA = {
        'A01:2021-Broken Access Control': {
            'description': 'Restrictions on authenticated users are not properly enforced.',
            'impact': 'Data breach, unauthorized access, privilege escalation',
            'remediation': 'Implement proper access controls, deny by default, validate server-side'
        },
        'A02:2021-Cryptographic Failures': {
            'description': 'Sensitive data exposed due to weak or missing encryption.',
            'impact': 'Data theft, compliance violations',
            'remediation': 'Use AES-256, secure key management, TLS 1.3'
        },
        'A03:2021-Injection': {
            'description': 'User-supplied data is not validated, filtered, or sanitized.',
            'impact': 'Data loss, corruption, disclosure, RCE',
            'remediation': 'Parameterized queries, input validation, WAF'
        }
    }

    @staticmethod
    def generate_report(data: VulnerabilityInput) -> ReportOutput:
        report_id = str(uuid.uuid4())[:8]
        generated_at = datetime.utcnow()
        
        html_content = ReportGenerator._generate_html(data, report_id, generated_at)
        markdown_content = ReportGenerator._generate_markdown(data, report_id, generated_at)
        
        return ReportOutput(
            id=report_id,
            generated_at=generated_at,
            html_content=html_content,
            markdown_content=markdown_content,
            metadata={
                "severity": data.severity,
                "cvss_score": data.cvss_score,
                "cwe_id": data.cwe_id
            }
        )

    @staticmethod
    def _generate_html(data: VulnerabilityInput, report_id: str, timestamp: datetime) -> str:
        severity_colors = {
            'critical': {'bg': '#fef2f2', 'text': '#dc2626', 'border': '#fecaca'},
            'high': {'bg': '#fff7ed', 'text': '#ea580c', 'border': '#fed7aa'},
            'medium': {'bg': '#fefce8', 'text': '#ca8a04', 'border': '#fde047'},
            'low': {'bg': '#eff6ff', 'text': '#2563eb', 'border': '#bfdbfe'},
            'info': {'bg': '#f3f4f6', 'text': '#4b5563', 'border': '#e5e7eb'}
        }
        
        colors = severity_colors.get(data.severity, severity_colors['medium'])
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Vulnerability Report - {data.name}</title>
            <style>
                body {{
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    line-height: 1.6;
                    max-width: 900px;
                    margin: 0 auto;
                    padding: 40px 20px;
                    color: #1f2937;
                    background: #ffffff;
                }}
                .header {{
                    border-bottom: 3px solid #3b82f6;
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }}
                .severity-badge {{
                    display: inline-block;
                    padding: 8px 16px;
                    border-radius: 6px;
                    font-weight: bold;
                    text-transform: uppercase;
                    font-size: 14px;
                    background: {colors['bg']};
                    color: {colors['text']};
                    border: 1px solid {colors['border']};
                }}
                .meta-grid {{
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 15px;
                    margin: 20px 0;
                    padding: 15px;
                    background: #f9fafb;
                    border-radius: 8px;
                }}
                .meta-item {{
                    display: flex;
                    justify-content: space-between;
                }}
                .meta-label {{
                    font-weight: 600;
                    color: #6b7280;
                }}
                .section {{
                    margin: 30px 0;
                }}
                .section-title {{
                    font-size: 20px;
                    font-weight: bold;
                    color: #111827;
                    margin-bottom: 15px;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #e5e7eb;
                }}
                .executive-summary {{
                    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
                    padding: 20px;
                    border-radius: 12px;
                    border-left: 4px solid #3b82f6;
                }}
                .poc-box {{
                    background: #1f2937;
                    color: #e5e7eb;
                    padding: 20px;
                    border-radius: 8px;
                    font-family: 'Courier New', monospace;
                    overflow-x: auto;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                }}
                .impact-box {{
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    padding: 20px;
                    border-radius: 8px;
                    color: #991b1b;
                }}
                .remediation-box {{
                    background: #f0fdf4;
                    border: 1px solid #86efac;
                    padding: 20px;
                    border-radius: 8px;
                    color: #166534;
                }}
                .footer {{
                    margin-top: 50px;
                    padding-top: 20px;
                    border-top: 1px solid #e5e7eb;
                    text-align: center;
                    color: #6b7280;
                    font-size: 12px;
                }}
                @media print {{
                    body {{ padding: 20px; }}
                    .no-print {{ display: none; }}
                }}
            </style>
        </head>
        <body>
            <div class="header">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div>
                        <h1 style="margin: 0 0 10px 0; color: #111827;">{data.name}</h1>
                        <p style="margin: 0; color: #6b7280; font-family: monospace;">{data.target_url}</p>
                    </div>
                    <div class="severity-badge">
                        {data.severity.upper()} | CVSS: {data.cvss_score}
                    </div>
                </div>
                
                <div class="meta-grid">
                    <div class="meta-item">
                        <span class="meta-label">Report ID:</span>
                        <span>#{report_id}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Date:</span>
                        <span>{timestamp.strftime('%B %d, %Y')}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">CWE:</span>
                        <span>{data.cwe_id}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Reporter:</span>
                        <span>{data.reporter_name}</span>
                    </div>
                    {f'<div class="meta-item"><span class="meta-label">OWASP:</span><span>{data.owasp_category}</span></div>' if data.owasp_category else ''}
                </div>
            </div>

            <div class="section">
                <div class="executive-summary">
                    <h2 style="margin-top: 0; color: #1e40af;">Executive Summary</h2>
                    <p>
                        A <strong>{data.severity}</strong> severity vulnerability was identified in <strong>{data.target_url}</strong>. 
                        This issue {'falls under ' + data.owasp_category if data.owasp_category else 'represents a significant security risk'} 
                        with a CVSS v3.1 score of <strong>{data.cvss_score}</strong>.
                        {'Immediate attention is required to prevent ' + data.impact.split(',')[0].lower() if data.severity in ['critical', 'high'] else 'Attention is recommended to address ' + data.impact.split(',')[0].lower()}.
                    </p>
                </div>
            </div>

            <div class="section">
                <h2 class="section-title">Technical Details</h2>
                
                <h3 style="color: #374151; margin-bottom: 10px;">Description</h3>
                <p style="background: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    {data.description}
                </p>

                <h3 style="color: #374151; margin-bottom: 10px;">Proof of Concept</h3>
                <div class="poc-box">{data.poc}</div>
            </div>

            <div class="section">
                <h2 class="section-title">Impact Analysis</h2>
                <div class="impact-box">
                    <strong>Risk Assessment:</strong> {data.impact}
                </div>
            </div>

            <div class="section">
                <h2 class="section-title">Remediation</h2>
                <div class="remediation-box">
                    <strong>Recommended Fix:</strong><br>
                    {data.remediation.replace(chr(10), '<br>')}
                </div>
            </div>

            <div class="section">
                <h2 class="section-title">References</h2>
                <ul style="line-height: 2;">
                    {''.join([f'<li><a href="{ref.strip()}" style="color: #2563eb; text-decoration: none;">{ref.strip()}</a></li>' for ref in data.references.split(',')])}
                </ul>
            </div>

            <div class="footer">
                <p>CONFIDENTIAL - For Authorized Personnel Only</p>
                <p>Generated by PentestAI on {timestamp.strftime('%Y-%m-%d %H:%M:%S')} UTC</p>
            </div>
        </body>
        </html>
        """
        return html

    @staticmethod
    def _generate_markdown(data: VulnerabilityInput, report_id: str, timestamp: datetime) -> str:
        return f"""# Vulnerability Report: {data.name}

**Severity:** {data.severity.upper()} | **CVSS Score:** {data.cvss_score}
**Report ID:** #{report_id} | **Date:** {timestamp.strftime('%Y-%m-%d')}

## Executive Summary

A {data.severity} severity vulnerability was identified in {data.target_url}. 
{'This issue falls under ' + data.owasp_category if data.owasp_category else 'This represents a significant security risk'}.

## Details

- **Target:** {data.target_url}
- **CWE ID:** {data.cwe_id}
- **Reporter:** {data.reporter_name}

## Description

{data.description}

## Proof of Concept