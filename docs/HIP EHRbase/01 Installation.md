---
sidebar_position: 2
title: Installation
---

# HIP EHRbase Installation

Typically, HIP EHRbase will be packed along with HIP CDR and should be installed as part of the overall installation process. For the case that CDR Base should be operated as a stand-alone application, you can follow the instructions below.

HIP EHRbase is provided as a Docker container or via HELM chart configuration. Please ensure that credentials for the artifact repository (vitagroup Harbor) have been provided as part of the contract agreements.

## Setup YugabyteDB

Before HIP EHRbase can be run, a YugabyteDB database needs to be set up and configured. Follow the instructions for [YugabyteDB](https://docs.yugabyte.com) installation. Please note that the YugabyteDB configuration will highly depend on your project and system requirements.

You are provided with a database installation script `createdb.sql`. This script needs to be run as a role `superuser` in order to create the database.

Extensions are installed in a separate schema called 'ext'.

For production servers, these operations should be performed by a configuration management system.

On NIX run this using:

```bash
sudo -u postgres psql < createdb.sql
```

You only have to run this script once. It only contains those operations which require superuser privileges. The actual database schema is managed by flyway, which will automatically be executed the first time CDR Base is connected to YugabyteDB.

## Docker

EHRbase is delivered as a single Docker container including all plugins (Please note that for the current release of EHRbase running on YugabyteDB, only ATNA Logging and Event Trigger Plugins are packaged).

### Prerequisites

- A YugabyteDB is available and is pre-configured in accordance with the steps described above.
- A recent version of a Docker runtime environment (e.g., Docker, Rancher, Colima, etc.)

### Parameters

To set parameters of HIP EHRbase and the plugins, the default environment variables can be overwritten. Check the next example (which assumes you pulled or created an image named ehrbase/ehrbase):

```bash
docker run -e DB_URL=jdbc:postgresql://ehrdb:5432/ehrbase \
       -e DB_USER=foouser \
       -e DB_PASS=foopass \
       -e SERVER_NODENAME=what.ever.org \
       ehrbase/ehrbase
```

Note that while there are parameters for the plugin system, these are rarely of use for the installation as these are set as default values of the docker image provided.

| Parameter                        | Env Variable                      | Use                                                                    | Example            |
|----------------------------------|-----------------------------------|------------------------------------------------------------------------|--------------------|
| plugin-manager.enable            | PLUGIN_MANAGER_ENABLE             | Enable and disable plugins                                             | "true"             |
| manager.plugin-dir               | PLUGIN_MANAGER_PLUGIN_DIR         | Directory of the plugins                                               | "/plugin_dir"      |
| plugin-manager.plugin-config-dir | PLUGIN_MANAGER_PLUGIN_CONFIG_DIR  | Directory of the plugin configuration file (containing default values) | /plugin_config_dir |

Here you can find some example settings for common use cases for the usage of EHRbase Docker containers. You can also use the environment variables with the normal .jar execution by setting the variables according to your operating system.

### Use BASIC auth

Run the docker image with this setting:

```bash
docker run --network ehrbase-net --name ehrbase -e SECURITY_AUTHTYPE=BASIC \
-e SECURITY_AUTHUSER=myuser -e SECURITY_AUTHPASSWORD=ThePasswordForUser \
-e SECURITY_AUTHADMINUSER=myadmin -e SECURITY_AUTHADMINPASSWORD=SecretAdminPassword \
-d -p 8080:8080 ehrbase/ehrbase:latest
```

This will set the used authentication method to BASIC auth, and all requests against the EHRbase must be provided with the Authorization header set to `Basic %username%:%password%` whereas the username and password must be encoded with base64.

> **Note:**
> 
> Ensure you use an encrypted connection over https; otherwise, the username and password can be decrypted easily.

### Use OAuth2

Run the docker image with this setting:

```bash
docker run --network ehrbase-net --name ehrbase -e SECURITY_AUTHTYPE=OAUTH \
-e SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_ISSUERURI=https://keycloak.example.com/auth/realms/ehrbase \
-d -p 8080:8080 ehrbase/ehrbase:latest
```

You have to prepare the authentication server, including a valid client at the target server to get this setup run.

## HELM Chart

A Helm chart can be used to install CDR Base in a Kubernetes or OpenShift cluster.

### Latest Version

- Helm: 0.28.0-early-access-v2
- Docker: 0.28.0-

early-access-v2

### Prerequisites

- A YugabyteDB is available and is pre-configured in accordance with the steps described above.
- Kubernetes 1.20+
- Helm 3.2.0+

### Access

- Docker image: `registry.vitasystems.dev/ibm-docker/ehrbase-enterprise-openshift`
- Helm chart: `registry.vitasystems.dev/ibm-helm/ehrbase-openshift`

### Installing the Chart

Adding the needed chart repository:

```bash
$ helm repo add ... <<< TODO: which repo has to be added for an external user?
```

Install the EHRbase helm chart with a Yugabyte database with a release name `ehrbase-openshift` in the Kubernetes context `mykubecontext` and the namespace `myinstallnamespace`:
Update `values.yaml` and mark `yugabyte.enabled: true`

```bash
$ helm install --kube-context mykubecontext -n myinstallnamespace -f values.yaml ehrbase-openshift .
```

### Uninstalling the Chart

To uninstall the deployment with a release name `ehrbase-openshift` in the Kubernetes context `mykubecontext` and the namespace `myinstallnamespace`:

```bash
$ helm uninstall --kube-context mykubecontext -n myinstallnamespace ehrbase-openshift
```

### Running Against an Existing YugabyteDB Instance

When disabling Yugabyte from this helm chart and running against an existing YugabyteDB instance, the init DB script that creates the users and DB has to be executed manually against YugabyteDB.

Open `config/db_setup.sql` and change the `GO` placeholders with concrete values

- `${EHRBASE_DB_USER}` and `${EHRBASE_DB_PASSWORD}` - credentials of the ehrbase user that reads/writes data
- `${EHRBASE_DB_USER_ADMIN}` and `${EHRBASE_DB_PASSWORD_ADMIN}` - credentials of the ehrbase user that manages the schema

Execute the updated script against YugabyteDB.

## Parameters

### Global Parameters

| Name                                           | Description                                                   | Value                           |
|------------------------------------------------|---------------------------------------------------------------|---------------------------------|
| `global.baseDomain`                            | Domain value for EHRbase ingress settings                     | `"ehrbase.org"`                 |
| `global.internalImagePullSecrets.ehrbaseImagePullSecret` | Secret for pulling the ehrbase image from the docker registry | `ehrbase`                       |
| `global.hosts.ehrbase`                         | EHRbase host to be used for ingress                           | `ehrbase.{{ .Values.global.baseDomain }}` |
| `global.tlsSecrets.ehrbase`                    | Secret name for the the host certificate                      | `vitasystems-dev`               |
| `global.initContainer.enabled`                 | Toggle the init container of the DB. To be set to `false` if the DB init is done manually. | `true`                          |

### CDR Base Application Parameters

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
| `appConfig.at

na.host`                      | Host of the ATNA logs registry                                      | `hip-logging`                              |
| `appConfig.atna.port`                      | Port of the ATNA logs registry                                      | `514`                                      |
| `appConfig.restApiDoc.enabled`             | Enables the built-in REST API documentation like swagger ui and api doc | `false`                              |
| `appConfig.restApiDoc.swaggerUi.enabled`   | Enables the Swagger ui for the EHRbase REST API                     | `false`                                    |
| `appConfig.restApiDoc.apiDocs.enabled`     | Enables the OpenAPI documentation                                   | `false`                                    |
| `replicaCount`                             | Number of EHRbase replicas to deploy                                | `1`                                        |

### Image Parameters

| Name             | Description                | Value                              |
|------------------|----------------------------|------------------------------------|
| `image.repository` | EHRbase image repository   | `ehrbase/ehrbasemvp`               |
| `image.pullPolicy` | EHRbase image pull policy  | `Always`                           |
| `image.tag`        | EHRbase image tag          | `early-access-openshift-2`         |

### Service Parameters

| Name              | Description                | Value       |
|-------------------|----------------------------|-------------|
| `service.type`    | EHRbase service type       | `ClusterIP` |
| `service.port`    | EHRbase service port       | `8080`      |
| `service.targetPort` | EHRbase service target port | `8080`    |
| `service.protocol` | EHRbase service protocol   | `TCP`       |
| `service.name`    | EHRbase service name       | `http`      |

### YugabyteDB Parameters

| Name                                 | Description                                      | Value     |
|--------------------------------------|--------------------------------------------------|-----------|
| `yugabyte.enabled`                   | Toggle for choosing database deployment          | `false`   |
| `yugabyte.storage.master.size`       | Storage size of the Yugabyte master database     | `5Gi`     |
| `yugabyte.storage.master.storageClass` | Storage class of the Yugabyte master database   | `""`      |
| `yugabyte.storage.tserver.size`      | Storage size of the Yugabyte tserver database    | `5Gi`     |
| `yugabyte.storage.tserver.storageClass` | Storage class of the Yugabyte tserver database | `""`      |
| `yugabyte.enableLoadBalancer`        | Toggle to activate/deactivate the Yugabyte load balancer | `false` |
| `yugabyte.gflags.master.minloglevel` | Configure log level for Yugabyte master node     | `2`       |
| `yugabyte.gflags.tserver.minloglevel` | Configure log level for Yugabyte tserver nodes  | `2`       |
| `yugabyte.authCredentials.ysql.user` | User name of the main Yugabyte YSQL user         | `yugabyte`|
| `yugabyte.authCredentials.ysql.password` | Password of the main Yugabyte YSQL user       | `yugabyte`|

--- 

This translation maintains the structure and content of the original RST document, adapting it to Markdown syntax.