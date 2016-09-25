<#escape x as jsonUtils.encodeJSONString(x)>
{
	<#if message?has_content>
	"message": "${message}"
	</#if>
	"masterData":
	[
	<#list masterData as item>
		{
			"type": "${item.type}",
			"dlRef": "${item.dlRef}",
			"dlField": "${item.dlField}",
			<#if item.type == "internal">
			"clRef": "${item.clRef}",
			"clField": "${item.clField}"
			<#else>
			"url": "${item.url}",
			"root": "${item.root}",
			"label": "${item.label}",
			"value": "${item.value}"
			</#if>
		}<#if item_has_next>,</#if>
	</#list>
	]
}
</#escape>
