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

        var token = sessionStorage.getItem("token");

        return Controller.extend(
            "regesta.regestarapportini.controller.NavbarFooter",
            {
                onInit: function () {},

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
                    ) {
                        window.open("https://www.regestaitalia.eu/", "_blank");
                    } else {
                        window.open(
                            "https://github.com/andrebellu/WebappRegesta",
                            "_blank"
                        );
                    }
                },

                fnOpen: function (oEvent) {
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

                    var oButton = oEvent.getParameter("button");
                    this._pPopover.then(function (oPopover) {
                        oPopover.openBy(oButton);
                    });
                },

                fnClose: function () {
                    this._pPopover.then(function (oPopover) {
                        oPopover.close();
                    });
                },

                goToTickets: function (oEvent) {
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteHome", { token: token });
                },
                goToRapportini: function (oEvent) {
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteTickets", { token: token });
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

                checkHours: function (oEvent) {
                    var oButton = oEvent.getSource(),
                        oView = this.getView();

                    // create popover
                    if (!this._pPopover) {
                        this._pPopover = Fragment.load({
                            id: oView.getId(),
                            name: "regesta.regestarapportini.fragments.ShowHours",
                            controller: this,
                        }).then(function (oPopover) {
                            oView.addDependent(oPopover);
                            return oPopover;
                        });
                    }
                    this._pPopover.then(function (oPopover) {
                        oPopover.openBy(oButton);
                    });
                },
            }
        );
    }
);
