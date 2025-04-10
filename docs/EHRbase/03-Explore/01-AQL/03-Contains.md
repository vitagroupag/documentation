---
title: FROM ... CONTAINS
---

# AQL FROM ... CONTAINS

The `CONTAINS` operator allows filtering compositions based on the openEHR Reference Model objects (and archetype_IDs) present inside the particular data instance.

## List of available RM classes

The following openEHR RM classes can be used in `CONTAINS`. Note that HIP EHRbase also supports the use of abstract classes from the openEHR RM.

- `ENTRY_CLASS`
  - `EVALUATION`
  - `OBSERVATION`
  - `INSTRUCTION`
  - `ACTION`
- `CLUSTER`
- `FEEDER_AUDIT`
- `ELEMENT`
- `EHR_STATUS`
- `COMPOSITION`
- `FOLDER` ([experimental](07-Configuration.md#experimental-features))
- `HISTORY`
- `EVENT`
  - `POINT_EVENT`
  - `INTERVAL_EVENT`
- `ITEM_SINGLE`
- `ITEM_LIST`
- `ITEM_TABLE`
- `ITEM_TREE`
- `ITEM`
- `ISM_TRANSITION`
- `ACTIVITY`
- `SECTION`
- `EVENT_CONTEXT`

## CONTAINS operators

CONTAINS statements can be chained and nested using parenthesis and operators AND and OR. You can also use parentheses to control the order of bindings. 

The NOT operator is currently not supported.

## Examples

### Example 1: Simple CONTAINS

The query retrieves all compositions for a specific electronic health record object that contain an observation of type body weight, regardless of which templates were used to define the structure of the composition.

```sql
SELECT
     c,
FROM EHR e CONTAINS
    COMPOSITION c CONTAINS
    OBSERVATION o[openEHR-EHR-OBSERVATION.body_weight.v2]
WHERE e/ehr_id/value = 'd50c939a-7661-4ef1-a67b-5a57661263db'
```

### Example 2: Complex CONTAINS

This example shows a more complex combination of CONTAINS statements, using the `AND` and `OR` operators along with parentheses. This ensures that only data following a certain structure or having entries for specific data, like the specimen used for laboratory tests, is queried.

```sql
SELECT
     c/uid/value,
     l as Test_Result,
     s as Specimen
FROM EHR e CONTAINS
    COMPOSITION c[openEHR-EHR-COMPOSITION.report-result.v1] CONTAINS
        (CLUSTER y[openEHR-EHR-CLUSTER.case_identification.v0] and OBSERVATION l[openEHR-EHR-OBSERVATION.laboratory_test_result.v1] CONTAINS
            (CLUSTER s[openEHR-EHR-CLUSTER.specimen.v1] and CLUSTER b[openEHR-EHR-CLUSTER.laboratory_test_panel.v0] CONTAINS
                (CLUSTER d[openEHR-EHR-CLUSTER.laboratory_test_analyte.v1])))
WHERE e/ehr_id/value = 'd50c939a-7661-4ef1-a67b-5a57661263db'
```

### Example 3: CONTAINS on ELEMENT

In some scenarios, directly searching for elements inside the electronic health record is required or convenient, especially when these are annotated by a value from a terminology like SNOMED CT or LOINC for unambiguous semantic annotation. The COMPOSTITION is needed within the CONTAINS statement as elements could also be part of objects like the EHR_STATUS. 

```sql
SELECT
     f
FROM EHR e CONTAINS
    COMPOSITION c CONTAINS
        ELEMENT f
WHERE
    e/ehr_id/value= 'ce9f05ee-095c-4c86-901b-1838f5d8837b' AND
    f/name/value = 'Blood Pressure'
```


### Example 4: CONTAINS on abstract classes

This example demonstrates the use of abstract classes within the CONTAINS statement. Within the openEHR Reference Model, care entry classes (OBSERVATION, EVALUATION, ACTION, INSTRUCTION) inherit from the CARE_ENTRY class. Incorporating the CARE_ENTRY class in AQL retrieves data from all these entry classes, allowing selection of shared attributes like 'name' and 'archetype_details'.

```sql
SELECT
     entry
FROM EHR e CONTAINS
    ENTRY entry
```
