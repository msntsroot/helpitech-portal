# HelpiTech Portal — Clientes, Métricas e Oportunidades (homologação)

Arquivo único `index.html` (HTML + CSS + JS, sem build/backend), Material Design 3 + Noto Sans, com:

- **Gestão de clientes e contratos** (CRUD, catálogo de serviços, histórico, alertas 30/15/7 dias, perfis simulados).
- **Importação manual por JSON** (dry-run, relatório por registro, upsert idempotente por `external_id`, histórico e reversão).
- **Métricas de uso** (por cliente/serviço, semanal/quinzenal/mensal/personalizado, comparativo, franquia, alertas de churn e excesso).
- **Agente de oportunidades** (gap de contrato + sinais em e-mails → score alta/média/baixa, evidência, próxima ação, rascunho, status, relatório semanal, exportação JSON).
- **Chat local** por regras (sem inventar; informa quando não encontra), com ponto de extensão para LLM.
- LGPD: dados só no navegador, máscara de PII, e-mail reduzido a resumo + referência, log de auditoria.

Abra `index.html` (ou a página do GitHub Pages) e use **Importar JSON → Carregar dados de exemplo**.

## Como importar
1. **Importar JSON**: cole ou envie o arquivo. Aceita o **formato atual** (`clientes`: `{"customers":{id:{...}}}`, `contratos`: `{"contracts":[{store,type,...}]}`, `{"contract_types":[...]}`) e o **formato canônico** (`schemas/`).
2. **Validar (dry-run)** → relatório por registro (novo/atualizado/inalterado/erro).
3. **Importar** → upsert por `external_id`; reimportar não duplica. **Reverter** no histórico.

Ordem: serviços → clientes → contratos → consumo (`usage_events`) → `emails`.
Mapeamento do formato atual: `store.id → customer_id`, `type.id → service_id`, `amount_hours → hours` (franquia), `value "4.000,00" → 4000`, `disabled_at ≠ null → cancelado`, `is_active → ativo/inativo` (inadimplente via `status`).

## Estrutura de dados
Schemas em [`schemas/`](schemas), exemplos em [`exemplos/`](exemplos): `customers`, `services`, `contracts`, `usage_events`, `emails`. Saída do agente: `opportunity-output-v1` (exportar em **Oportunidades**; exemplo em **Documentação**).

## Sinais, serviços e pontuação
Dicionário `sinal → serviço` editável em **Configurações** (padrão em `DEFAULT_DICT`). Score 0–100 = evidência (30) + urgência (25) + aderência (25) + receita estimada (20); **Alta ≥ 70, Média ≥ 45, Baixa < 45**. Detalhes em **Documentação → Sinais e pontuação**.

Guardrails: sem evidência não há oportunidade; e-mails internos/automáticos ignorados; descartadas/perdidas só reaparecem com nova evidência; nada é enviado/alterado automaticamente; perfil CS vê só seus clientes (`cs_owner`).

## Código
Módulos no próprio arquivo: `U` (utilitários), `SCHEMAS`/`V` (validação), `N` (normalizadores), `Signals`, `M` (métricas), `Opp` (análise/score) — funções puras —, `DB`/`Importer` (dados), `Acc` (perfis/máscara), `Pages` (UI), `Chat`. Autotestes: **Configurações → Executar autotestes** ou `index.html?selftest`.

## Suposições (confirmar)
- Catálogo = tipos de contrato (1–4) + serviços **fictícios 5–8** e preços de exemplo; substitua pelo catálogo real.
- Consumo = **horas** (`usage_events`); os dados de consumo e e-mails de exemplo são sintéticos.
- `cs_owner`, `segment`, `size` não existem no formato atual; devem ser informados na importação.
- Franquia de horas por vigência do contrato.

## Limitações
localStorage (~5 MB, milhares de registros), perfis simulados (não é segurança), análise por palavras-chave, sem API/e-mail real.

## Plano de evolução
1. **Backend + API REST** (PostgreSQL): `/customers /contracts /services /usage-events /emails /opportunities`; os módulos puros migram sem mudança.
2. **Webhooks/sync** com o helpdesk (chamados e horas) no lugar da importação manual.
3. **Autenticação real** (OIDC/SSO), RBAC no servidor, auditoria imutável.
4. **Conectores de e-mail** (Microsoft Graph/Gmail, OAuth) com minimização e retenção.
5. **LLM** em `Chat.providers.llm` e extrator de sinais com saída JSON validada pelos schemas, citando evidências, sempre com human-in-the-loop.
