sap.ui.define(["sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/core/routing/History"
    ], function(BaseController, MessageBox, History) {
    "use strict";

    return BaseController.extend("generated.app.controller.applicantdetails", {
    	handleRouteMatched: function (oEvent) {
		var oParams = {};
		
		if (oEvent.mParameters.data.context || oEvent.mParameters.data.masterContext) {
		    var oModel = this.getView ? this.getView().getModel() : null;
		    if (oModel) {
		        oModel.setRefreshAfterChange(true);
		
		        if (oModel.hasPendingChanges()) {
		            oModel.resetChanges();
		        }
		    }
		
		    this.sContext = oEvent.mParameters.data.context;
		    this.sMasterContext = oEvent.mParameters.data.masterContext;
		
		    if (!this.sContext) {
		        this.getView().bindElement("/" + this.sMasterContext, oParams);
		    }
		    else {
		        this.getView().bindElement("/" + this.sContext, oParams);
		    }
		
		}
		
	},
	_onPageNavButtonPress: function () {
		var oHistory = History.getInstance();
		var sPreviousHash = oHistory.getPreviousHash();
		
		if (sPreviousHash !== undefined) {
		    window.history.go(-1);
		} else {
		    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		    oRouter.navTo("default", true);
		}
		
	},
	_onUploadCollectionUploadComplete2: function (oEvent) {
		var oFile = oEvent.getParameter("files")[0];
		var iStatus = oFile ? oFile.status : 500;
		var sResponseRaw = oFile ? oFile.responseRaw : "";
		var oSourceBindingContext = oEvent.getSource().getBindingContext();
		var sSourceEntityId = oSourceBindingContext ? oSourceBindingContext.getProperty("ID") : null;
		var oModel = this.getView().getModel();
		
		return new ES6Promise.Promise(function (resolve, reject) {
		    if (iStatus !== 200) {
		        reject(new Error("Upload failed"));
		    }
		    else if (oModel.hasPendingChanges()) {
		        reject(new Error("Please save your changes, first"));
		    }
		    else if (!sSourceEntityId) {
		           reject(new Error("No source entity ID"));
		    }
		    else {
		        try {
		            var oResponse = JSON.parse(sResponseRaw);
		            oModel.setRefreshAfterChange(true);
		            var oNewEntityInstance = {};
		
		            oNewEntityInstance["ID"] = oResponse["ID"];
		            oNewEntityInstance[""] = sSourceEntityId;
		            oModel.createEntry("", { properties: oNewEntityInstance });
		            oModel.submitChanges({
		                success: function () {
		                    oModel.refresh(true, true);
		                    resolve();
		                },
		                error: function () {
		                    reject(new Error("submitChanges failed"));
		                }
		            });
		        }
		        catch (err) {
		            var message = typeof err === "string" ? err : err.message;
		            reject(new Error("Error: " + message));
		        }
		    }
		});
		
	},
	_onUploadCollectionChange2: function (oEvent) {
		var oUploadCollection = oEvent.getSource();
		var aFiles = oEvent.getParameter('files');
		
		if (aFiles && aFiles.length) {
		    var oFile = aFiles[0];
		    var sFileName = oFile.name;
		
		    var oDataModel = this.getView().getModel();
		    if (oUploadCollection && sFileName && oDataModel) {
		        var sXsrfToken = oDataModel.getSecurityToken();
		        var oCsrfParameter = new sap.m.UploadCollectionParameter({name: "x-csrf-token", value: sXsrfToken});
		        oUploadCollection.addHeaderParameter(oCsrfParameter);
		        var oContentDispositionParameter = new sap.m.UploadCollectionParameter({
		            name: "content-disposition",
		            value: "inline; filename=\"" + encodeURIComponent(sFileName) + "\""
		        });
		        oUploadCollection.addHeaderParameter(oContentDispositionParameter);
		    }
		    else {
		        throw new Error("Not enough information available");
		    }
		}
	},
	_onUploadCollectionTypeMissmatch2: function () {
		return new ES6Promise.Promise(function(fnResolve) {
		    sap.m.MessageBox.warning("The file you are trying to upload does not have an authorized file type (JPEG, JPG, GIF, PNG, TXT, PDF, XLSX, DOCX, PPTX).", {
		        title: "Invalid File Type",
		        onClose: function() {
		            fnResolve();
		        }
		    });
		});
		
	},
	_onUploadCollectionFileSizeExceed2: function () {
		return new ES6Promise.Promise(function(fnResolve) {
		    sap.m.MessageBox.warning("The file you are trying to upload is too large (10MB max).", {
		        title: "File Too Large",
		        onClose: function() {
		            fnResolve();
		        }
		    });
		});
		
	},
	onInit: function () {
		this.mBindingOptions = {};
        this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        this.oRouter.getTarget("applicantdetails").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));


	}
});
}, /* bExport= */true);
