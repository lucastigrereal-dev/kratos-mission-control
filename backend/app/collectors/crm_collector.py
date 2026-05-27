"""CRM pipeline status collector — vendas_crm sector health check.

Wave 12.4 — Vendas_CRM Foundation.
No external API calls. All data is from registry + code inventory.
Source_badge: "doc_only" — vendas_crm has zero implemented skills per FASE 11.
"""

from datetime import date


# ── Lead State Machine Definition ────────────────────────────────────────────────

LEAD_STATE_MACHINE = {
    "version": "1.0",
    "source": "Merged from sdr-hotel.md (9 stages) + omnis-control pipeline.py (7 stages)",
    "stages": [
        {
            "id": "prospect",
            "label": "Prospect",
            "description": "Hotel identified, not yet contacted",
            "order": 0,
            "allowed_transitions": ["first_contact"],
            "bant_required": False,
        },
        {
            "id": "first_contact",
            "label": "First Contact",
            "description": "DM/Email/WhatsApp sent — awaiting response",
            "order": 1,
            "allowed_transitions": ["responded", "no_response"],
            "bant_required": False,
            "followup_cadence": "D+0, D+2, D+5",
        },
        {
            "id": "responded",
            "label": "Responded",
            "description": "Lead replied positively — ready for qualification",
            "order": 2,
            "allowed_transitions": ["qualified", "rejected", "disqualified"],
            "bant_required": False,
        },
        {
            "id": "qualified",
            "label": "Qualified",
            "description": "BANT score >= 70 — lead ready for proposal",
            "order": 3,
            "allowed_transitions": ["proposal", "disqualified"],
            "bant_required": True,
            "bant_threshold": 70,
        },
        {
            "id": "proposal",
            "label": "Proposal",
            "description": "Formal proposal/brief sent (W126) — awaiting negotiation",
            "order": 4,
            "allowed_transitions": ["negotiation", "rejected"],
            "bant_required": False,
        },
        {
            "id": "negotiation",
            "label": "Negotiation",
            "description": "Price/terms discussion in progress",
            "order": 5,
            "allowed_transitions": ["closed_won", "closed_lost"],
            "bant_required": False,
        },
        {
            "id": "closed_won",
            "label": "Closed Won",
            "description": "Contract signed — deal won",
            "order": 6,
            "allowed_transitions": ["delivered"],
            "bant_required": False,
            "is_terminal": False,
        },
        {
            "id": "closed_lost",
            "label": "Closed Lost",
            "description": "Lead declined — revisit in 90 days",
            "order": 6,
            "allowed_transitions": ["prospect"],
            "bant_required": False,
            "is_terminal": True,
            "reengage_days": 90,
        },
        {
            "id": "delivered",
            "label": "Delivered",
            "description": "Content published — contract fulfilled",
            "order": 7,
            "allowed_transitions": ["archived"],
            "bant_required": False,
        },
        {
            "id": "archived",
            "label": "Archived",
            "description": "Historical record — cycle complete",
            "order": 8,
            "allowed_transitions": [],
            "bant_required": False,
            "is_terminal": True,
        },
    ],
    "negative_paths": {
        "no_response": {
            "id": "no_response",
            "label": "No Response",
            "description": "No reply after 7+ days and full followup cadence exhausted",
            "reengage_days": 90,
            "allowed_transitions": ["prospect"],
        },
        "rejected": {
            "id": "rejected",
            "label": "Rejected",
            "description": "Lead explicitly declined — reason tracked",
            "reengage_days": 90,
            "allowed_transitions": ["prospect"],
        },
        "disqualified": {
            "id": "disqualified",
            "label": "Disqualified",
            "description": "BANT score < 20 — not a fit",
            "reengage_days": 90,
            "allowed_transitions": ["prospect"],
        },
    },
}

# ── BANT Qualification Model ─────────────────────────────────────────────────────

BANT_MODEL = {
    "version": "1.0",
    "source": "omnis-control/src/commercial/lead_qualifier.py (W124)",
    "dimensions": {
        "budget": {
            "label": "Budget",
            "max_score": 25,
            "signals": ["hotel_tier", "average_daily_rate_placeholder", "room_count_placeholder"],
            "tiers": {
                "Premium": 18,
                "Growth": 12,
                "Starter": 6,
            },
        },
        "authority": {
            "label": "Authority",
            "max_score": 25,
            "signals": ["decision_maker_name", "decision_maker_role", "contact_channel"],
            "high_authority_roles": ["proprietario", "dono", "ceo", "diretor", "socio"],
        },
        "need": {
            "label": "Need",
            "max_score": 25,
            "signals": ["fit_score", "niche", "interest", "region"],
            "high_need_niches": ["resort", "pousada", "boutique", "eco_resort", "fazenda"],
        },
        "timing": {
            "label": "Timing",
            "max_score": 25,
            "signals": ["priority_tier", "source", "tags"],
            "tiers": {"hot": 18, "warm": 12, "cold": 5},
        },
    },
    "qualification_tiers": {
        "qualified": {"threshold": 70, "label": "Pronto para proposta"},
        "nurture": {"threshold": 45, "label": "Nutrir com conteudo antes de propor"},
        "low_fit": {"threshold": 20, "label": "Manter em lista fria"},
        "disqualified": {"threshold": 0, "label": "Fora do perfil"},
        "missing_information": {"threshold": -1, "label": "Dados insuficientes para qualificar"},
    },
}

