sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("iotkid.controller.main", {
		onInit: function() {
			// var oData = {
			// 	"data": [{
			// 			"id": 1,
			// 			"name": "Milkpak 1",
			// 			"temp": "7",
			// 			"infoState": "Success",
			// 			"info": "juiste temperatuur"
			// 		}, {
			// 			"id": 2,
			// 			"name": "Milkpak 2",
			// 			"temp": "12",
			// 			"infoState": "Error",
			// 			"info": "te warm"
			// 		}

			// 	]

			// };
			// var oModel = new sap.ui.model.json.JSONModel(oData);
			// sap.ui.getCore().setModel(oModel);
			// var m2 = sap.ui.getCore().getModel();
			// this.getView().setModel(oModel);

		},
		onPress: function(oEvent) {
			
		var sPath = oEvent.getSource().getBindingContext("odataModel").getPath();
		var sId = "overviewpage";
		var oCore = sap.ui.getCore();
		var oApp = oCore.byId("__xmlview0--appId");
		
		var overviewPage = oCore.byId(sId);
		
			if(overviewPage) {
				overviewPage.data("itemPath",sPath);
				oApp.to(overviewPage);
			}else{
			overviewPage = sap.ui.view({
					id: sId,
					viewName: "iotkid.view.overviewPage",
					type: sap.ui.core.mvc.ViewType.XML
				});	
				overviewPage.data("itemPath",sPath);
				oApp.addPage(overviewPage);
				oApp.to(overviewPage);
			}

		
			
		}

	});
});