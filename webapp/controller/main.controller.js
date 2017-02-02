sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/ws/WebSocket"
], function(Controller, WebSocket) {
	"use strict";

	return Controller.extend("iotkid.controller.main", {
		onInit: function() {
			var uModel = new sap.ui.model.json.JSONModel();
			uModel.loadData("/tnv/iot/services/coldchain.xsodata/Devices", {}, false, "GET");
			this.data = uModel.getProperty("/d/results/");

		},

		getData: function(oData) {
			var uModel = new sap.ui.model.json.JSONModel();
			var jsonModel = sap.ui.getCore().getModel("jsonModel");

			var jsonData = [];
			var oResult;
			for (var i = 0; i < this.data.length; i++) {

				uModel.loadData("/tnv/iot/services/gensense.xsodata/GenericMessages" +
					"?$filter=((DEVICEID eq '" + this.data[i].DEVICEID + "') )" +
					"&$top=1&$orderby=CREATION_TS desc", {}, false, "GET");

				oResult = uModel.getProperty("/d/results/0");
				oResult.name = "DEVICEID " + this.data[i].DEVICEID;
				
				uModel.loadData("/tnv/iot/services/coldchain.xsodata/Batches" +
					"?$filter=((DEVICEID eq '" + this.data[i].DEVICEID + "') )" +
					"&$top=1&$orderby=ENDDATE desc", {}, false, "GET");
					// console.log(uModel.getProperty("/d/results/0"));
				if (uModel.getProperty("/d/results/0")){
					oResult.name = oResult.name + " BATCHID "+uModel.getProperty("/d/results/0/BATCHID");
				}	
				this.adjustModel(oResult,uModel.getProperty("/d/results/0"));

				jsonData.push(oResult);

			}
			jsonModel.setProperty("/data", jsonData);
			jsonModel.refresh(true);
		},

		adjustModel: function(oResult,oDeviceInfo) {
			 oResult.TEMP = Math.round(+oResult.TEMP);
			var bHot = (oResult.TEMP >= parseFloat(oDeviceInfo.TEMPMIN) && oResult.TEMP <= parseFloat(oDeviceInfo.TEMPMAX));
			oResult.infoState = bHot ? "Success" : "Error";
			oResult.info = bHot ? "juiste temperatuur" : "te warm";

		},

		changeData: function(DEVICEID, TEMP) {
			var that = this;
			var jsonModel = sap.ui.getCore().getModel("jsonModel");
			var oData = jsonModel.getData();
			oData.data.forEach(function(item) {
				if ((item.DEVICEID === DEVICEID) && TEMP !== undefined) {
					item.TEMP = TEMP;
					that.adjustModel(item);
					}
			});
				jsonModel.setData(oData);
		},

		openConnection: function(oEvent) {
			var sUrl = "wss://iotkita28d5365e.hana.ondemand.com/gen_connectors/iotwebsocketproxy/loriot";
			this.webSocket = new WebSocket(sUrl).attachMessage(this.webSocketMessageRecieved, this).attachError(this.webSocketError,
			this).attachOpen(this.webSocketOpened, this);
		},

		webSocketOpened: function(oEvent) {
			console.log("connected")
		},

		webSocketMessageRecieved: function(oEvent) {
			var dataString = oEvent.getParameters().data;
			var data = JSON.parse(dataString);
			console.log(data);
			
			this.changeData(data.EUI, data.data.content.temp);
		},

		webSocketError: function(oEvent) {
			console.error(oEvent);
		},

		onPress: function(oEvent) {
			// sap.ui.getCore().byId("__xmlview0").setBusy(true);
		// var oItem = oEvent.getSource();
		// var sPath = oEvent.getSource().getBindingContext("jsonModel").getPath();
		// var jsonModel = sap.ui.getCore().getModel("jsonModel");
		// var sDeviceId = jsonModel.getProperty(sPath).DEVICEID;
		// console.log(sDeviceId);
		// var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		// oRouter.navTo("detail", {
		// 		deviceId: sDeviceId
		// 	});
		},
		
	onItemPress: function(oEvent) {
		// console.log("qwdqw");
		var sPath = oEvent.getSource().getBindingContext("odataModel").getPath();
		var odataModel = sap.ui.getCore().getModel("odataModel");
		var sSensorId = odataModel.getProperty(sPath).SensorId;
		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		oRouter.navTo("detail", {
				sBatchId: sSensorId
			});
		},
		
		onBeforeRendering: function() {
			var that = this;
			this.getData();
				// setInterval(function (){
				// 	that.getData();
				// }, 10000)

		},
		onAfterRendering: function() {
			this.openConnection();
			this.getView().addEventDelegate({
				onAfterShow: function(oEvent) {
					// sap.ui.getCore().byId("__xmlview0").setBusy(false);
				}.bind(this)					
			});
			
		}

	});
});