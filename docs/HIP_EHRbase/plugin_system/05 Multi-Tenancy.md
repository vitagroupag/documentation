# Multi-Tenancy Plugin

HIP CDR is built as a multi-tenant capable system. Multi-tenancy is promoted across nearly all services including EHRbase, CDR Bridge, CDR Suite, and other components. The logical separation of data is achieved using Row-Level-Security (RLS) on the database level, complemented by OAuth2 authentication workflows in Keycloak.

Please note that the Multi-Tenancy Plugin has been developed with the integration into the HIP CDR platform in mind. This means that there are dependencies towards Keycloak and its multi-tenancy concept, which is based on the concept of realms in Keycloak (in which realms are used to represent a tenant).

For the case you want to use multi-tenancy in EHRbase outside the context of HIP CDR, please be aware of these dependencies.

## Parameters / Environment Variables

The Transaction Compensation Plugin does not need any parameters to be provided.

## REST API

### Create Tenant

```http
POST {{ehrbase-url}}ehrbase/plugin/multi-tenant/service HTTP/1.1
Host: localhost:8080
Accept: application/json, text/javascript
Content-Type: application/json

{
   "tenantId": "550e8400-e29b-41d4-a716-446655440000",
   "tenantName": "London",
   "tenantProperties": {
      "host": "https://hip-keycloak-hip-lab-integration.vitasystems.dev",
      "realm": "London",
      "client-id": "HIP-CDR-EHRbase-Service"
   }
}
```

**Example response**:

```http
HTTP/1.1 200 OK
Vary: Accept
```

`200`: No error. The tenant was created successfully  
`401`: A tenant with an identical uuid already exists in CDR Base  
`500`: Internal system error

### Retrieve Tenant

```http
GET {{ehrbase-url}}ehrbase/plugin/multi-tenant/service/ HTTP/1.1
Host: localhost:8080
```

**Example response**:

```http
HTTP/1.1 200 OK
Vary: Accept
```

`200`: Event Trigger was successfully retrieved  
`404`: No Event Triggers were found  
`500`: Internal system error

### Delete Tenant

```http
DELETE {{ehrbase-url}}ehrbase/plugin/multi-tenant/service/{{tenant_id}} HTTP/1.1
Host: localhost:8080
```

**Example response**:

```http
HTTP/1.1 200 OK
Vary: Accept
```

`200`: Tenant was successfully deleted  
`404`: No tenant with given uuid was found  
`500`: Internal system error