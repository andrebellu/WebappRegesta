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
                    // register swipe event
                    var oSwipeContent = oEvent.getParameter("swipeContent"), // get swiped content from event
                        oSwipeDirection = oEvent.getParameter("swipeDirection"); // get swiped direction from event
                    var msg = "";

                    if (oSwipeDirection === "BeginToEnd") {
                        // List item is approved, change swipeContent(button) text to Disapprove and type to Reject
                        oSwipeContent.setText("Approve").setType("Accept");
                        msg = "Swipe direction is from the beginning to the end (left ro right in LTR languages)";
                    } else {
                        // List item is not approved, change swipeContent(button) text to Approve and type to Accept
                        oSwipeContent.setText("Disapprove").setType("Reject");
                        msg = "Swipe direction is from the end to the beginning (right to left in LTR languages)";
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
                Timer1: function () {
                    if (check) {
                        check = false;
                        startTime =String( new Date().getHours())+" : "+String(new Date().getMinutes());
                        console.log(startTime);
                    } else {
                        endTime = String( new Date().getHours())+" : "+String(new Date().getMinutes());
                        console.log(endTime);
                        var [hourstart,minutestart]=String(startTime).split(" : ")
                        var [hourend,minutend]=String(endTime).split(" : ")
                        timeDiffHour=Number(hourend)-Number(hourstart);
                        timeDiffMinute=Number(minutend)-Number(minutestart);
                        timeDiff = timeDiffHour + timeDiffMinute/60;
                        console.log(timeDiff);
                        
                        check = true;
                        sessionStorage.setItem("timeDiff", timeDiff);
                        this.showPopup();
                        
                    }
                },

                showPopup: function () {
                    var date=new Date();
                    var nuovoRapportino = this.getView()
                    .getModel();
                    var data=date.getDate()+"/"+Number(date.getMonth())+1+"/"+date.getFullYear();
                    nuovoRapportino.setProperty("Giorno",data);
                    nuovoRapportino.setProperty("Utente",sessionStorage.getItem("username"));
                    nuovoRapportino.setProperty("Ore",sessionStorage.getItem("timeDiff"))
                    console.log(nuovoRapportino);
                    if (!this.pDialog) {
                    this.pDialog = this.loadFragment({
                    name: "regesta.regestarapportini.fragments.Popup",
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
                },
                APIcommesse: function(){
                  var request = {
                    method : "POST",
                    redirect : "follow",
                  };
                  fetch("https://asstest.regestaitalia.it/api_v2/commesse?token=mF2rK0g%252bNh1xJnGB72RasA%253d%253d&idCommessa=0&idCliente=0", request)
                    .then((response) => response.text())
                    .then((result) => this.handleCommesse(result))
                    .catch((error) => console.log("error", error));
                },
                handleCommesse: function(result){
                  var oModel = this.getView().getModel();
                  var commesse = JSON.parse(result);
                  oModel.setProperty("/commesse", commesse);
                },
                APIticket: function(){
                  var request = {
                    method : "POST",
                    redirect : "follow",
                  };
                  fetch("https://asstest.regestaitalia.it/api_v2/ticket?token=mF2rK0g%252bNh1xJnGB72RasA%253d%253d&idTicket=0", request)
                    .then((response) => response.text())
                    .then((result) => this.handleTicket(result))
                    .catch((error) => console.log("error", error));
                },
                handleTicket: function(result){
                  var oModel = this.getView().getModel();
                  var ticket = JSON.parse(result);
                  oModel.setProperty("/ticket", ticket);
                  console.log(oModel.getProperty("/ticket"));
                }
            }
        );
    }
);
