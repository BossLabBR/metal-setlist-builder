# 🎨 Style Guide — Metal Setlist Builder

## Conceito Visual

Escuro, pesado, agressivo — mas limpo. Pensa no visual de um amplificador valvulado: preto com detalhes em laranja/âmbar. Não é bagunçado, é denso e preciso. O visual deve parecer que foi feito por alguém que escuta metal, não por alguém que "fez um tema escuro".

---

## Paleta de Cores

### Cores principais

| Nome | Hex | Uso |
|------|-----|-----|
| **Background** | `#0d0d0d` | Fundo da página |
| **Surface** | `#1a1a1a` | Cards, containers |
| **Surface Light** | `#2a2a2a` | Inputs, hover states |
| **Border** | `#333333` | Bordas, divisores |

### Cores de texto

| Nome | Hex | Uso |
|------|-----|-----|
| **Text Primary** | `#e8e8e8` | Texto principal |
| **Text Secondary** | `#888888` | Labels, metadata |
| **Text Muted** | `#555555` | Placeholders, hints |

### Cor de acento

| Nome | Hex | Uso |
|------|-----|-----|
| **Accent** | `#ff6b35` | Botões, links, ícones ativos, bordas de destaque |
| **Accent Hover** | `#ff8c5a` | Hover em elementos de acento |
| **Accent Muted** | `#ff6b3520` | Background sutil com acento (20% opacidade) |

### Feedback

| Nome | Hex | Uso |
|------|-----|-----|
| **Success** | `#4ade80` | Confirmações |
| **Error** | `#ef4444` | Erros |
| **Warning** | `#f59e0b` | Avisos |

---

## Tipografia

### Fontes (Google Fonts, grátis)

| Uso | Fonte | Weight | Fallback |
|-----|-------|--------|----------|
| **Títulos / Logo** | [Oswald](https://fonts.google.com/specimen/Oswald) | 700 | Impact, sans-serif |
| **Corpo / UI** | [Source Code Pro](https://fonts.google.com/specimen/Source+Code+Pro) | 400, 600 | monospace |

> **Por que Oswald?** É condensada, bold, agressiva — lembra tipografia de posters de shows de metal. Funciona bem em títulos sem parecer "decorativa demais".
>
> **Por que Source Code Pro?** Monospace dá um ar técnico e combina com o tema de setlist/instrumentação. Fácil de ler, boa pra tabelas e listas de faixas.

### Import no HTML

```html
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Source+Code+Pro:wght@400;600&display=swap" rel="stylesheet">
```

### Tamanhos

| Elemento | Tamanho | Weight |
|----------|---------|--------|
| Logo / H1 | 32px | 700 (Oswald) |
| H2 (nome da banda) | 24px | 700 (Oswald) |
| H3 (seção) | 14px uppercase | 600 (Source Code Pro) |
| Body | 14px | 400 (Source Code Pro) |
| Small / metadata | 12px | 400 (Source Code Pro) |
| Micro (labels) | 10px uppercase | 600 (Source Code Pro) |

---

## Espaçamentos

Usa múltiplos de **8px**:

| Token | Valor | Uso |
|-------|-------|-----|
| `xs` | 4px | Padding interno de badges/tags |
| `sm` | 8px | Gap entre elementos inline |
| `md` | 16px | Padding de cards |
| `lg` | 24px | Gap entre cards no grid |
| `xl` | 32px | Margem entre seções |
| `2xl` | 48px | Margem top/bottom de seções principais |

---

## Componentes

### Cards de resultado (busca de banda)

- Background: `Surface` (#1a1a1a)
- Border-radius: 6px
- Padding: 16px
- Hover: border-left 3px solid `Accent`
- Transição: 150ms ease

### Cards de álbum (grid)

- Tamanho: ~180px de largura (grid responsivo)
- Imagem da capa ocupa o topo (aspect-ratio 1:1)
- Título abaixo da imagem
- Hover: leve scale (1.03) + sombra
- Se a capa não carregar: placeholder cinza com ícone de disco

### Track list (faixas)

- Cada faixa é uma row: número + título + duração
- Background alternado sutil (#1a1a1a / #222222)
- Hover: background `Surface Light`
- Cursor: grab (draggable)

### Setlist (drop zone)

- Borda: 2px dashed `Border` quando vazio
- Borda: 1px solid `Accent` em cada item adicionado
- Número da ordem em `Accent`
- Footer com total de duração em destaque

### Botões

- **Primário**: background `Accent`, texto branco, border-radius 6px, padding 10px 20px
- **Secundário**: background transparente, border 1px `Border`, texto `Text Secondary`
- **Hover**: clarear 15% a cor de fundo
- **Uppercase**: sim, Oswald 700

### Inputs

- Background: `Surface Light` (#2a2a2a)
- Border: 1px solid `Border`
- Border-radius: 6px
- Focus: border-color `Accent`
- Placeholder: `Text Muted`
- Padding: 12px 16px

---

## Layout

### Desktop (>768px)

- Max-width do conteúdo: 1100px, centralizado
- Tela de busca: single column, centrado
- Tela de discografia: grid de 5 colunas
- Tela de builder: 2 colunas (tracks à esquerda, setlist à direita)

### Mobile (<768px)

- Single column em tudo
- Grid de álbuns: 2 colunas
- Builder: tracks em cima, setlist embaixo (scroll vertical)
- Navbar vira hamburger ou simplifica

---

## Efeitos e Interações

- **Transições**: tudo com `transition: all 150ms ease`
- **Hover em cards**: borda de acento + leve elevação (box-shadow)
- **Drag & drop**: item sendo arrastado fica com opacidade 0.5
- **Drop zone**: quando drag está sobre ela, borda fica `Accent` sólida
- **Loading**: um spinner simples ou texto "Loading..." com animação de pulse
- **Scroll**: suave (`scroll-behavior: smooth`)

---

## Referências visuais

Procura no Google/Dribbble por estes termos pra inspiração:

1. **"dark music player UI"** — layouts de player com estética escura
2. **"concert poster typography"** — tipografia pesada e condensada de posters de shows
3. **"guitar pedalboard app"** — interfaces de equipamento musical
4. **"kanban board dark mode"** — referência pro layout de drag & drop em 2 colunas

---

## CSS Variables (sugestão de estrutura)

O Lucas não precisa seguir essa estrutura exata, mas ajuda como ponto de partida:

```
--color-bg: #0d0d0d
--color-surface: #1a1a1a
--color-surface-light: #2a2a2a
--color-border: #333333
--color-text: #e8e8e8
--color-text-secondary: #888888
--color-text-muted: #555555
--color-accent: #ff6b35
--color-accent-hover: #ff8c5a

--font-display: 'Oswald', Impact, sans-serif
--font-body: 'Source Code Pro', monospace

--space-xs: 4px
--space-sm: 8px
--space-md: 16px
--space-lg: 24px
--space-xl: 32px

--radius-sm: 4px
--radius-md: 6px
--radius-lg: 8px

--transition: all 150ms ease
```
