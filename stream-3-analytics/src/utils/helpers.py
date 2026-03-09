"""Utility helpers for analytics prototypes."""
from datetime import datetime
from typing import List


def parse_iso(dt_str: str) -> datetime:
    return datetime.fromisoformat(dt_str)


def mean(values: List[float]) -> float:
    return sum(values) / len(values) if values else 0.0
