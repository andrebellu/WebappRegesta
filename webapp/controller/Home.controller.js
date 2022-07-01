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
    Text
  ) {
    "use strict";

    var CalendarType = coreLibrary.CalendarType;

    return Controller.extend("regesta.regestarapportini.controller.Home", {
      onInit: function () {
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

        if (dd < 10) dd = "0" + dd;
        if (mm < 10) mm = "0" + mm;

        today = dd + "/" + mm + "/" + yyyy;

        var oModel = this.getView().getModel();
        oModel.setProperty("/date", today);
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

      handleData: function (result) {
        var oModel = this.getView().getModel();
        var items = JSON.parse(result);
        oModel.setProperty("/items", items);
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

        var data = oBundle.getText("currentDate", [sRecipient]);
        document.getElementById(
          "container-regesta.regestarapportini---Home--btn-BDI-content"
        ).innerHTML = data;
      },

      handleDuplicate: function (oEvent) {
        msgT.show("Duplicate");
      },

      handleEdit: function (oEvent) {
        msgT.show("Edit");
      },

      handleDelete: function (oEvent) {
        sap.m.MessageBox.show("Sei sicuro di voler eliminare questo rapportino?", {
            title: "Attenzione!",
            actions: [
                sap.m.MessageBox.Action.YES,
                sap.m.MessageBox.Action.CANCEL,
            ],
            onClose: function (sAction) {
                if (sAction === sap.m.MessageBox.Action.YES) {
                    oView.byId("list").removeSelections(true);
                }
            }
        });
      },

      //! Dialog box

      showPopup: function (oEvent) {
        var source = oEvent.getSource();
        var index = source.getBindingContext().getPath();
        this.getView().getModel().setProperty("/index", index);
        var path = this.getView().getModel().getProperty("/index");
        this.getView().getModel().setProperty("/path", path);
        console.log(path);

        if (!this.pDialog) {
          this.pDialog = this.loadFragment({
            name: "regesta.regestarapportini.fragments.Details",
          });
        }
        this.pDialog.then(function (oDialog) {
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
