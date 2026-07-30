# 09 — Definition of done

A **story** is Done only when all applicable boxes are checked.

## Product story DoD

- [ ] Meets acceptance written in the story / SoT  
- [ ] No secrets in code, logs, or screenshots  
- [ ] API validation rejects malicious/invalid input where relevant  
- [ ] UI doesn’t crash on empty / error states  
- [ ] Activity event logged for meaningful user actions (when applicable)  
- [ ] Sean (PO) manually accepted in the running app  
- [ ] Related `docs/pm` change log entry if scope shifted  

## Bugfix DoD

- [ ] Repro steps recorded  
- [ ] Fix verified once manually  
- [ ] Regression covered by Playwright or API check when cheap  

## Sprint DoD

- [ ] Sprint goal met or explicitly descope’d in change log  
- [ ] Status report updated  
- [ ] RAID reviewed  
- [ ] At least one portfolio-export artifact added or explicitly N/A  

## Release DoD (tag / “ship”)

- [ ] `npx playwright test` green against running stack  
- [ ] Export/import smoke OK  
- [ ] Homelab backup note current (`docs/homelab.md`)
