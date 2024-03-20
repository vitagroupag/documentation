# Step 1: Data Models

Now, after we got an overview, it's time to put our hands on the tools. Though,
if you want to skip this part of the tutorial to directly work with EHRbase,
you can get the example files [here](https://openehr.org/ckm).

As a first step, we need to obtain the information models. As mentioned in the introduction,
the Clinical Knowledge Managers are our first address. To download all Archetypes, go to
the [International Clinical Knowledge Manager](https://openehr.org/ckm)

![alternate text](/img/ckm_main.png)

On the left side, you can find different categories of Archetypes, for example observations that
contain data models like blood pressure, body temperature, or Glasgow coma scale. For our tutorial,
we want to get a copy of the archetypes from the Clinical Knowledge Manager.*

Under Archetypes (marked in the image), you will find a function called *Bulk Export*.

![alternate text](/img/bulk.png)

You can choose if the export should only contain Archetypes from a selected project or all and depending
on its lifecycle status (published, draft etc.). Choose to get the latest published revision and use ADL (Archetype Definition Language)
as export format. Clicking **Bulk Export** will then download a zip folder containing all Archetypes meeting the criteria.*

Next, install the [Template Designer](http://downloads.oceaninformatics.com/downloads/TemplateDesigner/). The process should
be straight forward (At least on Windows). Alternatively, the [ADL Designer](https://tools.openehr.org/designer/)
can also be used to create Templates by following [this guide](https://openehr.atlassian.net/wiki/spaces/healthmod/pages/415465475/Archetype+Designer+-+template+building+manual).

Open the Template Designer. The first step is to configure a *Knowledge Repository*.

![alternate text](/img/template_designer.png)

Click on *Edit Repository List*

![alternate text](/img//RepositoryList.png)

Set *Archetype Files* to the path where you unzipped the Archetypes you obtained through the Bulk Export.
When you then select your new repository, the Archetypes should appear on the right window:

![alternate text](/img/template_designer_overview.png)

Now you can start to create your own Template. Typically, a Template needs an Archetype of type *Composition* as the root element.
The *Composition* Archetypes provide the basic structure for the Template through *Slots* (which can be filled with Archetypes) and
predefined metadata elements. In our example, we use the *Self Monitoring* Archetype. Just drag and drop the Archetype from the 
right panel to the left panel. Additionally, we add a blood pressure Archetype. Next, you can define further constraints on the 
particular elements, for example defining their cardinality, remove single elements, add terminology bindings etc.*

We could also fill the slot within the blood pressure Archetype with a device Archetype to collect information about the device used
for the measurement.

![alternate text](/img/ExampleTemplate.png)

Finally, give your Template a name. Then you can Export the Template in the Operational Template (OPT) Format (File --> Export --> As Operational Template).
This is all you need to upload your Template to EHRbase.
