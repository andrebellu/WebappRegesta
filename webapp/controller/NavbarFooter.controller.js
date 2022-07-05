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
                    const defaultBody = {
                        IDRapportino: null,
                        IDUtente: null,
                        Utente: sessionStorage.getItem("username"),
                        IDCliente: null,
                        IDCommessa: 1969,
                        IDClienteSede: null,
                        IDProgetto: null,
                        IDProgettoAttivita: null,
                        IDTodoList: 25329,
                        Codice: null,
                        Descrizione: null,
                        Attivita: null,
                        Sede: "UF",
                        Destinazione: null,
                        Giorno: "2022-07-04T00:00:00",
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
                        Plus: false,
                        Fatturabile: true,
                        Bloccato: null,
                        SpeseVarie: null,
                        Docente: null,
                    };

                    var oModel = this.getView().getModel();
                    oModel.setProperty("/nuovoRapportino", defaultBody);

                    var nuovoRapportino = this.getView()
                        .getModel()
                        .getProperty("/nuovoRapportino");

                    nuovoRapportino.Giorno = this.getCurrentDate();
                    nuovoRapportino.Utente = sessionStorage.getItem("username");

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
                    });
                },

                onSave: function () {
                    const defaultBody = {
                        IDRapportino: null,
                        IDUtente: null,
                        Utente: "studente.itis",
                        IDCliente: 5,
                        IDCommessa: 1969,
                        IDClienteSede: null,
                        IDProgetto: null,
                        IDProgettoAttivita: null,
                        IDTodoList: 25329,
                        Codice: null,
                        Descrizione: "Pizda mati",
                        Attivita: null,
                        Sede: "UF",
                        Destinazione: null,
                        Giorno: "2022-07-04T00:00:00",
                        Ore: 22.0,
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
                        Fatturabile: false,
                        Bloccato: null,
                        SpeseVarie: null,
                        Docente: null,
                    };
                    var nuovoRapportino = this.getView()
                        .getModel()
                        .getProperty("/nuovoRapportino");
                    console.log(nuovoRapportino);
                    console.log(JSON.stringify(defaultBody));

                    var requestOptions = {
                        method: "POST",
                        body: JSON.stringify(defaultBody),
                        redirect: "follow",
                    };

                    var token = sessionStorage.getItem("token");

                    token = token.replace(/"/g, "");
                    var encodedToken = encodeURIComponent(token);

                    sessionStorage.setItem("encodedToken", encodedToken);

                    fetch(
                        "https://asstest.regestaitalia.it/api_v2/nuovorapportino?token=" +
                            sessionStorage.getItem("encodedToken"),
                        requestOptions
                    )
                        .then((response) => response.text())
                        .then((result) => console.log(result))
                        .catch((error) => console.log("error", error));
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
                        var h =
                            Number(new Date(year1, month1, gg1).getDay()) + 6;
                    } else {
                        var h =
                            Number(new Date(year1, month1, gg1).getDay()) - 1;
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
                        date.getFullYear() != Number(year) + 2000 ||
                        oInput == ""
                    ) {
                        try {
                            oBinding.getType().validateValue(oInput.getValue());
                        } catch (oException) {
                            sValueState = "Error";
                            bValidationError = true;
                        }
                    } else {
                        if (
                            date.getMonth() + 1 - month == 1 &&
                            date.getDate() > 7
                        ) {
                            try {
                                oBinding
                                    .getType()
                                    .validateValue(oInput.getValue());
                            } catch (oException) {
                                sValueState = "Error";
                                bValidationError = true;
                            }
                        }
                    }

                    oInput.setValueState(sValueState);
                    return bValidationError;
                },
                onSubmit: function () {
                    // collect input controls
                    var oView = this.getView(),
                        hello = [oView.byId("date")],
                        bValidationError = false;

                    // Check that inputs are not empty.
                    // Validation does not happen during data binding as this is only triggered by user actions.

                    hello.forEach(function (oInput) {
                        bValidationError =
                            this._validateGiornoInput(oInput) ||
                            bValidationError;
                    }, this);

                    if (!bValidationError) {
                        MessageBox.success(
                            "la procedura è andata con successo"
                        );
                        //this.ApiGenera();
                    } else {
                        MessageBox.alert("la procedura è andata a fallimento");
                    }
                },
                handleData: function (raw) {
                    var oModel = this.getView().getModel();
                    var items = raw;
                    oModel.setProperty("/items", items);
                },
                ApiGenera: function () {
                    var oModel = this.getView().getModel();

                    var myHeaders = new Headers();
                    var myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");
                    myHeaders.append(
                        "Cookie",
                        "ASP.NET_SessionId=ykhyiqc5du5r3cytzuxzovhd"
                    );

                    var raw = JSON.stringify({
                        IDRapportino: 595443,
                        IDUtente: null,
                        Utente: oModel.getProperty("/name"),
                        IDCliente: 10,
                        IDCommessa: 1969,
                        IDClienteSede: null,
                        IDProgetto: null,
                        IDProgettoAttivita: null,
                        IDTodoList: 25329,
                        Codice: null,
                        Descrizione: oModel.getProperty("/description"),
                        Attivita: null,
                        Sede: oModel.getProperty("/sede"),
                        Destinazione: oModel.getProperty("/destination"),
                        Giorno: oModel.getProperty("/date"),
                        Ore: oModel.getProperty("/ore"),
                        OreLavorate: null,
                        Km: oModel.getProperty("/km"),
                        KmEuro: oModel.getProperty("/kmPrice"),
                        Pedaggio: oModel.getProperty("/toll"),
                        Forfait: oModel.getProperty("/forfait"),
                        Vitto: oModel.getProperty("/food"),
                        Alloggio: oModel.getProperty("/accomodation"),
                        Noleggio: oModel.getProperty("/rental"),
                        Trasporti: oModel.getProperty("/transport"),
                        Varie: oModel.getProperty("/various"),
                        Plus: oModel.getProperty("/plus"),
                        Fatturabile: oModel.getProperty("/fatturabile"),
                        Bloccato: null,
                        SpeseVarie: null,
                        Docente: null,
                    });

                    var requestOptions = {
                        method: "POST",
                        headers: myHeaders,
                        body: raw,
                        redirect: "follow",
                    };

                    fetch(
                        "https://asstest.regestaitalia.it/api_v2/nuovorapportino?token=" +
                            token,
                        requestOptions
                    )
                        .then((response) => response.text())
                        .then((result) => console.log(result))
                        .catch((error) => console.log("error", error));
                },
            }
        );
    }
);
