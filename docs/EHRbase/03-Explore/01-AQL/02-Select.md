# AQL SELECT

The SELECT statement allows retrieving single values or objects defined in the CONTAINS clause. The syntax always starts with the keyword SELECT, optionally followed by DISTINCT, and then one or more column expressions.

A column expression is formed by an identified path, a function, a literal value, or a plain variable name defined in the FROM clause. Where a variable name is specified, the full object of the type associated with the variable is retrieved, such as a COMPOSITION, OBSERVATION, etc.

Each column expression may have a name alias renaming the associated data. When the SELECT clause contains multiple column expressions, they are separated using a comma. Note that the alias cannot be used within the WHERE clause, as the WHERE clause is processed before the SELECT clause, in accordance with the SQL standard.

## Identified paths (partial paths)

AQL uses elements from SQL and XPath for flexible querying of single elements and objects, depending on the provided archetype path.

```
SELECT
     o/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value/magnitude AS Body_Weight_Value
FROM EHR e CONTAINS
    COMPOSITION c CONTAINS
    OBSERVATION o[openEHR-EHR-OBSERVATION.body_weight.v2]
WHERE e/ehr_id/value = 'd50c939a-7661-4ef1-a67b-5a57661263db'
```

This retrieves a column containing the body weight measurement as a double. The result set appears as follows:

```
{
"q": "SELECT k/data[at0002]/events[at0003]/data[at0001]/items[at0004] AS body_weight_magnitude
        FROM EHR e CONTAINS COMPOSITION c CONTAINS OBSERVATION k[openEHR-EHR-OBSERVATION.body_weight.v2]
        WHERE e/ehr_id/value = '9b896d07-950f-4d69-833e-a22fde13b24b' LIMIT 1",
    "columns": [
        {
            "path": "k/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value/magnitude",
            "name": "body_weight_magnitude"
        }
    ],
    "rows": [
        [
            50.0
        ]
    ]
}
```

Shortening the path fetches the object at the hierarchy level the path represents, fetching complete element objects.

```
SELECT
     o/data[at0002]/events[at0003]/data[at0001]/items[at0004] AS Body_Weight_Element
FROM EHR e CONTAINS
    COMPOSITION c CONTAINS
    OBSERVATION o[openEHR-EHR-OBSERVATION.body_weight.v2]
WHERE e/ehr_id/value = 'd50c939a-7661-4ef1-a67b-5a57661263db'
```

Resulting in:

```
{
    "q": "SELECT k/data[at0002]/events[at0003]/data[at0001]/items[at0004] AS body_weight_magnitude FROM EHR e CONTAINS
            COMPOSITION c CONTAINS OBSERVATION k[openEHR-EHR-OBSERVATION.body_weight.v2]
            WHERE e/ehr_id/value = '9b896d07-950f-4d69-833e-a22fde13b24b'",
    "columns": [
        {
            "path": "k/data[at0002]/events[at0003]/data[at0001]/items[at0004]",
            "name": "body_weight_magnitude"
        }
    ],
    "rows": [
        [
            {
                "_type": "ELEMENT",
                "name": {
                    "_type": "DV_TEXT",
                    "value": "Body Weight"
                },
                "value": {
                    "_type": "DV_QUANTITY",
                    "units": "kg",
                    "magnitude": 50.0
                },
                "archetype_node_id": "at0004"
            }
        ]
    ]
}
```

## Predicates

The openEHR specification supports repeating paths based on the archetype path ID, useful for distinguishing between different analytes in a lab test, for example.

```
SELECT
    l/data[at0001]/events[at0002]/data[at0003]/items[openEHR-EHR-CLUSTER.laboratory_test_analyte.v1, 'carbon dioxide partial pressure']/items[at0001]
FROM EHR e CONTAINS
    COMPOSITION c CONTAINS
        OBSERVATION l[openEHR-EHR-OBSERVATION.laboratory_test_result.v1]
            CONTAINS CLUSTER d[openEHR-EHR-CLUSTER.laboratory_test_analyte.v1]
WHERE e/ehr_id/value = '723f0e06-bf5b-4ec2-adff-40caf4d8b67e'
```

Results will only contain values for carbon dioxide partial pressure. Similar results can often be achieved with a WHERE clause.

:::tip
CDR Bases allow combining multiple predicates with the AND operator, and support for OR, `>`, `>=`, `=`, `<`, `<=`, `!=` is specified.
:::

:::tip
Currently, only predefined predicates including 'name/value', 'ehr_id/value', and 'archetype_id' are supported.
:::

## Name Aliases

As in SQL, AQL supports the use of a name alias for the retrieved data. This is done with the keyword AS, followed by the name which conforms to the syntax rule of AQL variable.

```
SELECT
     o/data[at0002]/events[at0003]/data[at0001]/items[at0004] AS Body_Weight_Element
     ...
```     

## DISTINCT

The DISTINCT modifier specify whether duplicate rows should be filtered out from result set.

By default, an AQL query returns all data items selected by the FROM and WHERE clauses as rows in the result set. A row is considered to be duplicated in the result set if there is at least one other row with the same value for each corresponding column expression. DISTINCT specifies removal of all such duplicate rows from the result set.

Below is an example using DISTINCT modifier to filter out duplicate rows:

````
SELECT DISTINCT
   c/name/value AS Name, c/composer/name AS Composer
FROM
   EHR e[ehr_id/value=$ehrUid]
      CONTAINS COMPOSITION c
````

## Aggregation Functions

Aggregate functions calculate a single result value from a set of input values, allowing the query to return summarized information about a data item or a result set. Input values are selected by an expression in a form of an identified path applied to data items filtered by FROM and WHERE clauses. Unless specified otherwise, these functions ignore NULL input values.

The following Aggregate functions are supported for any path that leads to a primitive and not a complex object:
* `COUNT` (for all paths)
* `COUNT(DISTINCT)`
* `SUM`
* `MIN` (also for DV_ORDERED)
* `MAX` (also for DV_ORDERED)
* `AVG`

```
SELECT
    MAX(o/data[at0001]/events[at0006]/data[at0003]/items[at0004]/value/magnitude) AS maxValue,
    MIN(o/data[at0001]/events[at0006]/data[at0003]/items[at0004]/value/magnitude) AS minValue,
    AVG(o/data[at0001]/events[at0006]/data[at0003]/items[at0004]/value/magnitude) AS meanValue
FROM
    EHR e CONTAINS COMPOSITION c[openEHR-EHR-COMPOSITION.encounter.v1]
        CONTAINS OBSERVATION o[openEHR-EHR-OBSERVATION.blood_pressure.v1]
```

### COUNT

The COUNT function returns the number of values of given expression argument. The syntax is COUNT([DISTINCT] expression|*).

The DISTINCT keyword can be used to calculate the number of only distinct values of expression. The COUNT(*) is used to calculate the number of all rows of the result set, including duplicates and NULL values.

### MIN

The MIN function returns the minimum value of given expression argument. The syntax is MIN(expression).

If there are no matching rows, then this function returns NULL. Input values type should be either String, Date, Time, Integer or Real, and it will also determine the return type.

### MAX

The MAX function returns the maximum value of given expression argument. The syntax is MAX(expression).


### SUM

The SUM function returns the sum value of given expression argument. The syntax is SUM(expression).


### AVG

The AVG function returns the average value of given expression argument. The syntax is AVG(expression).

