# Conditions applied on transformation level

Conditions can be applied on the custom mapping selection (see section above), as well as on transformation level.

:::warning
Note that conditions applied at the whole definition level (what is described in a section above) are different than conditions applied at the transformation level (described in this section). Syntax can differ and not all condition types are necessarily available at both levels.
:::

If a transformation entry contains a "conditions" element, the source to target mapping of this transformation entry will only be applied if all conditions are fulfilled. A transformation with a condition could look as follows:

```
"transformations" : [
  {
    "storagePath" : "status",
    "storageClass" : "String",
    "attributes" : {
      "value": {
        "type": "static",
        "sourcePath": "",
        "staticValue": "planned"
      }
    },
	"conditions": [
	  {
		"sourcePath": "MSH.9.1",
		"expectedValue": "ADT"
	  },
	  {
		"sourcePath": "MSH.9.2",
		"expectedValue": "A01"
	  }
	]
  },
  <...>
]
````

In the example above, the entry "planned" will only be written to "status", if the sourcePath "MSH.9.1" has the value "ADT" and the sourcePath "MSH.9.2" has the value "A01". The following is another type of condition:

````
"transformations" : [
  {
    "storagePath" : "effectiveDateTime",
    "storageClass" : "DateTime",
    "attributes" : {
      "value" : {
        "type" : "rw",
        "dataType" : "DateTime",
        "sourcePath" : "OBX.14"
      }
    },
	"conditions" : [
	  {
		"sourcePath" : "OBX.14",
		"isEmpty" : false
	  }
	]
  },
  {
    "storagePath" : "effectiveDateTime",
    "storageClass" : "DateTime",
    "attributes" : {
      "value" : {
        "type" : "rw",
        "dataType" : "DateTime",
        "sourcePath" : "OBR.7"
      }
    },
	"conditions" : [
	  {
		"sourcePath" : "OBX.14",
		"isEmpty" : true
	  }
	]
  },
  <...>
]
````

In the example above, the entry "effectiveDateTime" will be written based on the contents of "OBX.14" if this field is not empty, otherwise it will be based on the contents of "OBR.7".

Conditions on mapping level can be applied on "rw" and on "static" attributes.

