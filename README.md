# OGV Converter

Conversor local de midia para formatos usados no Godot.

- Videos para `.ogv` com Theora + Vorbis
- Audios para `.ogg` com Vorbis
- Conversao direto no navegador, sem upload para servidor

## Como rodar

```bash
npm install
npm run dev
```

## Testes

```bash
npm run test
```

Para rodar a validacao completa:

```bash
npm run ci
```

## Build

```bash
npm run build
```

Para deploy em subdiretório (ex: `dominio.com/tools/ogv`), defina antes do build:

```bash
VITE_BASE_PATH=/tools/ogv/ npm run build
```

## Estrutura

- `src/components`: componentes da interface
- `src/media`: deteccao de tipos de arquivo
- `src/ffmpeg`: carregamento do FFmpeg e conversao
- `tests`: testes unitarios