# ── Lead Sources ──────────────────────────────────────────────────────────────────

LEAD_SOURCES = [
    {
        "id": "instagram_dm",
        "label": "Instagram DM",
        "type": "primary_inbound",
        "automation_level": "manual",
        "template_available": True,
        "template_location": ".claude/skills/sdr-hotel.md",
    },
    {
        "id": "whatsapp",
        "label": "WhatsApp",
        "type": "primary_communication",
        "automation_level": "manual",
        "template_available": True,
        "template_location": "omnis-control/src/commercial/outreach_sequence.py",
    },
    {
        "id": "email",
        "label": "Email",
        "type": "cold_outreach",
        "automation_level": "template_only",
        "template_available": True,
        "template_location": ".claude/skills/sdr-hotel.md + outreach_sequence.py",
    },
    {
        "id": "indicacao",
        "label": "Indicacao (Referral)",
        "type": "warm_inbound",
        "automation_level": "none",
        "template_available": False,
    },
    {
        "id": "prospeccao",
        "label": "Prospeccao Ativa",
        "type": "cold_outreach",
        "automation_level": "manual_sdr",
        "template_available": True,
        "template_location": ".claude/skills/sdr-hotel.md",
        "active_campaign": "150 influenciadores Interior SP",
    },
    {
        "id": "evento",
        "label": "Eventos",
        "type": "in_person",
        "automation_level": "none",
        "template_available": False,
    },
    {
        "id": "site",
        "label": "Site / Landing Page",
        "type": "inbound",
        "automation_level": "none",
        "template_available": False,
    },
]

# ── Objection Metadata ────────────────────────────────────────────────────────────

OBJECTIONS = {
    "categories": {
        "preco": {
            "label": "Preco / Orcamento",
            "standard_responses": [
                "CPM R$0,15 vs R$15-25 Meta Ads = 98% economia",
                "Pacote Starter R$350 para teste sem risco",
                "ROI: 1 venda adicional cobre o investimento",
            ],
        },
        "timing": {
            "label": "Timing / Momento",
            "standard_responses": [
                "Agendamento flexivel — podemos planejar com antecedencia",
                "Conteudo permanente no feed, nao some em 24h como stories",
            ],
        },
        "concorrencia": {
            "label": "Concorrencia / Ja fazem",
            "standard_responses": [
                "Nosso CPM e 98% menor que anuncios tradicionais",
                "Audiencia segmentada por nicho — nao e alcance generico",
            ],
        },
        "necessidade": {
            "label": "Nao ve necessidade",
            "standard_responses": [
                "Cases de hoteis que aumentaram ocupacao em 30% apos collab",
                "Conteudo organico rankeia no Google por anos",
            ],
        },
        "autoridade": {
            "label": "Precisa falar com outra pessoa",
            "standard_responses": [
                "Posso enviar material completo para apresentacao interna",
                "Agendamos call com o decisor quando conveniente",
            ],
        },
    }
}

# ── Package Tiers ─────────────────────────────────────────────────────────────────

PACKAGE_TIERS = {
    "Starter": {
        "price": 350,
        "currency": "BRL",
        "description": "1 collab, 1 perfil — para teste",
        "ideal_for": "Primeiro contato, validacao",
    },
    "Growth": {
        "price": 990,
        "currency": "BRL",
        "billing": "monthly",
        "description": "3 collabs, 3 paginas + SEOgram — LIDERAR COM ESTE",
        "ideal_for": "Clientes regulares, parceria continua",
    },
    "Premium": {
        "price": 1200,
        "currency": "BRL",
        "billing": "monthly",
        "description": "4 collabs + 3 stories, 3+ perfis",
        "ideal_for": "Hoteis premium, alta temporada",
    },
}


# ── Collector ─────────────────────────────────────────────────────────────────────

