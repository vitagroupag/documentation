# Static Mappings

The mappings we've seen so far have "type" = "rw". This means that contents will be copied from source to storage and vice-versa. However, sometimes it is useful to set values that are not represented on one of the sides of the mapping but should still show up in the other side. These are what we call static mappings. Let's change the example above to make it a static mapping:


```"transformations" : [
  {
    "storagePath" : "/content[openEHR-EHR-OBSERVATION.laboratory_test_result.v1]/data[at0001]/events[at0002]/data[at0003]/items[at0005]/value",
    "storageClass" : "DvText",
    "attributes" : {
      "value": {
        "type": "static",
        "sourcePath": "",
        "staticValue": "My static value"
      }
    }
  },
  <...>
]
```

Because the storage path is specified and the source path is empty, the result of this transformation is that attribute value of the node determined by the path will always be set to "My static value" irrespective of the contents of the source. 

Conversely, we can also define static mappings in the other direction, by leaving the storage path empty and specifying a source path. This could look as follows:

```"transformations" : [
  {
    "storagePath" : "",
    "storageClass" : "DvText",
    "attributes" : {
      "value": {
        "type": "static",
        "sourcePath": "code.coding[isList: true].display",
        "staticValue": "My static value"
      }
    }
  },
  <...>
]
````

In this case, no value will be stored in EHRbase, and the value in the source at path code.coding.display will be set to "My static value" irrespective of the contents of the composition being mapped.

The mapping engine has a lot more features, enabling you to handle references to demographic data, specify more complex paths, map dynamic lists of terms from other terminologies, and more. Please read the page on the Protocol Specific Path Language (PSPL) for more details and examples.

For completeness, see this page's sub-pages for more examples of attribute mapping per set of supported openEHR and FHIR datatypes.
