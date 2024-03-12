---
sidebar_position: 2
---

# FHIR Connector

Documentation for the HIP CDR FHIR Connector

## Introduction

The HIP CDR provides a FHIR REST API based on the HL7 FHIR R4 standard definition ([Link](https://hl7.org/fhir/R4/index.html)). The FHIR API represents a facade to the internal data storages and provides access to the data in FHIR format.

Depending on the storage location of the data an according mapping (see _Custom Mappings FHIR_) is required to access the data via the FHIR API.

# Overview

```
╔════════════════╗
║  YOU ARE HERE  ║
╚════════════════╝
         │
         │
         ▼
┌───────────────┐        ┌─────────────────────┐        ┌───────────────┐        ┌───────────────┐
│     FHIR      │        │                     │        │  DEMOGRAPHIC  │        │  DEMOGRAPHIC  │
│   CONNECTOR   ◀────────▶                     ◀────────▶     PROXY     ◀────────▶     STORE     │
└───────────────┘        │       MAPPING       │        └───────────────┘        └───────────────┘
                         │       WORKER        │
┌───────────────┐        │       SERVICE       │        ┌───────────────┐        ┌───────────────┐
│     HL7v2     ◀────────▶                     ◀────────▶    EHRBASE    ◀────────▶    EHRBASE    │
│   CONNECTOR   │        │                     │        │     PROXY     │        │     STORE     │
└───────────────┘        └─────────────────────┘        └───────────────┘        └───────────────┘
```

## General information

- **Protocol**: HTTPS
- **Base URL**: `/fhir/R4`
- **Versions**: R4
- **Formats**: JSON (`application/fhir+json`)
- **Encoding**: UTF-8

## Security

All requests to the FHIR API must include an `Authorization` header with a valid OAuth 2.0 bearer token to access the resources. Access management is handled by the HIP CDR identity provider (`Keycloak`) where an access token can be retrieved by authorized clients.

## Resources

By default the FHIR API supports only `Patient` and `Encounter` resources that are required for internal data handling. These resource types are covered by product mappings which are activated when the system is set up for use.

All additional resources that should be supported by the system must be specified in an according custom mapping.

### Custom Mappings FHIR

To add FHIR support for an additional FHIR resource type a custom mapping needs to be defined and imported for the according resource type.

In the example below a custom mapping for the resource type `Practitioner` is shown. The custom mapping can be imported to the system using the mapping API endpoint as displayed in the example.

```bash
curl -X POST 'https://${baseUrl}/api/v1/mappings/custom' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer ${bearerToken} \
--data '{
  "name" : "Practitioner mapping for FHIR R4",
  "description" : "Custom Practitioner mapping",
  "definition": {
    "sourceProtocol" : "FHIR",
    "sourceProtocolVersions" : ["R4"],
    "sourceType" : "Practitioner",
    "storageProtocol" : "FHIR",
    "storageProtocolVersion" : "R4",
    "storageType" : "Practitioner"
  }
}'
```

### Supported Resources

All resources that a covered by a mapping (product or custom) in the system are supported.

For technical reasons, the following resources are currently not supported, even if a custom mapping exists:

- `Bundle`
- `CapabilityStatement`
- `CodeSystem`
- `CompartmentDefinition`
- `ConceptMap`
- `Library`
- `NamingSystem`
- `OperationDefinition`
- `Questionnaire`
- `SearchParameter`
- `StructureDefinition`
- `StructureMap`
- `ValueSet`

## Operations

All supported operations require a mapping for the resource involved (see above).

### `read`

- **Status**: Supported
- **HTTP Method**: `GET`
- **Example**: `/fhir/R4/Patient/123`
- **Response codes**: `200`, `401`, `403`, `404`, `410`
- **Constraints**:
  - Versioning not supported (`ETag`, `Last-Modified`).
  - Conditional read not supported

### `update`

- **Status**: Supported
- **HTTP Method**: `PUT`
- **Example**: `/fhir/R4/Patient/123`
- **Response codes**: `200`, `400`, `401`, `403`, `404`, `405`, `406`, `415`
- **Constraints**:
  - Versioning not supported (`ETag`, `Last-Modified`).
  - Update as create not supported
  - Conditional update not supported
  - Version aware updates (`If-Match` header) not supported

### `create`

- **Status**: Supported
- **HTTP Method**: `POST`, `PUT`
- **Example**: `/fhir/R4/Patient`
- **Response codes**: `201`, `400`, `401`, `403`, `404`, `405`, `406`, `409`
- **Constraints**:
  - Versioning not supported (`ETag`, `Last-Modified`)
  - Conditional create not supported

### `delete`

- **Status**: Supported
- **HTTP Method**: `DELETE`
- **Example**: `/fhir/R4/Patient/123`
- **Response codes**: `200`, `401`, `403`, `404`, `409`, `410`
- **Constraints**:
  - `ETag` header not supported
  - Conditional delete not supported
  - Cascading delete not supported
  - Expunge delete not supported
  - `Patient` Resource can only be deleted, if no Compositions exist for the associated EHR
  - `Encounter` Resource can only be deleted, if no Compositions exist for the associated Folder

### `search`

- **Status**: Supported
- **HTTP Method**: `GET`, `POST`
- **Example GET**: `/fhir/R4/Patient?name=Max`
- **Example POST**:

  ```
  POST  /fhir/R4/Patient
  Content-Type: application/x-www-form-urlencoded

  name=Max
  ```

- **Response codes**: `200`, `400`, `401`, `403`, `406`
- **Constraints**:
  - Compartment searching not supported
  - Not supported common parameters: `_text`, `_content`, `_list`, `_type`
  - Not supported search result parameters: `_contained`, `_containedType`
  - Advanced querying (`_query` and `_filter`) not supported
  - FHIR Search on resources stored in the EHRbase store is limited to the following parameter
    - `_lastUpdated` for querying and sorting
    - `subject` as a reference to the `Patient` resource for querying
- **Hint**: Adding a `_sort` parameter is highly recommended, when pagination functionality is used.

### Not Supported Operations

Following FHIR operations are currently not supported by the FHIR API:

- `vread`
- `patch`
- `search-all`
- `capabilities`
- `batch/transaction`
- `history`

### Additional Constraints

- HTTP return preference header (`Prefer: return=`) not supported
- `_format` parameter not supported
- `_pretty` parameter not supported
