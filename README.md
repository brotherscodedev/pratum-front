# pratum



# para rodar o projeto voce vai precisr do docker instalado

então na raiz do projeto rode

`docker compose up`


O banco local pode ser acessado em:
    - host: localhost
    - user: postgres
    - password: postgres
    - dbname: pratum


Se estiver usando VSC abre ao workspace
 `pratum.code-workspace`


Para usar a API no postman importe a coleção
`SIGA.postman_collection.json`


Usuários de teste
- concessionaria@pratum.com senha: teste123
- ocupante@pratum.com senha: teste123


#links uteis

    - NextJS 14: https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating
    - CSS lib: https://ui.shadcn.com/docs/components/accordion


# Gerenciar containers

Recriar somente container do app, mantendo os dados banco `docker-compose up --build`

Recriar todos os containeres `docker-compose down`