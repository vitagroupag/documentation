---
sidebar_position: 1
title: PSPL
---

# Path Specific Protocol Language (PSPL)

## Introduction

CDR Bridge enables to connect different medical and non-medical source protocols to HIP CDR storage services (e.g. EHRbase, FHIR, Binary) to read, write and search data. The protocol specific path language (PSPL) is the formal representation of a data extraction language from various source protocols (HL7v2, FHIR, CSV, ...) to HIP CDR and a data assembling from HIP CDR back to the source protocol. PSPL also specifies the target path (e.g. a FHIR resource to store demographic data or a AQL path to an openEHR Template).

PSPL is a path based navigation and extraction language, somewhat like XPath or FHIRPath. Operations are expressed in terms of the logical content of hierarchical data models, and support traversal, selection and filtering of data. Its design was influenced by the needs for path navigation, selection and function extendability.

Following aspects have been crucial for the design of PSPL:
* Collection-centric: PSPL deals with all values as collections, allowing it to easily deal with information models with repeating elements.
* Platform-independent: PSPL is a conceptual and logical specification that can be implemented in any platform.
* Model-independent: PSPL deals with data as an abstract model, allowing it to be used with any information model.
* The object graph always starts with a root (e.g. a hl7v2 message, a FHIR resource, a CSV document)


## Navigation Model

PSPL navigates and selects nodes from a tree that abstracts away and is independent of the actual underlying implementation of the source against which the PSPL query is run. Data are represented as a tree of labelled nodes, where each node may optionally carry a primitive value and have child nodes. Nodes need not have a unique label, and leaf nodes must carry a primitive value. For example, a (partial) representation of a FHIR Patient resource in this model looks like this:

![Treestructure of the PSPL](/img/bridge/treestructure.png)

The diagram shows a tree with a repeating name node, which represents repeating members of the PSPL model. Leaf nodes such as *use* and *family* carry a (string) value. PSPL expressions are then evaluated with respect to a specific instance, such as the Patient one described above. This instance is referred to as the context (also called the root) and paths within the expression are evaluated in terms of this instance.

### Path Selection

PSPL allows navigation through the tree by composing a path of concatenated labels, e.g.

```
name.given
```

### JSON (FHIR) path selection convention

```
JSON representation                                                                PATH representation
{
  "resourceType": "Observation",                                                   resourceType
  "id": "f001",                                                                    id
  "status": "final",                                                               status
  "code": {                                                                        code
    "coding": [                                                                    code.coding
      {
        "system": "http://loinc.org",                                              code.coding.system                                
        "code": "15074-8",                                                         code.coding.code
        "display": "Glucose [Moles/volume] in Blood"                               code.coding.display
      }
   ]
}
```

### HL7v2 path selection convention

