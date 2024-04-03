---
sidebar_position: 1
title: Overview
---

# Overview

In the context of HIP CDR, HIP EHRbase is enhanced by a set of Spring Boot native enterprise features

This way, HIP EHRbase enhances the open source version of EHRbase by providing additional functionalities in the following areas:

- **[ATNA Logging](02_atna.md)**: The IHE ATNA (Audit Trail and Node Authentication) Profile defines various measures on system security. The EHRbase ATNA Logging Plugin implements the logging specification of the profile which uses the Syslog protocol over TLS.

- **[Event Trigger](03_event_trigger.md)**: The Event Trigger feature allows to define criteria using the Archetype Query Language to extract and forward information to internal and external services whenever storing openEHR compositions. Protocols supported are HTTP and AMQP (RabbitMQ and Kafka).

- **[Transaction Compensation](04_transaction_compensation.md)**: Within HIP CDR, EHRbase is one among over 40 services. To ensure data integrity across the various services, HIP CDR implements the Saga Pattern for distributed transactions. The Transaction Compensation Plugin (based on Rabbit MQ) allows to orchestrate transactions (e.g., rollbacks) across the services.

- **[Multi-Tenancy](05_multi_tenancy.md)**: HIP CDR is designed as Software as a Service (SaaS) and provides multi-tenancy capabilities across its services. The Multi-Tenancy Plugin allows the HIP CDR Tenant Management to create, update, and delete tenants in EHRbase.

