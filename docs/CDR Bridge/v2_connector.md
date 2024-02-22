---
sidebar_position: 5
title: HL7v2 Connector
---

# HL7v2 Connector

## Introduction
The HIP CDR provides an HL7 v2 interface (HL7 v2 Connector) for the import of HL7 v2 messages via Minimal Lower Layer Protocol (MLLP).

HL7 v2 messages are internally stored and additionally mapped to structured data (HL7 FHIR, openEHR) so the information can be retrieved from the openEHR and FHIR APIs.

## General information
- **Protocol**: MLLP
- **Encoding**: UTF-8

## Overview

```

┌───────────────┐        ┌─────────────────────┐        ┌───────────────┐        ┌───────────────┐
│     FHIR      │        │                     │        │  DEMOGRAPHIC  │        │  DEMOGRAPHIC  │
│   CONNECTOR   ◀────────▶                     ◀────────▶     PROXY     ◀────────▶     STORE     │
└───────────────┘        │       MAPPING       │        └───────────────┘        └───────────────┘
                         │       WORKER        │
┌───────────────┐        │       SERVICE       │        ┌───────────────┐        ┌───────────────┐
│     HL7v2     ◀────────▶                     ◀────────▶    EHRBASE    ◀────────▶    EHRBASE    │
│   CONNECTOR   │        │                     │        │     PROXY     │        │     STORE     │
└───────────────┘        └─────────────────────┘        └───────────────┘        └───────────────┘
         ▲
         │
         │
╔════════════════╗
║  YOU ARE HERE  ║
╚════════════════╝
```

## HL7 v2 Import
The HL7 v2 Connector has a two layered import process:
1. `Communication Log`: The Communication Log represents a storage of original HL7 v2 message in raw format
2. `Structured Mappings`: Structured mapping of an HL7 v2 message provides storage of the field information contained in the HL7 v2 message

### Communication Log
The HL7 v2 Connector supports the import and storage of all incoming HL7 v2 messages for later processing or analysis.

### Structured Mappings
Structured mappings provide mapping and transformation rules for the extraction of information from HL7 v2 messages and the storage of these information in dedicated data objects (FHIR Resources or openEHR Templates).

Following message types are supported by structured mappings:
- `ADT (Admit, Discharge, Transfer)`
- `MDM (Medical Document Management)`
- `SIU (Scheduling Information Unsolicited)`
- `ORM (Order Message)`
- `ORU (Observation Result)`
- `BAR (Add/Change Billing Account)`


Structured mappings are processed per message segment (e.g. DG1). Depending on the message type following segments are processed in the structured mapping: 

| Segment Code | Segment Name                     | Supporting Segments | Target Structure        |
| ---          | ---                              | ---                 | ---                     |
| PID          | Patient Identification           | -                   | FHIR Patient            |
| PV1          | Patient Visit                    | -                   | FHIR Encounter Res.     |
| NK1          | Next of Kin / Associated Parties | -                   | FHIR RelatedPerson      |
| OBX          | Observation/Result               | ORC, OBR            | FHIR Observation        |
| IN1          | Insurance                        | IN2                 | FHIR Insurance          |
| TXA          | Transcription Document Header    | -                   | FHIR DocumentReference  |
| AL1          | Patient Allergy Information      | -                   | FHIR AllergyIntolerance |
| ORC          | Common Order                     | OBR                 | FHIR ServiceRequest     |
| SCH          | Schedule Activity Information    | TQ1, AIL, AIG, AIP  | FHIR Appointment        |


## Processing of Segments

### PID Segment
Each HL7 v2 message requires a patient reference provided in the PID (PID.3.1) identifier segment. If the PID segment or the patient identifier is missing in a message an error is returned.

In case a patient identifier is provided in the HL7 v2 message and the according record does not exist in the HIP CDR, the system automatically creates a new FHIR Patient with the given patient identifier.

### Other Segments
The same applies to the other message segments. If an identifier is applied for the segment object, the according target resource will be created/updated with each HL7 v2 message.


## Searching on Target Resources
When a structured mapping is applied to an incoming HL7 v2 message and target resources are created, the data can be searched and retrieved from the FHIR REST API using the FHIR search syntax, e.g. by the identifier ```${fhir-connector-url}/fhir/R4/[targetResource]?identifier=${v2Identifier}```

For further information about the FHIR REST API please see the [FHIR Connector](fhir_connector) documentation.


## Security

All requests to the FHIR API must include an `Authorization` header with a valid OAuth 2.0 bearer token to access the resources. Access management is handled by the HIP CDR identity provider (`Keycloak`) where an access token can be retrieved by authorized clients.

## Testing the API
```
docker run -it -v $PWD/testdata:/testdata dcm4che/dcm4che-tools:5.29.0 hl7snd -ccdr-connector-hl7v2-dev.vitasystems.dev:32001 /testdata/mdmt01.hl7
```


