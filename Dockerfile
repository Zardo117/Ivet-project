# Dockerfile para SoftPet API
FROM node:18-alpine

# Instala dependências do sistema necessárias para PostgreSQL
RUN apk add --no-cache python3 make g++

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos
COPY . .

# Expõe a porta da aplicação
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]

