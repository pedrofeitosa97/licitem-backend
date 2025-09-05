🔧 Licitem Backend

Dependências:

- Node 18+
- NestJS
- Firebase Admin SDK
- Axios (para integração com Firebase REST)
- Socket.IO
- Class-validator / Class-transformer

Arquitetura:

O backend utiliza NestJS com injeção de dependências e módulos organizados por domínio.
```
src/
├── auth
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── dto // validação de dados
├── firebase
│   └── firebase.service.ts
├── messages
│   ├── messages.controller.ts
│   ├── messages.service.ts
│   └── entities
├── chat
│   ├── messages
│   ├── rooms
└── chat.gateway.ts
│   └── chat.gateway.ts
└── main.ts
└── app.module.ts
```

Fluxo de Autenticação (Firebase):

O front envia email + password para o backend.
O backend chama a API REST do Firebase (signInWithPassword) e recebe idToken, refreshToken, localId.
O backend usa o Firebase Admin SDK para buscar displayName.
O backend retorna { uid, idToken, refreshToken, displayName }.
Rotas protegidas validam o idToken com verifyIdToken.
No chat.gateway.ts, o idToken é validado no handshake do Socket.IO.

Rodando o projeto:

```
npm install
npm run start:dev
```

Principais Funcionalidades:

Registro e login de usuários usando Firebase.
Geração e validação de tokens idToken.
Envio de mensagens via REST + broadcast em tempo real via Socket.IO.
Arquitetura modularizada (Auth, Messages, Chat, Firebase).

Base URL:

    http://localhost:3000

------------------------------------------------------------------------

## 🔹 Rooms

### ➕ Criar sala

**POST** `/rooms`

**Body (JSON):**

``` json
{
  "name": "Sala de Teste"
}
```

**Response (200):**

``` json
{
  "id": "abc123",
  "name": "Sala de Teste",
  "createdAt": "2025-09-05T18:20:00.000Z"
}
```

------------------------------------------------------------------------

### 📋 Listar salas

**GET** `/rooms`

**Response (200):**

``` json
[
  {
    "id": "abc123",
    "name": "Sala de Teste",
    "createdAt": "2025-09-05T18:20:00.000Z"
  },
  {
    "id": "def456",
    "name": "Outra sala",
    "createdAt": "2025-09-05T18:21:00.000Z"
  }
]
```

------------------------------------------------------------------------

### ❌ Deletar sala

**DELETE** `/rooms/:id`

Exemplo:

    DELETE /rooms/abc123

**Response (200):**

``` json
{ "message": "Sala removida com sucesso." }
```

------------------------------------------------------------------------

## 🔹 Messages

### ➕ Enviar mensagem

**POST** `/messages`

**Body (JSON):**

``` json
{
  "roomId": "abc123",
  "sender": "Pedro",
  "content": "Olá, mundo!"
}
```

**Response (200):**

``` json
{
  "id": "msg789",
  "roomId": "abc123",
  "sender": "Pedro",
  "content": "Olá, mundo!",
  "createdAt": "2025-09-05T18:22:00.000Z"
}
```

------------------------------------------------------------------------

### 📋 Listar mensagens da sala

**GET** `/messages/:roomId`

Exemplo:

    GET /messages/abc123

**Response (200):**

``` json
[
  {
    "id": "msg789",
    "roomId": "abc123",
    "sender": "Pedro",
    "content": "Olá, mundo!",
    "createdAt": "2025-09-05T18:22:00.000Z"
  },
  {
    "id": "msg790",
    "roomId": "abc123",
    "sender": "Maria",
    "content": "Oi, Pedro!",
    "createdAt": "2025-09-05T18:23:00.000Z"
  }
]
```

------------------------------------------------------------------------

## 🔹 WebSockets (tempo real)

Conexão via Socket.io:

    ws://localhost:3000

### Eventos

-   `joinRoom` → cliente entra em uma sala

    ``` json
    "roomId"
    ```

-   `roomHistory` → servidor envia histórico da sala

    ``` json
    [
      { "id": "msg1", "roomId": "abc123", "sender": "Pedro", "content": "Oi!", "createdAt": "..." }
    ]
    ```

-   `sendMessage` → cliente envia mensagem

    ``` json
    { "roomId": "abc123", "sender": "Pedro", "content": "Olá!" }
    ```

-   `message` → servidor envia mensagem nova em tempo real

    ``` json
    { "id": "msg2", "roomId": "abc123", "sender": "Pedro", "content": "Olá!", "createdAt": "..." }
    ```


