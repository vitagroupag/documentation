---
sidebar_position: 1
---

# Introduction

The Archetype Query Language (AQL) is an essential part of the openEHR specifications. It allows to retrieve data from any compliant openEHR system while abstracting from the underlying database model. This means that only Archetypes need to be known in order to create and execute queries.

# Structure

The basic structure from AQL resembles a combination of SQL and language like XPath and JSONPath. 

````
SELECT​

e/ehr_id/value, //Selection of EHR-ID
a/data[at0002]/events[at0003]/data[at0001]/items[at0004]/magnitude, //Selection of Archetyped data
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

# Query Builder

As the paths in AQL rely on the abstraction of the openEHR Reference Model, they are difficult to handle. For this reasons, it is recommended to use aneditor that provides a visual representation of openEHR Archetypes and/or Templates. Such tooling allows to select paths from a user-friendly tree view, making the building of AQL queries easy.

See the CDR Suite documentation for a description of HIP CDR's AQL Editor.
