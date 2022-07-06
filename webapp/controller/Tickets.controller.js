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
        var oList;
        var token;
        var defaultBody = {
          IDRapportino: null,
          IDUtente: null,
          Utente: null,
          IDCliente: null,
          IDCommessa: null,
          IDClienteSede: null,
          IDProgetto: null,
          IDProgettoAttivita: null,
          IDTodoList: null,
          Codice: null,
          Descrizione: null,
          Attivita: null,
          Sede: "UF",
          Destinazione: null,
          Giorno: null,
          Ore: null,
          OreLavorate: null,
          Km: null,
          KmEuro: null,
          Pedaggio: null,
          Forfait: null,
          Vitto: null,
          Alloggio: null,
          Noleggio: null,
          Trasporti: null,
          Varie: null,
          Plus: null,
          Fatturabile: null,
          Bloccato: null,
          SpeseVarie: null,
          Docente: null,
        };
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
                    token = sessionStorage.getItem("token");
                    token = token.replace(/"/g, "");
                    token = encodeURIComponent(token);
                    this.APIclienti();
                    this.APIcommesse();
                    this.APIticket();
                },

                handleSwipe: function (oEvent) {
                    var swipedItem = oEvent.getParameter("listItem");
                    var context = swipedItem.getBindingContext();
                    var oModel = this.getView().getModel();
                },
                HandleDate: function(date){
                  var timeStamp = date.replace(/\D/g, "");
                  var FormattedDate = new Date(parseInt(timeStamp));
                  FormattedDate = FormattedDate.toLocaleDateString("it-IT");
                  return FormattedDate;
              },
                showPopup: function (oEvent) {
                    var i;
                    var code;
                    var clientDescription;
                    var orderDescription;
                    var FormattedDate;
                    var oModel = this.getView().getModel();
                    var source = oEvent.getSource();
                    var context = source.getBindingContext();
                    var index = source.getBindingContext().getPath();
                    oModel.setProperty("/index", index);
                    var path = oModel.getProperty("/index");
                    oModel.setProperty("/path", path);

                    var IDClient = oModel.getProperty(path + "/IDCliente");
                    var clientLength = oModel.getProperty("/clienti").length;

                    var IDOrder = oModel.getProperty(path + "/IDCommessa");
                    var orderLength = oModel.getProperty("/commesse").length;
                    for(i = 0; i <= clientLength; i++)
                    {
                      if(IDClient == oModel.getProperty("/clienti/" + i + "/IDCliente")){
                        code =  oModel.getProperty("/clienti/" + i + "/Codice");
                        clientDescription = oModel.getProperty("/clienti/" + i + "/Descrizione");
                        break;
                      }
                    }
                    for(i = 0; i <= orderLength; i++)
                    {
                      if(IDOrder == oModel.getProperty("/commesse/" + i + "/IDCommessa")){
                        orderDescription =  oModel.getProperty("/commesse/" + i + "/Descrizione");
                        break;
                      }
                    }
                    var clientName = code + " - " + clientDescription;
                    oModel.setProperty(path + "/ClientName", clientName);

                    oModel.setProperty(path + "/Order", orderDescription);

                    var insertDate = context.getProperty("InsertDate");
                    FormattedDate = this.HandleDate(insertDate);
                    oModel.setProperty(path + "/DataInserimento", FormattedDate);

                    var DataConsegnaRichiesta = context.getProperty("DataConsegnaRichiesta");
                    FormattedDate = this.HandleDate(DataConsegnaRichiesta);
                    oModel.setProperty(path + "/DataConsegna", FormattedDate);

                    var UltimaModifica = context.getProperty("UltimaModifica");
                    FormattedDate = this.HandleDate(UltimaModifica);
                    var Edited = oModel.getProperty(path + "/UltimaModificaUtente")+ " - " + FormattedDate;
                    oModel.setProperty(path + "/Modifica", Edited);
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

                  fetch("https://asstest.regestaitalia.it/api_v2/clienti?token="  + token + "&idCliente=0", request)
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
                  fetch("https://asstest.regestaitalia.it/api_v2/commesse?token=" + token + "&idCommessa=0&idCliente=0", request)
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
                  fetch("https://asstest.regestaitalia.it/api_v2/ticket?token="+ token + "&idTicket=0", request)
                    .then((response) => response.text())
                    .then((result) => this.handleTicket(result))
                    .catch((error) => console.log("error", error));
                },
                handleTicket: function(result){
                  var oModel = this.getView().getModel();
                  var ticket = JSON.parse(result);
                  oModel.setProperty("/ticket", ticket);
                }
            }
        );
    }
);
