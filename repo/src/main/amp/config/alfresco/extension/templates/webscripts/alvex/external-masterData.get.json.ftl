<#if message?has_content>
{
	"message": "${message}"
}
<#elseif collection??>
<#escape x as jsonUtils.encodeJSONString(x)>
[
	<#list collection as item>
	{
		"label" : "${item.label}",
		"value" : "${item.value}"
	}<#if item_has_next>,</#if>
	</#list>
]
</#escape>
<#else>
${resp}
</#if>
