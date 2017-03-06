<#escape x as jsonUtils.encodeJSONString(x)>
{
	<#if message?has_content>
	"message": "${message}"
	</#if>
	"dataSource":
		{
			"name": "${sourceName}",
			"type": "${sourceType}",
      <#if datalistColumnValueField?has_content>"datalistColumnValueField": "${datalistColumnValueField}",</#if>
      <#if datalistColumnLabelField?has_content>"datalistColumnLabelField": "${datalistColumnLabelField}",</#if>
			<#if masterDataStorage?has_content>"masterDataStorage": {
				"itemType": "${masterDataStorage.itemType}",
				"datalistRef": "${masterDataStorage.datalistRef}",
				"label": "${masterDataStorage.label}"
			},</#if>
			<#if masterDataURL?has_content>"masterDataURL": "${masterDataURL}",</#if>
			<#if dataRootJsonQuery?has_content>"dataRootJsonQuery": "${dataRootJsonQuery}",</#if>
			<#if valueJsonField?has_content>"valueJsonField": "${valueJsonField}",</#if>
			<#if labelJsonField?has_content>"labelJsonField": "${labelJsonField}",</#if>
			<#if dataRootXpathQuery?has_content>"dataRootXpathQuery": "${dataRootXpathQuery}",</#if>
			<#if valueXpath?has_content>"valueXpath": "${valueXpath}",</#if>
			<#if labelXpath?has_content>"labelXpath": "${labelXpath}",</#if>
			"nodeRef": "${nodeRef}"
		}
}
</#escape>
