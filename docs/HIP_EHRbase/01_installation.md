---
sidebar_position: 1
title: Installation
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="database-provider">
<TabItem value="postgres" label="Postgres">

# EHRbase Installation

EHRbase by default is built with Postgres support.

The easiest way to get started with it is by spaning an ehrbase-postgres database and an ehrbase instance using Docker.

## Setup PostgresDB

A preconfigured Postgres DB can be set spaned using the https://hub.docker.com/r/ehrbase/ehrbase-postgres image.

```bash
docker run --network ehrbase-net --name ehrbase-postgres \
-e POSTGRES_USER=postgres \
-e PASSWORD=postgres \
-e EHRBASE_USER=ehrbase_restricted \
-e EHRBASE_PASSWORD=ehrbase_restricted \
-e EHRBASE_USER_ADMIN=ehrbase \
-e EHRBASE_PASSWORD_ADMIN=ehrbase \
-d -p 5432:5432 \
ehrbase/ehrbase-postgres:16.2
```

## Start EHRbase

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

This will start ehrbase without any Authentication mechanism configured. See the [Security](03_explore/04_security.md) section for details on how to configure security.

## Parameters

EHRbase supports a wide range of configurations. Some of them you can find in the Explore section, and for others, you can check out the [configuration](https://github.com/ehrbase/ehrbase/tree/develop/configuration) module in GitHub.

</TabItem>
<TabItem value="yugabyte" label="Yugabyte">

# HIP EHRbase Installation

Typically, HIP EHRbase will be packed along with HIP CDR and should be installed as part of the overall installation process. For the case that HIP EHRbase should be operated as a stand-alone application, you can follow the instructions below.

HIP EHRbase is provided as a Docker container or via HELM chart configuration.

## Setup YugabyteDB

Before HIP EHRbase can be run, a YugabyteDB database needs to be set up and configured. Follow the instructions for [YugabyteDB](https://docs.yugabyte.com) installation. Please note that the YugabyteDB configuration will highly depend on your project and system requirements.

You are provided with a database installation script `createdb.sql`. This script needs to be run as a role `superuser` in order to create the database.

Extensions are installed in a separate schema called `ext`.

For production servers, these operations should be performed by a configuration management system.

You only have to run this script once. It only contains those operations which require superuser privileges. The actual database schema is managed by flyway, which will automatically be executed the first time CDR Base is connected to YugabyteDB.

## Docker

EHRbase is delivered as a single Docker container including all plugins (Please note that for the current release of EHRbase running on YugabyteDB, only ATNA Logging and Event Trigger Plugins are packaged).

### Prerequisites

- A YugabyteDB is available and is pre-configured in accordance with the steps described above.
- A recent version of a Docker runtime environment (e.g., Docker, Rancher, Colima, etc.)

### Parameters

To set parameters of HIP EHRbase and the plugins, the default environment variables can be overwritten. Check the next example (which assumes you pulled or created an image named ehrbase/ehrbase):

```bash
docker run --network ehrbase-net --name ehrbase \
-e EHRBASE_DBMSPROVIDER=YUGABYTE \
-e DB_URL=jdbc:postgresql://ehrdb:5433/ehrbase \
-e DB_USER=ehrbase_restricted \
-e DB_PASS=ehrbase_restricted \
-e DB_USER_ADMIN=ehrbase \
-e DB_PASS_ADMIN=ehrbase \
-e SERVER_NODENAME=local.ehrbase.org \
-e SPRING_PROFILES_ACTIVE=local \
-d -p 8080:8080 \
ehrbase/ehrbase
```

Here you can find some example settings for common use cases for the usage of EHRbase Docker containers. You can also use the environment variables with the normal .jar execution by setting the variables according to your operating system.

### Use BASIC auth

Run the docker image with this setting:

```bash
docker run --network ehrbase-net --name ehrbase \
-e EHRBASE_DBMSPROVIDER=YUGABYTE \
-e DB_URL=jdbc:postgresql://ehrdb:5433/ehrbase \
-e DB_USER=ehrbase_restricted \
-e DB_PASS=ehrbase_restricted \
-e DB_USER_ADMIN=ehrbase \
-e DB_PASS_ADMIN=ehrbase \
-e SERVER_NODENAME=local.ehrbase.org \
-e SPRING_PROFILES_ACTIVE=local \
-e SECURITY_AUTHTYPE=BASIC \
-e SECURITY_AUTHUSER=myuser \
-e SECURITY_AUTHPASSWORD=ThePasswordForUser \
-e SECURITY_AUTHADMINUSER=myadmin \
-e SECURITY_AUTHADMINPASSWORD=SecretAdminPassword \
-d -p 8080:8080 \
ehrbase/ehrbase
```

This will set the used authentication method to BASIC auth, and all requests against the EHRbase must be provided with the Authorization header set to `Basic %username%:%password%` whereas the username and password must be encoded with base64.

> **Note:** Ensure you use an encrypted connection over https; otherwise, the username and password can be decrypted easily.

### Use OAuth2

Run the docker image with this setting:

```bash
docker run --network ehrbase-net --name ehrbase \
-e EHRBASE_DBMSPROVIDER=YUGABYTE \
-e DB_URL=jdbc:postgresql://ehrdb:5433/ehrbase \
-e DB_USER=ehrbase_restricted \
-e DB_PASS=ehrbase_restricted \
-e DB_USER_ADMIN=ehrbase \
-e DB_PASS_ADMIN=ehrbase \
-e SERVER_NODENAME=local.ehrbase.org \
-e SPRING_PROFILES_ACTIVE=local \
-e SECURITY_AUTHTYPE=OAUTH \
-e SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_ISSUERURI=https://keycloak.example.com/auth/realms/ehrbase \
-d -p 8080:8080 \
ehrbase/ehrbase
```

You have to prepare the authentication server, including a valid client at the target server to get this setup run.

> **NOTE:** For more information regarding authentication checkout the [Security](03_explore/04_security.md) section.

## HELM Chart

A Helm chart can be used to install HIP EHRbase in a Kubernetes or OpenShift cluster.

### Prerequisites

- A YugabyteDB is available and is pre-configured in accordance with the steps described above.
- Kubernetes 1.20+
- Helm 3.2.0+

### Installing the Chart

Adding the needed chart repository:

```bash
$ helm repo add ... <<< TODO: which repo has to be added for an external user?
```

Install the EHRbase helm chart with a Yugabyte database with a release name `ehrbase-kube` in the Kubernetes context `mykubecontext` and the namespace `myinstallnamespace`:
Update `values.yaml` and mark `yugabyte.enabled: true`

```bash
$ helm install --kube-context mykubecontext -n myinstallnamespace -f values.yaml ehrbase-kube .
```

### Uninstalling the Chart

To uninstall the deployment with a release name `ehrbase-kube` in the Kubernetes context `mykubecontext` and the namespace `myinstallnamespace`:

```bash
$ helm uninstall --kube-context mykubecontext -n myinstallnamespace ehrbase-kube
```

### Running Against an Existing YugabyteDB Instance

When disabling Yugabyte from this helm chart and running against an existing YugabyteDB instance, the init DB script that creates the users and DB has to be executed manually against YugabyteDB.

Open `config/db_setup.sql` and change the `GO` placeholders with concrete values

- `${EHRBASE_DB_USER}` and `${EHRBASE_DB_PASSWORD}` - credentials of the ehrbase user that reads/writes data
- `${EHRBASE_DB_USER_ADMIN}` and `${EHRBASE_DB_PASSWORD_ADMIN}` - credentials of the ehrbase user that manages the schema

Execute the updated script against YugabyteDB.

### Parameters

#### Global Parameters

| Name                                           | Description                                                   | Value                           |
|------------------------------------------------|---------------------------------------------------------------|---------------------------------|
| `global.baseDomain`                            | Domain value for EHRbase ingress settings                     | `"ehrbase.org"`                 |
| `global.internalImagePullSecrets.ehrbaseImagePullSecret` | Secret for pulling the ehrbase image from the docker registry | `ehrbase`                       |
| `global.hosts.ehrbase`                         | EHRbase host to be used for ingress                           | `ehrbase.{{ .Values.global.baseDomain }}` |
| `global.tlsSecrets.ehrbase`                    | Secret name for the the host certificate                      | `vitasystems-dev`               |
| `global.initContainer.enabled`                 | Toggle the init container of the DB. To be set to `false` if the DB init is done manually. | `true`                          |

#### Application Parameters

This general overview of available CDR Base parameters is complemented by additional parameters within dedicated chapters of this documentation (for example, for configuration with an external terminology service).

| Name                                       | Description                                                         | Value                                      |
|--------------------------------------------|---------------------------------------------------------------------|--------------------------------------------|
| `appConfig.database.dbName`                | Name of the EHRbase database                                        | `ehrbase`                                  |
| `appConfig.database.adminUsername`         | Name of the EHRbase admin user                                      | `ehrbase`                                  |
| `appConfig.database.dbUser`                | Name of the EHRbase database user                                   | `ehrbase_restricted`                       |
| `appConfig.database.dbPort`                | Port of the EHRbase database server                                 | `5433`                                     |
| `appConfig.database.dbHostname`            | Host of the EHRbase database                                        | `yb-tservers`                              |
| `appConfig.database.dbDriver`              | Database driver to use                                              | `"jdbc:yugabytedb"`                        |
| `appConfig.database.dbAdditionalParameter` | Additional parameter to use for EHRbase database URL (used for Yugabyte) | `"?load-balance=true"`                |
| `appConfig.cacheEnabled`                   | Toggle to activate/deactivate EHRbase caching mechanisms            | `true`                                     |
| `appConfig.adminApiActive`                 | Toggle to activate/deactivate EHRbase admin API                     | `true`                                     |
| `appConfig.serviceUrl`                     | External EHRbase URL used for ingress setup                         | `"hip-cdr-core-ehrbase-enterprise-{{ .Release.Namespace }}.{{ .Values.domain }}"` |
| `appConfig.commonFullnameOverride`         | EHRbase service name (also used for naming of EHRbase database service) | `hip-cdr-core-ehrbase-enterprise`      |
| `appConfig.atna.enabled`                   | Enables ATNA logs                                                   | `false`                                    |
| `appConfig.atna.host`                      | Host of the ATNA logs registry                                      | `hip-logging`                              |
| `appConfig.atna.port`                      | Port of the ATNA logs registry                                      | `514`                                      |
| `appConfig.restApiDoc.enabled`             | Enables the built-in REST API documentation like swagger ui and api doc | `false`                              |
| `appConfig.restApiDoc.swaggerUi.enabled`   | Enables the Swagger ui for the EHRbase REST API                     | `false`                                    |
| `appConfig.restApiDoc.apiDocs.enabled`     | Enables the OpenAPI documentation                                   | `false`                                    |
| `replicaCount`                             | Number of EHRbase replicas to deploy                                | `1`                                        |

#### Image Parameters

| Name               | Description                | Value                    |
|--------------------|----------------------------|--------------------------|
| `image.repository` | EHRbase image repository   | `ehrbase/ehrbase`        |
| `image.pullPolicy` | EHRbase image pull policy  | `Always`                 |
| `image.tag`        | EHRbase image tag          | `latest`                 |

#### Service Parameters

| Name                 | Description                 | Value       |
|----------------------|-----------------------------|-------------|
| `service.type`       | EHRbase service type        | `ClusterIP` |
| `service.port`       | EHRbase service port        | `8080`      |
| `service.targetPort` | EHRbase service target port | `8080`      |
| `service.protocol`   | EHRbase service protocol    | `TCP`       |
| `service.name`       | EHRbase service name        | `http`      |

#### YugabyteDB Parameters

| Name                                     | Description                                              | Value     |
|------------------------------------------|----------------------------------------------------------|-----------|
| `yugabyte.enabled`                       | Toggle for choosing database deployment                  | `false`   |
| `yugabyte.storage.master.size`           | Storage size of the Yugabyte master database             | `5Gi`     |
| `yugabyte.storage.master.storageClass`   | Storage class of the Yugabyte master database            | `""`      |
| `yugabyte.storage.tserver.size`          | Storage size of the Yugabyte tserver database            | `5Gi`     |
| `yugabyte.storage.tserver.storageClass`  | Storage class of the Yugabyte tserver database           | `""`      |
| `yugabyte.enableLoadBalancer`            | Toggle to activate/deactivate the Yugabyte load balancer | `false`   |
| `yugabyte.gflags.master.minloglevel`     | Configure log level for Yugabyte master node             | `2`       |
| `yugabyte.gflags.tserver.minloglevel`    | Configure log level for Yugabyte tserver nodes           | `2`       |
| `yugabyte.authCredentials.ysql.user`     | User name of the main Yugabyte YSQL user                 | `yugabyte`|
| `yugabyte.authCredentials.ysql.password` | Password of the main Yugabyte YSQL user                  | `yugabyte`|
--- 

</TabItem>
</Tabs>