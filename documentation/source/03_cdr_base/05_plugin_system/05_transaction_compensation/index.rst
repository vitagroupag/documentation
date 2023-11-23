.. _plugin_system_transaction_compensation:

*******************************
Transaction Compensation Plugin
*******************************

As HIP CDR follows a service-oriented architecture, distributed transactions across services are required.
The Transaction Compensation Plugin allows to rollback transactions in accordance with the Saga Pattern.

For this purpose, a REST API can be used by external services to invoke the transaction compensation functions.

The transaction compensation uses the openEHR Contribution objects for the rollback.


Parameters / Environment Variables
----------------------------------

The Transaction Compensation Plugin does not need any parameters to be provided.


REST API
--------

Execute Rollback
^^^^^^^^^^^^^^^^

.. http:get:: {{ehrbase-url}}/ehrbase/rest/admin/ehr/{ehr_id}/contribution/{contribution_id}/rollback

   Executes a rollback based a contribution ID.

   **Example request**:

   .. sourcecode:: http

      GET /ehrbase/rest/admin/ehr/{ehr_id}/contribution/{contribution_id}/rollback HTTP/1.1
      Host: localhost:8080

   **Example response**:

   .. sourcecode:: http

      HTTP/1.1 200 OK
      Vary: Accept

   :statuscode 200: Contribution was successfully rolled back
   :statuscode 500: internal system error. The whole compensation transaction is rolled back

Dealing with parallel access
----------------------------

Before starting the rollback the ehr_id, contribution id, and status will be saved in a DB.
If there already is an entry with the same ehr but status not finished, then the thread will
block till it is set to finished or it will time out.

Rollback Algorithm
------------------

The objects in the contribution are rolled back:
* in a serial way,
* an inverse order and
* in one database transaction.
If at any point an exception representing a 501 or 500 happens, the whole compensation transaction is rolled back.
If all objects have been rolled back successfully, the respective contribution object is deleted from the database.
















