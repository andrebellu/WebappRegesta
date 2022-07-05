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
          var itemPressed = oEvent.getParameter("itemPressed").getId();

          console.log(itemPressed);
          if (
            itemPressed === "__item0-__switch0-0" ||
            itemPressed === "__item1-__switch1-0"
          ) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
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

        getHours: function (oEvent) {
          var ore = oEvent.getParameter("value");
          var nuovoRapportino = this.getView()
            .getModel()
            .getProperty("/nuovoRapportino");

          nuovoRapportino.Ore = ore;
        },

        getPlus: function (oEvent) {
          var plus = oEvent.getParameter("value");
          var nuovoRapportino = this.getView()
            .getModel()
            .getProperty("/nuovoRapportino");

          nuovoRapportino.Plus = plus;
        },

        getFatturabile: function (oEvent) {
          var fatturabile = oEvent.getParameter("value");
          var nuovoRapportino = this.getView()
            .getModel()
            .getProperty("/nuovoRapportino");

          nuovoRapportino.Fatturabile = fatturabile;
        },

        showPopup: function (oEvent) {
          const defaultBody = {
            IDRapportino: null,
            IDUtente: null,
            Utente: sessionStorage.getItem("username"),
            IDCliente: 5,
            IDCommessa: 1969,
            IDClienteSede: null,
            IDProgetto: null,
            IDProgettoAttivita: null,
            IDTodoList: null,
            Codice: null,
            Descrizione: null,
            Attivita: null,
            Sede: "UF",
            Destinazione: null,
            Giorno: this.getCurrentDate(),
            Ore: 0,
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
            Plus: false,
            Fatturabile: true,
            Bloccato: null,
            SpeseVarie: null,
            Docente: null,
          };

          var oModel = this.getView().getModel();
          oModel.setProperty("/nuovoRapportino", defaultBody);

          var nuovoRapportino = oModel.getProperty("/nuovoRapportino");

          var source = oEvent.getSource();
          var setContext = source.setBindingContext(
            new sap.ui.model.Context(oModel, "/nuovoRapportino")
          );
          var getContext = setContext.getBindingContext();

          if (!this.pDialog) {
            this.pDialog = this.loadFragment({
              name: "regesta.regestarapportini.fragments.Popup",
            });
          }
          this.pDialog.then(function (oDialog) {
            oModel.setProperty("/nuovoRapportino", defaultBody);
            oDialog.setBindingContext(getContext);
            oDialog.open();
            nuovoRapportino.Plus = oDialog.byId("plus").getSelected();
            nuovoRapportino.Fatturabile = oDialog.byId("fatturabile").getSelected();
          });
        },

        onSave: function () {
          var nuovoRapportino = this.getView()
            .getModel()
            .getProperty("/nuovoRapportino");
          console.log(nuovoRapportino);

          

          // ? Chech date
          // collect input controls
          var oView = this.getView();
          var getDate = oView.byId("date");
          var bValidationError = false;

          bValidationError = this._validateGiornoInput(getDate);

          if (!bValidationError) {
            MessageToast.show("Rapportino aggiunto");

            //! API call for newRepo
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append(
              "Cookie",
              "ASP.NET_SessionId=h44eqjrap4hk2tsla2tjsbwv"
            );

            var raw = JSON.stringify(nuovoRapportino);

            var requestOptions = {
              method: "POST",
              headers: myHeaders,
              body: raw,
              redirect: "follow",
            };

            fetch(
              sessionStorage.getItem("hostname") + "/api_v2/nuovorapportino?token=" +
              sessionStorage.getItem("encodedToken"),
              requestOptions
            )
              .then((response) => response.text())
              .then((result) => console.log(result))
              .catch((error) => console.log("error", error));

            this.byId("popup").close();
          } else {
            MessageToast.show("Inserisci i dati correttamemte");
          }
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

        onGiornoChange: function (oEvent) {
          var oInput = oEvent.getSource();
          this._validateGiornoInput(oInput);
        },

        //! Check date input
        _validateGiornoInput: function (oInput) {
          var sValueState = "None";
          var bValidationError = false;
          var oBinding = oInput.getBinding("value");

          var [gg, month, year] = oInput.getValue().split("/");
          //per costruttore
          var gg1 = Number(gg) + 1,
            month1 = Number(month) - 1,
            year1 = Number(year);

          var date = new Date();
          if (
            new Date(year1, month1, gg1).getDay() == 0 ||
            new Date(year1, month1, gg1).getDay() == 1
          ) {
            MessageBox.information(
              "Hai avuto il premesso di creare il rapportino durante il weekend?"
            );
          }

          if (
            new Date(year1, month1, gg1).getDay() == 1 ||
            new Date(year1, month1, gg1).getDay() == 0
          ) {
            var h = Number(new Date(year1, month1, gg1).getDay()) + 6;
          } else {
            var h = Number(new Date(year1, month1, gg1).getDay()) - 1;
          }
          if (date.getDay() == 0) {
            var c = date.getDay() + 7;
          } else {
            var c = date.getDay();
          }

          if (
            (date.getDate() <= 7 && gg <= 7) ||
            (date.getDate() <= 7 && gg >= 24)
          ) {
            var t = date.getDate() + 30;
            if (gg >= 24) {
              var f = Number(gg);
            } else {
              var f = Number(gg) + 30;
            }
          } else {
            var f = gg;
            var t = date.getDate();
          }

          if (
            t - 7 == gg ||
            c < h ||
            t - f < 0 ||
            t - f > 7 ||
            date.getMonth() + 1 - month > 1 ||
            date.getMonth() + 1 - month < 0 ||
            date.getFullYear() != Number(year) ||
            oInput == ""
          ) {
            try {
              oBinding.getType().validateValue(oInput.getValue());
            } catch (oException) {
              sValueState = "Error";
              bValidationError = true;
            }
          } else {
            if (date.getMonth() + 1 - month == 1 && date.getDate() > 7) {
              try {
                oBinding.getType().validateValue(oInput.getValue());
              } catch (oException) {
                sValueState = "Error";
                bValidationError = true;
              }
            }
          }

          oInput.setValueState(sValueState);
          return bValidationError;
        },
      }
    );
  }
);
