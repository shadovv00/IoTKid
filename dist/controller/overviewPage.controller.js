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
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("detail").attachPatternMatched(this._onObjectMatched, this)
				// this.getView().addEventDelegate({
				// 	onBeforeShow: function(oEvent) {

			// var el = $("#overviewpage--chartContainer");
			// this.buildChart("0059AC00001502B5");
			// 	}.bind(this)
			// });

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
		_onObjectMatched: function(oEvent) {
			this.sDeviceID = oEvent.getParameter("arguments").deviceId;
		},
		onHome: function() {
			// sap.ui.getCore().byId("__xmlview0--appId").back();
			// sap.ui.getCore().byId("__xmlview0").setBusy(true);
			

			// var oApp = sap.ui.getCore().byId("__xmlview0--app");
			// var oCurrentPage = oApp.getCurrentPage();
			// oCurrentPage.destroy();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			clearInterval(this.oInterval);
			oRouter.navTo("overview");

		},
		onChangeDateFrom: function(oEvent) {
			var ctrlDateFrom = oEvent.getSource();
			var ctrlDateTo = this.byId("dateTo");
			var oDateFrom = ctrlDateFrom.getDateValue();
			var oDateTo = ctrlDateTo.getDateValue();
			this.dateFrom = oDateFrom;
			if(oDateTo && oDateFrom.getLocalTotalPassedDays() > oDateTo.getLocalTotalPassedDays()) {
				ctrlDateTo.setDateValue(new Date(+oDateFrom));
			}
			this.buildChart();
		},
		onChangeDateTo: function(oEvent) {
			var ctrlDateFrom = this.byId("dateFrom");
			var ctrlDateTo = oEvent.getSource();
			var oDateFrom = ctrlDateFrom.getDateValue();
			var oDateTo = ctrlDateTo.getDateValue();
			this.dateTo = oDateTo;
			if(oDateFrom && oDateFrom.getLocalTotalPassedDays() > oDateTo.getLocalTotalPassedDays()) {
				ctrlDateFrom.setDateValue(new Date(+oDateTo));
			}
			this.buildChart();
		},
		
		dateFrom: null,
		dateTo: null,


		buildChart: function() {
			$("div [id*='chartContainer'] svg").remove();
			console.log("this.sDeviceID= "+this.sDeviceID);
			// var sItemPath = this.getView().data("sPath");
			// var deviceId=sap.ui.getCore().getModel("jsonModel").getProperty(sItemPath).DEVICEID;                         
			// var deviceId="0059AC00001502BD";                      

			var uModel = new sap.ui.model.json.JSONModel();
			var dateForChart = [];
			//for weekly
			// var nowDate=new Date().getTime();
			// var iii, thisDate;
			// for (iii = 0; iii < 7; iii++) { 
			// 	thisDate=new Date(nowDate-86400000*iii);
			// 	uModel.loadData( "/tnv/iot/services/gensense.xsodata/GenericMessages"
			// 		// +"?$filter=((DEVICEID eq '0059AC00001502BD')   and year(CREATION_TS) eq "+thisDate.getYear()+"  and month(CREATION_TS) eq "+thisDate.getMonth()+"  and day(CREATION_TS) eq "+thisDate.getDate()+"  )"
			// 		+"?$filter=((DEVICEID eq '0059AC00001502BD')   and (CREATION_TS le datetime'"+thisDate.toISOString().slice(0, -5)+"')    )"
			// 		+"&$top=1&$orderby=CREATION_TS desc"
			// 		,{}, false, "GET");
			// 	// console.log(uModel.getData().d.results[0]);
			// 	dateForChart.push(uModel.getData().d.results[0])
			// }
			//for last 3 hours				
			// uModel.loadData("/tnv/iot/services/gensense.xsodata/GenericMessages" + "?$select=DEVICEID, CREATION_TS" +
			// 	"&$filter=((DEVICEID eq '" + this.sDeviceID + "'))" + "&$top=1&$orderby=CREATION_TS desc", {}, false, "GET");
			// console.log(uModel.getData());
			if (this.dateFrom && this.dateTo) {

				uModel.loadData("/tnv/iot/services/coldchain.xsodata/Devices?$filter=DEVICEID eq '" + this.sDeviceID + "'  ", {}, false, "GET");
				var oDevInfo=uModel.getData().d.results[0];
				// console.log(oDevInfo);
				uModel.loadData("/tnv/iot/services/gensense.xsodata/GenericMessages" 
					+ "?$select=TEMP, CREATION_TS" 
					+ "&$filter=((DEVICEID eq '" + this.sDeviceID + "')  "
					// + "and (CREATION_TS gt datetime'" + this.dateFrom.toISOString().slice(0, -5) + "')    )"
					+ "and (CREATION_TS ge datetime'" + this.dateFrom.toISOString().slice(0, -5) + "' and CREATION_TS le datetime'" + this.dateTo.toISOString().slice(0, -5) + "'))"
					+ "&$top=30000&$orderby=CREATION_TS desc", {}, false, "GET");
				dateForChart = uModel.getData().d.results;
				// console.log(dateForChart);
				var chartcontainer = $("div [id*='chartContainer']")[0];
			
				createChart(chartcontainer, dateForChart, oDevInfo.TEMPMIN, oDevInfo.TEMPMAX );
			}
		},

		onInitGraphBuild: function(){
			var uModel = new sap.ui.model.json.JSONModel();
			uModel.loadData("/tnv/iot/services/gensense.xsodata/GenericMessages" + "?$select=DEVICEID, CREATION_TS" +
				"&$filter=((DEVICEID eq '" + this.sDeviceID + "'))" + "&$top=1&$orderby=CREATION_TS desc", {}, false, "GET");
			// console.log(uModel.getData().d.results);
			if (uModel.getData().d.results.length > 0) {
				var dateTo=uModel.getData().d.results[0].CREATION_TS.slice(6, -2) * 1;
				this.dateTo=new Date(dateTo);
				this.dateFrom=new Date(dateTo - 10800000);
				this.byId("dateTo").setDateValue(this.dateTo);
				this.byId("dateFrom").setDateValue(this.dateFrom);
			}			
			
			this.buildChart();
			clearInterval(this.oInterval);
			var that = this;
			this.oInterval = setInterval(function (){
				that.buildChart();
			}, 10000);				
		},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf iotkid.view.overviewPage
		 */
		onAfterRendering: function() {
			// console.log("onAfterRendering");
			this.onInitGraphBuild();			
			this.getView().addEventDelegate({
				onBeforeShow: function(oEvent) {
					// console.log("onBeforeShow");
					this.onInitGraphBuild();			
				}.bind(this)
				// ,onAfterShow: function(oEvent) {
				// 	console.log("onAfterShow");
				// 	// sap.ui.getCore().byId("__xmlview0").setBusy(false);
				// }.bind(this)					
			});
		}




	});

});