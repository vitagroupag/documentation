---
sidebar_position: 0
---

# Overview

The CDR Bridge provides a configurable facade for healthcare data over HIP CDR's openEHR, FHIR and binary databases. A mapping language called Protocol Specific Path Language (PSPL) allows to flexibly map between varios formats including HL7v2, FHIR and openEHR.

The following diagram provides an overview of its main components:

```
                         ┌─────────────────────┐
                         │       MAPPING       │
                         │    CONFIG SERVICE   │
                         └─────────────────────┘
                                    ▲
                                    │
                                    ▼
┌───────────────┐        ┌─────────────────────┐        ┌───────────────┐        ┌───────────────┐
│     FHIR      │        │                     │        │    EHRBASE    │        │    EHRBASE    │
│   CONNECTOR   ◀────────▶                     ◀────────▶     PROXY     ◀────────▶     STORE     │
└───────────────┘        │       MAPPING       │        └───────────────┘        └───────────────┘
                         │       WORKER        │
┌───────────────┐        │       SERVICE       │        ┌───────────────┐        ┌───────────────┐
│     HL7v2     ◀────────▶                     ◀────────▶  DEMOGRAPHIC  ◀────────▶  DEMOGRAPHIC  │
│   CONNECTOR   │        │                     │        │     PROXY     │        │     STORE     │
└───────────────┘        └─────────────────────┘        └───────────────┘        └───────────────┘
```

**Connectors** are the main entry points for requests and data in the various supported source protocols (e.g. HL7 v2, HL7 FHIR, etc). These are relatively thin components that communicate asynchronously with the core of the CDR Bridge via (RabbitMQ) messaging.

The **Mapping Config Service** stores and provides mappings separately for each HIP CDR tenant. Its services are exposed through a [REST API](/api/cdr-bridge/mappings). Every change in the mapping is stored versioned in the mapping database.

Messages are picked up by the **Mapping Worker Service** for tenant-specific processing. This can involve creating new data or retrieving existing data from store. The worker uses (bi-directional) mappings specified in PSPL to either map from the source protocol to FHIR (mostly demographics data) and/or openEHR (mostly medical data) or the opposite. Although the idea is that these mappings are specified by the customer, some proposals for built-in mappings are being developed internally, especially for messages that trigger system behavior like ADT.

Communication with the storage layer is also done asynchronously: the worker posts messages which are then handled by the proxies (see Communication between worker and proxies). The Mapping Worker Service is also responsible to orchestrate transactions between the different services. If one of the services fils to process and store the data, a rollback is conducted for the transaction across all services involved. 

Authentication and authorization is controlled using Keycloak Authorization Services and is further described in API Authentication & Authorization.

