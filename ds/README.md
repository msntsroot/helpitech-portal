# Grupo Helpitech — Design System Corporativo

Identidade visual unificada para os sites institucionais, plataformas SaaS, landing pages e futuros produtos do **Grupo Helpitech** — um ecossistema de empresas e soluções de tecnologia especializado em infraestrutura de TI, serviços gerenciados, computação em nuvem, segurança da informação e proteção de dados.

O sistema garante consistência visual, qualidade de UX/UI, acessibilidade (WCAG AA) e reutilização de componentes. **Cada produto mantém nome, logotipo, conteúdo e navegação próprios**; todos compartilham tipografia, paleta, linguagem de componentes, padrões de acessibilidade e a assinatura institucional do grupo (footer).

## Produtos e superfícies

| Superfície | O que é | Onde |
|---|---|---|
| Site institucional Grupo Helpitech | Site da holding (helpitech.com.br): soluções, produtos, contato | `ui_kits/institutional/` |
| DataKeep | Plataforma SaaS de backup e proteção de dados — landing + console | `ui_kits/datakeep/` |
| Futuros produtos / landing pages | Usam o mesmo Header + Footer corporativos com nome e links próprios | `components/site/` |

## Fontes recebidas

- **Brief do Design System** (texto colado pelo usuário, em pt-BR): paleta, tipografia, linguagem visual, estrutura de header/footer, componentes, stack técnica e diretrizes. É a fonte de verdade para todos os valores marcados *(brief)* em `tokens/colors.css`.
- **`uploads/logo-helpitech.png`** — logotipo oficial do Grupo Helpitech (PNG 199×60, fundo transparente; "Help" em cinza + seta/circuito azul + assinatura "Inteligência em outsourcing"). Copiado para `assets/logo-helpitech.png`.
- Não foram fornecidos: codebase, Figma, screenshots de produto, logotipo do DataKeep, versão negativa (branca) do logo do grupo, dados de contato, redes sociais nem textos legais. Ver **Pendências**.

---

## Índice (manifest)

```
styles.css                 ← entrada única: só @imports (tokens + base + CSS dos componentes)
tokens/
  fonts.css                @font-face Hanken Grotesk (variável 400–700) + Material Symbols Outlined
  colors.css               paleta corporativa + tons derivados + aliases semânticos
  typography.css           famílias, pesos, escala responsiva (clamp), papéis tipográficos
  spacing.css              espaçamento 4px, raios, sombras, tamanhos de controle, layout, motion, z-index
  base.css                 reset, foco visível, links, classe .ms (ícones), utilitários .ht-*, keyframes, reduced-motion
tailwind/theme.css         mesmos tokens em @theme para projetos Tailwind CSS 4 (não importado por styles.css)
fonts/                     woff2 auto-hospedados (Hanken Grotesk latin + latin-ext, roman + italic; Material Symbols)
assets/logo-helpitech.png  logotipo oficial do grupo
guidelines/                cards de fundamentos (cores, tipo, espaçamento, marca)
components/<grupo>/        componentes React + .d.ts + .prompt.md + CSS de classes .ht-* + card de preview
ui_kits/institutional/     site do Grupo Helpitech (Home, Contato)
ui_kits/datakeep/          DataKeep: landing, login, console (Visão geral, Backups, Configurações)
thumbnail.html             miniatura do design system
SKILL.md                   versão Agent Skill (Claude Code)
```

### Componentes

Cada componente tem `<Nome>.jsx` (React), `<Nome>.d.ts` (contrato de props) e `<Nome>.prompt.md` (uso). O CSS de cada grupo (`components/<grupo>/<grupo>.css`) usa classes `.ht-*` e é **independente de framework** — em Vue/Tailwind basta aplicar as mesmas classes ou recriar o componente com os mesmos tokens.

