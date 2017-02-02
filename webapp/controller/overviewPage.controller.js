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
		},
		
		_onObjectMatched: function(oEvent) {
			// this.sDeviceID = oEvent.getParameter("arguments").deviceId;
			this.sBatchId = oEvent.getParameter("arguments").sBatchId;
			console.log(this.sBatchId);
		},
		
		onHome: function() {
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
			// console.log("this.sDeviceID= "+this.sDeviceID);
			// var sItemPath = this.getView().data("sPath");
			// var deviceId=sap.ui.getCore().getModel("jsonModel").getProperty(sItemPath).DEVICEID;                         
			// var deviceId="0059AC00001502BD";                      

			var uModel = new sap.ui.model.json.JSONModel();
			var dateForChart = [];
			if (this.dateFrom && this.dateTo) {
				uModel.loadData("/tnv/iot/services/coldchain.xsodata/Batches?$filter=BATCHID eq '" + this.sBatchId+"'", {}, false, "GET");
				var oBatchInfo=uModel.getData().d.results[0];
				// uModel.loadData("/tnv/iot/services/coldchain.xsodata/Devices?$filter=DEVICEID eq '" + this.sDeviceID + "'  ", {}, false, "GET");
				//old way to get data
				// console.log(oBatchInfo);
				// uModel.loadData("/tnv/iot/services/gensense.xsodata/GenericMessages" 
				// 	+ "?$select=TEMP, CREATION_TS" 
				// 	+ "&$filter=((DEVICEID eq '" + this.sDeviceID + "')  "
				// 	// + "and (CREATION_TS gt datetime'" + this.dateFrom.toISOString().slice(0, -5) + "')    )"
				// 	+ "and (CREATION_TS ge datetime'" + this.dateFrom.toISOString().slice(0, -5) + "' and CREATION_TS le datetime'" + this.dateTo.toISOString().slice(0, -5) + "'))"
				// 	+ "&$top=30000&$orderby=CREATION_TS desc", {}, false, "GET");
				uModel.loadData("/tnv/iot/services/coldchain.xsodata/COLDCHAINBTEMP2" +
					"?$filter=((BATCHID eq '" + this.sBatchId + "' and CORRECT eq '1') and (STARTDATE le datetime'"+new Date().toISOString()+"')"+
					         " and (CREATION_TS ge datetime'" + this.dateFrom.toISOString().slice(0, -5) + "' and CREATION_TS le datetime'" + this.dateTo.toISOString().slice(0, -5) + "' and STARTDATE le CREATION_TS))" +
					"&$top=30000&$orderby=CREATION_TS desc", {}, false, "GET");
					
					
				dateForChart = uModel.getData().d.results;
				// console.log(dateForChart);
				var chartcontainer = $("div [id*='chartContainer']")[0];
				createChart(chartcontainer, dateForChart, oBatchInfo.TEMPMIN, oBatchInfo.TEMPMAX );
			}
		},

		onInitGraphBuild: function(){
			
			var uModel = new sap.ui.model.json.JSONModel();
			// console.log(this.sBatchId);
			// uModel.loadData("/tnv/iot/services/coldchain.xsodata/Batches" + // old way to get deveiceId for future calculation and time of the last device session for timerange selectors
			// 	"?$filter=((BATCHID eq '" + this.sBatchId + "') and STARTDATE le datetime'"+new Date().toISOString()+"' )" +
			// 	"&$top=1&$orderby=STARTDATE desc", {}, false, "GET");
			// console.log(uModel.getProperty("/d/results/0"));
			// this.sDeviceID = uModel.getProperty("/d/results/0").DEVICEID;

			// uModel.loadData("/tnv/iot/services/coldchain.xsodata/Batches" +
			// 	"", {}, false, "GET");
			// console.log(uModel.getProperty("/d/results/0"));		

			
			uModel.loadData("/tnv/iot/services/coldchain.xsodata/COLDCHAINBTEMP2" +
				"?$filter=((BATCHID eq '" + this.sBatchId + "' and CORRECT eq '1') and (STARTDATE le datetime'"+new Date().toISOString()+"' and STARTDATE le CREATION_TS))" +
				"&$top=1&$orderby=CREATION_TS desc, STARTDATE desc", {}, false, "GET");
			// console.log(uModel.getProperty("/d/results/0"));		
			
			// var batchModel = sap.ui.getCore().getModel("batchModel");
			// console.log(batchModel);
			// var jsonModel = sap.ui.getCore().getModel("jsonModel");
			// console.log(jsonModel);
			// batchModel.setProperty("/data", uModel.getProperty("/d/results/0"));
			// batchModel.refresh(true);			
			// console.log(batchModel.getProperty("/data"));
			
			
			// var uModel = new sap.ui.model.json.JSONModel();
			// uModel.loadData("/tnv/iot/services/gensense.xsodata/GenericMessages" + "?$select=DEVICEID, CREATION_TS" +  // old way to get time of the last device session
			// 	"&$filter=((DEVICEID eq '" + this.sDeviceID + "'))" + "&$top=1&$orderby=CREATION_TS desc", {}, false, "GET");
			// console.log(uModel.getData().d.results);
			if (uModel.getData().d.results.length > 0) {
				var dateTo=uModel.getData().d.results[0].CREATION_TS.slice(6, -2) * 1;
				this.dateTo=new Date(dateTo);
				this.dateFrom=new Date(dateTo - 10800000);
				this.byId("dateTo").setDateValue(this.dateTo);
				this.byId("dateFrom").setDateValue(this.dateFrom);
				this.buildChart();
			}			
			this.byId("batchIdText").setText(this.sBatchId);
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
					this.onInitGraphBuild();			
				}.bind(this)
			});
		}




	});

});