# Merges

:::info
The merge logic is currently only available for HL7v2 to openEHR transformations.

At the moment, we are not aware of any use case which would require a merge logic for FHIR to openEHR transformations. If we find one, the merge logic can also be implemented there.
:::

"Merges" enables the mapping engine to map multiple HL7v2 segments to a specific openEHR template.

HL7v2 communication is based on various standardised messages, where each message has a specific semantic meaning. In opposite to a FHIR bundle, where each resource has a 1 to 1 mapping to the FHIR- or openEHR- store, multiple segments of a HL7v2 message could be merged and mapped to one single openEHR composition and stored in openEHR. This behaviour can be controlled with the "merges" block in the mapping definition.

The conditions in the "merges" block are "or" combined. If a segment of the merges entries is missing, the segment will be not used for the transformation, but the "merges" block would be still applied.

## Merges example

The following example would merge the segment with the value OBX.3.1 = 271649006 and the segment with the value OBX.3.1 = 271650006 to one blood pressure composition.

````
{
  "name" : "BloodPressure",
  "description" : "OBX blood pressure mapping.",
  "definition" : {
    "templateId" : "bloodPressure.v2.2.0",
    "sourceProtocol" : "HL7v2",
    "sourceProtocolVersions" : [ "2.3" ],
    "sourceType" : "OBX",
    "storageProtocol" : "openEHR",
    "storageProtocolVersion" : "1.1.0",
    "storageType" : "Composition",
    "transformations" : [
      ...
    ],
    "conditions" : [
      ...
    ],
    "merges": [
      {
        "condition" : "OBX.3.1",
        "expectedValue" : "271649006"
      },
      {
        "condition" : "OBX.3.1",
        "expectedValue" : "271650006"
      }
    ]
  }
}
````

