<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/RedK1t/RedKit/main/docs/assets/logo-light.svg">
    <img src="https://raw.githubusercontent.com/RedK1t/RedKit/main/docs/assets/logo-dark.svg" alt="RedKit" width="96">
  </picture>
</p>

<h1 align="center">RedKit AI-Report</h1>

<p align="center">Pentest report generator with CVSS scoring, OWASP Top 10 mapping and PDF export.<br>
Part of <a href="https://github.com/RedK1t/RedKit"><b>RedKit</b></a>, a modular, web-based penetration-testing framework.</p>

---

## API (`:3002`)

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/generate-report` | Build a report from vulnerability findings |
| `POST` | `/api/calculate-cvss` | Compute a CVSS score from metrics |
| `POST` | `/api/export-pdf` | Export a report as PDF |
| `GET` | `/api/owasp-top10` | OWASP Top 10 reference data |

Interactive docs: `http://localhost:3002/docs`.

## Run

```bash
cp template.env .env
docker build -t redkit-ai-report . && docker run -p 3002:3002 redkit-ai-report
```

Or locally (Python 3.10):

```bash
pip install -r requirements.txt
uvicorn app.main:app --port 3002
```

Arabic run notes: [RUN.md](RUN.md).

## License

[MIT](LICENSE). For authorized security testing and education only. Only scan systems you own or have written permission to test.