- **core/** — `Button`, `IconButton`, `Icon`, `Badge`, `Card`
- **forms/** — `Input` (inclui textarea via `multiline`), `Select`, `Checkbox`, `Radio`, `RadioGroup`, `Switch`
- **overlays/** — `Modal`, `Dropdown`, `Tooltip`
- **feedback/** — `Alert`, `ProgressBar`, `Spinner`, `Skeleton`
- **navigation/** — `Tabs`, `Accordion`, `Breadcrumbs`, `SideNav`
- **site/** — `Header`, `Footer` (estrutura corporativa obrigatória)
- **data/** — `Table`

**Adições intencionais** (fora da lista do brief, com motivo):
- `Icon` — wrapper do Material Symbols para garantir tamanho/peso/optical size consistentes.
- `IconButton` — ações só com ícone (fechar, menu, ações de linha) com `aria-label` obrigatório.
- `Breadcrumbs`, `SideNav` — navegação de plataformas SaaS (o brief cita "Navigation" e "plataformas SaaS").
- `ProgressBar`, `Skeleton`, `Spinner` — cobrem "Loading states" (progresso conhecido, placeholder de conteúdo, espera curta).
- `RadioGroup` — fieldset + legend acessível para radios.

---

## CONTENT FUNDAMENTALS — como escrever

**Idioma:** português do Brasil em toda interface e conteúdo. Termos técnicos consagrados no mercado ficam em inglês quando é o uso corrente: *backup*, *cloud*, *SaaS*, *dashboard*, *data center*. LGPD sempre em sigla.

**Tom:** profissional, seguro e direto — um especialista calmo explicando algo complexo com clareza. Transmite tecnologia, segurança e confiabilidade sem exagero. Nada de hype ("revolucionário", "o melhor do mercado"), sem gírias, sem exclamações em excesso.

**Pessoa:** fala-se com o cliente por **"você"** (nunca "tu", raramente "vocês"); a empresa fala como **"nós"** / "a Helpitech" / "o DataKeep". Ex.: *"Nós cuidamos da sua infraestrutura para que você foque no negócio."*

**Caixa:** *sentence case* em tudo — títulos, botões, menus, labels. Só a primeira palavra e nomes próprios em maiúscula: "Fale com um especialista", não "Fale Com Um Especialista". Exceção: overlines/eyebrows em CAIXA ALTA via CSS (`.ht-overline`), nunca digitadas em caps.

**Botões e ações:** verbo no infinitivo, curto e específico: "Salvar", "Criar backup", "Executar agora", "Solicitar demonstração", "Exportar relatório". Evitar "Clique aqui", "OK", "Enviar" genérico quando há algo mais preciso.

**Títulos:** afirmações de benefício, concisas. Ex.: *"Seus dados protegidos, sempre disponíveis."* · *"Infraestrutura de TI que acompanha o seu crescimento."*

**Mensagens de sistema:** dizer o que aconteceu + o que fazer. Sem culpar o usuário.
- Erro: *"Não foi possível concluir o backup. Verifique a conexão com o servidor e tente novamente."*
- Sucesso: *"Backup concluído. 42,8 GB copiados em 18 min."*
- Vazio: *"Nenhuma rotina de backup ainda. Crie a primeira para proteger seus dados."*
- Validação: *"Informe um e-mail corporativo válido."*

**Formatos (pt-BR):** datas `08/10/2026`; hora `14:30` (24 h); números `1.284,50`; percentuais `99,9%`; moeda `R$ 1.290,00`; tamanhos `42,8 GB`.

**Emoji:** não usar — nem em interface, nem em marketing. Ícones são sempre Material Symbols.

**Dados reais:** **nunca inventar** telefones, e-mails, endereços, URLs, CNPJ, números de clientes, certificações ou textos legais. Use placeholders identificáveis entre colchetes — `[Telefone comercial]`, `[E-mail de contato]`, `[Endereço institucional]` — renderizados com `.ht-placeholder` (itálico + sublinhado tracejado). A única URL fornecida é `https://helpitech.com.br`.

**Assinatura do grupo:** "Parte do Grupo Helpitech" (footer de cada produto). Assinatura do logo: "Inteligência em outsourcing".

---

## VISUAL FOUNDATIONS

**Referência:** Material Design 3 adaptado — tonal surfaces, state layers, easing M3 — com estética SaaS B2B premium: limpa, hierarquia forte, pouca decoração.

**Cores.** O azul é a identidade: `Primary #005698` em CTAs, links, foco, estados ativos; `Primary Container #2e6fb3` e `Secondary #346092` como apoio; `Tertiary #4c546a` para elementos neutros fortes. Conteúdo, dashboards e formulários sobre fundos claros (`Background #f8f9ff`, `Surface #ffffff`, containers tonais azulados `#eff4ff → #d3e4fe`). Texto principal `#0b1c30`, secundário `#414751`. **Ink `#0f172a` / Ink Deep `#020617`** em heroes, footers e seções de destaque. **Accent Blue `#3b82f6` e Accent Sky `#63adde` são decorativos ou para texto sobre fundo escuro** — nunca texto pequeno sobre branco (3,7:1 e 2,5:1). Sucesso (`#146c2e`) e alerta (`#8a5100`) foram derivados (não constam no brief).

**Tipografia.** Hanken Grotesk em tudo (títulos, corpo, menus, botões, formulários), pesos 400/500/600/700. Títulos em Bold com tracking negativo (−3% display, −1,8% H1/H2); H3–H5 Semibold; corpo Regular com entrelinha 1,6; labels/botões Semibold 14px. Escala responsiva via `clamp()` (Display 40→60, H1 34→48, H2 28→36, H3 22→26). Números em tabelas usam `tabular-nums`. Não há fonte mono de marca — `--font-mono` usa a monoespaçada do sistema.

**Espaçamento & layout.** Base 4px (`--space-1` = 4px … `--space-32` = 128px). Container 1280px com padding fluido 20→32px; seções com 64→96px de respiro vertical. Grid de 12 colunas com gap 16→24px. Mobile-first; breakpoints 640 / 768 / 1024 / 1280 / 1536. Header e Footer usam *container queries* (menu mobile abaixo de 960px de largura).

**Fundos.** Claros e planos na maior parte. Seções escuras usam `--gradient-hero-dark` (Ink Deep → Ink com um brilho radial azul discreto no canto). Faixas de CTA podem usar `--gradient-brand` (Primary → Primary Container). Sem texturas, padrões repetidos, ilustrações desenhadas à mão ou gradientes roxos. Imagens (quando houver): fotografia real, tons frios/azulados, sem granulação; nenhuma foi fornecida — usar placeholders.

**Cantos.** Faixa do brief 0,5–1,25rem: `sm .5rem` (botão pequeno, item de menu), `md .75rem` (botões, inputs, alertas, menus), `lg 1rem` (cards, tabelas), `xl 1.25rem` (modais, painéis). `xs .375rem` só para checkbox/tooltip (controles de 20px); `full` para badges, switches, chips.

**Cards.** Branco, borda 1px `#dde3ee`, raio 1rem, sombra `xs`. Interativo: borda azul clara + sombra `md` no hover. Variantes: `elevated` (só sombra), `sunken` (fundo tonal, sem borda), `dark` (branco 4% sobre Ink, borda slate 18%). Ícone de card em ladrilho 44px `primary-fixed`. **Nunca** cards com borda colorida só à esquerda.

**Bordas.** Hairlines `#dde3ee` para divisores e cards; `#c1c7d3` para bordas de botão secundário; `#727782` (outline) para inputs/checkbox — garante 3:1 de contraste não textual.

**Sombras.** Suaves, tingidas de Ink, de `xs` a `xl`; usadas com parcimônia (cards em repouso `xs`, menus `lg`, modais `xl`). Botão primário ganha um brilho azul (`--shadow-primary`) no hover. Sem sombras internas.

**Estados.**
- *Hover:* botões primários escurecem (`#00487f`) + brilho; ghost/standard recebem *state layer* azul 6%; links ganham sublinhado de 2px; cards elevam a sombra.
- *Pressed:* tom mais escuro (`#003b69`) ou state layer 12%. Sem efeito de encolher.
- *Focus:* anel 2px `Primary` com offset 2px (em fundos escuros: Accent Sky). Inputs: borda primária + halo 4px 18%.
- *Disabled:* fundo 6% / texto 38% de `#0b1c30`; cursor `not-allowed`.
- *Loading:* spinner substitui o ícone do botão (`aria-busy`); skeleton com shimmer; barra de progresso.
- *Selected:* fundo `primary-fixed #d3e4ff` com texto `#00487f` (nav ativa, linha selecionada, aba).

**Transparência & blur.** Apenas em dois lugares: header sticky (`rgba(248,249,255,.78)` + `blur(14px) saturate(1.6)`, ganha borda e sombra leve ao rolar) e scrim de modal (Ink Deep 56% + `blur(4px)`).

**Motion.** Microinterações curtas e funcionais: 80–320ms, easing M3 `cubic-bezier(.2,0,0,1)`; entrada de menus/modais com fade + 6px de deslocamento (`ease-decelerate`). Sem bounce, sem parallax, sem animações decorativas. `prefers-reduced-motion` desliga transições (spinner continua, mais lento).

**Acessibilidade.** WCAG AA: contraste ≥4,5:1 para texto (Primary sobre branco = 7,5:1), alvos de toque ≥44px (`--control-md`), foco sempre visível, labels visíveis em todos os campos, `aria-*` corretos em menus, abas, accordion, modal (focus trap + Esc), HTML semântico.

---

## ICONOGRAPHY

- **Biblioteca única: Material Symbols Outlined** (Google, Apache 2.0) — fonte variável auto-hospedada em `fonts/MaterialSymbolsOutlined.woff2` (eixos opsz 20–48, wght 300–600, FILL 0–1). Não misturar com outras bibliotecas.
- Uso: `<span class="ms">cloud_done</span>` ou `<Icon name="cloud_done" />`. Padrão 24px, peso 400, FILL 0, GRAD 0. Em botões 20px; em badges 15px; em tabelas/menus 20px.
- **FILL 1 apenas para estado ativo/selecionado** (item ativo da SideNav, IconButton pressionado).
- Cor: herda o texto; ícones de destaque em `--color-primary` sobre ladrilho `primary-fixed`; em fundo escuro, Accent Sky.
- Glifos recorrentes: `cloud`, `backup`, `shield_lock`, `encrypted`, `dns`, `storage`, `lan`, `security`, `verified_user`, `monitoring`, `support_agent`, `restore`, `schedule`, `database`, `sync`, `settings`.
- **Sem emoji. Sem caracteres Unicode como ícone** (exceto "·" como separador e "©"). Sem SVGs desenhados à mão.
- **Redes sociais:** Material Symbols não tem logos de marcas; o Footer mostra as redes como chips de texto. Se forem necessários ícones de marca, solicitar os SVGs oficiais.

## Logotipos

- `assets/logo-helpitech.png` — único logo fornecido. Uso em fundo claro diretamente; **em fundo escuro, sobre uma placa branca** (`.ht-footer__plate`) porque o texto do logo é cinza e não há versão negativa. Não recolorir, não recriar, não aplicar filtros.
- **DataKeep não tem logotipo fornecido** — o nome é renderizado em tipo (Hanken Grotesk Bold 20px, tracking −2,5%) no Header/Footer. Não desenhar um logo.

---

## Stack técnica

Referência: **Vue 3 + Vite + TypeScript + Tailwind CSS 4**. Os componentes deste projeto são React (formato exigido pelo compilador do design system), mas toda a aparência vive em CSS puro com classes `.ht-*` e tokens CSS — portanto reutilizável em qualquer stack. Para Tailwind 4, copie `tailwind/theme.css` (tokens em `@theme`). Não usar valores de cor/espaço/tipo *hardcoded* quando existir token. Tokens visuais ficam separados de componentes específicos de produto.

## Pendências / caveats

- **Fontes:** Hanken Grotesk e Material Symbols foram baixadas do Google Fonts (subsets latin + latin-ext). Se houver arquivos licenciados próprios, substituir em `fonts/`.
- **Tons derivados:** hover/active, containers tonais, sucesso e alerta foram derivados da paleta — validar com a marca.
- **Faltam:** logo do DataKeep, versão negativa do logo do grupo, dados de contato, redes sociais, endereço, textos legais, fotografia institucional e screenshots/código dos produtos reais. Os UI kits são **composições de referência construídas a partir do brief**, não recriações de telas existentes.
