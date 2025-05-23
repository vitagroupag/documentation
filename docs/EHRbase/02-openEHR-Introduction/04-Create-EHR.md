# Step 3: Create an EHR

When you start EHRbase from scratch, you will find an empty electronic health record. OpenEHR has a patient-centric architecture. This means that all clinical information inside the database are associated with the EHR of a patient. Hence, the first thing to get started is the creation of an EHR for a patient.

Beware that demographic data of a patient (name, date of birth, etc.) are not stored inside an openEHR system by design to ensure a clear separation from the clinical data. Hence, patients are not directly represented in openEHR but their electronic health record. In many cases, a separate demographics service (for example an IHE PIX/PDQ actor, a FHIR Server, an openEHR Demographics Repository, or a custom solution) is used.

To create a new EHR, you can either directly use the openEHR REST API or a function within the EHRbase Client Library that encapsulates the REST call.

The REST API can be found here: [openEHR REST API specifications](https://specifications.openehr.org/releases/ITS-REST/latest/ehr.html#ehr-ehr-post)

## REST

In this tutorial, we assume that we have a new patient coming to our organization. We simply make a REST call with an empty EHR_STATUS body.

```json
{
  "archetype_node_id": "openEHR-EHR-EHR_STATUS.generic.v1",
  "name": {
    "value": "EHR status"
  },
  "uid": {
    "_type": "OBJECT_VERSION_ID",
    "value": "8849182c-82ad-4088-a07f-48ead4180515::openEHRSys.example.com::1"
  },
  "subject": {
    "_type": "PARTY_SELF"
  },
  "is_queryable": true,
  "is_modifiable": true,
  "_type": "EHR_STATUS"
}
```

:::warning
Please note that in HIP, you need to use ADT messages or the FHIR API to create a new patient. In this case, the EHR object will be automatically created in EHRbase.
:::

You will receive the following response result (assuming you are using the `Prefer: return=representation` header):

```json
{
  "system_id": {
    "value": "d60e2348-b083-48ce-93b9-916cef1d3a5a"
  },
  "ehr_id": {
    "value": "7d44b88c-4199-4bad-97dc-d78268e01398"
  },
  "ehr_status": {
    "id": {
      "_type": "OBJECT_VERSION_ID",
      "value": "8849182c-82ad-4088-a07f-48ead4180515::openEHRSys.example.com::1"
    },
    "namespace": "local",
    "type": "EHR_STATUS"
  },
  "ehr_access": {
    "id": {
      "_type": "OBJECT_VERSION_ID",
      "value": "59a8d0ac-140e-4feb-b2d6-af99f8e68af8::openEHRSys.example.com::1"
    },
    "namespace": "local",
    "type": "EHR_ACCESS"
  },
  "time_created": {
    "value": "2015-01-20T19:30:22.765+01:00"
  }
}
```

In the response payload, you should find the EHR ID. This ID will be needed for further operations.

```json
{
  ...
  "ehr_id": {
    "value": "7d44b88c-4199-4bad-97dc-d78268e01398"
  },
  ...
}
```

If the request did not specify the `Prefer` header or you used `return=minimal`, the `ehr_id` can be retrieved from the `etag` response header.

## openEHR SDK

In the EHRbase Client Library, creating a new EHR object is straightforward:

```java
openEhrClient = DefaultRestClientTestHelper.setupDefaultRestClient();
EhrEndpoint ehrEndpoint = openEhrClient.ehrEndpoint();
UUID ehr = ehrEndpoint.createEhr();
```
