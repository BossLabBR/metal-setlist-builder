# 🎸 Metal Setlist Builder

## A ideia

Um app web pra montar setlists de metal — tipo um planejador de shows/ensaios onde você monta a ordem das músicas, vê a duração total, e tem a cara visual de metal que nenhum app de setlist no mercado tem.

Pensa num app onde você digita "Slayer", aparece a discografia com as capas dos álbuns, você escolhe as músicas e arrasta pra montar o setlist. Simples, bonito, e útil.

## Como funciona

1. Busca por banda → aparece lista de artistas
2. Seleciona o artista → aparece a discografia com capas
3. Clica num álbum → aparece a lista de faixas com duração
4. Arrasta faixas pro setlist → calcula duração total automaticamente
5. Salva o setlist com nome, data, e notas

## Features (MVP)

- **Busca de bandas e músicas** via MusicBrainz API (gratuita, sem cadastro)
- **Capas de álbuns** via Cover Art Archive (gratuita, sem cadastro)
- **Drag & drop** pra ordenar músicas no setlist
- **Duração total** calculada em tempo real
- **Campos extras por música**: tuning (Drop D, C Standard, etc), BPM, notas pessoais
- **CRUD de setlists**: criar, editar, duplicar, deletar
- **Visual metal**: tema escuro, tipografia agressiva, estética que os apps genéricos não têm

## Features futuras (v2+)

- Login / autenticação
- Compartilhar setlist com link
- Integração com Spotify (requer Premium)
- Metrônomo embutido
- Tags de dificuldade técnica
- Filtros por subgênero (thrash, death, black, progressive, etc.)
- PWA (instalar como app no celular)
- Migrar frontend pra framework (Vue 3 / React)

## Stack técnica

| Camada | Tech |
|--------|------|
| **Frontend** | HTML + CSS + JavaScript (vanilla) |
| **Backend** | Express + TypeScript |
| **Banco** | SQLite (MVP) → PostgreSQL (se precisar) |
| **APIs externas** | MusicBrainz + Cover Art Archive |
| **Versionamento** | GitHub (monorepo, PRs, issues) |
| **Deploy frontend** | GitHub Pages |
| **Deploy backend** | VPS |

## APIs externas

### MusicBrainz (metadados de música)

- **Docs**: https://musicbrainz.org/doc/MusicBrainz_API
- **URL base**: `https://musicbrainz.org/ws/2/`
- **Custo**: Grátis, sem API key
- **Rate limit**: 1 request/segundo (o backend cacheia pra não estourar)
- **Formato**: JSON (adiciona `?fmt=json`)

Exemplos:
```
# Buscar artista
GET /ws/2/artist?query=Megadeth&fmt=json

# Álbuns do artista
GET /ws/2/release-group?artist={MBID}&type=album&fmt=json

# Faixas de um álbum
GET /ws/2/release/{MBID}?inc=recordings&fmt=json
```

### Cover Art Archive (capas de álbum)

- **Docs**: https://coverartarchive.org/
- **Custo**: Grátis
- **Uso no frontend**: direto no `<img>`, sem passar pelo backend

```
# Capa do álbum em 500px (usa direto como src da imagem)
https://coverartarchive.org/release-group/{MBID}/front-500
```

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/artists/search?q=` | Busca artistas no MusicBrainz |
| `GET` | `/api/artists/:id/albums` | Discografia do artista |
| `GET` | `/api/albums/:id/tracks` | Faixas de um álbum |
| `GET` | `/api/setlists` | Lista setlists |
| `POST` | `/api/setlists` | Cria setlist |
| `PUT` | `/api/setlists/:id` | Atualiza setlist |
| `DELETE` | `/api/setlists/:id` | Remove setlist |

## Milestones

### M1 — Busca e visual base
- [ ] Endpoint de busca de artistas funcionando
- [ ] Tela de busca renderizando resultados
- [ ] Tema escuro aplicado

### M2 — Discografia com capas
- [ ] Endpoint de álbuns do artista
- [ ] Grid de álbuns com capas (Cover Art Archive)

### M3 — Faixas e montagem do setlist
- [ ] Endpoint de faixas
- [ ] Lista de faixas com duração
- [ ] Drag & drop pro setlist com cálculo de duração total

### M4 — Persistência
- [ ] CRUD de setlists completo
- [ ] Salvar, listar, editar e deletar setlists

## Como contribuir

- Cada um trabalha na sua branch, faz PR pro main
- Issues pra trackear o que falta fazer
- API contract first — endpoints documentados antes de codar
- Commits pequenos e frequentes