def collect_status():
    """Collect CRM pipeline status — vendas_crm sector health check.

    Returns (data, source, collector_status).
    source_badge: "doc_only" — vendas_crm has zero implemented skills.
    """
    today = date.today().isoformat()

    # Sector status from registry
    sector_status = {
        "id": "vendas_crm",
        "name": "Vendas & CRM",
        "priority": "P1",
        "implemented_skills": 0,
        "planned_skills": ["crm-manager", "revenue-tracker"],
        "implementation_status": "doc_only",
        "assessment": "Critical monetization gap — zero CRM infrastructure",
    }

    # Code inventory summary
    code_inventory = {
        "publisher_os": {
            "sdr_qualifier": "qualifier_v2.py — standalone PydanticAI HotelLead qualifier",
            "status": "code_exists_not_integrated",
        },
        "omnis_control_sales": {
            "description": "Full sales/CRM module with tests (Group 12)",
            "modules": ["leads.py", "pipeline.py", "deals.py", "followups.py", "timeline.py", "proposals.py", "commissions.py", "dashboard.py", "export.py"],
            "pipeline_stages": 7,
            "status": "all_dry_run",
            "file_backed": True,
            "storage": "JSONL files",
        },
        "omnis_control_commercial": {
            "description": "Commercial SDR layer (Group 13)",
            "modules": ["hotel_lead.py", "prospect_list.py", "outreach_sequence.py", "lead_qualifier.py", "package_matcher.py", "proposal_brief.py", "pipeline_sync.py", "sdr_metrics.py", "followup_schedule.py"],
            "status": "all_dry_run",
            "file_backed": True,
            "bant_model": "Budget, Authority, Need, Timing (0-25 each)",
            "outreach_cadence": "D+0, D+2, D+5 across 5 channels",
        },
        "claude_skills": {
            "sdr_hotel": "sdr-hotel.md — DM/email/followup templates",
            "hotel_pitch_generator": "hotel-pitch-generator.md",
            "instagram_roi_calculator": "instagram-roi-calculator.md",
        },
        "daily_prophet_hotels": {
            "crm_tables": 0,
            "crm_data_in": "hotels.status + collabs table",
            "dedicated_pipeline": False,
        },
        "supabase_crm_tables": 0,
    }

    # Known gaps
    gaps = [
        {
            "id": "GAP_NO_CRM_TABLES",
            "description": "No dedicated CRM tables in any database",
            "severity": "CRITICAL",
            "resolution": "Create leads, pipeline_stages, deals, activities, objections tables in Supabase",
        },
        {
            "id": "GAP_NO_OUTREACH_AUTOMATION",
            "description": "Outreach sequences generated but never sent (dry_run=True)",
            "severity": "HIGH",
            "resolution": "Connect outreach_sequence.py to n8n + Instagram/WhatsApp APIs",
        },
        {
            "id": "GAP_NO_PIPELINE_INTEGRATION",
            "description": "qualifier_v2.py output not connected to pipeline stage",
            "severity": "HIGH",
            "resolution": "Connect qualifier to pipeline_sync bridge",
        },
        {
            "id": "GAP_NO_REVENUE_ATTRIBUTION",
            "description": "No link between leads and closed revenue",
            "severity": "HIGH",
            "resolution": "Link collabs table to leads + implement revenue-tracker skill",
        },
        {
            "id": "GAP_NO_FOLLOWUP_AUTOMATION",
            "description": "Followup cadence exists in code but no scheduler/trigger",
            "severity": "MEDIUM",
            "resolution": "Build n8n workflow for scheduled followups",
        },
        {
            "id": "GAP_NO_METRICS",
            "description": "Zero CRM KPIs being tracked",
            "severity": "MEDIUM",
            "resolution": "Implement sdr_metrics.py pipeline + dashboard",
        },
        {
            "id": "GAP_ZERO_SKILLS",
            "description": "vendas_crm sector has zero implemented skills",
            "severity": "HIGH",
            "resolution": "Build crm-manager and revenue-tracker skills (planned but not executed)",
        },
    ]

    # Next steps
    next_steps = [
        {
            "priority": "P0",
            "description": "Create Supabase CRM tables (leads, pipeline_stages, deals, activities, objections)",
            "wave": "12.5 or later",
        },
        {
            "priority": "P0",
            "description": "Wire KRATOS /crm/status to read real pipeline data from Supabase",
            "wave": "12.5 or later",
        },
        {
            "priority": "P1",
            "description": "Connect qualifier_v2.py output to pipeline_sync bridge",
            "wave": "12.6",
        },
        {
            "priority": "P1",
            "description": "Build followup automation (D+0, D+2, D+5 cadence triggered by n8n)",
            "wave": "12.6",
        },
        {
            "priority": "P2",
            "description": "Implement revenue-tracker skill",
            "wave": "13.0",
        },
        {
            "priority": "P2",
            "description": "Connect outreach templates to real channels via n8n",
            "wave": "13.0",
        },
    ]

    data = {
        "status": "doc_only",
        "date": today,
        "wave": "12.4",
        "collector": "crm_collector",
        "source_badge": "doc_only",
        "sector": sector_status,
        "lead_state_machine": LEAD_STATE_MACHINE,
        "bant_model": BANT_MODEL,
        "lead_sources": {
            "total": len(LEAD_SOURCES),
            "automated": 0,
            "sources": LEAD_SOURCES,
        },
        "pipeline_health": {
            "total_leads_tracked": 0,
            "total_deals": 0,
            "stages_with_counts": {},
            "estimated_active_manual": "~5-10 (Lucas mental tracking)",
            "known_prospect_list": "150 influenciadores Interior SP (manual pipeline)",
        },
        "package_tiers": PACKAGE_TIERS,
        "objection_model": OBJECTIONS,
        "code_inventory": code_inventory,
        "gaps": gaps,
        "next_steps": next_steps,
    }

    return data, "real", "ok"
