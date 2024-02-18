# Overview

In the context of HIP CDR, EHRbase is enhanced by a Plugin-System based on the PF4J plugin framework. In some cases, this approach is complemented by Spring Boot-native functionality when appropriate. The Plugin-System allows to enhance EHRbase’s features without a need to fork its code basis. The following figure shows the conceptual view of the Plugin-System.

![Plugin System](/img/plugin_system.png)

This way, the Plugin-System enhances the open source version of EHRbase by providing additional functionalities in the following areas:

- **ATNA Logging**: The IHE ATNA (Audit Trail and Node Authentication) Profile defines various measures on system security. The EHRbase ATNA Logging Plugin implements the logging specification of the profile which uses the Syslog protocol over TLS.

- **Event Trigger**: The Event Trigger Plugin allows to define criteria using the Archetype Query Language to extract and forward information to internal and external services whenever storing openEHR compositions. Protocols supported are HTTP and AMQP (RabbitMQ and Kafka).

- **Transaction Compensation**: Within HIP CDR, EHRbase is one among over 40 services. To ensure data integrity across the various services, HIP CDR implements the Saga Pattern for distributed transactions. The Transaction Compensation Plugin (based on Rabbit MQ) allows to orchestrate transactions (e.g., rollbacks) across the services.

- **Multi-Tenancy**: HIP CDR is designed as Software as a Service (SaaS) and provides multi-tenancy capabilities across its services. The Multi-Tenancy Plugin allows the HIP CDR Tenant Management to create, update, and delete tenants in EHRbase.

