
[![Build Status](https://travis-ci.org/ITDSystems/alvex-reports.svg?branch=master)](https://travis-ci.org/ITDSystems/alvex-masterdata)

# Alvex Masterdata

Extends default Alfresco content model LIST constraints to use dynamic and external lists of values. Can be used when filling document metadata or task fields to fill form fields with a data from Alfresco data lists, Master Data management systems, any external XML or JSON file. For example, for any document it is possible to select a contractor. It allows avoiding mistakes in company naming if a document is entered by hand.

![image](http://docs.alvexcore.com/en-US/Alvex/2.1/html-single/Admin_Guide/images/img33.png)

[Presentation from Alfresco Summit 2014](http://www.slideshare.net/itdsystems/using-master-data).

Compatible with Alfresco 5.1.

This component depends on:
* [Alvex Utils](https://github.com/ITDSystems/alvex-utils)
* [Alvex Datagrid](https://github.com/ITDSystems/alvex-datagrid)

# Downloads

Download ready-to-use Alvex components via [Alvex](https://github.com/ITDSystems/alvex#downloads).

# Build from source

To build Alvex follow [this guide](https://github.com/ITDSystems/alvex#build-component-from-source).

# Use

### Configuring Master Data Sources

Administrator can create conenctions to the master data sources in Alfresco data-lists and in the third-party systems. The configuration can be done in the Admin Console.

There are three types of available master data sources:
* Datalist (column of the register or of the data list on any publicly visible site in Alfresco)
* External Master Data in JSON format (directory in third-party system such as SAP)
* External Master Data in XML format (directory in third-party system such as 1C)

As an internal directory you can select a column of the data list on the publicly visible site. The site should be publicly visible to allow all users that should use values of the directory. To choose the directory select the site and the data list title in the first field and the column title in the 'Value field' and 'Label field'. On the screenshot below you can see sample configuration for using Contractor column of Contacts data list on a Office site.

![image](http://docs.alvexcore.com/en-US/Alvex/2.1/html-single/Admin_Guide/images/img34.png)

To configure external system integration via JSON click Add REST/JSON button and enter the following parameters in the appeared window:
* **Name of the connection**. Later we will use it in the content model as a constraint.
* **URL** of the file in JSON format, it should be published on some web server and be available to Alvex.
* **Root** (query) of the objects to parse.
* **Label** and **Value** of the field to use. Usually these two fields have the same value. Value is a value that is saved in the node, label is the label that user sees. If label is changed in the external system (JSON file), it will be changed in Alfresco automatically.
* **Cache**. Specify should Alvex store a cached data for this master data source or not. *Currently not supported.*

![image](http://docs.alvexcore.com/en-US/Alvex/2.1/html-single/Admin_Guide/images/img35.png)

To configure external system integration via XML click Add REST/XML button and enter the following parameters in the appeared window:
* **Name of the connection**. Later we will use it in the content model as a constraint.
* **URL** of the file in XML format, it should be published on some web server and be available to Alvex.
* To **Root** (XPath query) field enter XPath to select right objects from XML. Sample paths: use */root/element* for *element* objects inside *root* on the first level of the multi-level XML, use *//CatalogObject.Banks[IsFolder='false']* for *CatalogObject.Banks* objects on the second level of the multi-level XML with IsFolder property set to false.
* **Label** and **Value** of the field to use. Usually these two fields have the same value. Value is a value that is saved in the node, label is the label that user sees. If label is changed in the external system (JSON file), it will be changed in Alfresco automatically.
* **Cache**. Specify should Alvex store a cached data for this master data source or not. *Currently not supported.*

![image](http://docs.alvexcore.com/en-US/Alvex/2.1/html-single/Admin_Guide/images/img36.png)

### Attaching Master data to the field

Use the following constraint to attach master data to the text property of the content type:

```
<constraints>
  <constraint name="dl:contractorMasterData" type="com.alvexcore.repo.masterdata.MasterDataConstraint">
		<parameter name="dataSourceName">
			<value>Name of the connection</value>
		</parameter>
	</constraint>
</constraints>
```

