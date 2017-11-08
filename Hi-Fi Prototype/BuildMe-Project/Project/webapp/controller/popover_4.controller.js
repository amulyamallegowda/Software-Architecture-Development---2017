sap.ui.define(["sap/ui/core/mvc/Controller"], function(BaseController) {
	"use strict";

	return BaseController.extend("generated.app.controller.popover_4", {

    onInit: function() {
        this.mBindingOptions = {};
        this._oDialog = this.getView().getContent()[0];
    },
    onExit: function() {
        this._oDialog.destroy();
    },
    setRouter: function(oRouter) {
        this.oRouter = oRouter;
    },
	getBindingParameters: function () {
		return {};
		
	}
    });
}, /* bExport= */true);