HL7v2 messages are composed of segments, fields, components, and subcomponents. Segments can be thought of as containers that group like kinds of data. Each segment contains fields that are separated with the ‘|’ character. Fields and segments can be repeating. Repeating fields are separated with the ‘~’ character. Components are the data points within fields, and they are separated with the ‘^’ character. Sub-components are demarcated with the ‘&’ separator. These special characters are called control characters. The table contains the standard control characters used in HL7 (see also [here](https://lyniate.com/resources/hl7-encoding-characters/)).

```
MSH|^~\&|VSM001|MIRTH_CONNECT|HIS001|MIRTH_CONNECT|20100511220525||ORU^R01|MSG0000001|P|2.5|||NE|NE|CO|8859/1|ES-CO
PID|||6537077^^^^CC||ANDRES FELIPE^FERNANDEZ CORTES||19860705|M
OBR|1||VS12340000|28562-7^Vital Signs^LN
OBX|1|NM|386725007^Body temperature^SNOMED-CT||37|C|37|N|||F|||20100511220525
```

The syntax of a path is as follows:

````
SEGMENT "." FIELD["." COMPONENT["." SUBCOMPONENT]]
* Values in [ ] are optional
`````

Field, repetition, component, and subcomponent are integers (representing, respectively, the field repetition (starting at 0), and the field number, component number, and subcomponent numbers (starting at 1). Omitting the repetition is equivalent to specifying 0; omitting the component or subcomponent will select the full original content of, respectively, the field or component specified. Each field is assumed to potentially contain the whole hierarchy down to subcomponent, so it is always possible to specify indexes on that level. Any path that would point below that level will return an empty element.

```
MSH|^~\&|VSM001|MIRTH_CONNECT|HIS001|MIRTH_CONNECT|20100511220525||ORU^R01|MSG0000001|P|2.5|||NE|NE|CO|8859/1|ES-CO
PID|||6537077^^^^CC||ANDRES FELIPE^FERNANDEZ CORTES||19860705|M
OBR|1||VS12340000|28562-7^Vital Signs^LN
OBX|1|NM|386725007^Body temperature^SNOMED-CT||37|C|37|N|||F|||20100511220525
OBX|2|NM|78564009^Pulse rate^SNOMED-CT||80|bpm|60-100|N|||F|||20100511220525
OBX|3|NM|431314004^SpO2^SNOMED-CT||90|%|94-100|L|||F|||20100511220525
 
Patient segment example
Patient ID:
    PID.3.1     (value: 6537077)
    PID.3.5     (value: CC)
    PID.3       (value: 6537077^^^^CC)
    PID.3.1.1   (value: 6537077)
    PID.3.1.1.1 (value: "")
Patient Name:
    PID.5.1.1 (value: BEETHOVEN)
    PID.5.1.2 (value: VAN)
    PID.5.2   (value: ANDRES FELIPE)
    PID.5     (value: BEETHOVEN&VAN^ANDRES FELIPE)
    PID.5.1   (value: BEETHOVEN&VAN)
 
Observation segment example
Pulse rate:
    OBX[where: "3.1='78564009'"].5 (value: 80)
    OBX[where: "3.1='78564009'"].6 (value: bpm)
SpO2:
    OBX[where: "3.1='431314004'"].5 (value: 90)
    OBX[where: "3.1='431314004'"].6 (value: %)
```

## Function invocation

Functions are used as "hooks" when reading or writing data, e.g. they can help to select the correct data, to describe the source protocol or they can manipulate the data before reading or writing. 
Functions are distinguished from path navigation names by the fact that they are wrapped in square brackets []. Multiple functions are separated by ",".

### WHERE

Returns a collection containing only those elements in the input collection for which the stated criteria expression evaluates to "true". Elements for which the expression evaluates to false or empty ("{ }") are not included in the result. If the input collection is empty ("{ }"), then the result is empty. If the result of evaluating the condition is other than a single boolean value, the evaluation will end and signal an error to the calling environment, consistent with singleton evaluation of collections behaviour.

#### Boolean Expressions

Conditions in the where function can be combined with boolean expressions.

#### AND
Returns true if both operands evaluate to true, false if either operand evaluates to false, and the empty collection ({ }) otherwise.

:::info
**OR** and **NOT** are currently not supported.
:::

### isList: true|false

When CDR Bridge reads data from EHRbase or the FHIR Service and creates a protocol specific resource out of it, CDR Bridge has no insights if the created node in the resource should be type of a list (e.g. a JSONArray) or not (e.g. a JSONObject). If the created resource is type of a list, this can be marked with "isList" in the mapping.

:::info
"isList" is a mandatory information when resources are created. If "isList" is not set, the default value (false) will be used.
:::

```
code.coding.code=15074-8 will create
{
    "code": {
        "coding": {
            "code": "15074-8"
        }
    }
}
 
code.coding[isList: true].code=15074-8 will create
{
    "code": {
        "coding": [
            {
                "code": "15074-8",
            }
        ]
    }
}
```

### isIdValue: resourceType

Processing medical data (e.g. FHIR or HL7v2) in a business context implies to resolve information from other resources (e.g. other datasources). The function "isIdValue: resource type" is used as a marker to resolve those "foreign" resources by id in the business flow.

#### Usage to resolve the EHR of a patient

Every operation in EHRbase (e.g. inserting data, reading data) needs the EHR of the patient ([see]https://specifications.openehr.org/releases/RM/latest/ehr.html#_root_ehr_object), which is stored in the FHIR Service. To mark the patientId which should be used for the query to the FHIR Service, the  function "isIdValue: 'Patient'" is used as a marker.

:::info
Every mapping needs at least one entry where "isIdValue: 'Patient'" is set, otherwise the target EHR can not be identified and the mapping will fail.
:::

##### EXAMPLE FHIR

```
{
    "resourceType": "Observation",
    "id": "blood-pressure",
    "subject": {
        "reference": "Patient/123"
    },
    ...
}
 
Expression subject.reference[isIdValue: "Patient"] will use the value "Patient/123" to query the demographic service for the EHR-Id of the patient.
```
##### EXAMPLE HL7V2

```
MSH|^~\&|KIS|ADT|CDRBRIDGE|ADT|200504011705||ADT^A08
PID|||6537077^^^CC||Engels^Sarah
 
Expression PID.3.1[isIdValue: "Patient"] will use the value "6537077" to query the demographic service for the EHR-Id of the patient.
```

#### Usage to resolve the Encounter

##### EXAMPLE FHIR
```
{
    "resourceType": "Observation",
    "id": "blood-pressure",
    "encounter": {
        "reference": "Encounter/123"
    },
    ...
}
  
 
Expression encounter.reference[isIdValue: "Encounter"] will use the value "Encounter/123" to resolve the encounter in the demographic service.
```

##### EXAMPLE HL7V2

```
MSH|^~\&|ORBIS|http://hl7.org/v2/PID-3|EGATE|http://hl7.org/v2/PID-3|20121224||ADT^A01^ADT_A01|8048087|P|2.5|||NE|NE||8859/1
...
PV1|1||||||||||||||||||enc-123^^^sap.ishmed.cerner|
...
Expression PV1.19.1[isIdValue: "Encounter"] will use the value "enc-123" to resolve the encounter identifier in the demographic service.
```

### isIdSystem: resourceType

The isIdSystem function is similar like "isIdValue" but resolves the authority (or organization or agency or department) that created the id value.

```
MSH|^~\&|ORBIS|http://hl7.org/v2/PID-3|EGATE|http://hl7.org/v2/PID-3|20121224||ADT^A01^ADT_A01|8048087|P|2.5|||NE|NE||8859/1
...
PV1|1||||||||||||||||||enc-123^^^sap.ishmed.cerner|
...
Expression PV1.19.4[isIdSystem: "Encounter"] will use the value "sap.ishmed.cerner" to resolve the encounter system in the demographic service.
```

### toEventDateTime: true|false

Every event on EHRbase has a time property to store the relevant dateTime (e.g. in case of a blood pressure archetype, the dateTime when the blood pressure was measured could be stored there). The "toEventDateTime" function maps the source property to this EHRbase property.

Default value of "toEventDateTime": false

```
{
    "resourceType": "Observation",
    "id": "bloodgroup",
    "status": "final",
    "code": {
        "coding": [
            {
                "system": "http://loinc.org",
                "code": "883-9",
                "display": "ABO group [Type] in Blood"
            }
        ],
        "text": "Blood Group"
    },
    "subject": {
        "reference": "Patient/infant"
    },
    "effectiveDateTime": "2018-03-11T16:07:54+00:00",
    "valueCodeableConcept": {
        "coding": [
            {
                "system": "http://snomed.info/sct",
                "code": "112144000",
                "display": "Blood group A (finding)"
            }
        ],
        "text": "A"
    }
}
 
Expression effectiveDateTime[toEventDateTime: true] would map the value "2018-03-11T16:07:54+00:00" to the archetype (in the blood group example above "Laboratory test result") event date.
```

### toEventDateTimeInterval: true|false

Same as "toEventDateTime" but with an "INTERVAL_EVENT" instead of an "EVENT" in EHRbase to store an interval date time object.

Default value of "toEventDateTimeInterval": false

```
{
    "resourceType": "Observation",
    "id": "f004",
    "code": {
        "coding": [
            {
                "system": "http://loinc.org",
                "code": "789-8",
                "display": "Erythrocytes [#/volume] in Blood by Automated count"
            }
        ]
    },
    "effectivePeriod": {
        "start": "2013-04-02T10:30:10+01:00",
        "end": "2013-04-05T10:30:10+01:00"
    },
    "valueQuantity": {
        "value": 4.12,
        "unit": "10^12/L",
        "system": "http://unitsofmeasure.org",
        "code": "10*12/L"
    }
}
 
Expression effectivePeriod[toEventDateTimeInterval: true] would map the interval "2013-04-02T10:30:10+01:00 - 2013-04-05T10:30:10+01:00" to the archetype event date and archetype interval_event width. End is the value of start + width.
```

### convert['source' -> 'target']

:::info
The inline convertion will be complemented soon with lookups on concept maps from a FHIR (Terminology) Server
:::

Identifiers used for the item in the originating system, e.g. filler and placer ids.
Executing a business operation on an existing resource (e.g. an update or delete operation via HL7v2 or FHIR) implies at least one stable ID to match the existing resource with the resource, which should be updated. This relationship is set with the isOriginatingSystemIdValue function marker.

At least one stable Id must be provided with "isOriginatingSystemIdValue". The maximum numbers of Ids marked with "isOriginatingSystemIdValue" is unlimited.

```
MSH|^~\&|GHH LAB|ELAB-3|GHH OE|BLDG4|20020215093000+0600||ORU^R01|CNTRL-3456|P|2.3|
PID|||555-44-4444||...
OBR|1|845439^GHH OE|1045813^GHH LAB|...
OBX|1|SN|1554-5^GLUCOSE^POST 12H CFST:MCNC:PT:SER/PLAS:QN||^182|mg/dl|70_105|H|||F
 
OBR.3.1[isOriginatingSystemIdValue: true]: Would use the value "1045813" to identify the source resource for further operations (like update and delete).
OBX.3.1[isOriginatingSystemIdValue: true]: Would use the value "1554-5" to identify the source resource for further operations (like update and delete).
```

### isOriginatingSystemIdSystem: true|false

:::info
The handling of "isOriginatingSystemIdSystem" is only implemented for HL7v2.
:::

The isOriginatingSystemIdSystem function is similar like "isOriginatingSystemIdValue" but resolves the authority, organization, agency, department or ... that created the value of isOriginatingSystemIdValue.

## Storage Path Selection

### OpenEHR Storage Path

EHRbase storage paths are defined as the AQL path to the datatype in the template, appended with the AQL path to the attribute. Please note that the path should point exactly to the datatype; this means that, for example, if you want to map to a value attribute (e.g. `DV_QUANTITY.magnitude`), the storage path will have to include `/value` (e.g. it should be `/content[openEHR-EHR-OBSERVATION.body_weight.v2]/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value`, as without the `/value` you would be pointing to an `ELEMENT` datatype, which has no `magnitude` attribute).

![Paths inside an openEHR Template](/img/bridge/template.png)

### FHIR Storage Path

When defining mappings to the FHIR store, storage paths work just like source paths. One particularity is that only paths to primitive datatypes are currently supported and for these there is only one attribute called `value`.

![FHIR to openEHR Mapping](/img/bridge/fhir_mapping.png)

