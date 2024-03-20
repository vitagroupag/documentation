---
sidebar_position: 2
title: Create a Mapping
---

# Create your custom mapping

The structure of a custom mapping specification looks like the following:


```{
  "name": <short name, e.g. "FHIR Blood Pressure Mapping">,
  "description": <lengthier description, e.g. "Custom mapping for FHIR R4 Observation resources containing blood pressure data">,
  "definition" : {
    "sourceProtocol" : <source protocol name, e.g. "FHIR", "HL7v2">,
    "sourceProtocolVersions" : [ <list of source protocol versions, e.g. "R4", "2.3">, ]
    "sourceType" : <type of object (source protocol), e.g. "Observation", "OBX">,
    "storageProtocol" : <storage protocol name, e.g. "openEHR", "FHIR">,
    "storageProtocolVersion" : <storage protocol version, e.g. "1.1.0", "R4">,
    "storageType" : <type of object (storage protocol), e.g. "Composition", "Patient">,
    "templateId" : <ID of the template to be used, e.g. "bloodPressure.v2.2.0" or null, if the storageProtocol = FHIR>,
    "conditions" : [ <...> ],
    "transformations" : [ <...> ],
    "merges": [<..>] (optional)
  }
}
```

Note that sourceType varies with the source protocol you are mapping to/from. For FHIR, it will be the name of a [resource type](https://hl7.org/fhir/resourcelist.html). For HL7 V2.x it will be a [segment name](https://www.hl7.eu/HL7v2x/v24/std24/AppendixA.htm). Similarly, storageType varies with the storage protocol. For openEHR it should be Composition, for FHIR it should be the name of a resource type.

Also note that templateId is only required when the storage protocol is openEHR.

It should by now be relatively clear how to fill out all fields, except for conditions and transformations, so let's focus on those (lines 9-10).

A custom mapping definition for FHIR resources, which should be stored in the demographic store (sourceProtocol = "FHIR"; storageProtocol = "FHIR") does not need a "transformation" block as no transformations will be applied.

## Conditions to select a custom mapping

Conditions specify when your custom mapping will be applied. Here's an example:

```"conditions" : [
  {
    "condition" : "code.coding[where: \"system='http://loinc.org'\"].code",
    "expectedValue" : "85354-9"
  }
]
```

A condition consists of two fields: a PSPL path selecting a text node in the source protocol (line 3) and an expected value for that text node (line 4). This example is tailored for a [FHIR R4 Observation](https://hl7.org/fhir/R4/observation.html) and will select those that have a LOINC code of 85354-9,  i.e. Observation resources that contain a blood pressure panel. Note that conditions are conjunctive, so if you specify more than one, your custom mapping will only be applied if all of them are true.

There is another type of condition that allows you to specify a list of possible values to be matched. Here's an example:

``` "conditions" : [
  {
    "condition" : "code.coding[where: \"system='http://loinc.org'\"].code",
    "anyExpectedValue" : [ "29463-7", "3141-9" ]
  }
]
````

This condition matches if the Observation resource contains either 29463-7 (Body weight) or 3141-9 (Body weight Measured) at code.coding.code (where code.coding.system is http://loinc.org). You could also include other possible codes in the list, like 8335-2 (Body weight Estimated), 3142-7 (Body weight Stated), etc.

## Update conditions to mark a field for updates

Update conditions specify how individual fields shall be used for updating. Here's an example:

```"updateConditions" : [
  {
    "condition" : "OBX.11",
    "expectedValue" : "C"
  }
]
```

A update condition consists of two fields: a PSPL path selecting a text node in the source protocol (line 3) and an expected value for that text node (line 4). 
This example is tailored for a HL7v2 ORU message, containing a correction for a previously sent message.

The mapping in this example will enable triggering an update rather than a create if the value of OBX.11 is C.

These conditions are structurally the same as the conditions to select a mapping, so, whatever condition types you use there (e.g. expectedValue, anyExpectedValue, etc), you can also use here.

## Transformations

Transformations specify how individual fields are mapped to/from the storage protocol. This is the core of your mapping definition. Let's have a look at a simple example:

```"transformations" : [
  {
    "storagePath" : "/content[openEHR-EHR-OBSERVATION.laboratory_test_result.v1]/data[at0001]/events[at0002]/data[at0003]/items[at0005]/value",
    "storageClass" : "DvText",
    "attributes" : {
      "value": {
        "type": "rw",
        "dataType": "String",
        "sourcePath": "code.coding[isList: true].display"
      }
    }
  },
  <...>
]
```

A transformation consists of three fields:
* **storagePath:** a path pointing to a field in your storage protocol type (either an [AQL path](https://specifications.openehr.org/releases/QUERY/latest/AQL.html) pointing to a node in your custom openEHR template, or a simple PSPL path for other protocols)
* **storageClass:** the name of the storage data type (typically a base [data type](https://specifications.openehr.org/releases/RM/latest/data_types.html) for openEHR or a [primitive data type](https://hl7.org/fhir/R4/datatypes.html#primitive) for FHIR)
* **attributes:** a specification of how the type's attributes should be mapped to/from the source protocol.

In this example, the path is based on the co2.v1.1.0 template you can find in the mappings library. Focusing on the attributes  field, in this example, the value attribute of the [DV_TEXT](https://specifications.openehr.org/releases/RM/latest/data_types.html#_dv_text_class) class is being mapped to the content of the field specified by the path code.coding.display. Connecting with the rest of the example above, what this means is that, when mapping from the source protocol, the value of this field in the source will be stored in the value attribute of the DV_TEXT node determined by the AQL path specified above in storagePath; conversely, when mapping from openEHR to the source protocol, the content of the value attribute will be represented in code.coding.display. This can be illustrated as a correspondence between the two (partial) examples shown below:

```{
  "code": {
    "coding": [
      {
        "display": "Carbon dioxide in blood"
      }
    ]
  }
}
```

```{
  "_type" : "DV_TEXT",
  "value" : "Carbon dioxide in blood"
}
```

For the specifics of how to write PSPL paths and the effect of functions like isList see this page.

Note that you can map more attributes from openEHR classes, the following is an example for [DV_QUANTITY](https://specifications.openehr.org/releases/RM/latest/data_types.html#_dv_quantity_class):

````
{
  "magnitude": {
    "type": "rw",
    "dataType": "Double",
    "sourcePath": "valueQuantity.value"
  },
  "units": {
    "type": "rw",
    "dataType": "String",
    "sourcePath": "valueQuantity.code"
  },
  "unitsSystem": {
    "type": "rw",
    "dataType": "String",
    "sourcePath": "valueQuantity.system"
  },
  "unitsDisplayName": {
    "type": "rw",
    "dataType": "String",
    "sourcePath": "valueQuantity.unit"
  }
}
`````

When the storage protocol is FHIR, or the source protocol is something else, the approach is similar, only the paths change. The following is an example from HL7 V2 to FHIR:

```
{
  "storagePath" : "name[isList: true].family",
  "storageClass" : "String",
  "attributes" : {
    "value": {
      "type": "rw",
      "dataType": "String",
      "sourcePath": "PID.5.1"
    }
  }
}
```

This transformation would map a PID segment like "PID | | | | | Smith" to the following FHIR resource:

````
{
  "resourceType" : "Patient",
  "name" : [
    {
      "family" : "Smith"
    }
  ]
}
````


