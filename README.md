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
│   └── chat.gateway.ts
└── main.ts
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
