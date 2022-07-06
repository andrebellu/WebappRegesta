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
                    sum += parseFloat(item.Ore);
                });

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

            handleSwipe: function (oEvent) {
                var swipedItem = oEvent.getParameter("listItem");
                var context = swipedItem.getBindingContext();
                var body = context.getObject();
                var id = context.getObject().IDRapportino;

                var oModel = this.getView().getModel();

                oModel.setProperty("/id", id);
                oModel.setProperty("/body", body);
            },

            handleMore: function (oEvent) {
                var oButton = oEvent.getSource();
                this.byId("actionSheet").openBy(oButton);

                oList = oEvent.getSource().getParent();

                console.log(oEvent.getSource().data("id"));
            },

            handleDuplicate: function (oEvent) {
                var body = this.getView().getModel().getProperty("/body");
                console.log(body);

                // ? API CALL NUOVO RAPPORTIN

                // var myHeaders = new Headers();
                // myHeaders.append("Content-Type", "application/json");
                // myHeaders.append(
                //     "Cookie",
                //     "ASP.NET_SessionId=2e1qkoj1jlpiglg1zeub1nox"
                // );

                // var raw = JSON.stringify({
                //     body
                // });

                // var requestOptions = {
                //     method: "POST",
                //     headers: myHeaders,
                //     body: raw,
                //     redirect: "follow",
                // };

                // fetch(
                //     sessionStorage.getItem("hostname") + "/api_v2/nuovorapportino?token=" + sessionStorage.getItem("encodedToken"),
                //     requestOptions
                // )
                //     .then((response) => response.text())
                //     .then((result) => console.log(result))
                //     .catch((error) => console.log("error", error));
            },

            handleEdit: function (oEvent) {
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

                                console.log(url);

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

            //! Dialog box

            showPopup: function (oEvent) {
                var source = oEvent.getSource();
                var context = source.getBindingContext();
                if (context != undefined) {
                    var index = source.getBindingContext().getPath();
                    this.getView().getModel().setProperty("/index", index);
                    var path = this.getView().getModel().getProperty("/index");
                    this.getView().getModel().setProperty("/path", path);

                    // Get date from list item and convert it to string from timestamp
                    var date = context.getProperty("Giorno");
                    // check if date starts with /
                    if (date.charAt(0) == "/") { 
                    // Get numbers from input
                    var timeStamp = date.replace(/\D/g, "");
                    // Convert timestamp to date and format it to put it into the model
                    var date = new Date(parseInt(timeStamp));
                    date = date.toLocaleDateString("it-IT");
                    this.getView()
                        .getModel()
                        .setProperty(path + "/Giorno", date);
                    }
                }

                if (!this.pDialog) {
                    this.pDialog = this.loadFragment({
                        name: "regesta.regestarapportini.fragments.Details",
                    });
                }
                this.pDialog.then(function (oDialog) {
                    oDialog.setBindingContext(context);
                    oDialog.open();
                });
            },

            onSave: function (oEvent) {
                this.byId("detailsDialog").close();
            },

            onCancel: function (oEvent) {
                this.byId("detailsDialog").close();
            },
        });
    }
);
