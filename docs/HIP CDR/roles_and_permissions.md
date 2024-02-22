# Roles and Permissions

## Default Scopes & Permissions

HIP CDR provides a defined set of default roles necessary to bootstrap the system and tenants. In a project environment, these roles and permissions will normally be adjusted to seamlessly integrate with local roles & permissions. A description of the default roles is given in the section on [Multi-Tenancy](multi_tenancy).

## Attribute Based Access Control (ABAC)

HIP CDR secures data by implementing the [Extensible Access Control Markup Language (XACML 3.0)](http://xml.coverpages.org/xacml.html) standard. Policies are used to secure services as well as data. 

:::info
For now, configuration of access control for roles needs to be done by vitagroup or an authorized partner. The CDR Suite will support this task for tenant-admins in one of the upcoming releases.
:::

The following list provides an extensive overview of available scopes and permissions in HIP CDR. These can be used as foundation to define individual role definitions:

| Category    | Scope            | Permissions                                                     |
| ----------- | ---------------- | --------------------------------------------------------------- |
| cdrforms    | form             | create<br/>delete<br/>metadata<br/>read<br/>render              |
| demographic | metadata         | read                                                            |
| demographic | resource         | create<br/>delete<br/>read<br/>search<br/>update                |
| ehrbase     | admin            | access                                                          |
| ehrbase     | composition      | create<br/>delete<br/>read<br/>update                           |
| ehrbase     | contribution     | create<br/>delete<br/>read<br/>update                           |
| ehrbase     | directory        | create<br/>read<br/>update                                      |
| ehrbase     | ehr              | create<br/>delete<br/>read<br/>read_status<br/>update<br/>update_status |
| ehrbase     | query            | create<br/>delete<br/>read<br/>search<br/>search_ad_hoc         |
| ehrbase     | system           | monitoring<br/>read<br/>status                                  |
| ehrbase     | template         | create<br/>delete<br/>example<br/>read<br/>update               |
| ehrbase     | trigger          | create<br/>delete<br/>read<br/>update                           |
| hip-suite   | account-management | enable                                                        |
| hip-suite   | admin-dashboard  | enable                                                          |
| hip-suite   | aql-editor       | enable                                                          |
| hip-suite   | explorer         | enable                                                          |
| hip-suite   | forms            | enable                                                          |
| hip-suite   | patient-viewer   | enable                                                          |
| hip-suite   | provisioning-ui  | enable                                                          |
| hip-suite   | templates        | enable                                                          |
| hip-suite   | tenant-users     | enable                                                          |
| mapping     | config           | create<br/>delete<br/>read<br/>update                           |
| orgservice  | role-management  | create<br/>delete<br/>read<br/>update                           |
| orgservice  | tenant-admin     | create<br/>delete<br/>read<br/>update                           |
| orgservice  | tenant-user      | create<br/>delete<br/>read<br/>update                           |
| tenant      |                  | read                                                            |


Within XACML, scopes and permissions are formalized the following way. The example shows the policy for healthcare professionals.

````
<Policy xmlns="urn:oasis:names:tc:xacml:3.0:core:schema:wd-17"
  PolicyId="938b692e-5075-4fe4-9be1-bcb671e3a8bb"
  RuleCombiningAlgId="urn:oasis:names:tc:xacml:1.0:rule-combining-algorithm:permit-overrides"
  Version="1.0">
  <Description>hcp policy</Description>
  <Target>
    <AnyOf>
        <AllOf>
          <Match MatchId="urn:oasis:names:tc:xacml:1.0:function:string-equal">
            <AttributeValue DataType="http://www.w3.org/2001/XMLSchema#string">hcp</AttributeValue>
            <AttributeDesignator
                AttributeId="urn:ag.vitagroup.hip.cdr.authorization.xacml:role"
                DataType="http://www.w3.org/2001/XMLSchema#string"
                MustBePresent="true"
                Category="urn:oasis:names:tc:xacml:1.0:subject-category:access-subject" />
          </Match>
        </AllOf>    
    </AnyOf>
  </Target>

  <Rule Effect="Permit" RuleId="permitAccess">
    <Target/>

    <Condition>
      <Apply FunctionId="urn:oasis:names:tc:xacml:1.0:function:any-of-all">
        <Function FunctionId="urn:oasis:names:tc:xacml:1.0:function:string-equal" />
        <Apply FunctionId="urn:oasis:names:tc:xacml:1.0:function:string-bag">
          <AttributeValue DataType="http://www.w3.org/2001/XMLSchema#string">ehrbase:template:read</AttributeValue>
          <AttributeValue DataType="http://www.w3.org/2001/XMLSchema#string">ehrbase:ehr:create</AttributeValue>
          <AttributeValue DataType="http://www.w3.org/2001/XMLSchema#string">ehrbase:ehr:read</AttributeValue>
          <AttributeValue DataType="http://www.w3.org/2001/XMLSchema#string">ehrbase:ehr:update</AttributeValue>
          <AttributeValue DataType="http://www.w3.org/2001/XMLSchema#string">ehrbase:ehr:update_status</AttributeValue>
          <AttributeValue DataType="http://www.w3.org/2001/XMLSchema#string">ehrbase:ehr:read_status</AttributeValue>
          <AttributeValue DataType="http://www.w3.org/2001/XMLSchema#string">ehrbase:composition:create</AttributeValue>
          <AttributeValue DataType="http://www.w3.org/2001/XMLSchema#string">ehrbase:composition:update</AttributeValue>
          <AttributeValue DataType="http://www.w3.org/2001/XMLSchema#string">ehrbase:composition:read</AttributeValue>
          <AttributeValue DataType="http://www.w3.org/2001/XMLSchema#string">ehrbase:directory:create</AttributeValue>
          <AttributeValue DataType="http://www.w3.org/2001/XMLSchema#string">ehrbase:directory:update</AttributeValue>
          <AttributeValue DataType="http://www.w3.org/2001/XMLSchema#string">ehrbase:directory:read</AttributeValue>
          <AttributeValue DataType="http://www.w3.org/2001/XMLSchema#string">ehrbase:contribution:create</AttributeValue>
          <AttributeValue DataType="http://www.w3.org/2001/XMLSchema#string">ehrbase:contribution:read</AttributeValue>
          <AttributeValue DataType="http://www.w3.org/2001/XMLSchema#string">ehrbase:contribution:update</AttributeValue>
          <AttributeValue DataType="http://www.w3.org/2001/XMLSchema#string">ehrbase:contribution:delete</AttributeValue>
          <AttributeValue DataType="http://www.w3.org/2001/XMLSchema#string">ehrbase:trigger:read</AttributeValue>
          <AttributeValue DataType="http://www.w3.org/2001/XMLSchema#string">ehrbase:query:read</AttributeValue>
          <AttributeValue DataType="http://www.w3.org/2001/XMLSchema#string">ehrbase:query:search</AttributeValue>
          <AttributeValue DataType="http://www.w3.org/2001/XMLSchema#string">ehrbase:query:search_ad_hoc</AttributeValue>
          <AttributeValue DataType="http://www.w3.org/2001/XMLSchema#string">ehrbase:admin:access</AttributeValue>
          <AttributeValue DataType="http://www.w3.org/2001/XMLSchema#string">ehrbase:system:status</AttributeValue>
        </Apply>

        <AttributeDesignator AttributeId="urn:ag.vitagroup.hip.cdr.authorization.xacml:scope"
          DataType="http://www.w3.org/2001/XMLSchema#string" MustBePresent="true"
          Category="urn:oasis:names:tc:xacml:1.0:subject-category:access-subject" />
      </Apply>
    </Condition>
  </Rule>

  <Rule Effect="Deny" RuleId="alwaysDeny" />
</Policy>
````

