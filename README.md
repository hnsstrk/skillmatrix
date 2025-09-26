# Agile Skill Matrix Web App

Die Agile Skill Matrix Web App ist ein leichtgewichtiges Tool, mit dem Teams Fähigkeiten und Kompetenzen transparent erfassen, bewerten und für die Ausbildungsplanung nutzen. Der Fokus liegt auf der Frage: Welche Aufgaben kann das Team heute sicher übernehmen, und welche Trainings sind sinnvoll, um den Auftrag morgen besser zu erfüllen?

## Beispiele für abbildbare Kompetenzen

Technik und Qualität:
- Programmierkenntnisse (z. B. Java, Python, TypeScript)
- Testautomatisierung (Unit-Tests, Integrationstests, End-to-End-Tests)
- Clean Code und Architekturgrundlagen
- Versionskontrolle mit Git
- Secure Coding (OWASP Top 10, Umgang mit Secrets)

DevOps und Infrastruktur:
- CI/CD-Pipelines aufbauen und pflegen
- Containerisierung (Docker, Kubernetes)
- Infrastruktur als Code (Terraform, Ansible)
- Monitoring und Observability
- Cloud-Plattformen (AWS, Azure, GCP)

Agile Praxis:
- User Story Writing und Akzeptanzkriterien
- Schätzung und Aufwandseinschätzung
- Backlog-Pflege und Refinement
- Moderation von Meetings
- Definition of Done anwenden

Zusammenarbeit:
- Code-Reviews durchführen und Feedback geben
- Pair Programming oder Mob Programming
- Dokumentation und Wissensweitergabe
- Kommunikation im Team und mit Stakeholdern
- Konfliktlösung und Moderation

Spezielle Themen:
- Einsatz von KI-Tools in der Entwicklung (z. B. Code Copilot)
- Datenschutz und Compliance-Anforderungen
- Domain-Driven Design
- Sicherheitstests (SAST, DAST)
- Performance-Optimierung


## Zielsetzung
- Transparenz: Welche Kompetenzen sind im Team vorhanden, wo gibt es Lücken?
- Einsatzfähigkeit: Einschätzung, welche Arbeiten das Team aktuell übernehmen kann.
- Ausbildungsplanung: Lehrgänge und Trainings zielgerichtet planen und nachhalten.
- Entwicklungspfad: Fortschritt pro Kompetenz sichtbar machen (0 bis 5 Sterne).

## Kernfunktionen
- CRUD für Team, Entwickler, Kompetenz/Fähigkeit.
- Bewertung pro Entwickler x Kompetenz mit 0 bis 5 Sternen.
- Team-Heatmap und Skill-Gap-Analyse zur Ableitung von Trainings.
- Trainingsbedarfe aus Skill-Gaps ableiten und als Maßnahmenliste erfassen.
- Export von Übersichten (CSV/JSON) für Berichte.

## Einsatzszenarien
- Lehrgangsplanung: Aggregierte Skill-Gaps je Team generieren und passenden Kurskatalog zuordnen.
- Ausbildungssteuerung: Maßnahmen pro Quartal planen, Status fortschreiben.
- Auftragsprüfung: Gegenüber einem Aufgabenprofil prüfen, ob die Team-Skill-Abdeckung ausreicht.
- Staffing: Entwickler nach nachgewiesenen Kompetenzen auf Aufgaben zuordnen.

## Domänenmodell
- Team: organisatorische Einheit, besitzt Entwickler und eine Ziel-Skill-Abdeckung.
- Entwickler: Person mit Bewertungen je Kompetenz.
- Kompetenz (Skill): definierte Fähigkeit mit Beschreibung und optionalen Nachweisen.
- Bewertung: Relation Entwickler x Kompetenz mit Sternen 0-5 und Evidenzen.
- Maßnahme: Training oder Lehrgang, der auf eine Kompetenz wirkt.

Beziehungen:
- Team 1..n Entwickler
- Kompetenz n..n Entwickler (über Bewertung)
- Kompetenz 1..n Maßnahme (z. B. mehrere Lehrgänge decken eine Kompetenz ab)

