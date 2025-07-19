# Agent Backend API

Este é o backend da aplicação de agentes, construído com FastAPI e gerenciado com `uv`.

## Como executar com Docker

### Pré-requisitos
- Docker instalado
- Variáveis de ambiente configuradas (veja `.env.example`)

### Build da imagem
```bash
# A partir do diretório raiz do projeto (bordeless_coding_classes)
docker build -f class2/agent_backend/Dockerfile -t agent-backend .
```

### Executar o container
```bash
# Executar na porta 8000
docker run -p 8000:8000 agent-backend

# Ou com variáveis de ambiente
docker run -p 8000:8000 \
  -e OPENAI_API_KEY=sua_chave_aqui \
  -e AZURE_OPENAI_API_KEY=sua_chave_aqui \
  -e AZURE_OPENAI_ENDPOINT=seu_endpoint_aqui \
  -e AZURE_OPENAI_API_VERSION=2023-12-01-preview \
  -e ANTHROPIC_API_KEY=sua_chave_aqui \
  agent-backend
```

### Verificar se está funcionando
```bash
curl http://localhost:8000/status
```

## Desenvolvimento Local

### Com uv
```bash
# Instalar dependências
uv venv
uv pip install -e ../../

# Executar a aplicação
uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --reload
``` 