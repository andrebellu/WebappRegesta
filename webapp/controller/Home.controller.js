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
        var sDate = sRecipient.split("/");
        sRecipient = sDate[1] + "/" + sDate[0] + "/" + sDate[2];

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

      //! Dialog box
      showPopup: function () {
        if (!this.pDialog) {
          this.pDialog = this.loadFragment({
            name: "regesta.regestarapportini.fragments.Popup",
          });
        }
        this.pDialog.then(function (oDialog) {
          oDialog.open();
        });
      },

      onSave: function (oEvent) {
        this.byId("popup").close();
      },

      onCancel: function (oEvent) {
        this.byId("popup").close();
      },
    });
  }
);
