# WHERE

A `WHERE` clause is used to represent further criteria applied to the data items within the objects declared in the FROM (and CONTAINS) clause. A WHERE clause expresses the query criteria that cannot be represented in other AQL clauses, such as criteria on archetype id, composition committal date/time, and the criteria on in which order the returned results should be listed.

The WHERE clause syntax has the following parts (in order): keyword WHERE and one or more identified expressions. Logical operators `AND`, `OR`, `NOT` and parenthesis () can be used to combine multiple identified expressions. Examples:

```
WHERE
   c/name/value=$nameValue AND c/archetype_details/template_id/value=$templateId
```

```
WHERE
   (c/name/value = $nameValue OR c/archetype_details/template_id/value = $templateId) AND
   o/data[at0001]/events[at0006]/data[at0003]/items[at0004]/value/value >= 140
``` 

## Identified expression



## LIKE

The `LIKE` binary operator is used to compare a value of type string (or dates and times) against a simple pattern. The left-hand operand is an AQL identified path to a data element that is either a String or has a String representation, while the right-hand operand is a String value, representing the pattern to be matched. It returns true if the value matches the supplied pattern.

Below is an example using a simple pattern matching:

```
SELECT
   e/ehr_id/value, c/context/start_time
FROM
   EHR e
      CONTAINS COMPOSITION c[openEHR-EHR-COMPOSITION.administrative_encounter.v1]
         CONTAINS ADMIN_ENTRY admission[openEHR-EHR-ADMIN_ENTRY.admission.v1]
WHERE
   c/context/start_time LIKE '2019-0?-*'
```

## Matches

The matches binary operator is used in the `WHERE` clause. The left-hand operand is an AQL identified path. The right-hand operand is enclosed within curly braces ({}), and may take the following forms:

```
SELECT
   o/data[at0002]/events[at0003]/data/items[at0015]/items[at0018]/name
FROM
   EHR [uid=$ehrUid]
      CONTAINS Composition c
         CONTAINS Observation o[openEHR-EHR-OBSERVATION.microbiology.v1]
WHERE
   o/data[at0002]/events[at0003]/data/items[at0015]/items[at0018]/items[at0019]/items[at0021]/name/defining_code/code_string 
   matches {'18919-1', '18961-3', '19000-9'}
```

