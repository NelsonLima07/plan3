# Plan3 Backend

Backend do sistema de gestão empresarial Plan3.

## Tecnologias

- [Quarkus](https://quarkus.io/) 3.40.1
- [Kotlin](https://kotlinlang.org/)
- [Gradle](https://gradle.org/) com Gradlew (Kotlin DSL)
- [Hibernate ORM](https://hibernate.org/orm/) com [Panache](https://quarkus.io/guides/hibernate-orm-panache)
- [PostgreSQL](https://www.postgresql.org/)
- [Flyway](https://flywaydb.org/) para gerenciamento de migrações de banco de dados
- Arquitetura: **Repository Pattern**

## Estrutura

```
Backend/
├── src/main/kotlin/com/plan3/
│   ├── config/      # Configurações
│   ├── domain/      # Entidades JPA
│   ├── repository/  # Repositórios (Repository Pattern)
│   ├── resource/    # Endpoints REST
│   └── service/     # Regras de negócio
└── src/main/resources/
    ├── application.properties
    └── db/migration/  # Migrações Flyway (V*.sql)
```

## Configuração do Banco de Dados

As configurações são feitas via variáveis de ambiente ou `application.properties`:

| Variável | Padrão | Descrição |
|---|---|---|
| `DB_USERNAME` | `plan3` | Usuário do PostgreSQL |
| `DB_PASSWORD` | `plan3` | Senha do PostgreSQL |
| `DB_URL` | `jdbc:postgresql://localhost:5432/plan3` | URL de conexão JDBC |
| `HTTP_PORT` | `8080` | Porta HTTP da aplicação |

## Migrações (Flyway)

- Migrações ficam em `src/main/resources/db/migration/`
- Padrão de nomenclatura: `V{versao}__{descricao}.sql` (ex: `V1__init.sql`)
- Flyway executa automaticamente na inicialização (`migrate-at-start=true`)

## Build e Execução

### Desenvolvimento (modo dev)

```bash
./gradlew quarkusDev
```

### Build

```bash
./gradlew build
```

### Executar JAR

```bash
java -jar build/quarkus-app/quarkus-run.jar
```

### Build nativo (opcional)

```bash
./gradlew build -Dquarkus.native.enabled=true
```

## Documentação

- [Quarkus Guides](https://quarkus.io/guides/)
- [Hibernate ORM with Panache (Kotlin)](https://quarkus.io/guides/hibernate-orm-panache-kotlin)
- [Flyway](https://quarkus.io/guides/flyway)
- [Kotlin](https://quarkus.io/guides/kotlin)
