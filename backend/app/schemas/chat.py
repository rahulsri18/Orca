from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class AgentFinding(BaseModel):
    agent_name: str
    role: str
    status: str
    findings: str
    evidence_sources: List[str]

class AiQueryRequest(BaseModel):
    query: str
    user_location: Optional[str] = "Kochi, Kerala"
    coordinates: Optional[List[float]] = [9.93, 76.26]
    session_id: Optional[str] = None
    language: Optional[str] = "en"

class AiQueryResponse(BaseModel):
    query: str
    system_time_ist: str
    synthesized_answer: str
    risk_level: str
    actionable_directive: str
    agent_findings: List[AgentFinding]
    evidence_sources: List[str]
    disclaimer: str