## Proficiency Level (0 bis 5 Sterne)
- 0: keine Erfahrung
- 1: Grundlagen, arbeitet mit Anleitung
- 2: Basisfähigkeit, in Standardsituationen selbständig
- 3: fortgeschritten, antizipiert Fehler, teilt Wissen
- 4: Experte, setzt Standards, coacht
- 5: Vordenker, etabliert Vorgehen team- oder organisationsweit

Hinweis: Sterne werden numerisch als Integer 0-5 gespeichert. Die Darstellung kann als Symbole oder Zahl erfolgen.

## Datenmodell (PostgreSQL)
Tables:
- teams(id, name, description, created_at, updated_at)
- developers(id, team_id, name, email, created_at, updated_at)
- skills(id, key, name, description, category, created_at, updated_at)
- ratings(id, developer_id, skill_id, stars, evidence, rated_at)
- measures(id, skill_id, title, type, provider, url, effort_hours, status, created_at, updated_at)
- assignments(id, team_id, task_name, required_skill_id, min_stars, status)

Indizes:
- ratings unique(developer_id, skill_id)
- developers idx(team_id)
- measures idx(skill_id)

Kategorien (optional):
- Technik/Qualität, Agile Praxis, Produkt/Domäne, Zusammenarbeit, Sicherheit, DevOps, AI

## API Entwürfe (CRUD)
Teams:
- GET /api/teams
- POST /api/teams
- GET /api/teams/{id}
- PUT /api/teams/{id}
- DELETE /api/teams/{id}

Entwickler:
- GET /api/developers?team_id={id}
- POST /api/developers
- GET /api/developers/{id}
- PUT /api/developers/{id}
- DELETE /api/developers/{id}

Kompetenzen:
- GET /api/skills?category=...
- POST /api/skills
- GET /api/skills/{id}
- PUT /api/skills/{id}
- DELETE /api/skills/{id}

Bewertungen:
- GET /api/ratings?developer_id=...&skill_id=...
- POST /api/ratings   { developer_id, skill_id, stars, evidence }
- PUT /api/ratings/{id}
- DELETE /api/ratings/{id}

Maßnahmen (Trainings):
- GET /api/measures?skill_id=...&status=...
- POST /api/measures
- PUT /api/measures/{id}
- DELETE /api/measures/{id}

Assignments (Auftragsprüfung, optional):
- POST /api/assignments  { team_id, task_name, required_skill_id, min_stars }
- GET /api/assignments/{id}
- DELETE /api/assignments/{id}

## Beispielobjekte
Skill:
~~~json
{
  "id": 10,
  "key": "secure_coding",
  "name": "Secure Coding",
  "description": "Umgang mit Schwachstellen, Threat Modeling, Secrets",
  "category": "Sicherheit"
}
~~~

Rating:
~~~json
{
  "developer_id": 7,
  "skill_id": 10,
  "stars": 3,
  "evidence": "Fix OWASP A1 Finding, PR 124, Threat Model Epic-42",
  "rated_at": "2025-09-26"
}
~~~

Maßnahme:
~~~json
{
  "skill_id": 10,
  "title": "Secure Coding Grundkurs",
  "type": "Lehrgang",
  "provider": "Intern",
  "url": "https://example.local/kurse/secure-coding",
  "effort_hours": 8,
  "status": "geplant"
}
~~~

## Frontend Funktionsumfang
- Übersicht Team: Heatmap Entwickler x Kompetenz, Filter nach Kategorie.
- Entwicklerprofil: Bewertungen, Evidenzen, vorgeschlagene Maßnahmen.
- Kompetenzkatalog: Beschreibungen, verknüpfte Lehrgänge, Mindestlevel für Aufgaben.
- Lehrgangsplanung: Skill-Gaps erkennen, Maßnahmenliste erzeugen, Status nachhalten.
- Aufgabencheck: Gegen Profil prüfen, ob Mindest-Sterne erfüllt sind.

## Berechtigungen (einfacher Vorschlag)
- Admin: Vollzugriff auf CRUD aller Entitäten.
- Lead: CRUD für Team, Entwickler des eigenen Teams, Bewertungen schreiben.
- Member: Read, eigene Selbstbewertung vorschlagen (Pending), Evidenzen hinzufügen.

## Technischer Stack
- Frontend: React und Tailwind.
- Backend: Node.js mit Express.
- Datenbank: PostgreSQL.
- Deployment: Docker Compose.
