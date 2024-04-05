---
title: Transaction Compensation
description: Within HIP CDR, EHRbase is one among over 40 services. To ensure data integrity across the various services, HIP CDR implements the Saga Pattern for distributed transactions. The Transaction Compensation Plugin (based on Rabbit MQ) allows to orchestrate transactions (e.g., rollbacks) across the services.
---

# Transaction Compensation

As HIP CDR follows a service-oriented architecture, distributed transactions across services are required. The Transaction Compensation feature allows rolling back transactions in accordance with the Saga Pattern.

For this purpose, a REST API can be used by external services to invoke the transaction compensation functions.

The transaction compensation uses the openEHR Contribution objects for the rollback.

:::note
In combination with [multi-tenancy](06-Multi-Tenancy.md), the transaction compensations are tenant bound.
:::

## Parameters / Environment Variables

The Transaction Compensation feature does not need any parameters to be provided.

## REST API

### Execute Rollback

```http
GET {{ehrbase-url}}/ehrbase/rest/admin/ehr/{ehr_id}/contribution/{contribution_id}/rollback HTTP/1.1
Host: localhost:8080

HTTP/1.1 200 OK
Vary: Accept
```

**Status Codes:**
- `200`: Contribution was successfully rolled back
- `500`: Internal system error. The whole compensation transaction is rolled back

## Dealing with Parallel Access

Before starting the rollback, the `ehr_id`, `contribution_id`, and `status` will be saved in a DB. If there already is an entry with the same `ehr_id` but status not finished, then the thread will block until it is set to finished or it will time out.

## Rollback Algorithm

The objects in the contribution are rolled back:
- In a serial way,
- In inverse order, and
- In one database transaction.

If at any point an exception representing a `501` or `500` happens, the whole compensation transaction is rolled back. If all objects have been rolled back successfully, the respective contribution object is deleted from the database.