sap.ui.define(
    [
        "sap/ui/Device",
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "sap/m/Button",
        "sap/m/MessageToast",
        "sap/ui/core/Fragment",
    ],
    function (Device, Controller, JSONModel, Button, MessageToast, Fragment) {
        "use strict";

        return Controller.extend(
            "regesta.regestarapportini.controller.NavbarFooter",
            {
                onInit: function () {
                    var oModel = new JSONModel("model/icons.json"),
                        oView = this.getView();
                    this.getView().setModel(oModel);

                    if (!this._pPopover) {
                        this._pPopover = Fragment.load({
                            id: oView.getId(),
                            name: "regesta.regestarapportini.fragments.Options",
                            controller: this,
                        }).then(
                            function (oPopover) {
                                oView.addDependent(oPopover);
                                if (Device.system.phone) {
                                    oPopover.setEndButton(
                                        new Button({
                                            text: "Close",
                                            type: "Emphasized",
                                            press: this.fnClose.bind(this),
                                        })
                                    );
                                }
                                return oPopover;
                            }.bind(this)
                        );
                    }
                },
                fnChange: function (oEvent) {

                    if (
                        oEvent.getParameter("itemPressed").getId() ===
                        "__item0-__switch0-0"
                    ) {
                        var oRouter =
                            sap.ui.core.UIComponent.getRouterFor(this);
                        oRouter.navTo("RouteLogin");
                    } else if (
                        oEvent.getParameter("itemPressed").getId() ===
                        "__item0-__switch0-1"
                    ){
						window.open("https://www.regestaitalia.eu/", "_blank");
					}else{
						window.open("https://github.com/andrebellu/WebappRegesta", "_blank");
					}
         },

		fnOpen: function(oEvent) 
		{
			var oButton = oEvent.getParameter("button");
			this._pPopover.then(function(oPopover)
			{
				oPopover.openBy(oButton);
			});
		},
		fnClose: function() 
		{
			this._pPopover.then(function(oPopover)
			{
				oPopover.close();
			});
		},
        test: function()
        {
            MessageToast.show("Test");
        },
		tickets: function(oEvent){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("RouteTickets");
		},
		rapportini: function(oEvent){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("RouteHome");
		},
		showPopup: function () {
			if (!this.pDialog) {
			  this.pDialog = this.loadFragment({
				name: "regesta.regestarapportini.fragments.Popup",
			  });
			}
			this.pDialog.then(function (oDialog) {
			  oDialog.open();
			  
			});
		  },
		  onSave: function (oEvent) {
			this.byId("popup").close();
		  },
	
		  onCancel: function (oEvent) {
			this.byId("popup").close();
		  },
	});
});