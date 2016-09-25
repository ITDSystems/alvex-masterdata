(function() {
	try {
		var dlRef = json.get('data').get('dlRef');
		var dlField = json.get('data').get('dlField');

		var dl = search.findNode( dlRef );

		for each ( cl in dl.assocs["alvexdr:attachedMasterData"] )
		{
			if( cl.properties["alvexdr:masterDataTargetField"] == dlField )
			{
				dl.removeAssociation( cl, "alvexdr:attachedMasterData" );
				cl.remove();
			}
		}

		var type = json.get('data').get('type');
		var store = companyhome.childrenByXPath('/sys:system/sys:alvex/alvex:data/alvex:documents-registers')[0];

		if( type == "internal" )
		{
			var masterDataRef = json.get('data').get('masterDataRef');
			var masterDataField = json.get('data').get('masterDataField');

			if( (masterDataRef != "") && (masterDataField != "") )
			{
				var cl = search.findNode( masterDataRef );

				var newClConf = store.createNode(null,'alvexdr:internalMasterData','sys:children');
				newClConf.properties["alvexdr:masterDataTargetField"] = dlField;
				newClConf.properties["alvexdr:masterDataDataListColumn"] = masterDataField;
				newClConf.save();
				newClConf.createAssociation( cl, "alvexdr:masterDataDataList" );

				dl.createAssociation( newClConf, "alvexdr:attachedMasterData" );
			}
		}
		else if( type == "external" )
		{
			var url = json.get('data').get('url');
			var root = json.get('data').get('root');
			var label = json.get('data').get('label');
			var value = json.get('data').get('value');

			var newClConf = store.createNode(null,'alvexdr:externalMasterData','sys:children');
			newClConf.properties["alvexdr:masterDataTargetField"] = dlField;
			newClConf.properties["alvexdr:masterDataURL"] = url;
			newClConf.properties["alvexdr:masterDataDataRoot"] = root;
			newClConf.properties["alvexdr:masterDataLabelField"] = label;
			newClConf.properties["alvexdr:masterDataValueField"] = value;
			newClConf.save();

			dl.createAssociation( newClConf, "alvexdr:attachedMasterData" );
		}

		status.code = 200;
	} catch (e) {
		status.code = 500;
		status.message = e.message;
		model.message = e.message;
	}
})();
