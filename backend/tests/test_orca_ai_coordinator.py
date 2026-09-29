import pytest
from backend.app.services.orca_ai_coordinator import OrcaAiCoordinator

@pytest.mark.asyncio
async def test_orca_ai_multi_agent_findings():
    """Verify all 7 specialized agents execute and contribute findings."""
    query = "Is it safe to fish near Kochi tomorrow?"
    res = await OrcaAiCoordinator.process_query(
        query=query,
        user_location="Kochi, Kerala",
        coordinates=[9.93, 76.26]
    )

    assert "synthesized_answer" in res
    assert "agent_findings" in res
    assert len(res["agent_findings"]) == 7

    agent_names = [f["agent_name"] for f in res["agent_findings"]]
    expected_agents = [
        "Planner Agent",
        "Weather Agent",
        "Ocean Agent",
        "PFZ Agent",
        "GIS Agent",
        "Risk Agent",
        "Decision Agent"
    ]
    for expected in expected_agents:
        assert expected in agent_names

    # Verify each agent has findings and evidence sources
    for finding in res["agent_findings"]:
        assert len(finding["findings"]) > 10
        assert len(finding["evidence_sources"]) >= 1

    # Verify evidence sources and safety disclaimer
    assert len(res["evidence_sources"]) >= 3
    assert "disclaimer" in res
    assert "Channel 16" in res["disclaimer"]
    assert "Never guarantee 100% safety" not in res["disclaimer"] # Disclaimer should be realistic
