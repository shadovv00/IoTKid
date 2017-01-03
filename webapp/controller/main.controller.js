sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/ws/WebSocket"
], function(Controller, WebSocket) {
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
			var uModel = new sap.ui.model.json.JSONModel();
			// uModel.loadData("/tnv/iot/services/coldchain.xsodata/Batches", {}, false, "GET");
			// console.log(uModel.getProperty("/d/results/"));

			uModel.loadData("/tnv/iot/services/coldchain.xsodata/Devices", {}, false, "GET");
			
			this.data = uModel.getProperty("/d/results/");
			// console.log(this.data);

		},

		getData: function(oData) {
			var uModel = new sap.ui.model.json.JSONModel();
			var jsonModel = sap.ui.getCore().getModel("jsonModel");

			var jsonData = [];
			var oResult;
			// uModel.loadData("/tnv/iot/services/coldchain.xsodata/Devices", {}, false, "GET");
			// console.log(uModel.getProperty("/d/results/"));
			// uModel.loadData("/tnv/iot/services/coldchain.xsodata/Batches", {}, false, "GET");
			// console.log(uModel.getProperty("/d/results/"));
			for (var i = 0; i < this.data.length; i++) {

				uModel.loadData("/tnv/iot/services/gensense.xsodata/GenericMessages" +
					"?$filter=((DEVICEID eq '" + this.data[i].DEVICEID + "') )" +
					"&$top=1&$orderby=CREATION_TS desc", {}, false, "GET");

				oResult = uModel.getProperty("/d/results/0");
				oResult.name = "DEVICEID " + this.data[i].DEVICEID;
				
				uModel.loadData("/tnv/iot/services/coldchain.xsodata/Batches" +
					"?$filter=((DEVICEID eq '" + this.data[i].DEVICEID + "') )" +
					"&$top=1&$orderby=ENDDATE desc", {}, false, "GET");
				if (uModel.getProperty("/d/results/0")){
					oResult.name = oResult.name + " BATCHID "+uModel.getProperty("/d/results/0/BATCHID");
				}	
				this.adjustModel(oResult,this.data[i]);

				jsonData.push(oResult);

			}
			jsonModel.setProperty("/data", jsonData);
			jsonModel.refresh(true);
			// console.log(jsonModel);
			// uModel.loadData( "/tnv/iot/services/gensense.xsodata/GenericMessages?$top=1000&$orderby=CREATION_TS desc", {}, false, "GET");
			// uModel.loadData( "/tnv/iot/services/gensense.xsodata/GenericMessages"
			// +"?$filter=((DEVICEID eq "++")  or (DEVICEID eq "+thisKpiId+") )"
			// uModel.loadData("/tnv/iot/services/gensense.xsodata/GenericMessages" +
			// 	"?$filter=((DEVICEID eq 'DEVICEID')  or (DEVICEID eq '0059AC00001502B5') or (DEVICEID eq '0059AC00001502C2') )" +
			// 	"&$apply=groupby((DEVICEID,TEMP))" + "&$top=50&$orderby=TEMP desc", {}, false, "GET");
			// console.log(uModel.getData().d.results);
			// var i;
			// for (i = 0; i < uModel.getData().d.results.length; i++) {
			// 	console.log(uModel.getData().d.results[i].DEVICEID);
			// }

		},

		adjustModel: function(oResult,oDeviceInfo) {
			// console.log(oResult);
			// console.log(oDeviceInfo);
			 oResult.TEMP = Math.round(+oResult.TEMP);
			// oResult.TEMP = new Date().getMilliseconds();

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
			// var inputBox = this.getView().byId("wsInput");
			// var sUrl = inputBox.getValue();
			// var sUrl = "wss://www.italks.eu/app?id=BE7A005E&token=7B7lwnfs3m6rRJrfiGkKjA";
			var sUrl = "wss://iotkita28d5365e.hana.ondemand.com/gen_connectors/iotwebsocketproxy/loriot";
			this.webSocket = new WebSocket(sUrl).attachMessage(this.webSocketMessageRecieved, this).attachError(this.webSocketError,
				this).attachOpen(this.webSocketOpened, this);
		},

		webSocketOpened: function(oEvent) {
			// this.getView().byId("page").setTitle("Connected");
			// this.webSocket.send({
			// 	cmd: 'cq'
			// });
			console.log("connected")
		},

		webSocketMessageRecieved: function(oEvent) {
			var dataString = oEvent.getParameters().data;
			var data = JSON.parse(dataString);
			console.log(data);
			
			this.changeData(data.EUI, data.data.content.temp);
					
			// this.changeData (data.EUI, data.TEMP);
			// if (data.cmd === "rx") {
			// 	data.timestamp = new Date();
			// 	console.log(data);
			// 	var jsonModel = this.getView().getModel("jsonModel");
			// 	var jsonData = jsonModel.getProperty("/data");
			// 	jsonData.push(data);
			// 	jsonModel.setProperty("/data", jsonData);
			// 	if (data.data.startsWith("01")) {
			// 		//http://1m2m.eu/services/GETPAYLOAD?Human=0&PL=0102096100064f7a3c07a50300000000
			// 		var locationModel = this.getView().getModel("locationModel");
			// 		locationModel.setProperty("/data", data);
			// 		var sUrl = "/destinations/1m2mpayload/services/GETPAYLOAD?Human=0&PL=" + data.data;
			// 		locationModel.loadData(sUrl, null, true, "GET", true);
			// 	} else {
			// 		var messageModel = this.getView().getModel("messageModel");
			// 		messageModel.setProperty("/data", data);
			// 		var sUrl = "/destinations/1m2mpayload/services/GETPAYLOAD?Human=0&PL=" + data.data;
			// 		messageModel.loadData(sUrl, null, true, "GET", true);
			// 	}
			// }
		},

		webSocketError: function(oEvent) {
			console.error(oEvent);
		},

	onPress: function(oEvent) {
			// sap.ui.getCore().byId("__xmlview0").setBusy(true);
		var oItem = oEvent.getSource();
		var sPath = oEvent.getSource().getBindingContext("jsonModel").getPath();
		var jsonModel = sap.ui.getCore().getModel("jsonModel");
		var sDeviceId = jsonModel.getProperty(sPath).DEVICEID;
		console.log(sDeviceId);
		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		oRouter.navTo("detail", {
				deviceId: sDeviceId
			});
			// var oApp = sap.ui.getCore().byId("__xmlview0--appId");

			// var overviewPage = oApp.getPage(sId);

			// if (overviewPage) {
			// 	overviewPage.data("sPath", sPath);
			// 	oApp.to(overviewPage);
			// } else {
			// 	overviewPage = sap.ui.view({
			// 		id: sId,
			// 		viewName: "iotkid.view.overviewPage",
			// 		type: sap.ui.core.mvc.ViewType.XML
			// 	});
			// 	overviewPage.data("sPath", sPath);
			// 	oApp.addPage(overviewPage);
			// 	oApp.to(overviewPage);
			// }
			// var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// oRouter.navTo("detail");

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