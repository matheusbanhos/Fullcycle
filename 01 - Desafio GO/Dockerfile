# Etapa de build
FROM golang:alpine AS build

# Definir diretório de trabalho
WORKDIR /app

# Copiar o arquivo go.mod e go.sum
COPY go.mod ./
COPY go.sum ./

# Baixar as dependências
RUN go mod tidy

# Copiar o código fonte para o contêiner
COPY . .

# Compilar a aplicação
RUN go build -o main .

# Etapa final
FROM scratch

# Copiar o executável da etapa de build
COPY --from=build /app/main .

# Definir o ponto de entrada
ENTRYPOINT ["./main"]
