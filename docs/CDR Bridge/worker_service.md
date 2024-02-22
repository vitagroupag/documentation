---
sidebar_position: 5
title: Mapping Worker Service
---

# Mapping Worker Service

The Mapping Worker Service is resposible to execute mappings for specific tenants. It analyzes the payload that is being send to the connectors and checks for conditions defined in mapping files.

In the case of an incoming HL7v2 message, potentially multiple mappings will be applied


## Transaction Compensation

The Mapping Worker Service is also responsible to ensure the integrity of data. The services ensures that all transactions related to a message are successfully executed within the particular services (Binary Store, FHIR Server, HIP EHRbase). If one of the transactions fail, a rollback is being executed across all services involved and an error message is provided to the sending system. 

![Transaction Compensation Overview](/img/bridge/transaction_compensation.png)