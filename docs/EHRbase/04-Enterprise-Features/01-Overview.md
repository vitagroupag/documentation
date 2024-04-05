---
title: Overview
---

# Overview

In the context of HIP CDR, HIP EHRbase is enhanced by a set of Spring Boot native enterprise features

This way, HIP EHRbase enhances the open source version of EHRbase by providing additional functionalities in the following areas:
- **[Yugabyte](02-Yugabyte.md)**: Yugabyte provides a PostgreSQL-compatible highly scalable, distributed SQL database that delivers strong consistency and resilience for mission-critical applications across global deployments.
- **[ATNA Logging](03-ATNA.md)**: The IHE ATNA (Audit Trail and Node Authentication) Profile defines various measures on system security. The EHRbase ATNA Logging Plugin implements the logging specification of the profile which uses the Syslog protocol over TLS.
- **[Event Trigger](04-Event-Trigger.md)**: The Event Trigger feature allows to define criteria using the Archetype Query Language to extract and forward information to internal and external services whenever storing openEHR compositions. Protocols supported are HTTP and AMQP (RabbitMQ and Kafka).
- **[Transaction Compensation](05-Transaction-Compensation.md)**: Within HIP CDR, EHRbase is one among over 40 services. To ensure data integrity across the various services, HIP CDR implements the Saga Pattern for distributed transactions. The Transaction Compensation Plugin (based on Rabbit MQ) allows to orchestrate transactions (e.g., rollbacks) across the services.
- **[Multi-Tenancy](06-Multi-Tenancy.md)**: HIP CDR is designed as Software as a Service (SaaS) and provides multi-tenancy capabilities across its services. The Multi-Tenancy Plugin allows the HIP CDR Tenant Management to create, update, and delete tenants in EHRbase.
