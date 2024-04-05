# (UN)COMMON QUERIES

This page provides a collection of very common or very specific queries to quickly provide some reference for building your queries.

## Retrieve EHR-ID (and external subject ID) of a patient
Use the paths `e/ehr_id/value`to retrieve the electronic health record ID of a patient. If an external ID is stored as part of the EHR object in EHRbase, it can be retrieved through `e/ehr_status/subject/external_ref/id/value`

```
SELECT
   e/ehr_id/value,
   e/ehr_status/subject/external_ref/id/value
   EHR e
```

## Retrieve Feeder Audit Information

For data integration scenarios, the Feeder_Audit object can be used to store metadata about the provenance of a reference model object. This example retrieves a composition based only on the identifier of the message that was received by HIP CDR, mapped to an openEHR Templates and stored in HIP EHRbase.

```sql
SELECT
     e/ehr_id/value,
     c,
     c/feeder_audit as Feeder_Audit
FROM EHR e[ehr_id/value='118194d5-1efe-42fc-8ee8-2e11b74782a2'] CONTAINS
    FEEDER_AUDIT f
WHERE
    f/feeder_audit/originating_system_item_ids/id='Observation/6115aed3-8b17-42ce-97d5-67e25b02a702/_history/1' AND
    f/feeder_audit/originating_system_item_ids/type='fhir_logical_id'
```

## Join between compositions

The following example shows an example how an AQL query can address multiple compositions, thereby representing JOIN semantics. 

:::info
In such scenarios, the result set will be relatively large as the carthesian product will be produced. This is mathematically correct but might make handling of result sets a bit more challenging.
:::

```
SELECT
    e/ehr_id/value,
    a_b/data[at0001]/events[at0006]/data[at0003]/items[at0004]/value/magnitude,
    a_b/data[at0001]/events[at0006]/data[at0003]/items[at0005]/value/magnitude
FROM EHR e CONTAINS
    (COMPOSITION c1
         CONTAINS OBSERVATION a_a[openEHR-EHR-OBSERVATION.alcohol_use.v1]
     AND
     COMPOSITION c2
         CONTAINS OBSERVATION a_b[openEHR-EHR-OBSERVATION.blood_pressure.v1])
```