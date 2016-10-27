sap.ui.define([
	"sap/ui/core/mvc/Controller"
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
				onBeforeShow: function(oEvent) {
				console.log("onBeforeShow");
					var sItemPath = this.getView().data("sPath");
			console.log(sItemPath);
				}.bind(this)
			});
		
			},
			onHome: function() {
				sap.ui.getCore().byId("__xmlview0--appId").back();
				
			},
			

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
			// onAfterRendering: function() {
			
			// },

		
		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf iotkid.view.overviewPage
		 */
		//	onExit: function() {
		//
		//	}

	});

});