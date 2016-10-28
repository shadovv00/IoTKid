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
			
	var uModel=new sap.ui.model.json.JSONModel();
		// uModel.loadData( "/tnv/iot/services/gensense.xsodata/GenericMessages?$top=1000&$orderby=CREATION_TS desc", {}, false, "GET");
		// uModel.loadData( "/tnv/iot/services/gensense.xsodata/GenericMessages"
		// +"?$filter=((DEVICEID eq "++")  or (DEVICEID eq "+thisKpiId+") )"
		uModel.loadData( "/tnv/iot/services/gensense.xsodata/GenericMessages"
			+"?$filter=((DEVICEID eq '0059AC00001502BD')  or (DEVICEID eq '0059AC00001502B5') or (DEVICEID eq '0059AC00001502C2') )"
			+"&$apply=groupby((DEVICEID,TEMP))"
			+"&$top=50&$orderby=TEMP desc"
			,{}, false, "GET");
		console.log(uModel.getData().d.results);
		var i;
		for (i = 0; i < uModel.getData().d.results.length; i++) { 
				console.log(uModel.getData().d.results[i].DEVICEID);
		}

		},
		onPress: function(oEvent) {
			
		var sPath = oEvent.getSource().getBindingContext("odataModel").getPath();
		var sId = "overviewpage";
	
		var oApp = sap.ui.getCore().byId("__xmlview0--appId");
		
		var overviewPage = oApp.getPage(sId);
		
			if(overviewPage) {
				overviewPage.data("sPath",sPath);
				oApp.to(overviewPage);
			}else{
			overviewPage = sap.ui.view({
					id: sId,
					viewName: "iotkid.view.overviewPage",
					type: sap.ui.core.mvc.ViewType.XML
				});	
				overviewPage.data("sPath",sPath);
				oApp.addPage(overviewPage);
				oApp.to(overviewPage);
			}

		
			
		}

	});
});