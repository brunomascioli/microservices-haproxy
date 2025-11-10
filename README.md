# Microservices com HAProxy

Repositório exemplo que demonstra um conjunto simples de microserviços Node.js (inventory, order, payment) balanceados por um HAProxy em Docker Compose.

Visão geral
- 4 containers de serviços:
  - `inventory` (porta interna 3000)
  - `order` (porta interna 3000)
  - `order2` (segunda instância do serviço `order`, porta interna 3000)
  - `payment` (porta interna 3000)
- Um container HAProxy que expõe a porta 8000 no host e encaminha requisições para os backends conforme o caminho da URL.

Roteamento do HAProxy
- Porta pública: 8000
- Regras de roteamento (no `haproxy.cfg`):
  - /api/v1/order  -> backend `order_back` (order:3000 e order2:3000, roundrobin)
  - /api/v1/payment -> backend `payment_back` (payment:3000)
  - /api/v1/inventory -> backend `inventory_back` (inventory:3000)

Os backends também têm checagem de saúde (`/health`). O HAProxy reescreve o caminho removendo o prefixo `/api/v1/<servico>` e encaminha para `/api/v1` nos serviços.

Como rodar

Pré-requisitos
- Docker e Docker Compose instalados (versões compatíveis com compose v3.8)

Subir os serviços

```bash
# no diretório raiz deste repositório
docker-compose up --build
```

Isso irá construir as imagens dos serviços (Dockerfiles nas pastas `inventory/`, `order/` e `payment/`) e iniciar os containers. O HAProxy ficará disponível em `http://localhost:8000`.

Testando endpoints

- Health checks (direto para o HAProxy):

```bash
curl -i http://localhost:8000/health
```

Observação: o HAProxy encaminha `/health` para os backends apenas quando a checagem é configurada no backend (`option httpchk GET /health`). Por padrão, você pode testar os endpoints dos serviços através das rotas abaixo.

- Testar o endpoint de cada serviço através do HAProxy:

```bash
curl -i http://localhost:8000/api/v1/order
curl -i http://localhost:8000/api/v1/payment
curl -i http://localhost:8000/api/v1/inventory
```

Respostas esperadas
- Cada serviço responde em `/api/v1` com um texto indicando qual serviço respondeu (por exemplo: "Response from the ORDER server API v1.").
- `/health` retorna `OK` com status 200 quando o serviço está saudável.

Arquivos importantes
- `docker-compose.yml` — define serviços, rede e mapeamento de porta do HAProxy (8000).
- `haproxy.cfg` — configuração do HAProxy com frontends e backends.
- `inventory/server.js`, `order/server.js`, `payment/server.js` — implementações de exemplo dos serviços Node.js.