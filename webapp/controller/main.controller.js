sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("iotkid.controller.main", {
		onInit: function() {
			var oData = {
				"data": [{
						"id": 1,
						"name": "Milkpak 1",
						"temp": "7",
						"infoState": "Success",
						"info": "juiste temperatuur"
					}, {
						"id": 2,
						"name": "Milkpak 2",
						"temp": "12",
						"infoState": "Error",
						"info": "te warm"
					}

				]

			};
			var oModel = new sap.ui.model.json.JSONModel(oData);
			// sap.ui.getCore().setModel(oModel);
			// var m2 = sap.ui.getCore().getModel();
			this.getView().setModel(oModel);

		},
		onPress: function(oEvent) {
			var oTile = oEvent.getSource();
			var obj = oTile.getBindingContext();

			// var obj = this.getView.getModel().getOData()[id-1];

			// var overviewPage = sap.ui.view({
			// 		id: "overview page",
			// 		viewName: "dummenorangetnv.view.GreenhouseSelect",
			// 		type: sap.ui.core.mvc.ViewType.XML
			// 	});
		}

	});
});