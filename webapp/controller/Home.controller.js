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
    "sap/m/library",
    "sap/m/List",
    "sap/m/StandardListItem",
    "sap/m/Text",
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
    IconPool,
    Dialog,
    Button,
    mLibrary,
    List,
    StandardListItem,
    Text
  ) {
    "use strict";

    var CalendarType = coreLibrary.CalendarType;

    // shortcut for sap.m.ButtonType
    var ButtonType = mLibrary.ButtonType;

    // shortcut for sap.m.DialogType
    var DialogType = mLibrary.DialogType;

    return Controller.extend("regesta.regestarapportini.controller.Home", {
      oFormatYyyymmdd: null,

      onInit: function () {
        // set explored app's demo model on this sample
        var oModel = new JSONModel("model/data.json");

        this.getView().setModel(oModel);
        this.oFormatYyyymmdd = DateFormat.getInstance({
          pattern: "dd-MM-yyyy",
          calendarType: CalendarType.Gregorian,
        });
        // set i18n model on view
        var i18nModel = new ResourceModel({
          bundleName: "regesta.regestarapportini.i18n.i18n",
        });
        this.getView().setModel(i18nModel, "i18n");
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

      handleMore: function (oEvent) {
        var oButton = oEvent.getSource();
        this.byId("actionSheet").openBy(oButton);
      },

      clicked: function () {
        msgT.show("Rapportino clicked");
      },

      onShowPopup: function () {
        var dialog = new Dialog({
          title: "Inserisci i dati del rapportino",
          type: "Message",
          content: [
            // Input user
            new sap.m.Label({ text: "Utente", labelFor: "event" }),
            new sap.m.Input("event", {
              liveChange: function (oEvent) {
                var eventName = oEvent.getParameter("value");
              },
              width: "100%",
              value: "Utente",
              placeholder: "Utente",
              enabled: false,
            }),

            // Input date with datepicker
            new sap.m.Label({
              text: "Giorno",
              required: true,
              labelFor: "day",
            }),
            new sap.m.DatePicker("day", {
              type: "Date",
              displayFormat: "short",
              width: "100%",
              placeholder: "Giorno",
              enabled: true,
            }),

            // Input work hours with step input
            new sap.m.Label({
              text: "Ore",
              required: true,
              labelFor: "workHours",
            }),
            new sap.m.StepInput("workHours", {
              liveChange: function (oEvent) {
                var eventName = oEvent.getParameter("value");
              },
              value: "0",
              textAlign: "Center",
              min: 0,
              max: 24,
              step: 1,
              width: "100%",
              placeholder: "Ore",
              enabled: true,
            }),

            // Input ticket with combo box
            new sap.m.Label({
              text: "Ticket",
              required: true,
              labelFor: "ticket",
            }),
            new sap.m.ComboBox("ticket", {
              items: [
                new sap.ui.core.Item({ key: "1", text: "Ticket 1" }),
                new sap.ui.core.Item({ key: "2", text: "Ticket 2" }),
                new sap.ui.core.Item({ key: "3", text: "Ticket 3" }),
                new sap.ui.core.Item({ key: "4", text: "Ticket 4" }),
                new sap.ui.core.Item({ key: "5", text: "Ticket 5" }),
                new sap.ui.core.Item({ key: "6", text: "Ticket 6" }),
              ],
              width: "100%",
              placeholder: "Ticket",
              //path: '/CountriesCollection',
              // sorter: { path: 'text' },
              enabled: true,
            }),

            // Input client
            new sap.m.Label({ text: "Cliente", labelFor: "client" }),
            new sap.m.Input("client", {
              liveChange: function (oEvent) {
                var eventName = oEvent.getParameter("value");
              },
              width: "100%",
              value: "Cliente",
              placeholder: "Cliente",
              enabled: false,
            }),

            // Input commessa
            new sap.m.Label({ text: "Commessa", labelFor: "commessa" }),
            new sap.m.Input("commessa", {
              liveChange: function (oEvent) {
                var eventName = oEvent.getParameter("value");
              },
              width: "100%",
              value: "Commessa",
              placeholder: "Commessa",
              enabled: false,
            }),

            // Input site with combo box
            new sap.m.Label({ text: "Sede", labelFor: "site" }),
            new sap.m.ComboBox("site", {
              items: [
                new sap.ui.core.Item({ key: "1", text: "UF" }),
                new sap.ui.core.Item({ key: "2", text: "CL" }),
                new sap.ui.core.Item({ key: "3", text: "CA" }),
                new sap.ui.core.Item({ key: "4", text: "SW" }),
              ],
              width: "100%",
              placeholder: "Sede",
              //path: '/SiteCollection',
              // sorter: { path: 'text' },
              enabled: true,
            }),

            // Input destination
            new sap.m.Label({ text: "Destinazione", labelFor: "destination" }),
            new sap.m.Input("destination", {
              liveChange: function (oEvent) {
                var eventName = oEvent.getParameter("value");
              },
              width: "100%",
              value: "",
              placeholder: "Destinazione",
              enabled: true,
            }),

            // Input description
            new sap.m.Label({
              text: "Descrizione",
              required: true,
              labelFor: "description",
            }),
            new sap.m.Input("description", {
              liveChange: function (oEvent) {
                var eventName = oEvent.getParameter("value");
              },
              width: "100%",
              value: "",
              placeholder: "Descrizione",
              enabled: true,
            }),

            // Checkbox plus
            new sap.m.CheckBox("plus", {
              text: "Plus",
              selected: false,
              enabled: true,
            }),

            // Checkbox fatturabile
            new sap.m.CheckBox("fatturabile", {
              text: "Fatturabile",
              selected: true,
              enabled: true,
            }),

            // Create expandable panel with inputs
            new sap.m.Panel({
              expandable: true,
              expanded: false,
              headerText: "Dettagli fuori sede",
              content: [
                // Input Km
                new sap.m.Label({ text: "Km", labelFor: "km" }),
                new sap.m.Input("km", {
                  liveChange: function (oEvent) {
                    var eventName = oEvent.getParameter("value");
                  },
                  type: "Number",
                  width: "100%",
                  value: "",
                  placeholder: "Km",
                  enabled: true,
                }),

                // Input km/€ formatted in currency
                new sap.m.Label({ text: "Km/€", labelFor: "kmPrice" }),
                new sap.m.Input("kmPrice", {
                  liveChange: function (oEvent) {
                    var eventName = oEvent.getParameter("value");
                  },
                  type: "Number",
                  width: "100%",
                  value: "",
                  placeholder: "Km/€",
                  enabled: true,
                }),

                // Input toll formatted in currency
                new sap.m.Label({ text: "Pedaggio", labelFor: "toll" }),
                new sap.m.Input("toll", {
                  liveChange: function (oEvent) {
                    var eventName = oEvent.getParameter("value");
                  },
                  type: "Number",
                  width: "100%",
                  value: "",
                  placeholder: "Pedaggio",
                  enabled: true,
                }),

                // Input forfait formatted in currency
                new sap.m.Label({ text: "Forfait", labelFor: "forfait" }),
                new sap.m.Input("forfait", {
                  liveChange: function (oEvent) {
                    var eventName = oEvent.getParameter("value");
                  },
                  type: "Number",
                  width: "100%",
                  value: "",
                  placeholder: "Forfait",
                  enabled: true,
                }),

                // Input food formatted in currency
                new sap.m.Label({ text: "Vitto", labelFor: "food" }),
                new sap.m.Input("food", {
                  liveChange: function (oEvent) {
                    var eventName = oEvent.getParameter("value");
                  },
                  type: "Number",
                  width: "100%",
                  value: "",
                  placeholder: "Vitto",
                  enabled: true,
                }),

                // Input accomodation formatted in currency
                new sap.m.Label({ text: "Alloggio", labelFor: "accomodation" }),
                new sap.m.Input("accomodation", {
                  liveChange: function (oEvent) {
                    var eventName = oEvent.getParameter("value");
                  },
                  type: "Number",
                  width: "100%",
                  value: "",
                  placeholder: "Alloggio",
                  enabled: true,
                }),

                // Input rental formatted in currency
                new sap.m.Label({ text: "Noleggio", labelFor: "rental" }),
                new sap.m.Input("rental", {
                  liveChange: function (oEvent) {
                    var eventName = oEvent.getParameter("value");
                  },
                  type: "Number",
                  width: "100%",
                  value: "",
                  placeholder: "Noleggio",
                  enabled: true,
                }),

                // Input transport formatted in currency
                new sap.m.Label({ text: "Trasporti", labelFor: "transport" }),
                new sap.m.Input("transport", {
                  liveChange: function (oEvent) {
                    var eventName = oEvent.getParameter("value");
                  },
                  type: "Number",
                  width: "100%",
                  value: "",
                  placeholder: "Trasporti",
                  enabled: true,
                }),

                // Input various formatted in currency
                new sap.m.Label({ text: "Varie", labelFor: "various" }),
                new sap.m.Input("various", {
                  liveChange: function (oEvent) {
                    var eventName = oEvent.getParameter("value");
                  },
                  type: "Number",
                  width: "100%",
                  value: "",
                  placeholder: "Varie",
                  enabled: true,
                }),

                // Input reserved formatted in currency
                new sap.m.Label({ text: "Riservato", labelFor: "reserved" }),
                new sap.m.Input("reserved", {
                  liveChange: function (oEvent) {
                    var eventName = oEvent.getParameter("value");
                  },
                  type: "Number",
                  width: "100%",
                  value: "",
                  placeholder: "Riservato",
                  enabled: true,
                }),
              ],
            }),
          ],
          endButton: new sap.m.Button({
            type: ButtonType.Emphasized,
            text: "Salva",
            press: function () {
              var sText = sap.ui.getCore().byId("event").getValue();
              var event = {
                eventName: sText,
              };
              dialog.close();
            },
          }),

          beginButton: new sap.m.Button({
            text: "Annulla",
            press: function () {
              dialog.close();
            },
          }),

          afterClose: function () {
            dialog.destroy();
          },
        });

        dialog.open();
      },

      onShowDetails: function () {
        var dialog = new Dialog({
          title: "Dettagli rapportino",
          type: "Message",
          content: [
            // Input user
            new sap.m.Label({ text: "Utente", labelFor: "event" }),
            new sap.m.Input("event", {
              
              width: "100%",
              value: "Utente",
              placeholder: "Utente",
              enabled: false,
            }),

            // Input date with datepicker
            new sap.m.Label({
              text: "Giorno",
              labelFor: "day",
            }),
            new sap.m.DatePicker("day", {
              type: "Date",
              displayFormat: "short",
              width: "100%",
              placeholder: "Giorno",
              enabled: false,
            }),

            // Input work hours with step input
            new sap.m.Label({
              text: "Ore",
              labelFor: "workHours",
            }),
            new sap.m.StepInput("workHours", {
              liveChange: function (oEvent) {
                var eventName = oEvent.getParameter("value");
              },
              value: "0",
              textAlign: "Center",
              min: 0,
              max: 24,
              step: 1,
              width: "100%",
              placeholder: "Ore",
              enabled: false,
            }),

            // Input ticket with combo box
            new sap.m.Label({
              text: "Ticket",
              labelFor: "ticket",
            }),
            new sap.m.ComboBox("ticket", {
              items: [
                new sap.ui.core.Item({ key: "1", text: "Ticket 1" }),
                new sap.ui.core.Item({ key: "2", text: "Ticket 2" }),
                new sap.ui.core.Item({ key: "3", text: "Ticket 3" }),
                new sap.ui.core.Item({ key: "4", text: "Ticket 4" }),
                new sap.ui.core.Item({ key: "5", text: "Ticket 5" }),
                new sap.ui.core.Item({ key: "6", text: "Ticket 6" }),
              ],
              width: "100%",
              placeholder: "Ticket",
              //path: '/CountriesCollection',
              // sorter: { path: 'text' },
              enabled: false,
            }),

            // Input client
            new sap.m.Label({ text: "Cliente", labelFor: "client" }),
            new sap.m.Input("client", {
              liveChange: function (oEvent) {
                var eventName = oEvent.getParameter("value");
              },
              width: "100%",
              value: "Cliente",
              placeholder: "Cliente",
              enabled: false,
            }),

            // Input commessa
            new sap.m.Label({ text: "Commessa", labelFor: "commessa" }),
            new sap.m.Input("commessa", {
              liveChange: function (oEvent) {
                var eventName = oEvent.getParameter("value");
              },
              width: "100%",
              value: "Commessa",
              placeholder: "Commessa",
              enabled: false,
            }),

            // Input site with combo box
            new sap.m.Label({ text: "Sede", labelFor: "site" }),
            new sap.m.ComboBox("site", {
              items: [
                new sap.ui.core.Item({ key: "1", text: "UF" }),
                new sap.ui.core.Item({ key: "2", text: "CL" }),
                new sap.ui.core.Item({ key: "3", text: "CA" }),
                new sap.ui.core.Item({ key: "4", text: "SW" }),
              ],
              width: "100%",
              placeholder: "Sede",
              //path: '/SiteCollection',
              // sorter: { path: 'text' },
              enabled: false,
            }),

            // Input destination
            new sap.m.Label({ text: "Destinazione", labelFor: "destination" }),
            new sap.m.Input("destination", {
              liveChange: function (oEvent) {
                var eventName = oEvent.getParameter("value");
              },
              width: "100%",
              value: "",
              placeholder: "Destinazione",
              enabled: false,
            }),

            // Input description
            new sap.m.Label({
              text: "Descrizione",
              labelFor: "description",
            }),
            new sap.m.Input("description", {
              liveChange: function (oEvent) {
                var eventName = oEvent.getParameter("value");
              },
              width: "100%",
              value: "",
              placeholder: "Descrizione",
              enabled: false,
            }),

            // Checkbox plus
            new sap.m.CheckBox("plus", {
              text: "Plus",
              selected: false,
              enabled: false,
            }),

            // Checkbox fatturabile
            new sap.m.CheckBox("fatturabile", {
              text: "Fatturabile",
              selected: true,
              enabled: false,
            }),

            // Create expandable panel with inputs
            new sap.m.Panel({
              expandable: true,
              expanded: false,
              headerText: "Dettagli fuori sede",
              content: [
                // Input Km
                new sap.m.Label({ text: "Km", labelFor: "km" }),
                new sap.m.Input("km", {
                  liveChange: function (oEvent) {
                    var eventName = oEvent.getParameter("value");
                  },
                  type: "Number",
                  width: "100%",
                  value: "",
                  placeholder: "Km",
                  enabled: false,
                }),

                // Input km/€ formatted in currency
                new sap.m.Label({ text: "Km/€", labelFor: "kmPrice" }),
                new sap.m.Input("kmPrice", {
                  liveChange: function (oEvent) {
                    var eventName = oEvent.getParameter("value");
                  },
                  type: "Number",
                  width: "100%",
                  value: "",
                  placeholder: "Km/€",
                  enabled: false,
                }),

                // Input toll formatted in currency
                new sap.m.Label({ text: "Pedaggio", labelFor: "toll" }),
                new sap.m.Input("toll", {
                  liveChange: function (oEvent) {
                    var eventName = oEvent.getParameter("value");
                  },
                  type: "Number",
                  width: "100%",
                  value: "",
                  placeholder: "Pedaggio",
                  enabled: false,
                }),

                // Input forfait formatted in currency
                new sap.m.Label({ text: "Forfait", labelFor: "forfait" }),
                new sap.m.Input("forfait", {
                  liveChange: function (oEvent) {
                    var eventName = oEvent.getParameter("value");
                  },
                  type: "Number",
                  width: "100%",
                  value: "",
                  placeholder: "Forfait",
                  enabled: false,
                }),

                // Input food formatted in currency
                new sap.m.Label({ text: "Vitto", labelFor: "food" }),
                new sap.m.Input("food", {
                  liveChange: function (oEvent) {
                    var eventName = oEvent.getParameter("value");
                  },
                  type: "Number",
                  width: "100%",
                  value: "",
                  placeholder: "Vitto",
                  enabled: false,
                }),

                // Input accomodation formatted in currency
                new sap.m.Label({ text: "Alloggio", labelFor: "accomodation" }),
                new sap.m.Input("accomodation", {
                  liveChange: function (oEvent) {
                    var eventName = oEvent.getParameter("value");
                  },
                  type: "Number",
                  width: "100%",
                  value: "",
                  placeholder: "Alloggio",
                  enabled: false,
                }),

                // Input rental formatted in currency
                new sap.m.Label({ text: "Noleggio", labelFor: "rental" }),
                new sap.m.Input("rental", {
                  liveChange: function (oEvent) {
                    var eventName = oEvent.getParameter("value");
                  },
                  type: "Number",
                  width: "100%",
                  value: "",
                  placeholder: "Noleggio",
                  enabled: false,
                }),

                // Input transport formatted in currency
                new sap.m.Label({ text: "Trasporti", labelFor: "transport" }),
                new sap.m.Input("transport", {
                  liveChange: function (oEvent) {
                    var eventName = oEvent.getParameter("value");
                  },
                  type: "Number",
                  width: "100%",
                  value: "",
                  placeholder: "Trasporti",
                  enabled: false,
                }),

                // Input various formatted in currency
                new sap.m.Label({ text: "Varie", labelFor: "various" }),
                new sap.m.Input("various", {
                  liveChange: function (oEvent) {
                    var eventName = oEvent.getParameter("value");
                  },
                  type: "Number",
                  width: "100%",
                  value: "",
                  placeholder: "Varie",
                  enabled: false,
                }),

                // Input reserved formatted in currency
                new sap.m.Label({ text: "Riservato", labelFor: "reserved" }),
                new sap.m.Input("reserved", {
                  liveChange: function (oEvent) {
                    var eventName = oEvent.getParameter("value");
                  },
                  type: "Number",
                  width: "100%",
                  value: "",
                  placeholder: "Riservato",
                  enabled: false,
                }),
              ],
            }),
          ],
          endButton: new sap.m.Button({
            type: ButtonType.Emphasized,
            text: "Salva",
            press: function () {
              var sText = sap.ui.getCore().byId("event").getValue();
              var event = {
                eventName: sText,
              };
              dialog.close();
            },
          }),

          beginButton: new sap.m.Button({
            text: "Annulla",
            press: function () {
              dialog.close();
            },
          }),

          afterClose: function () {
            dialog.destroy();
          },
        });

        dialog.open();
      },

      handleSelectToday: function (oEvent) {
        var oCalendar = this.byId("calendar");
        oCalendar.removeAllSelectedDates();
        oCalendar.addSelectedDate(new DateRange({ startDate: new Date() }));
        this._updateText(oCalendar);
      },

      openDatePicker: function (oEvent) {
        this.getView().byId("HiddenDP").openBy(oEvent.getSource().getDomRef());
      },

      changeDateHandler: function (oEvent) {
        var oBundle = this.getView().getModel("i18n").getResourceBundle();
        var sRecipient = oEvent.getParameter("value");
        console.log(sRecipient);
        var sMsg = oBundle.getText("currentDate", [sRecipient]);
        document.getElementById(
          "container-regesta.regestarapportini---Home--btn-BDI-content"
        ).innerHTML = sMsg;
      },

      handleDuplicate: function (oEvent) {
        msgT.show("Duplicate");
      },

      handleEdit: function (oEvent) {
        msgT.show("Edit");
      },

      handleDelete: function (oEvent) {
        msgT.show("Delete");
      },
    });
  }
);