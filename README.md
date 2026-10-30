# HelpiTech Portal — Clientes, Métricas e Oportunidades (homologação)

Arquivo único `index.html` (HTML + CSS + JS, sem build/backend), Material Design 3 + Noto Sans, com:

- **Gestão de clientes e contratos** (CRUD, catálogo de serviços, histórico, alertas 30/15/7 dias, perfis simulados).
- **Importação por JSON** (motor de validação/upsert idempotente por `external_id`; sem tela dedicada nesta versão).
- **Métricas de uso** (por cliente/serviço, semanal/quinzenal/mensal/personalizado, comparativo, franquia, alertas de churn e excesso).
- **Agente de oportunidades** (gap de contrato + sinais em e-mails → score alta/média/baixa, evidência, próxima ação, rascunho, status, relatório semanal, exportação JSON).
- **Chat local** por regras (sem inventar; informa quando não encontra), com ponto de extensão para LLM.
- LGPD: dados só no navegador, máscara de PII, e-mail reduzido a resumo + referência, log de auditoria.

Abra `index.html` (ou a página do GitHub Pages): na primeira visita os **dados fictícios (mock)** são carregados automaticamente a partir dos dados de origem em [`dados-mock/`](dados-mock). A tela de importação manual foi removida; o motor de importação (upsert por `external_id`, validação por schema) segue no código para a carga dos dados.

## Catálogo e mapeamento dos dados
Catálogo: Suporte, Backup, Desenvolvimento, NOC, SOC, Projetos, Manutenção e Sustentação, Consultoria de Segurança e LGPD, Migração para Nuvem e Gestão de Licenças (preços fictícios).
O `type` dos contratos de origem (Mensal, Anual, Bolsa de Horas…) é só o tipo de cobrança e **não** é serviço; o serviço é inferido da descrição (`desenvolvimento` → Desenvolvimento, `manutenção` → Manutenção, `projeto` → Projetos, demais → Suporte).
Outros campos: `store.id → customer_id`, `amount_hours → hours` (franquia), `value "4.000,00" → 4000`, `disabled_at ≠ null → cancelado`, `is_active → ativo/inativo`.

## Estrutura de dados
Schemas em [`schemas/`](schemas), exemplos em [`exemplos/`](exemplos): `customers`, `services`, `contracts`, `usage_events`, `emails`. Saída do agente: `opportunity-output-v1` (exportar em **Oportunidades**; exemplo em **Documentação**).

## Sinais, serviços e pontuação
Dicionário `sinal → serviço` editável em **Configurações** (padrão em `DEFAULT_DICT`). Score 0–100 = evidência (30) + urgência (25) + aderência (25) + receita estimada (20); **Alta ≥ 70, Média ≥ 45, Baixa < 45**. Detalhes em **Documentação → Sinais e pontuação**.

Guardrails: sem evidência não há oportunidade; e-mails internos/automáticos ignorados; descartadas/perdidas só reaparecem com nova evidência; nada é enviado/alterado automaticamente; perfil CS vê só seus clientes (`cs_owner`).

## Código
Módulos no próprio arquivo: `U` (utilitários), `SCHEMAS`/`V` (validação), `N` (normalizadores), `Signals`, `M` (métricas), `Opp` (análise/score) — funções puras —, `DB`/`Importer` (dados), `Acc` (perfis/máscara), `Pages` (UI), `Chat`. Autotestes: **Configurações → Executar autotestes** ou `index.html?selftest`.

## Suposições (confirmar)
- Catálogo e preços de exemplo fictícios; substitua pelo catálogo real.
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
