# API Backend de Jogos Educacionais

Olá, este é meu projeto de trabalho de conclusão de curso que apresentei em março de 2022.

Para executar este projeto você irá precisar ter instalado o NodeJs.
Recomenda-se também um banco de dados local utilizando uma imagem do Docker.

Para criar a imagem execute o comando:
`docker run -p 5432:5432 --name some-postgres -e POSTGRES_PASSWORD=dev -e POSTGRES_DB=tcc_dev -d postgres`

Caso a imagem já tenha sido criada anteriormente, só é necessário iniciar o container:
`docker start some-postgres`

Passos para executar o projeto:

1. Execute o comando `npm install` para baixar as dependências do projeto
2. Execute o comando `npm run local`
3. Realize uma chamada GET no endereço `http://localhost:3000` e aguarde uma resposta

Para as demais operações, siga a documentação presente na monografia.
