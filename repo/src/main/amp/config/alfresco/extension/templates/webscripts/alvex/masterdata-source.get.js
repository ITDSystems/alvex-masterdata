(function() {
	try {
		var sourceRef = args['sourceRef'];
		var src = search.findNode(sourceRef);
    model.sourceType = src.properties["alvexmd:sourceType"];
    model.nodeRef = sourceRef;
		model.sourceName = src.properties["cm:name"];
		if (src.properties["alvexmd:sourceType"] == "datalist") {
			model.datalistColumnValueField = src.properties["alvexmd:datalistColumnValueField"];
			model.datalistColumnLabelField = src.properties["alvexmd:datalistColumnLabelField"];
			var assoc = src.assocs["alvexmd:masterDataStorage"][0];
			model.masterDataStorage = {
				"datalistRef": assoc["storeType"] + "://" + assoc["storeId"] + "/" + assoc["id"],
				"itemType": assoc.properties["dl:dataListItemType"],
				"label": assoc.properties["cm:title"] + " (" + assoc.parent.parent.properties["cm:title"] + ")"
			};
    }
		if (src.properties["alvexmd:sourceType"] == "restJSON") {
			model.masterDataURL = src.properties["alvexmd:masterDataURL"];
			model.dataRootJsonQuery = src.properties["alvexmd:dataRootJsonQuery"];
			model.valueJsonField = src.properties["alvexmd:valueJsonField"];
			model.labelJsonField = src.properties["alvexmd:labelJsonField"];
    }
		if (src.properties["alvexmd:sourceType"] == "restXML") {
			model.masterDataURL = src.properties["alvexmd:masterDataURL"];
			model.dataRootXpathQuery = src.properties["alvexmd:dataRootXpathQuery"];
			model.valueXpath = src.properties["alvexmd:valueXpath"];
			model.labelXpath = src.properties["alvexmd:labelXpath"];
    }
		status.code = 200;
	} catch (e) {
		status.code = 500;
		status.message = e.message;
		model.message = e.message;
	}
})();
