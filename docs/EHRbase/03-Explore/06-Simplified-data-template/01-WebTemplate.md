---
title: WebTemplate
---

# Introduction

The Simplified Data Template Format (also known as **WebTemplate format**) offers a simplified representation of openEHR Templates and compositions. 

Besides, there are two representations of compositions called simSDT JSON (also known as **Flat format**) and structSDT JSON (also known as **Structured** format). Data is represented as a map of human-readable paths to values.

```json
{
  "ctx/language": "de",
  "ctx/territory": "US",
  "ctx/time": "2021-04-01T12:40:31.418954+02:00",
  "ctx/composer_name": "Silvia Blake",
  "conformance-ehrbase.de.v0/context/start_time": "2021-12-21T14:19:31.649613+01:00",
  "conformance-ehrbase.de.v0/context/setting|code": "238",
  "conformance-ehrbase.de.v0/context/setting|value": "other care",
  "conformance-ehrbase.de.v0/context/setting|terminology": "openehr",
  "conformance-ehrbase.de.v0/conformance_section/conformance_observation/any_event:0/dv_quantity|magnitude": 65.9,
  "conformance-ehrbase.de.v0/conformance_section/conformance_observation/any_event:0/dv_quantity|unit": "unit"
}
```

## Simplified Data Template

The Flat format is based on a simplified representation of a template, the so-called **Simplified Data Template**.

To get one from a template, call the get Simplified Data Template Endpoint.

```commandline
curl -X GET "http://localhost:8080/ehrbase/rest/openehr/v1/definition/template/adl1.4/:template_id" -H "Accept: application/json"
```

Or alternatively export from Archetype Designer ([https://tools.openehr.org/](https://tools.openehr.org/)) by selecting "Export Web Template" in the export button dropdown.

The result will look something like this:

```json
{
  "templateId": "conformance-ehrbase.de.v0",
  "semVer": "1.0.0",
  "version": "2.3",
  "defaultLanguage": "en",
  "languages": [
    "en"
  ],
  "tree": {
    "id": "conformance-ehrbase.de.v0",
    "name": "conformance-ehrbase.de.v0",
    "localizedName": "conformance-ehrbase.de.v0",
    "rmType": "COMPOSITION",
    "nodeId": "openEHR-EHR-COMPOSITION.conformance_composition_.v0",
    "min": 1,
    "max": 1,
    "aqlPath": "",
    "children": [
      {
        "id": "conformance_section",
        "name": "conformance section",
        "localizedName": "conformance section",
        "rmType": "SECTION",
        "nodeId": "openEHR-EHR-SECTION.conformance_section.v0",
        "min": 0,
        "max": 1,
        "aqlPath": "/content[openEHR-EHR-SECTION.conformance_section.v0]",
        "children": [
          {
            "id": "conformance_observation",
            "name": "Conformance Observation",
            "localizedName": "Conformance Observation",
            "rmType": "OBSERVATION",
            "nodeId": "openEHR-EHR-OBSERVATION.conformance_observation.v0",
            "min": 0,
            "max": 1,
            "aqlPath": "/content[openEHR-EHR-SECTION.conformance_section.v0]/items[openEHR-EHR-OBSERVATION.conformance_observation.v0]",
            "children": [
              {
                "id": "any_event",
                "name": "Any event",
                "localizedName": "Any event",
                "rmType": "EVENT",
                "nodeId": "at0002",
                "min": 0,
                "max": -1,
                "aqlPath": "/content[openEHR-EHR-SECTION.conformance_section.v0]/items[openEHR-EHR-OBSERVATION.conformance_observation.v0]/data[at0001]/events[at0002]",
                "children": [
                  {
                    "id": "dv_quantity",
                    "name": "DV_QUANTITY",
                    "localizedName": "DV_QUANTITY",
                    "rmType": "DV_QUANTITY",
                    "nodeId": "at0008",
                    "min": 0,
                    "max": 1,
                    "aqlPath": "/content[openEHR-EHR-SECTION.conformance_section.v0]/items[openEHR-EHR-OBSERVATION.conformance_observation.v0]/data[at0001]/events[at0002]/data[at0003]/items[at0008]/value",
                    "inputs": [
                      {
                        "suffix": "magnitude",
                        "type": "DECIMAL"
                      },
                      {
                        "suffix": "unit",
                        "type": "CODED_TEXT"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}
```

## simSDT JSON

To build a simSDT JSON:

- Concatenate the content from the `id` fields from the Web-Template hierarchy together.
- If an element is multivalued, add an index to the path, e.g., :0.
- Once at a data value leaf node, use "|" to select the appropriate attribute.

```json
{
  "conformance-ehrbase.de.v0/conformance_section/conformance_observation/any_event:0/dv_quantity|magnitude": 65.9,  "conformance-ehrbase.de.v0/conformance_section/conformance_observation/any_event:0/dv_quantity|unit": "unit"
}
```

## structSDT JSON 

Instead of using index numbers, the Structured format represents compositions using JSON hierarchies. The naming conventions stay the same. See the following example:

```json
{
  "ctx": {
    "language": "en",
    "territory": "SI",
    "composer_name": "matijak_test"
  },
  "vitals": {
    "vitals": [
      {
        "body_temperature": [
          {
            "any_event": [
              {
                "description_of_thermal_stress": [
                  "Test description of symptoms"
                ],
                "temperature": [
                  {
                    "|magnitude": 37.2,
                    "|unit": "°C"
                  }
                ],
                "symptoms": [
                  {
                    "|code": "at0.64",
                    "|value": "Chills / rigor / shivering",
                    "|terminology": "local"
                  }
                ],
                "time": [
                  "2014-01-22T15:18:07.339+01:00"
                ]
              }
            ]
          }
        ]
      }
    ],
    "context": [
      {
        "setting": [
          {
            "|code": "238",
            "|value": "other care",
            "|terminology": "openehr"
          }
        ],
        "start_time": [
          "2014-01-22T15:18:07.339+01:00"
        ]
      }
    ]
  }
}
```

## RM-Attributes

Some attributes are not defined by the template but by the Reference Model. If those are optional, they are not part of the Web-Template and are selected by "_attributeName".

```json
{
  "conformance-ehrbase.de.v0/conformance_section/conformance_observation/any_event:0/dv_quantity|magnitude": 65.9,
  "conformance-ehrbase.de.v0/conformance_section/conformance_observation/any_event:0/dv_quantity|unit": "unit",
  "conformance-ehrbase.de.v0/conformance_section/conformance_observation/any_event:0/dv_quantity/_normal_range/lower|magnitude": 20.5,
  "conformance-ehrbase.de.v0/conformance_section/conformance_observation/any_event:0/dv_quantity/_normal_range/lower|unit": "unit",
  "conformance-ehrbase.de.v0/conformance_section/conformance_observation/any_event:0/dv_quantity/_normal_range/upper|magnitude": 66.6,
  "conformance-ehrbase.de.v0/conformance_section/conformance_observation/any_event:0/dv_quantity/_normal_range/upper|unit": "unit"
}
```

See [Data Types](02-Flat-Reference.md) for details.

## Context

To simplify the input, the flat format offers the option to set context values, which set default values in the rm-tree.

```json
{
  "ctx/language": "de",
  "ctx/territory": "US",
  "ctx/time": "2021-04-01T12:40:31.418954+02:00",
  "ctx/composer_name": "Silvia Blake"
}
```

See [Context](03-Context.md) for details.
