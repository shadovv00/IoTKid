sap.ui.define([
	"sap/ui/core/mvc/Controller",
		"sap/ui/core/ws/WebSocket"
], function(Controller) {
	"use strict";

	return Controller.extend("iotkid.controller.overviewPage", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf iotkid.view.overviewPage
		 */
		onInit: function() {
			
			this.getView().addEventDelegate({
				// onBeforeShow: function(oEvent) {
				// 	console.log("onBeforeShow");
				// 	var sItemPath = this.getView().data("sPath");
				// 	console.log(sItemPath);
				// 	// var el = $("#overviewpage--chartContainer");
				// 	this.buildChart("0059AC00001502B5");
				// }.bind(this)
			});
			
			// this.webSocket = null;
			// this.jsonModel = new sap.ui.model.json.JSONModel({
			// 	data: [],
			// 	locations: [],
			// 	temps: [],
			// 	movement: []
			// });
			// var locationModel = new sap.ui.model.json.JSONModel({});
			// var messageModel = new sap.ui.model.json.JSONModel({});
			// locationModel.attachRequestCompleted(this.locationDataLoaded, this);
			// messageModel.attachRequestCompleted(this.messageLoaded, this);
			// this.getView().setModel(locationModel, "locationModel");
			// this.getView().setModel(this.jsonModel, "jsonModel");
			// this.getView().setModel(messageModel, "messageModel");
			
			},
			onHome: function() {
				sap.ui.getCore().byId("__xmlview0--appId").back();
				
			},
			
			buildChart: function(deviceId) {
			var uModel=new sap.ui.model.json.JSONModel();
		// uModel.loadData( "/tnv/iot/services/gensense.xsodata/GenericMessages?$top=1000&$orderby=CREATION_TS desc", {}, false, "GET");
		// uModel.loadData( "/tnv/iot/services/gensense.xsodata/GenericMessages"
		// +"?$filter=((DEVICEID eq "++")  or (DEVICEID eq "+thisKpiId+") )"
		
			// uModel.loadData( "/tnv/iot/services/gensense.xsodata/GenericMessages"
			// 				// +"?$filter=((DEVICEID eq '"+deviceId+"') and year(CREATION_TS) eq 2016) and month(CREATION_TS) eq 10)"
			// 				+"?$filter=((DEVICEID eq '"+deviceId+"') and year(CREATION_TS) eq 2016) and month(CREATION_TS) eq 9)"
			// 				+"&$top=7&$orderby=CREATION_TS desc"
			// 				,{}, false, "GET");

				uModel.loadData( "/tnv/iot/services/gensense.xsodata/GenericMessages"
					// +"?$filter=((DEVICEID eq '0059AC00001502BD')   and year(CREATION_TS) eq "+thisDate.getYear()+"  and month(CREATION_TS) eq "+thisDate.getMonth()+"  and day(CREATION_TS) eq "+thisDate.getDate()+"  )"
					+"?$filter=((DEVICEID eq '0059AC00001502BD'))"
					+"&$top=10&$orderby=CREATION_TS desc"
					,{}, false, "GET");
				console.log(uModel.getData().d.results[0]);

			// var nowDate=new Date().getTime();
				// console.log(uModel.getData().d.results[0].CREATION_TS);
				// console.log(uModel.getData().d.results[0].CREATION_TS  .slice(6, -2));
			var nowDate=new Date(+uModel.getData().d.results[0].CREATION_TS  .slice(6, -2)).getTime();
				// console.log(nowDate);
			var iii, thisDate;
			var dateForChart=[];
			for (iii = 0; iii < 7; iii++) { 
				thisDate=new Date(nowDate-86400000*iii);
				// console.log(thisDate.toISOString().slice(0, -5));

				uModel.loadData( "/tnv/iot/services/gensense.xsodata/GenericMessages"
					// +"?$filter=((DEVICEID eq '0059AC00001502BD')   and year(CREATION_TS) eq "+thisDate.getYear()+"  and month(CREATION_TS) eq "+thisDate.getMonth()+"  and day(CREATION_TS) eq "+thisDate.getDate()+"  )"
					+"?$filter=((DEVICEID eq '0059AC00001502BD')   and (CREATION_TS le datetime'"+thisDate.toISOString().slice(0, -5)+"')    )"
					+"&$top=1&$orderby=CREATION_TS desc"
					,{}, false, "GET");
				// console.log(uModel.getData().d.results[0]);
				dateForChart.push(uModel.getData().d.results[0])
			}


				uModel.loadData( "/tnv/iot/services/gensense.xsodata/GenericMessages"
					// +"?$filter=((DEVICEID eq '0059AC00001502BD')   and year(CREATION_TS) eq "+thisDate.getYear()+"  and month(CREATION_TS) eq "+thisDate.getMonth()+"  and day(CREATION_TS) eq "+thisDate.getDate()+"  )"
					+"?$filter=((DEVICEID eq '0059AC00001502BD')   and (CREATION_TS le datetime'"+thisDate.toISOString().slice(0, -5)+"')    )"
					+"&$top=30000&$orderby=CREATION_TS desc"
					,{}, false, "GET");
			dateForChart=uModel.getData().d.results;
			
			
			
			createChart( $("#overviewpage--chartContainer"), dateForChart);
			},


		// 	var sUrl = "wss://iotkita28d5365e.hana.ondemand.com/gen_connectors/iotwebsocketproxy/loriot";
		// 	this.webSocket = new WebSocket(sUrl).attachMessage(this.webSocketMessageRecieved, this).attachError(this.webSocketError,
		// 		this).attachOpen(this.webSocketOpened, this);
		// },

		// webSocketOpened: function(oEvent) {
		// 	this.getView().byId("testtext").setVar("Connected");
		// },

		// webSocketMessageRecieved: function(oEvent) {
		// 	var dataString = oEvent.getParameters().data;
		// 	var data = JSON.parse(dataString);
		// 	var jsonModel = this.getView().getModel("jsonModel");
		// 	var jsonData = jsonModel.getProperty("/data");
		// 	var item = new Object();
		// 	item.item = dataString;
		// 	jsonData.push(item);
		// 	jsonModel.setProperty("/data", jsonData);
		// 	if (data.data.content.temp !== undefined) {
		// 		this.loadTemp(data);
		// 	}
		// 	if(data.data.content.lat !== undefined && data.data.content.lat > 0){
		// 		this.loadLocation(data);
		// 	}
		// 	if(data.data.content.levelX !== undefined){
		// 		this.loadMovement(data);
		// 	}
		// },

		// webSocketError: function(oEvent) {
		// 	console.error(oEvent);
		// },

		// loadLocation: function(oData) {
		// 	// console.log(oEvent.getSource().getData());
		// 	// var jsonModel = this.getView().getModel("jsonModel");
		// 	// var jsonData = jsonModel.getProperty("/locations");
		// 	// jsonData.push(loadedData);
		// 	// jsonModel.setProperty("/locations", jsonData);
		// 	var myLatLng = {
		// 		lat: parseFloat(oData.data.content.lat),
		// 		lng: parseFloat(oData.data.content.lon)
		// 	};
		// 	// var deviceID = loadedData.data.EUI;
		// 	var marker = new google.maps.Marker({
		// 		position: myLatLng,
		// 		map: this.map,
		// 		title: oData.EUI
		// 	});

		// 	var infowindow = new google.maps.InfoWindow({
		// 		content: oData.EUI
		// 	});
		// 	marker.addListener('click', function() {
		// 		infowindow.open(map, marker);
		// 	});
		// },

		// loadTemp: function(oData) {
		// 	var loadedData = new Object();
		// 	var jsonModel = this.getView().getModel("jsonModel");
		// 	var jsonData = jsonModel.getProperty("/temps");
		// 	loadedData.EUI = oData.EUI;
		// 	loadedData.Temp = parseFloat(oData.data.content.temp);
		// 	loadedData.timestamp = new Date();
		// 	jsonData.push(loadedData);
		// 	jsonModel.setProperty("/temps", jsonData);
		// },
		
		// loadMovement: function(oData) {
		// 	var loadedData = new Object();
		// 	var jsonModel = this.getView().getModel("jsonModel");
		// 	var jsonData = jsonModel.getProperty("/movement");
		// 	loadedData.EUI = oData.EUI;
		// 	loadedData.levelX = parseFloat(oData.data.content.levelX);
		// 	loadedData.levelY = parseFloat(oData.data.content.levelY);
		// 	loadedData.levelZ = parseFloat(oData.data.content.levelZ);
		// 	loadedData.timestamp = new Date();
		// 	jsonData.push(loadedData);
		// 	jsonModel.setProperty("/movement", jsonData);
		// },

		// findLocation: function() {
		// 	if (navigator.geolocation) {
		// 		navigator.geolocation.getCurrentPosition(function(position) {
		// 			var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		// 			this.map.setCenter(pos);
		// 			// var infowindow = new google.maps.InfoWindow({
		// 			// 	map: this.map,
		// 			// 	position: pos,
		// 			// 	content: 'This is you Location\n' + pos
		// 			// });
		// 		}.bind(this));
		// 	}

		// },

		// initMap: function() {

		// 	var mapOptions = {
		// 		zoom: 11
		// 	};
		// 	this.map = new google.maps.Map(document.getElementById(this.getView().byId('map_canvas').sId), mapOptions);
		// 	this.findLocation();
		// },
		// onAfterRendering: function() {
		// 	this.getView().byId('map_canvas');
		// 	google.maps.event.addDomListener(window, 'load', this.initMap());
		// 	this.openConnection();
		// },
		
		// showConsole: function(oEvent){
		// 	if (!this.oConsoleDialog) {
		// 		// associate controller with the fragment
		// 		this.oConsoleDialog = sap.ui.xmlfragment("nl.thenextview.LoraApp.view.dialog.Console", this);
		// 	}
		// 	this.getView().addDependent(this.oConsoleDialog);

		// 	this.oConsoleDialog.open();
		// },
		
		// handleClose: function(oEvent){
		// 	this.oConsoleDialog.close();
		// }

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf iotkid.view.overviewPage
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf iotkid.view.overviewPage
		 */
			onAfterRendering: function() {
				// onBeforeShow: function(oEvent) {

					// var el = $("#overviewpage--chartContainer");
					this.buildChart("0059AC00001502B5");
			},

		
		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf iotkid.view.overviewPage
		 */
		//	onExit: function() {
		//
		//	}

	});

});