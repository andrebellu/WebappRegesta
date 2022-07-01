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
                    this.APIclienti();
                },

                handleSwipe: function (oEvent) {
                    // register swipe event
                    var oSwipeContent = oEvent.getParameter("swipeContent"), // get swiped content from event
                        oSwipeDirection = oEvent.getParameter("swipeDirection"); // get swiped direction from event
                    var msg = "";

                    if (oSwipeDirection === "BeginToEnd") {
                        // List item is approved, change swipeContent(button) text to Disapprove and type to Reject
                        oSwipeContent.setText("Approve").setType("Accept");
                        msg =
                            "Swipe direction is from the beginning to the end (left ro right in LTR languages)";
                    } else {
                        // List item is not approved, change swipeContent(button) text to Approve and type to Accept
                        oSwipeContent.setText("Disapprove").setType("Reject");
                        msg =
                            "Swipe direction is from the end to the beginning (right to left in LTR languages)";
                    }
                    msgT.show(msg);
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

                showPopup: function () {
                    if (!this.pDialog) {
                        this.pDialog = this.loadFragment({
                            name: "regesta.regestarapportini.fragments.PopupTicket",
                        });
                    }
                    this.pDialog.then(function (oDialog) {
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
                  fetch("https://asstest.regestaitalia.it/api_v2/clienti?token=mF2rK0g%252bNh1xJnGB72RasA%253d%253d&idCliente=0", request)
                    .then((response) => response.text())
                    .then((result) => this.handleClienti(result))
                    .catch((error) => console.log("error", error));
                },
                handleClienti: function(result){
                  var oModel = this.getView().getModel();
                  var clienti = JSON.parse(result);
                  oModel.setProperty("/clienti", clienti);
                  console.log(oModel.getProperty("/clienti"));
                }

            }
        );
    }
);
