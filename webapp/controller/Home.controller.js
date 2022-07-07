sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageToast",
        "sap/ui/model/json/JSONModel",
        "sap/ui/unified/DateRange",
        "sap/ui/core/format/DateFormat",
        "sap/ui/core/library",
        "sap/ui/core/Fragment",
        "sap/ui/model/resource/ResourceModel",
        "sap/ui/core/IconPool",
        "sap/m/Dialog",
        "sap/m/Button",
        "sap/m/MessageBox",
        "sap/m/library",
        "sap/m/List",
        "sap/m/StandardListItem",
        "sap/m/Text",
        "sap/ui/core/Element",
    ],
    function (
        Controller,
        msgT,
        JSONModel,
        DateRange,
        DateFormat,
        coreLibrary,
        Fragment,
        ResourceModel,
        MessageBox,
        IconPool,
        Dialog,
        Button,
        mLibrary,
        List,
        StandardListItem,
        Text,
        Element
    ) {
        "use strict";

        var CalendarType = coreLibrary.CalendarType;
        var oList;
        var firstTime = true;
        var formattedDate;

        return Controller.extend("regesta.regestarapportini.controller.Home", {
            onInit: function () {
                var oRouter = this.getOwnerComponent().getRouter();

                oRouter.getRoute("RouteHome").attachMatched(function () {
                    this.sumHours();
                }, this);

                var oModel = new JSONModel();
                var i18nModel = new ResourceModel({
                    bundleName: "regesta.regestarapportini.i18n.i18n",
                });

                this.getView().setModel(oModel);
                this.getView().setModel(i18nModel, "i18n");

                this.oFormatYyyymmdd = DateFormat.getInstance({
                    pattern: "dd-MM-yyyy",
                    calendarType: CalendarType.Gregorian,
                });

                this.APICall();
                this.getCurrentDate();
            },

            getCurrentDate: function () {
                var today = new Date();
                var yyyy = today.getFullYear();
                var mm = today.getMonth() + 1;
                var dd = today.getDate();

                today = dd + "/" + mm + "/" + yyyy;

                var oModel = this.getView().getModel();
                oModel.setProperty("/date", today);
            },

            APICall: function () {
                var requestOptions = {
                    method: "POST",
                    redirect: "follow",
                };

                var token = sessionStorage.getItem("token");

                token = token.replace(/"/g, "");
                var encodedToken = encodeURIComponent(token);

                sessionStorage.setItem("encodedToken", encodedToken);

                fetch(
                    sessionStorage.getItem("hostname") +
                        "/api_v2/rapportini?token=" +
                        sessionStorage.getItem("encodedToken"),
                    requestOptions
                )
                    .then((response) => response.text())
                    .then((result) => this.handleData(result))
                    .catch((error) => console.log("error", error));
            },

            handleData: function (result) {
                var oModel = this.getView().getModel();
                var items = JSON.parse(result);
                console.log(items);
                oModel.setProperty("/items", items);

                this.filterItems();
            },

            filterItems: function () {
                var oModel = this.getView().getModel();
                var items = oModel.getProperty("/items");

                if (firstTime) {
                    var selectedDate = oModel.getProperty("/date");
                    firstTime = false;
                } else {
                    var selectedDate = oModel.getProperty("/selectedDate");
                }

                var filteredItems = items.filter(function (item) {
                    if (
                        new Date(
                            parseInt(item.Giorno.replace(/\D/g, ""))
                        ).toLocaleDateString("it-IT") === selectedDate
                    ) {
                        return item;
                    }
                });

                oModel.setProperty("/filteredItems", filteredItems);
                this.sumHours();
            },

            sumHours: function () {
                var oModel = this.getView().getModel();
                var filteredItems = oModel.getProperty("/filteredItems");
                var sum = 0.0;

                filteredItems.forEach(function (item) {
                    sum += item.Ore;
                    console.log(sum);
                });

                sum = sum.toFixed(1);

                if (sum >= 8) {
                    document
                        .getElementById("__xmlview1--hourBadge-inner")
                        .style.setProperty(
                            "background-color",
                            "rgba(194, 249, 112, .2)",
                            "important"
                        );
                } else {
                    document
                        .getElementById("__xmlview1--hourBadge-inner")
                        .style.setProperty(
                            "background-color",
                            "rgba(254, 121, 104, .2)",
                            "important"
                        );
                }

                oModel.setProperty("/sum", sum);
            },

            destinationAPI: function () {
                var oModel = this.getView().getModel();
                var nuovoRapportino = oModel.getProperty("/body");
                //! API call to get destinations
                var myHeaders = new Headers();
                myHeaders.append(
                    "Cookie",
                    "ASP.NET_SessionId=h44eqjrap4hk2tsla2tjsbwv"
                );

                var requestOptions = {
                    method: "POST",
                    headers: myHeaders,
                    redirect: "follow",
                };

                fetch(
                    sessionStorage.getItem("hostname") +
                        "/api_v2/sedi?token=" +
                        sessionStorage.getItem("encodedToken") +
                        "&idCliente=" +
                        nuovoRapportino.IDCliente,
                    requestOptions
                )
                    .then((response) => response.text())
                    .then((result) => this.handleDestination(result))
                    .catch((error) => console.log("error", error));
            },

            handleDestination: function (result) {
                var oModel = this.getView().getModel();

                oModel.setProperty("/destinazioni", JSON.parse(result));
                var destinazioni = oModel.getProperty("/destinazioni");
                console.log(destinazioni);
            },

            handleSwipe: function (oEvent) {
                var oModel = this.getView().getModel();

                var swipedItem = oEvent.getParameter("listItem");
                var context = swipedItem.getBindingContext();
                var body = context.getObject();

                var gg = body.Giorno.replace(/\D/g, "");
                formattedDate = new Date(parseInt(gg));
                formattedDate = formattedDate.toLocaleDateString("it-IT");

                var id = context.getObject().IDRapportino;

                oModel.setProperty("/id", id);
                oModel.setProperty("/body", body);
                oModel.setProperty("/formattedDate", formattedDate);
            },

            handleMore: function (oEvent) {
                var oButton = oEvent.getSource();
                this.byId("actionSheet").openBy(oButton);

                oList = oEvent.getSource().getParent();

                console.log(oEvent.getSource().data("id"));
            },

            handleChange: function (oEvent) {
                var i;
                var oModel = this.getView().getModel();
                var IDCliente = sap.ui
                    .getCore()
                    .byId(oEvent.getSource().getSelectedItemId())
                    .getBindingContext()
                    .getObject().IDCliente;
                oModel.setProperty(
                    "/body/IDTodoList",
                    sap.ui
                        .getCore()
                        .byId(oEvent.getSource().getSelectedItemId())
                        .getBindingContext()
                        .getObject().IDTodoList
                );
                oModel.setProperty("/body/IDCliente", IDCliente);
                var clientLength = oModel.getProperty("/clienti").length;
                var IDOrder = sap.ui
                    .getCore()
                    .byId(oEvent.getSource().getSelectedItemId())
                    .getBindingContext()
                    .getObject().IDCommessa;
                var orderLength = oModel.getProperty("/commesse").length;
                for (i = 0; i <= clientLength; i++) {
                    if (
                        IDCliente ==
                        oModel.getProperty("/clienti/" + i + "/IDCliente")
                    ) {
                        var code = oModel.getProperty(
                            "/clienti/" + i + "/Codice"
                        );
                        var clientDescription = oModel.getProperty(
                            "/clienti/" + i + "/Descrizione"
                        );
                        break;
                    }
                }
                for (i = 0; i <= orderLength; i++) {
                    if (
                        IDOrder ==
                        oModel.getProperty("/commesse/" + i + "/IDCommessa")
                    ) {
                        var orderDescription = oModel.getProperty(
                            "/commesse/" + i + "/Descrizione"
                        );
                        break;
                    }
                }
                var clientName = code + " - " + clientDescription;
                oModel.setProperty("/body/Codice", clientName);
                oModel.setProperty(
                    "/body/IDCommessa",
                    IDOrder // !+ " - " + orderDescription
                );
                this.destinationAPI();
            },

            getHours: function (oEvent) {
                var ore = oEvent.getParameter("value");
                var nuovoRapportino = this.getView()
                    .getModel()
                    .getProperty("/body");

                nuovoRapportino.Ore = ore;
            },

            
            APIticket: function () {
                var request = {
                    method: "POST",
                    redirect: "follow",
                };
                fetch(
                    sessionStorage.getItem("hostname") +
                        "/api_v2/ticket?token=" +
                        sessionStorage.getItem("encodedToken") +
                        "&idTicket=0",
                    request
                )
                    .then((response) => response.text())
                    .then((result) => this.handleTicket(result))
                    .catch((error) => console.log("error", error));
            },
            handleTicket: function (result) {
                var oModel = this.getView().getModel();
                var ticket = JSON.parse(result);
                oModel.setProperty("/ticket", ticket);
            },
            APIclienti: function () {
                var request = {
                    method: "POST",
                    redirect: "follow",
                };

                fetch(
                    sessionStorage.getItem("hostname") +
                        "/api_v2/clienti?token=" +
                        sessionStorage.getItem("encodedToken") +
                        "&idCliente=0",
                    request
                )
                    .then((response) => response.text())
                    .then((result) => this.handleClienti(result))
                    .catch((error) => console.log("error", error));
            },
            handleClienti: function (result) {
                var oModel = this.getView().getModel();
                var clienti = JSON.parse(result);
                oModel.setProperty("/clienti", clienti);
            },

            APIcommesse: function () {
                var request = {
                    method: "POST",
                    redirect: "follow",
                };
                fetch(
                    sessionStorage.getItem("hostname") +
                        "/api_v2/commesse?token=" +
                        sessionStorage.getItem("encodedToken") +
                        "&idCommessa=0&idCliente=0",
                    request
                )
                    .then((response) => response.text())
                    .then((result) => this.handleCommesse(result))
                    .catch((error) => console.log("error", error));
            },
            handleCommesse: function (result) {
                var oModel = this.getView().getModel();
                var commesse = JSON.parse(result);
                oModel.setProperty("/commesse", commesse);
            },

            

            handleEdit: function () {
                msgT.show("Edit");
            },

            handleDelete: function (oEvent) {
                var id = this.getView().getModel().getProperty("/id");

                sap.m.MessageBox.warning(
                    "Sei sicuro di voler eliminare questo rapportino?",
                    {
                        title: "Attenzione!",
                        actions: [
                            sap.m.MessageBox.Action.YES,
                            sap.m.MessageBox.Action.CANCEL,
                        ],
                        onClose: function (sAction) {
                            if (sAction === sap.m.MessageBox.Action.YES) {
                                var token = sessionStorage.getItem("token");

                                token = token.replace(/"/g, "");
                                token = encodeURIComponent(token);

                                var myHeaders = new Headers();
                                myHeaders.append(
                                    "Cookie",
                                    "ASP.NET_SessionId=p42wuyurx1pcevyrkavscdxu"
                                );

                                var requestOptions = {
                                    method: "POST",
                                    headers: myHeaders,
                                    redirect: "follow",
                                };

                                var url =
                                    sessionStorage.getItem("hostname") +
                                    "/api_v2/eliminarapportino?token=" +
                                    token +
                                    "&idRapportino=" +
                                    id;

                                fetch(url, requestOptions)
                                    .then((response) => response.text())
                                    .then((result) => console.log(result))
                                    .catch((error) =>
                                        console.log("error", error)
                                    );

                                oList.removeAggregation(
                                    "items",
                                    oList.getSwipedItem()
                                );
                                oList.swipeOut();
                            }
                        },
                    }
                );
            },

            handleSelectToday: function (oEvent) {
                var oCalendar = this.byId("calendar");
                oCalendar.removeAllSelectedDates();
                oCalendar.addSelectedDate(
                    new DateRange({ startDate: new Date() })
                );
                this._updateText(oCalendar);
            },

            openDatePicker: function (oEvent) {
                this.getView()
                    .byId("HiddenDP")
                    .openBy(oEvent.getSource().getDomRef());
            },

            changeDateHandler: function (oEvent) {
                var oBundle = this.getView()
                    .getModel("i18n")
                    .getResourceBundle();

                var sRecipient = oEvent
                    .getParameter("value")
                    .replace(/\b0/g, "");

                this.getView()
                    .getModel()
                    .setProperty("/selectedDate", sRecipient);

                var data = oBundle.getText("currentDate", [sRecipient]);
                document.getElementById(
                    "container-regesta.regestarapportini---Home--btn-BDI-content"
                ).innerHTML = data;

                this.filterItems();
            },

            handleDuplicate: function (oEvent) {
                var oModel = this.getView().getModel();
                var body = oModel.getProperty("/body");

                this.APIticket();
                this.APIclienti();
                this.APIcommesse();

                var defaultBody = {
                    IDRapportino: null,
                    IDUtente: null,
                    Utente: sessionStorage.getItem("username"),
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
                    Giorno: this.getCurrentDate(),
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

                var source = oEvent.getSource();
                var setContext = source.setBindingContext(
                    new sap.ui.model.Context(oModel, "/body")
                );
                var getContext = setContext.getBindingContext();

                if (!this.pDialog) {
                    this.pDialog = this.loadFragment({
                        name: "regesta.regestarapportini.fragments.PopupEdit",
                    });
                }
                this.pDialog.then(function (oDialog) {
                    oModel.setProperty("/nuovoRapportino", body);
                    oDialog.setBindingContext(getContext);
                    oDialog.open();
                });

                // oList.getModel().updateBindings(true);
            },

            onCancelDuplicate: function (oEvent) {
                this.byId("popupEdit").close();
            },

            onSaveDuplicate: function () {

                var nuovoRapportino = this.getView()
                    .getModel()
                    .getProperty("/nuovoRapportino");

                // ? Chech date
                // collect input controls
                var oView = this.getView();
                var getDate = oView.byId("date");
                console.log(getDate);
                var bValidationError = false;

                bValidationError = this._validateGiornoInput(getDate);

                if (!bValidationError) {
                    var oModel = this.getView().getModel();
                    msgT.show("Rapportino aggiunto");

                    //! API call for newRepo
                    var myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");
                    myHeaders.append(
                        "Cookie",
                        "ASP.NET_SessionId=h44eqjrap4hk2tsla2tjsbwv"
                    );

                    oModel.setProperty("/nuovoRapportino/Giorno", formattedDate);
                    var raw = JSON.stringify(nuovoRapportino);
                    console.log(nuovoRapportino);

                    var requestOptions = {
                        method: "POST",
                        headers: myHeaders,
                        body: raw,
                        redirect: "follow",
                    };

                    fetch(
                        sessionStorage.getItem("hostname") +
                            "/api_v2/nuovorapportino?token=" +
                            sessionStorage.getItem("encodedToken"),
                        requestOptions
                    )
                        .then((response) => response.text())
                        .then((result) => console.log(result))
                        .catch((error) => console.log("error", error));

                    this.byId("popupEdit").close();
                    window.location.reload();
                } else {
                    msgT.show("Inserisci i dati correttamente");
                }
            },

            //! Dialog box
            showPopup: function (oEvent) {
                var oModel = this.getView().getModel();
                var source = oEvent.getSource();
                
                
                var setContext = source.setBindingContext(
                    new sap.ui.model.Context(oModel, source.getBindingContext().sPath)
                );
                var getContext = setContext.getBindingContext();
                var index = source.getBindingContext().getPath();
                if (getContext != undefined) {
                    

                    // Get date from list item and convert it to string from timestamp
                    var date = getContext.getProperty("Giorno");
                    // check if date starts with /
                    if (date.charAt(0) == "/") {
                        // Get numbers from input
                        var timeStamp = date.replace(/\D/g, "");
                        // Convert timestamp to date and format it to put it into the model
                        var date = new Date(parseInt(timeStamp));
                        date = date.toLocaleDateString("it-IT");
                        this.getView()
                            .getModel()
                            .setProperty(index + "/Giorno", date);
                    }
                }

                if (!this.pDialogDetails) {
                    this.pDialogDetails = this.loadFragment({
                        name: "regesta.regestarapportini.fragments.Details",
                    });
                }
                this.pDialogDetails.then(function (oDialog) {
                    oDialog.setBindingContext(getContext);
                    oDialog.open();
                });
            },

            onCancel: function (oEvent) {
                this.byId("detailsDialog").close();
            },

            onGiornoChange: function (oEvent) {
                var oInput = oEvent.getSource();
                this._validateGiornoInput(oInput);
            },

            isDateInThisWeek: function (date) {
                const now = new Date();

                const weekDay = (now.getDay() + 6) % 7; // Make sure Sunday is 6, not 0
                const monthDay = now.getDate();
                const mondayThisWeek = monthDay - weekDay;

                const startOfThisWeek = new Date(+now);
                startOfThisWeek.setDate(mondayThisWeek);
                startOfThisWeek.setHours(0, 0, 0, 0);

                const startOfNextWeek = new Date(+startOfThisWeek);
                startOfNextWeek.setDate(mondayThisWeek + 5);

                return date >= startOfThisWeek && date < startOfNextWeek;
            },
            isFutureDate: function (value) {
                const d_now = new Date();
                const d_inp = new Date(value);
                return d_now.getTime() <= d_inp.getTime();
            },
            //! Check date input
            _validateGiornoInput: function (oInput) {
                var sValueState = "None";
                var bValidationError = false;
                var oBinding = oInput.getBinding("value");

                var [gg, month, year] = oInput.getValue().split("/");
                const giorno = new Date(year, month - 1, gg);

                //console.log(gg, month, year);
                //console.log(this.isDateInThisWeek(giorno));

                var week = giorno.getDay();
                //console.log(week);

                if (week == 0 || week == 6) {
                    MessageBox.information(
                        "Hai avuto il premesso di creare il rapportino durante il weekend?"
                    );

                    sValueState = "Error";
                    bValidationError = true;
                    oInput.setValueState(sValueState);
                    return bValidationError;
                }

                if (
                    !this.isDateInThisWeek(giorno) ||
                    this.isFutureDate(giorno)
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
        });
    }
);
