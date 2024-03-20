.. _plugin_system_multi_tenancy:

********************
Multi-Tenancy Plugin
********************

HIP CDR is built as a multi-tenant capable system. Multi-tenancy is promoted across nearly all services
including EHRbase, CDR Bridge, CDR Suite and other components. The logical separation of data is achieved
using Row-Level-Security (RLS) on database level, complemented by OAuth2 authentication workflows in Keycloak.

Please note that the Multi-Tenancy Plugin has been developed with the integration into the HIP CDR platform in mind.
This means that there are dependencies towards Keycloak and its multi-tenancy concept, which is based on the concept
of realms in Keycloak (in which realms are used to represent a tenant).

For the case you want to use multi-tenancy in EHRbase outside the context of HIP CDR,
please be aware of these dependencies.


Parameters / Environment Variables
----------------------------------

The Transaction Compensation Plugin does not need any parameters to be provided.


REST API
--------

Create Tenant
^^^^^^^^^^^^^

.. http:post:: {{ehrbase-url}}ehrbase/plugin/multi-tenant/service

   Creates a new tenant in CDR Base

   **Example request**:

   .. sourcecode:: http

      POST /ehrbase/plugin/event-trigger/service HTTP/1.1
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

   **Example response**:

   .. sourcecode:: http

      HTTP/1.1 200 OK
      Vary: Accept

   :statuscode 200: No error. The tenant was created successfully
   :statuscode 401: A tenant with an identical uuid already exists in CDR Base
   :statuscode 500: Internal system error.


.. list-table::
   :name: Description of attributes
   :widths: 30 40 30
   :header-rows: 1

   * - Attribute
     - Meaning
     - Example
   * - tenantId
     - Identifier of the tenant that should be used across all services of the tenant
     - “550e8400-e29b-41d4-a716-446655440000”
   * - tenantName
     - Human readable name of the tenant
     - “London”
   * - tenantProperties.host
     - Keycloak URI
     - "https://hip-keycloak-hip-lab-integration.vitasystems.dev"
   * - tenantProperties.realm
     - Keycloak realm of the tenant (typically identical to the tenant name)
     - “London”
   * - tenantProperties.client-id
     - client-id of EHRbase as used in Keycloak
     - “HIP-CDR-EHRbase-Service”


Retrieve Tenant
^^^^^^^^^^^^^^^

.. http:get:: {{ehrbase-url}}ehrbase/plugin/multi-tenant/service/

   Retrieves a list of all tenants available in CDR Base

   **Example request**:

   .. sourcecode:: http

      GET /ehrbase/plugin/multi-tenant/service/ HTTP/1.1
      Host: localhost:8080

   **Example response**:

   .. sourcecode:: http

      HTTP/1.1 200 OK
      Vary: Accept

      [
       {
         "tenantId": "550e8400-e29b-41d4-a716-446655440000",
         "tenantName": "London",
         "tenantProperties": {
            "host": "https://hip-keycloak-hip-lab-integration.vitasystems.dev",
            "realm": "London",
            "client-id": "HIP-CDR-EHRbase-Service"
         }
      },
      {
         "tenantId": "3f2266c6-4eb2-47a3-9a83-6c7ace470fef",
         "tenantName": "Barcelona",
         "tenantProperties": {
            "host": "https://hip-keycloak-hip-lab-integration.vitasystems.dev",
            "realm": "Barcelona",
            "client-id": "HIP-CDR-EHRbase-Service"
         }
      }
      ]

   :statuscode 200: Event Trigger was successfully retrieved
   :statuscode 404: No Event Triggers were found
   :statuscode 500: Internal system error.

Delete Tenant
^^^^^^^^^^^^^

.. http:delete:: {{ehrbase-url}}ehrbase/plugin/multi-tenant/service/{{tenant_id}}

   Deletes the tenant with the tenant_uuid (all data is physically wiped from the system.
   We strongly advise against using this feature on any production system.

   **Example request**:

   .. sourcecode:: http

      DELETE /ehrbase/plugin/multi-tenant/service/3f2266c6-4eb2-47a3-9a83-6c7ace470fef HTTP/1.1
      Host: localhost:8080

   **Example response**:

   .. sourcecode:: http

      HTTP/1.1 200 OK
      Vary: Accept

   :statuscode 200: Tenant was successfully deleted
   :statuscode 404: No tenant with given uuid was found
   :statuscode 500: internal system error.



