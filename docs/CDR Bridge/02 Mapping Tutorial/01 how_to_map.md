# Understand your data

This guide is written from the perspective of a CDR Bridge user who wishes to write a new custom mapping. As there is no graphical user interface (yet), the steps described here require some technical knowledge. Assuming you're starting from scratch, writing a new custom mapping involves the following steps:

The first step before you start mapping data is to understand what you are going to map. Mappings in CDR bridge are bidirectional, they simply represent a correspondence between two formats, but there is an asymmetry when it comes to their use. When a client interacts with the CDR Bridge, it will be submitting and/or requesting data in a certain format. This is what we call the source protocol. This data is mapped back and forth to another format used for storage. This is what we call the storage protocol. Supported source protocols include FHIR R4 and HL7 V2.x. Supported storage protocols include openEHR (RM-1.1.0) and FHIR R4. Ask the team if you're dealing with something else. 

Data within a given source protocol can be defined in various versions (e.g. HL7v2 in version 2.2, 2.3, 2.5., ...; FHIR in R4, R4A, R5, ...). This is what we call the source protocol version. A custom mapping must be defined for at least one source protocol version, but can cover also multiple source protocol versions. 

:::tip
What are the source and storage protocols you want to map to/from? What versions are you targeting? Are they supported by CDR Bridge?
:::

After you determined the source and storage protocols and checked whether CDR Bridge supports it, start by listing which fields you want to map. You might feel tempted to map everything, but you'll soon find that can be a lot of work. If you have explicit requirements, maybe you're done. Otherwise, check the source and storage protocol's documentation for mandatory fields; if your protocol supports profiling (like FHIR does), check what fields must be supported (in FHIR this is marked explicitly in the profile definition); and, finally, explore examples or other sources to figure out which fields might additionally be useful to map and store appropriately.

:::tip
What are your requirements? Which fields are mandatory in your source protocol? Are there additional must-support fields in specific profiles? What else would be useful to map?
:::

When you've determined which fields you want to map on the source protocol, it's time to think of how they should be represented in the storage protocol. This page gives an overview of the openEHR Reference Model. It is useful to think of which base data types should be used to correctly represent the base data types of the fields you want to map, which data structures are better suited to group them, and how this all fits in the EHR information model. If your storage protocol is FHIR R4, take time to study the data types and their specific requirements as well as the different FHIR resources, which can be used.

:::tip
Which data types are better suited for the fields you want to map? How should these be structured? Are there additional mandatory fields?
:::

After gaining a deeper understanding of the data model of the storage protocol, it is time to work on your domain-level definition.

If your storage protocol is openEHR, your custom mapping will be based on a template. This defines the structure of the data as it will be stored in EHRbase. Templates are built by putting together one or more archetypes, which are the building blocks representing domain-level concepts. See this documentation for more details. If you can reuse an existing template, that's great, but often you will need/want to write your own. When it comes to archetypes, however, you should always use existing ones and only write your own as a last resort. Use the openEHR Foundation's CKM to search for existing artifacts that suit the type of data you want to map. There are also national level CKMs (see here), which you might be able to use to find additional materials, depending on the context you are working on. Give preference to published materials, as these are more stable and likely to be used across the industry.

:::tip
What existing archetypes fit the data I want to map? How should I combine them? Is there an existing template I can reuse?
:::

If your storage protocol is FHIR R4, you will be mapping directly to a resource type. Have a look at the resource list to figure out which resources are better suited for your needs.

:::tip
What existing resource fits the data I want to map?
:::

When you're done with all of this preliminary work, you should be ready to start developing your mapping.

