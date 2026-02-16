import math
from typing import Dict

class CVSSCalculator:
    WEIGHTS = {
        'AV': {'N': 0.85, 'A': 0.62, 'L': 0.55, 'P': 0.2},
        'AC': {'L': 0.77, 'H': 0.44},
        'PR': {'N': 0.85, 'L': 0.62, 'H': 0.27},
        'UI': {'N': 0.85, 'R': 0.62},
        'S': {'U': 1.0, 'C': 1.0},
        'C': {'H': 0.56, 'L': 0.22, 'N': 0.0},
        'I': {'H': 0.56, 'L': 0.22, 'N': 0.0},
        'A': {'H': 0.56, 'L': 0.22, 'N': 0.0}
    }

    @staticmethod
    def calculate_base_score(metrics: Dict[str, str]) -> float:
        """Calculate CVSS v3.1 Base Score"""
        av = CVSSCalculator.WEIGHTS['AV'][metrics.get('AV', 'N')]
        ac = CVSSCalculator.WEIGHTS['AC'][metrics.get('AC', 'L')]
        pr = CVSSCalculator.WEIGHTS['PR'][metrics.get('PR', 'N')]
        ui = CVSSCalculator.WEIGHTS['UI'][metrics.get('UI', 'N')]
        s = CVSSCalculator.WEIGHTS['S'][metrics.get('S', 'U')]
        c = CVSSCalculator.WEIGHTS['C'][metrics.get('C', 'H')]
        i = CVSSCalculator.WEIGHTS['I'][metrics.get('I', 'H')]
        a = CVSSCalculator.WEIGHTS['A'][metrics.get('A', 'H')]

        # Impact Sub-Score
        iss = 1 - ((1 - c) * (1 - i) * (1 - a))
        
        # Impact
        if s == 1.0:  # Scope Changed
            impact = 7.52 * (iss - 0.029) - 3.25 * pow(iss - 0.02, 15)
        else:  # Scope Unchanged
            impact = 6.42 * iss

        # Exploitability
        exploitability = 8.22 * av * ac * pr * ui

        # Base Score
        if impact <= 0:
            base_score = 0.0
        else:
            if s == 1.0:
                base_score = min(1.08 * (impact + exploitability), 10)
            else:
                base_score = min(impact + exploitability, 10)

        return round(base_score, 1)

    @staticmethod
    def get_severity_from_score(score: float) -> str:
        if score >= 9.0:
            return "critical"
        elif score >= 7.0:
            return "high"
        elif score >= 4.0:
            return "medium"
        elif score > 0:
            return "low"
        return "info"