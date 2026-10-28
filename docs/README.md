# HMS Documentation

Design and reference documents for the HMS diabetes glycemic control platform. Start with the [root README](../README.md) for the overview.

> **Status:** the files below exist as empty placeholders. They will be written as each phase is built, so documentation stays in step with the code.

| Document | Purpose | Written in |
|---|---|---|
| [architecture.md](architecture.md) | System components, data flow, deployment topology | Phase 1 |
| [multi-tenancy.md](multi-tenancy.md) | Tenant model, row-level security, onboarding a new hospital | Phase 1 |
| [data-model.md](data-model.md) | Entities, relationships and ER diagram | Phase 1 to 2 |
| [api.md](api.md) | REST and WebSocket reference (alongside Swagger) | Ongoing |
| [risk-rules.md](risk-rules.md) | Triage tiers, thresholds, clinical sign-off record | Phase 3 |
| [telemedicine.md](telemedicine.md) | Signalling flow, TURN setup, audio-only fallback | Phase 4 |
| [security-privacy.md](security-privacy.md) | Threat model, Kenya Data Protection Act mapping, retention, consent | Phase 1 and 6 |
| [ui-design-system.md](ui-design-system.md) | Tokens, components, patterns, accessibility checklist | Phase 1 |
| [deployment.md](deployment.md) | Environments, CI/CD, hosting, backups, monitoring | Phase 6 |
| [testing.md](testing.md) | Test strategy, tenant-isolation tests, usability testing plan | Phase 2 to 6 |

## Writing guidelines

- Keep documents short and current. Update them in the same pull request as the code change
- Use diagrams where they clarify a flow
- Clinical content (risk rules, thresholds) must record who approved it and when
