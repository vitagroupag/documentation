---
sidebar_position: 1
title: Installation
tags: 
  - quick-start
---

:::tip
The fastest way to get started with EHRbase and openEHR is the **EHRbase Sandbox** available at https://sandkiste.ehrbase.org/.
:::

# EHRbase Installation

EHRbase by default is built against Postgres.

The easiest way to get started with it locally is by spinning up an EHRbase Postgres database and an EHRbase instance using Docker.

### Start PostgresDB

A preconfigured Postgres DB can be spun up using the https://hub.docker.com/r/ehrbase/ehrbase-v2-postgres/tags image.

```bash
docker run --network ehrbase-net --name ehrbase-postgres \
-e POSTGRES_USER=postgres \
-e PASSWORD=postgres \
-e EHRBASE_USER=ehrbase_restricted \
-e EHRBASE_PASSWORD=ehrbase_restricted \
-e EHRBASE_USER_ADMIN=ehrbase \
-e EHRBASE_PASSWORD_ADMIN=ehrbase \
-d -p 5432:5432 \
ehrbase/ehrbase-v2-postgres:16.2
```

### Start EHRbase

To start EHRbase you can simply use the Docker image provided at https://hub.docker.com/r/ehrbase/ehrbase

```bash
docker run --network ehrbase-net --name ehrbase \
-e DB_URL=jdbc:postgresql://ehrbase-postgres:5432/ehrbase \
-e DB_USER=ehrbase_restricted \
-e DB_PASS=ehrbase_restricted \
-e DB_USER_ADMIN=ehrbase \
-e DB_PASS_ADMIN=ehrbase \
-e SERVER_NODENAME=local.ehrbase.org \
-e SPRING_PROFILES_ACTIVE=local \
-d -p 8080:8080 \
ehrbase/ehrbase
```

This will start EHRbase without any Authentication mechanism configured. See the [Security](03-Explore/04-Security.md) section for details on how to configure security.

To check that EHRbase has started, open a browser and access http://localhost:8080/ehrbase and you should see the welcome page.

#### Parameters

EHRbase supports a wide range of configurations. Some of them you can find in the [Explore](/docs/category/explore) section, and for others, you can check out the [configuration](https://github.com/ehrbase/ehrbase/tree/develop/configuration) module in GitHub.
