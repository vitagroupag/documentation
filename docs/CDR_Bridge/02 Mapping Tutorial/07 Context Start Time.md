# Context Start Time

The ["start time" element](https://specifications.openehr.org/releases/RM/latest/ehr.html#_event_context_class) within the context of an openEHR composition  describes the "Start time of the clinical session or other kind of event during which a provider performs a service of any kind for the patient.".

Mappings to the context start time element are possible with the following syntax:

````
{
...
    "transformations": [
      {
        "storageClass" : "DvDateTime",
        "storagePath" : "/context/start_time",
        "attributes" : {
          "value" : {
            "type" : "rw",
            "dataType" : "DateTime",
            "sourcePath" : "OBX.14.1" // source date time element, which should be mapped to /context/start_time
          }
        }
      }
    ]
...
}
````



