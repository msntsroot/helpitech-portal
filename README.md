# HelpiTech Portal — Clientes, Métricas e Oportunidades (homologação)

Arquivo único `index.html` (HTML + CSS + JS, sem build/backend), Material Design 3 + Noto Sans, com:

- **Gestão de clientes e contratos** (CRUD, catálogo de serviços, histórico, alertas 30/15/7 dias, perfis simulados).
- **Importação por JSON** (motor de validação/upsert idempotente por `external_id`; sem tela dedicada nesta versão).
- **Métricas de uso** (por cliente/serviço, semanal/quinzenal/mensal/personalizado, comparativo, franquia, alertas de churn e excesso).
- **Agente de oportunidades** (gap de contrato + sinais em e-mails → score alta/média/baixa, evidência, próxima ação, rascunho, status, relatório semanal, exportação JSON).
- **Chat de consulta**: com **IA via Microsoft Foundry** (Azure OpenAI chat completions, conversa com histórico e **tools** para consultar clientes, gerar relatórios de contratos e comparar/ranquear clientes com métricas) ou, sem configuração, chat local por regras (sem inventar; informa quando não encontra).
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

## Chat com IA (Microsoft Foundry)
Em **Configurações → IA — Microsoft Foundry**: informe o endpoint do recurso (`https://<recurso>.openai.azure.com` ou `https://<recurso>.services.ai.azure.com`; uma URL completa terminando em `/chat/completions` também é aceita), o nome do deployment do modelo, a API key e a API version (padrão `2024-10-21`). Use **Testar conexão**, marque **Usar IA no Chat de consulta** e salve.
A chamada é feita direto do navegador para `{endpoint}/openai/deployments/{deployment}/chat/completions` com o header `api-key`. A configuração fica numa chave própria do localStorage (`helpitech.ai.v1`), fora de backups e exportações. Com a IA ativa, as perguntas e o histórico da conversa são enviados ao endpoint. **Homologação apenas**: em produção a chave não deve ficar no navegador; use um backend/proxy com Entra ID.

**Sem API key (Entra ID, ex.: papel "Foundry Owner" só no projeto)**: use o proxy local [`server/foundry-proxy.js`](server/foundry-proxy.js) (Node 18+, sem dependências), que obtém/renova o token via Azure CLI e chama `{projeto}/openai/v1/chat/completions`:
```bash
az login
FOUNDRY_PROJECT_ENDPOINT="https://<recurso>.services.ai.azure.com/api/projects/<projeto>" node server/foundry-proxy.js
```
No portal: Endpoint `http://localhost:8787/chat/completions`, Deployment = nome do modelo (ex.: `gpt-4o`), API key em branco.

**Tools (function calling)**: com a IA ativa, o modelo consulta os dados locais do portal via `AITools` (executadas no navegador, respeitando o perfil — valores só com permissão de valores, oportunidades só com permissão de oportunidades — e sem CPF/CNPJ/contatos; evidências passam por `PII.scrub`):
- `listar_clientes` — busca/filtra clientes (status, segmento, UF, CS).
- `detalhes_cliente` — cadastro, métricas do período e oportunidades de um cliente.
- `relatorio_contratos` — relatório dos contratos (vigência, franquia, horas usadas, % uso, alertas, valores) com totais.
- `comparar_clientes` — métricas lado a lado de 2 a 10 clientes.
- `ranking_clientes` — top N da carteira por métrica (consumo, variação, uso de franquia, valor, chamados, oportunidades).

Período padrão: últimos 30 dias (configurável via `dias`). Os resultados das tools são enviados ao endpoint. A resposta mostra as tools consultadas e permite **Baixar .md**.

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
