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
    ],
    function (
        Controller,
        msgT,
        JSONModel,
        DateRange,
        DateFormat,
        coreLibrary,
        Fragment,
        ResourceModel
    ) {
        "use strict";

        var CalendarType = coreLibrary.CalendarType;

        return Controller.extend(
            "regesta.regestarapportini.controller.Home",
            {
                oFormatYyyymmdd: null,

                onInit: function () {
                    // set explored app's demo model on this sample
                    var oModel = new JSONModel("model/data.json");

                    var today = new Date().toLocaleDateString();
                    console.log(today);

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

                handleSwipe: function (evt) {
                    // register swipe event
                    var oSwipeContent = evt.getParameter("swipeContent"), // get swiped content from event
                        oSwipeDirection = evt.getParameter("swipeDirection"); // get swiped direction from event
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

                handleMore: function (evt) {
                    var oButton = evt.getSource();
                    this.byId("actionSheet").openBy(oButton);
                },

                clicked: function () {
                    msgT.show("Rapportino clicked");
                },

                handleSelectToday: function (evt) {
                    var oCalendar = this.byId("calendar");
                    oCalendar.removeAllSelectedDates();
                    oCalendar.addSelectedDate(
                        new DateRange({ startDate: new Date() })
                    );
                    this._updateText(oCalendar);
                },

                openDatePicker: function (evt) {
                    this.getView()
                        .byId("HiddenDP")
                        .openBy(evt.getSource().getDomRef());
                },

                changeDateHandler: function (evt) {
                    var oBundle = this.getView()
                        .getModel("i18n")
                        .getResourceBundle();
                    var sRecipient = evt.getParameter("value");
                    console.log(sRecipient);
                    var sMsg = oBundle.getText("currentDate", [sRecipient]);
                    msgT.show(sMsg);
                },

                handleDuplicate: function (evt) {
                    msgT.show("Duplicate");
                },

                handleEdit: function (evt) {
                    msgT.show("Edit");
                },

                handleDelete: function (evt) {
                    msgT.show("Delete");
                },
            }
        );
    }
);