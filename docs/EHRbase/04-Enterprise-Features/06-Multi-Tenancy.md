---
title: Multi-Tenancy
description: HIP is designed as Software as a Service (SaaS) and provides multi-tenancy capabilities across its services. The Multi-Tenancy Plugin allows the HIP Tenant Management to create, update, and delete tenants in EHRbase.
---

# Multi-Tenancy

HIP is built as a multi-tenant capable system. Multi-tenancy is promoted across nearly all services including EHRbase, HIP Bridge, HIP Suite, and other components. The logical separation of data is achieved using dedicated schemas for each tenant on the database level, complemented by OAuth2 authentication workflows in Keycloak.

Please note that the Multi-Tenancy feature has been developed with the integration into the HIP platform in mind. This means that there are dependencies towards Keycloak and its multi-tenancy concept, which is based on the concept of realms in Keycloak (in which realms are used to represent a tenant).

For the case you want to use multi-tenancy in EHRbase outside the context of HIP, please be aware of these dependencies.

## Configuration

| Property               | Env Variable                    | Use                   | Example          |
|------------------------|---------------------------------|-----------------------|------------------|
| `multitenancy.enabled` | `MULTITENANCY_ENABLED`          | Enables multi-tenancy | `true`           |

> **Attention:** Enabling multi-tenancy will create additional schemas for each new tenant. Enabling it for an already running system should be done after carefuly considering migrating of the existing data.

## REST API

For managing tenants through the REST API checkout the [Multi-Tenant API Definition](/api/hip-ehrbase/enterprise#tag/Multi-tenant)
