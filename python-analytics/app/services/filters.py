from datetime import datetime
from typing import List, Dict

def filter_by_date(records: List[Dict], target_date: str) -> List[Dict]:
    """
    Filters location records to a specific date.

    Parameters:
        records: List of location records with 'timestamp'
        target_date: Date string in 'YYYY-MM-DD' format

    Returns:
        List of records from the specified date
    """
    try:
        target = datetime.strptime(target_date, "%Y-%m-%d").date()
    except ValueError:
        raise ValueError("Date must be in YYYY-MM-DD format")

    return [rec for rec in records if rec["timestamp"].date() == target]
