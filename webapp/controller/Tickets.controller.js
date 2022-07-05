sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageToast",
        "sap/ui/model/json/JSONModel",
        "sap/ui/core/library",
        "sap/ui/core/Fragment",
        "sap/ui/model/resource/ResourceModel",
        "sap/ui/core/IconPool",
        "sap/m/Dialog",
        "sap/m/Button",
        "sap/m/library",
        "sap/m/List",
        "sap/m/StandardListItem",
        "sap/m/Text",
    ],
    function (
        Controller,
        msgT,
        JSONModel,
        coreLibrary,
        Fragment,
        ResourceModel,
        IconPool,
        Dialog,
        Button,
        mLibrary,
        List,
        StandardListItem,
        Text
    ) {
        "use strict";
        var check = true;
        var startTime, endTime, timeDiff;
        return Controller.extend(
            "regesta.regestarapportini.controller.Tickets",
            {
                onInit: function () {
                    var oModel = new JSONModel();

                    this.getView().setModel(oModel);
                    // set i18n model on view
                    var i18nModel = new ResourceModel({
                        bundleName: "regesta.regestarapportini.i18n.i18n",
                    });
                    this.getView().setModel(i18nModel, "i18n");
                    this.getView().getModel().setSizeLimit("10000");
                    this.APIclienti();
                    this.APIcommesse();
                    this.APIticket();
                },

                handleSwipe: function (oEvent) {
                    var swipedItem = oEvent.getParameter("listItem");
                    var context = swipedItem.getBindingContext();
                    var oModel = this.getView().getModel();
                    oModel.setProperty("/id", id);
                },

                Timer: function () {
                    if (check) {
                        check = false;
                        startTime = new Date().getTime();
                        console.log(startTime);
                    } else {
                        endTime = new Date().getTime();
                        console.log(endTime);
                        timeDiff = endTime - startTime;
                        console.log(timeDiff);
                        var minutes = Math.floor(timeDiff / 60000);
                        var seconds = ((timeDiff % 60000) / 1000).toFixed(0);
                        console.log(
                            minutes + ":" + (seconds < 10 ? "0" : "") + seconds
                        );
                        check = true;
                    }
                },

                showPopup: function (oEvent) {
                    var source = oEvent.getSource();
                    var context = source.getBindingContext();
                    var index = source.getBindingContext().getPath();
                    this.getView().getModel().setProperty("/index", index);
                    var path = this.getView().getModel().getProperty("/index");
                    this.getView().getModel().setProperty("/path", path);
                    console.log(path);
                    if (!this.pDialog) {
                        this.pDialog = this.loadFragment({
                            name: "regesta.regestarapportini.fragments.PopupTicket",
                        });
                    }
                    this.pDialog.then(function (oDialog) {
                        oDialog.setBindingContext(context);
                        oDialog.open();
                    });
                },
                onCancel: function (oEvent) {
                  this.byId("popup").close();
                },
                APIclienti: function(){
                  var request = {
                    method : "POST",
                    redirect : "follow",
                  };
                    var token = sessionStorage.getItem("token");
                    token = token.replace(/"/g, "");
                    token = encodeURIComponent(token);

                  fetch(hostname + "/api_v2/clienti?token="  + token + "&idCommessa=0&idCliente=0", request)
                    .then((response) => response.text())
                    .then((result) => this.handleClienti(result))
                    .catch((error) => console.log("error", error));
                },
                handleClienti: function(result){
                  var oModel = this.getView().getModel();
                  var clienti = JSON.parse(result);
                  oModel.setProperty("/clienti", clienti);
                },
                APIcommesse: function(){
                  var request = {
                    method : "POST",
                    redirect : "follow",
                  };
                  fetch(hostname + "/api_v2/commesse?token=mF2rK0g%252bNh1xJnGB72RasA%253d%253d&idCommessa=0&idCliente=0", request)
                    .then((response) => response.text())
                    .then((result) => this.handleCommesse(result))
                    .catch((error) => console.log("error", error));
                },
                handleCommesse: function(result){
                  var oModel = this.getView().getModel();
                  var clienti = JSON.parse(result);
                  oModel.setProperty("/clienti", clienti);
                  console.log(clienti);
                },
                APIticket: function(){
                  var request = {
                    method : "POST",
                    redirect : "follow",
                  };
                  fetch(hostname + "/api_v2/ticket?token=mF2rK0g%252bNh1xJnGB72RasA%253d%253d&idTicket=0", request)
                    .then((response) => response.text())
                    .then((result) => this.handleTicket(result))
                    .catch((error) => console.log("error", error));
                },
                handleTicket: function(result){
                  var oModel = this.getView().getModel();
                  var clienti = JSON.parse(result);
                  oModel.setProperty("/clienti", clienti);
                  console.log(oModel.getProperty("/ticket"));
                }
            }
        );
    }
);
