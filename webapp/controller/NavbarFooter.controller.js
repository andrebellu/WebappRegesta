sap.ui.define(
  [
    "sap/ui/Device",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/Button",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/ui/model/resource/ResourceModel",
    "sap/m/BadgeEnabler",
  ],
  function (
    Device,
    Controller,
    JSONModel,
    Button,
    MessageToast,
    Fragment,
    MessageBox,
    ResourceModel
  ) {
    "use strict";

    var token = sessionStorage.getItem("token");
    var defaultBody = {
			"IDRapportino": null,
			"IDUtente": null,
			"Utente": null,
			"IDCliente": null,
			"IDCommessa": null,
			"IDClienteSede": null,
			"IDProgetto": null,
			"IDProgettoAttivita": null,
			"IDTodoList": null,
			"Codice": null,
			"Descrizione": null,
			"Attivita": null,
			"Sede": "UF",
			"Destinazione": null,
			"Giorno": null,
			"Ore": null,
			"OreLavorate": null,
			"Km": null,
			"KmEuro": null,
			"Pedaggio": null,
			"Forfait": null,
			"Vitto": null,
			"Alloggio": null,
			"Noleggio": null,
			"Trasporti": null,
			"Varie": null,
			"Plus": null,
			"Fatturabile": null,
			"Bloccato": null,
			"SpeseVarie": null,
			"Docente": null
  };

    return Controller.extend(
      "regesta.regestarapportini.controller.NavbarFooter",
      {
        onInit: function () {

          var i18nModel = new ResourceModel({
            bundleName: "regesta.regestarapportini.i18n.i18n",
          });

          this.getView().setModel(i18nModel, "i18n");
        },

        fnChange: function (oEvent) {
            var itemPressed = oEvent
                .getParameter("itemPressed")
                .getId();

            console.log(itemPressed);
            if (
                itemPressed === "__item0-__switch0-0" ||
                itemPressed === "__item1-__switch1-0"
            ) {
                var oRouter =
                    sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteLogin");
            } else if (
                itemPressed === "__item0-__switch0-1" ||
                itemPressed === "__item1-__switch1-1"
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

        APICall: function () {
          var requestOptions = {
            method: "POST",
            redirect: "follow",
          };

          fetch(
            "https://asstest.regestaitalia.it/api_v2/rapportini?token=mF2rK0g%252bNh1xJnGB72RasA%253d%253d",
            requestOptions
          )
            .then((response) => response.text())
            .then((result) => this.handleData(result))
            .catch((error) => console.log("error", error));
        },

        handleData: function (data) {
          var oModel = this.getView().getModel();
          var items = JSON.parse(result);
          oModel.setProperty("/nuovoRapportino", items);
        },

        getCurrentDate: function () {
          var today = new Date();
          var yyyy = today.getFullYear();
          var mm = today.getMonth() + 1;
          var dd = today.getDate();

          if (dd < 10) dd = "0" + dd;
          if (mm < 10) mm = "0" + mm;

          today = dd + "/" + mm + "/" + yyyy;

          return today;
        },

        showPopup: function (oEvent) {
          
          var oModel = this.getView().getModel();
          oModel.setProperty("/nuovoRapportino", defaultBody);

          var nuovoRapportino = this.getView()
            .getModel()
            .getProperty("/nuovoRapportino");
          nuovoRapportino.Giorno = this.getCurrentDate();
          nuovoRapportino.Utente = sessionStorage.getItem("username");

          oModel.setProperty("/nuovoRapportino", nuovoRapportino);
          
          var source = oEvent.getSource();
          var setContext = source.setBindingContext(new sap.ui.model.Context(oModel, "/nuovoRapportino"));
          var getContext = setContext.getBindingContext();
          console.log(setContext);
          console.log(getContext);
          console.log(nuovoRapportino);

          if (!this.pDialog) {
            this.pDialog = this.loadFragment({
              name: "regesta.regestarapportini.fragments.Popup",
            });
          }
          this.pDialog.then(function (oDialog) {
            oDialog.setBindingContext(getContext);
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

        //! Check date input
        _validateInput: function (oInput) {
          var sValueState = "None";
          var bValidationError = false;
          var oBinding = oInput.getBinding("value");

          try {
            oBinding.getType().validateValue(oInput.getValue());
          } catch (oException) {
            sValueState = "Error";
            bValidationError = true;
          }

          oInput.setValueState(sValueState);

          return bValidationError;
        },

        onGiornoChange: function (oEvent) {
          var oInput = oEvent.getSource();
          this._validateGiornoInput(oInput);
        },

        _validateGiornoInput: function (oInput) {
          var sValueState = "None";
          var bValidationError = false;
          var oBinding = oInput.getBinding("value");

          var [gg, month, year] = oInput.getValue().split("/");
          //per costruttore
          var gg1 = Number(gg) + 1,
            month1 = Number(month) - 1,
            year1 = Number(year) + 2000;

          var date = new Date();
          if (
            new Date(year1, month1, gg1).getDay() == 0 ||
            new Date(year1, month1, gg1).getDay() == 1
          ) {
            MessageBox.information("Hai avuto il premesso?");
          }

          if (
            new Date(year1, month1, gg1).getDay() == 1 ||
            new Date(year1, month1, gg1).getDay() == 0
          ) {
            var h = Number(new Date(year1, month1, gg1).getDay()) + 6;
          } else {
            var h = Number(new Date(year1, month1, gg1).getDay()) - 1;
          }

          if (
            date.getDay() < h ||
            Math.abs(date.getDate() - gg) > 7 ||
            date.getMonth() + 1 != month ||
            date.getFullYear() != Number(year) + 2000 ||
            oInput == ""
          ) {
            try {
              oBinding.getType().validateValue(oInput.getValue());
            } catch (oException) {
              sValueState = "Error";
              bValidationError = true;
            }
          }

          oInput.setValueState(sValueState);
          return bValidationError;
        },
      }
    );
  }
);
