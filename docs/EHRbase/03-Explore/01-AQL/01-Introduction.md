# Introduction

The Archetype Query Language (AQL) is an essential part of the openEHR specifications. It allows to retrieve data from any compliant openEHR system while abstracting from the underlying database model. This means that only Archetypes need to be known in order to create and execute queries.

# Structure

The basic structure from AQL resembles a combination of SQL and language like XPath and JSONPath. As openEHR has a hierarchical structure, the CONTAINS keyword allows to provide a filter for the query based on the existence of instances of these classes (INSTRUCTION, ACTION, EVALUATION, OBSERVATION, CLUSTER etc.) within compositions and their specific Archetype IDs (e.g. "I want to retrieve data from all compositions that contain a blood pressure measurement AND corresponding device information).

````
SELECT​

e/ehr_id/value, //Selection of EHR-ID
a/data[at0002]/events[at0003]/data[at0001]/items[at0004]/magnitude, 
c/context/start_time/value​

FROM​

COMPOSITION c​

CONTAINS​

OBSERVATION a[openEHR-EHR-OBSERVATION.body_temperature.v2]​

WHERE​

a/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value/magnitude > 37 ​

ORDER BY​

c/context/start_time/value DESC

````

The paths are derived from Archetypes. Following figure illustrates the connection between Archetype and AQL expression.

![From Archetype to Query](/img/aql_process.png)

Each element inside an Archetype has a path consisting of its type and at-code (which can be understand as an internal identifier). Using the combination of type and at-codes, every element can be addressed. Predicates can be used to distinguish between paths that would otherwise be identical.

The root of the path is the archetype-id which is typically being used to in the CONTAINS statement. 


# Query Builder

As the paths in AQL rely on the abstraction of the openEHR Reference Model, they are difficult to handle. For this reasons, it is recommended to use aneditor that provides a visual representation of openEHR Archetypes and/or Templates. Such tooling allows to select paths from a user-friendly tree view, making the building of AQL queries easy.

See the CDR Suite documentation for a description of HIP CDR's AQL Editor.


