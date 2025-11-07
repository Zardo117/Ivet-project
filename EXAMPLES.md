# Exemplos de Uso da API SoftPet

Este arquivo contém exemplos práticos de como usar a API SoftPet.

## 🔐 1. Autenticação

### Registrar um novo usuário (Tutor)

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123",
    "role": "tutor",
    "phone": "+5511999999999"
  }'
```

**Resposta:**
```json
{
  "message": "Usuário registrado com sucesso",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "tutor",
    "phone": "+5511999999999"
  }
}
```

### Registrar um veterinário

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Maria Santos",
    "email": "maria@example.com",
    "password": "senha123",
    "role": "vet",
    "phone": "+5511888888888"
  }'
```

### Fazer login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "tutor"
  }
}
```

## 🐾 2. Gerenciamento de Pets

### Cadastrar um pet

```bash
curl -X POST http://localhost:3000/api/pets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "name": "Rex",
    "species": "cão",
    "breed": "Labrador",
    "age": 3,
    "ownerId": 1
  }'
```

**Resposta:**
```json
{
  "id": 1,
  "name": "Rex",
  "species": "cão",
  "breed": "Labrador",
  "age": 3,
  "ownerId": 1,
  "createdAt": "2024-12-25T10:00:00.000Z",
  "updatedAt": "2024-12-25T10:00:00.000Z"
}
```

### Listar todos os pets

```bash
curl -X GET http://localhost:3000/api/pets \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta:**
```json
[
  {
    "id": 1,
    "name": "Rex",
    "species": "cão",
    "breed": "Labrador",
    "age": 3,
    "ownerId": 1
  },
  {
    "id": 2,
    "name": "Mimi",
    "species": "gato",
    "breed": "Persa",
    "age": 2,
    "ownerId": 1
  }
]
```

## 📅 3. Agendamentos

### Criar um agendamento simples

```bash
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "date": "2024-12-30T10:00:00Z",
    "vetId": 2,
    "petId": 1,
    "status": "scheduled"
  }'
```

**Resposta:**
```json
{
  "id": 1,
  "date": "2024-12-30T10:00:00.000Z",
  "vetId": 2,
  "petId": 1,
  "status": "scheduled",
  "createdAt": "2024-12-25T10:00:00.000Z",
  "updatedAt": "2024-12-25T10:00:00.000Z"
}
```

### Criar agendamento com diagnóstico automático

```bash
curl -X POST http://localhost:3000/api/appointments/with-diagnosis \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "petId": 1,
    "vetId": 2,
    "date": "2024-12-30T10:00:00Z",
    "symptoms": "Vômito, falta de apetite, letargia"
  }'
```

**Resposta:**
```json
{
  "appointment": {
    "id": 2,
    "date": "2024-12-30T10:00:00.000Z",
    "vetId": 2,
    "petId": 1,
    "status": "scheduled"
  },
  "diagnosis": {
    "id": 1,
    "appointmentId": 2,
    "possibleDiagnosis": [
      "Gastrite",
      "Intoxicação alimentar",
      "Desidratação",
      "Infecção sistêmica"
    ],
    "recommendations": "Manter o pet em jejum por 12 horas. Oferecer água em pequenas quantidades. Avaliação clínica completa. Exames laboratoriais recomendados. Manter o pet em ambiente tranquilo. Observar evolução dos sintomas. Retornar ao veterinário se necessário.",
    "symptoms": "Vômito, falta de apetite, letargia",
    "species": "cão",
    "breed": "Labrador"
  }
}
```

## 🔬 4. Diagnósticos

### Obter diagnóstico baseado em sintomas

```bash
curl -X POST http://localhost:3000/api/diagnosis \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "symptoms": "Diarréia, vômito, febre",
    "species": "cão",
    "breed": "Labrador"
  }'
```

**Resposta:**
```json
{
  "possibleDiagnosis": [
    "Gastrite",
    "Intoxicação alimentar",
    "Gastroenterite",
    "Parasitose intestinal",
    "Infecção",
    "Processo inflamatório"
  ],
  "recommendations": "Manter o pet em jejum por 12 horas. Oferecer água em pequenas quantidades. Hidratação adequada. Exame de fezes recomendado. Monitorar temperatura. Medicação antitérmica se necessário. Manter o pet em ambiente tranquilo. Observar evolução dos sintomas. Retornar ao veterinário se necessário.",
  "confidence": 0.7,
  "note": "Este é um diagnóstico preliminar gerado por IA. Consulte sempre um veterinário para diagnóstico definitivo."
}
```

## 📱 5. Notificações

### Enviar notificação SMS

```bash
curl -X POST http://localhost:3000/api/notifications/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "message": "Seu agendamento foi confirmado para 30/12/2024 às 10:00",
    "tutorPhone": "+5511999999999"
  }'
```

**Resposta (modo mock):**
```json
{
  "status": "Mensagem enviada (modo mock)",
  "sent": false,
  "note": "Twilio não configurado. Configure TWILIO_SID, TWILIO_TOKEN e TWILIO_PHONE para envio real."
}
```

**Resposta (com Twilio configurado):**
```json
{
  "status": "Mensagem enviada",
  "sent": true
}
```

## 🔄 Fluxo Completo de Uso

### 1. Registrar usuário e fazer login

```bash
# Registrar
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"João","email":"joao@example.com","password":"senha123","role":"tutor"}'

# Login (salve o token retornado)
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@example.com","password":"senha123"}' | jq -r '.token')
```

### 2. Cadastrar pet

```bash
curl -X POST http://localhost:3000/api/pets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Rex","species":"cão","breed":"Labrador","age":3,"ownerId":1}'
```

### 3. Criar agendamento com diagnóstico

```bash
curl -X POST http://localhost:3000/api/appointments/with-diagnosis \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "petId": 1,
    "vetId": 2,
    "date": "2024-12-30T10:00:00Z",
    "symptoms": "Vômito, falta de apetite"
  }'
```

### 4. Enviar notificação

```bash
curl -X POST http://localhost:3000/api/notifications/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "message": "Seu agendamento foi confirmado",
    "tutorPhone": "+5511999999999"
  }'
```

## 📚 Usando o Swagger UI

1. Inicie a aplicação:
```bash
npm start
```

2. Acesse a documentação Swagger:
```
http://localhost:3000/api-docs
```

3. Clique em "Authorize" e insira seu token JWT

4. Teste os endpoints diretamente na interface Swagger

## 🧪 Testando com Postman

1. Importe a coleção (você pode criar uma baseada nos exemplos acima)
2. Configure a variável de ambiente `token` com o token JWT
3. Use `{{token}}` nos headers de autenticação

## 💡 Dicas

- Todos os endpoints (exceto `/api/auth/*`) requerem autenticação
- O token JWT expira em 1 hora
- O banco de dados mock não persiste dados entre reinicializações
- Para produção, configure um banco de dados real e o serviço de IA real

