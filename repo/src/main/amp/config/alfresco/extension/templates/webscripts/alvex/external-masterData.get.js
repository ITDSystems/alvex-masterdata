(function() {
	try {
		var connector = remoteService.connect("http");
		var url = args['url'];
		var root = args['root'];
		var label = args['label'];
		var value = args['value'];
		if( ! root.toLowerCase().match('^xpath:') ) {
			model.resp = connector.call( decodeURIComponent( url ) );
		} else {
			model.collection = [];
			root = root.substring(6);
			var res = xmlService.queryURL(url, root, label, value);
			for each( item in res )
				model.collection.push(item);
		}
		status.code = 200;
	} catch (e) {
		status.code = 500;
		status.message = e.message;
		model.message = e.message;
	}
})();
