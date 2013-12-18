/** @license
 |
 |ArcGIS for Canadian Municipalities / ArcGIS pour les municipalités canadiennes
 |Polling Place Locator v10.2.0 / Localisateur de bureau de scrutin v10.2.0
 |This file was modified by Esri Canada - Copyright 2013 Esri Canada
 |
 | Version 10.2
 | Copyright 2012 Esri
 |
 | Licensed under the Apache License, Version 2.0 (the "License");
 | you may not use this file except in compliance with the License.
 | You may obtain a copy of the License at
 |
 |    http://www.apache.org/licenses/LICENSE-2.0
 |
 | Unless required by applicable law or agreed to in writing, software
 | distributed under the License is distributed on an "AS IS" BASIS,
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 | See the License for the specific language governing permissions and
 | limitations under the License.
 */
//Toggle bottom panel
function ShowHideResult(imgToggle) {
    if (!noRoute) {
        if (pollPoint) {
            if (imgToggle.getAttribute("state") == "minimized") {
                imgToggle.setAttribute("state", "maximized");
                if (dojo.byId('divPollingPlaceDetailsHeader').className || dojo.byId('divElectedOfficialsHeader').className == "divSelectedHeader") {
                    if (dojo.byId('imgToggleResults').title) {
                        WipeInResults();
                    }
                }
                dojo.byId('imgToggleResults').src = "images/down.png";
                dojo.byId('imgToggleResults').title = HidePanelTooltip; //CanMod
				dojo.byId('imgPrint').title = PrintTooltip; //CanMod: Print button behavior
                // maximize
            }
            else {
                imgToggle.setAttribute("state", "minimized");
                WipeOutResults();
                dojo.byId('imgToggleResults').src = "images/up.png";
                if (dojo.byId('divPollingPlaceDetailsHeader').className || dojo.byId('divElectedOfficialsHeader').className == "divSelectedHeader") {
                    dojo.byId('imgToggleResults').title = ShowPanelTooltip; //CanMod
					dojo.byId('imgPrint').title = PrintTooltip; //CanMod: Print button behavior
                }
                //minimize
            }
        }
    }
}

//Wipe-In bottom panel
function WipeInResults() {
    dojo.byId("imgToggleResults").style.cursor = "pointer";
	dojo.byId("imgPrint").style.cursor = "pointer"; //CanMod: Print button behavior
    dojo.byId("esriLogo").style.bottom = "210px";
    dojo.byId('showHide').style.bottom = "200px";
    dojo.byId('divGradient').style.height = "200px";
    dojo.byId('divPollingDetails').style.height = "200px";
    dojo.replaceClass("divPollingDetails", "hideBottomContainer", "showBottomContainer");
    dojo.replaceClass("divGradient", "hideBottomContainer", "showBottomContainer");
}

//Wipe-Out bottom panel
function WipeOutResults() {
    dojo.byId("esriLogo").style.bottom = "0px";
    dojo.byId('showHide').style.bottom = "0px";
    dojo.byId('divGradient').style.height = "0px";
    dojo.byId('divPollingDetails').style.height = "0px";
    dojo.replaceClass("divPollingDetails", "showBottomContainer", "hideBottomContainer");
    dojo.replaceClass("divGradient", "showBottomContainer", "hideBottomContainer");
}

//Display elected officials data
function ShowElectedOffialInfo(attributes, electedOfficialsTabData, index, fields, aliases) {

    var divContainer = dojo.byId("div" + index + "content");
    RemoveChildren(divContainer);

    divContainer.style.overflow = "hidden";
    divContainer.style.height = "144px";

    var table = document.createElement("table");
    table.style.width = "95%";
    table.cellSpacing = 2;
    table.cellPadding = 0;
    table.style.paddingTop = "5px";
    table.style.paddingLeft = "5px";
    var tbody = document.createElement("tbody");
    table.appendChild(tbody);

    for (var key = 0; key < electedOfficialsTabData[index].Data.length; key++) {
        var tr = document.createElement("tr");
        tbody.appendChild(tr);

        var td1 = document.createElement("td");
        td1.style.verticalAlign = "top";
        td1.style.height = "20px";
        if (electedOfficialsTabData[index].Data[key].DisplayText) {
            td1.innerHTML = '<a>' + electedOfficialsTabData[index].Data[key].DisplayText + '</a>';
        }
        else {
            for (var m = 0; m < fields.length; m++) {
                if ("${" + fields[m].name + "}" == electedOfficialsTabData[index].Data[key].FieldName.split(",")[0]) {
                    td1.innerHTML = aliases[fields[m].name] + ':';
                    break;
                }
            }
        }

        var td2 = document.createElement("td");
        td2.style.verticalAlign = "top";
        td2.style.height = "20px";
        td2.style.paddingLeft = "5px";
        td2.className = "tdBreak";
        if (dojo.string.substitute(electedOfficialsTabData[index].Data[key].FieldName, attributes)) {
            if ((dojo.string.substitute(electedOfficialsTabData[index].Data[key].FieldName, attributes)).match("http:" || "https:")) {
                td2.innerHTML = "<u style='cursor:pointer'>More info</u>";
                td2.title = dojo.string.substitute(electedOfficialsTabData[index].Data[key].FieldName, attributes);
                td2.style.wordBreak = "break-all";
                td2.setAttribute("link", dojo.string.substitute(electedOfficialsTabData[index].Data[key].FieldName, attributes));
                td2.onclick = function () {
                    window.open(this.getAttribute("link"));
                }
            }
            else {
                td2.innerHTML = dojo.string.substitute(electedOfficialsTabData[index].Data[key].FieldName, attributes);
            }
        }
        else {
            td2.innerHTML = showNullValueAs;
        }

        tr.appendChild(td1);
        tr.appendChild(td2);
        tbody.appendChild(tr);
        divContainer.appendChild(table);

    }
    CreatePollingDetailsScrollBar("div" + index + "container", "div" + index + "content");
}

//function for map click event
function FindLocation(evt) {
	StopFlashSearchButton(); //CanMod
	showCandidates = true; //CanMod: When click on map, show candidates (clicking outside area is handled by other functions)
    HideAddressContainer();
    noRoute = false;
    ShowProgressIndicator();
    if (!isMobileDevice) {
        for (var index in electedOfficialsTabData) {
            if (electedOfficialsTabData[index]) {
                RemoveChildren(dojo.byId('div' + index + 'content'));
            }
        }
    }

    map.getLayer(routeGraphicsLayerId).clear();
    map.getLayer(highlightPollLayerId).clear();
    ClearGraphics();
    featureID = null;
    map.infoWindow.hide();
    mapPoint = evt.mapPoint;

    var locator2 = new esri.tasks.Locator(locatorSettings.LocatorURL);
    locator2.locationToAddress(evt.mapPoint, 100);
    dojo.connect(locator2, "onLocationToAddressComplete", function (candidate) {
        if (candidate.address) {
            var symbol = new esri.symbol.PictureMarkerSymbol(locatorSettings.DefaultLocatorSymbol, locatorSettings.SymbolSize.width, locatorSettings.SymbolSize.height);
            var attr = [];
            if (candidate.address.Loc_name == "US_Zipcode") {
                attr = { Address: candidate.address.Zip };
            }
			//CanMod: Handle postal codes
			else if (candidate.address.Loc_name == "CAN_Postcode") {
				attr = { Address: (candidate.address).toUpperCase().replace("-"," ") };
			}
            else {
                var address = [];
                for (var att = 0; att < locatorSettings.LocatorFields.length; att++) {
                    if (candidate.address[locatorSettings.LocatorFields[att]]) {
                        address.push(candidate.address[locatorSettings.LocatorFields[att]]);
                    }
                }
                attr = { Address: address.join(',') };
            }

            var graphic = new esri.Graphic(mapPoint, symbol, attr, null);
            map.getLayer(tempGraphicsLayerId).add(graphic);
        }
    });
    FindPrecinctLayer();

    if (!isMobileDevice) {
        ShowPollingPlaceDetails();
        for (var index in electedOfficialsTabData) {
            GetOfficeName(electedOfficialsTabData[index].ServiceUrl, electedOfficialsTabData[index].Data, index);
        }
    }

}

//Get the name of the Layer from Config
function GetOfficeName(officeURL, officeData, index) {
    queryTask = new esri.tasks.QueryTask(electedOfficialsTabData[index].ServiceUrl);
    var queryCounty = new esri.tasks.Query();
    queryCounty.geometry = mapPoint;
    queryCounty.returnGeometry = false;
    queryCounty.outFields = ["*"];
    queryCounty.spatialRelationship = esri.tasks.Query.SPATIAL_REL_WITHIN;
    queryTask.execute(queryCounty, function (features) {
        if (features.features.length > 0) {
            ShowElectedOffialInfo(features.features[0].attributes, electedOfficialsTabData, index, features.fields, features.fieldAliases);
        }
    }
    );
}

//Query precinct layer
function FindPrecinctLayer() {
    selectedPollPoint = null;
    featureID = null;
    map.getLayer(highlightPollLayerId).clear();
    var query = new esri.tasks.Query();
    query.geometry = mapPoint;
    query.spatialRelationship = esri.tasks.Query.SPATIAL_REL_WITHIN;
    map.getLayer(precinctLayerId).selectFeatures(query, esri.layers.FeatureLayer.SELECTION_NEW, function (features) {
        if (features.length > 0) {
            setTimeout(function () {
                map.setExtent(features[0].geometry.getExtent().expand(3));
            }, 100);
            GetpollingId(features);
        }
        else {
            pollPoint = null;
            mapPoint = null;
            featureID = null;
            HideProgressIndicator();
            map.infoWindow.hide();
            ClearSelection();
            ClearGraphics();
            ShowInfoDetailsView();
            map.getLayer(routeGraphicsLayerId).clear();
            noRoute = true;
            if (!isMobileDevice) {
                var imgToggle = dojo.byId('imgToggleResults');
                if (imgToggle.getAttribute("state") == "maximized") {
                    imgToggle.setAttribute("state", "minimized");
                    WipeOutResults();
                    dojo.byId('imgToggleResults').src = "images/up.png";
                }
            }
            alert(dojo.string.substitute(messages.getElementsByTagName("noPollingPlaces")[0].childNodes[0].nodeValue,[pollingPlaceLabel.toLowerCase()])); //CanMod
        }
    });
}

//Get the PollingID
function GetpollingId(features) {
    // Save the precinct attributes
    var precinctAttrs = features[0].attributes;

    var relationshipId;
    (isBrowser ? pollLayer.PrimaryKeyForPolling : pollMobileLayer.PrimaryKeyForPolling).replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g, function (match, key) {
        relationshipId = key;
    });

    var precinctField;
    precinctID.replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g, function (match, key) {
        precinctField = key;
    });

    var queryTable = new esri.tasks.Query();
    queryTable.where = databaseFields.PrecinctIdFieldName + "= '" + features[0].attributes[precinctField] + "'";  // CanMod: use the Precinct/District ID field name specified in the database fields configuration
    queryTable.outFields = [relationshipId];
    map.getLayer(precinctOfficeLayerId).queryFeatures(queryTable, function (features) {
        if (features.features.length > 0) {
            GetDesignatedPollingPlace(features, precinctAttrs);
        }
        else {
            selectedPollPoint = null;
            featureID = null;
            pollPoint = null;
            mapPoint = null;
            HideProgressIndicator();
            map.infoWindow.hide();
            ClearSelection();
            ShowInfoDetailsView();
            map.getLayer(routeGraphicsLayerId).clear();
            if (!isMobileDevice) {
                var imgToggle = dojo.byId('imgToggleResults');
                if (imgToggle.getAttribute("state") == "maximized") {
                    imgToggle.setAttribute("state", "minimized");
                    WipeOutResults();
                    dojo.byId('imgToggleResults').src = "images/up.png";
                }
            }
            alert(dojo.string.substitute(messages.getElementsByTagName("designatedPollingPlaces")[0].childNodes[0].nodeValue,[pollingPlaceLabel.toLowerCase()])); //CanMod
        }
    });
}

//Get the Designated Polling Place
function GetDesignatedPollingPlace(features, precinctAttrs) {
    featureID = null;
    map.infoWindow.hide();
    map.getLayer(highlightPollLayerId).clear();
    map.getLayer(pollLayerId).clearSelection();
    var queryPollingPlaces = new esri.tasks.Query();
    var relationshipId;
    (isBrowser ? pollLayer.PrimaryKeyForPolling : pollMobileLayer.PrimaryKeyForPolling).replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g, function (match, key) {
        relationshipId = key;
    });
	//CanMod: Allow for multiple polling place matches to be queried on the map
    queryPollingPlaces.where = relationshipId + "= '" + dojo.string.substitute((isBrowser ? pollLayer.PrimaryKeyForPolling : pollMobileLayer.PrimaryKeyForPolling), features.features[0].attributes) + "'";
	for (var loopValue=1; loopValue<(features.features.length); loopValue++) {
		queryPollingPlaces.where += " OR " + relationshipId + "= '" + dojo.string.substitute((isBrowser ? pollLayer.PrimaryKeyForPolling : pollMobileLayer.PrimaryKeyForPolling), features.features[loopValue].attributes) + "'";
	}
    map.getLayer(pollLayerId).selectFeatures(queryPollingPlaces, esri.layers.FeatureLayer.SELECTION_NEW, function (features) {
        map.getLayer(highlightPollLayerId).clear();
        map.getLayer(pollLayerId).clearSelection();
        if (features.length > 0) {
            desgFlag = true;
            pollPoint = features[0].geometry;

            devObjectId = features[0].attributes[map.getLayer(pollLayerId).objectIdField];
            map.getLayer(pollLayerId).queryAttachmentInfos(devObjectId, GetAttachmentInfo, function (err) {
                GetAttachmentInfo();
            });

            // Add the precinct display to the polling place
            var amendedAttrs = dojo.clone(features[0].attributes);
            amendedAttrs["_PrecinctAttributes"] = precinctAttrs;

            storeAttr = dojo.string.substitute(infoWindowHeader, features[0].attributes);

            var extent = GetQuerystring('extent');
            if (extent != "") {
                if (generateRouteToNonDesignatedPollingPlace) {
                    if ((window.location.toString().split('$featureID=').length <= 1)) {
                        ShowPollingPlace(null, amendedAttrs);
                    }
                }
                else {
                    ShowPollingPlace(null, amendedAttrs);
                }
            }
            else {
                ShowPollingPlace(null, amendedAttrs);
            }
			var symbol = new esri.symbol.PictureMarkerSymbol(locatorSettings.LocatorRipple.image, locatorSettings.LocatorRipple.width, locatorSettings.LocatorRipple.height); //CanMod: Switch from Marker Symbol with transparencies to a Picture Marker (transparencies not compatible with print)
            AddGraphic(map.getLayer(highlightPollLayerId), symbol, pollPoint);
            if (isMobileDevice) {
                ShowServiceInfoDetails(pollPoint, amendedAttrs); //CanMod: Include Precinct info for popup in utlis.js Ln1400
            }
        }
        if (!isMobileDevice) {
            var imgToggle = dojo.byId('imgToggleResults');
            if (imgToggle.getAttribute("state") == "minimized") {
                imgToggle.setAttribute("state", "maximized");
                dojo.byId('divPollingPlaceDetailsHeader').style.display = "block";
                dojo.byId('divElectedOfficialsHeader').style.display = "block";
                dojo.byId('divImageBackground').style.display = "block";
				if (!isTablet) {
					dojo.byId('divImageBackgroundPrint').style.display = "block"; //CanMod: Show print button
				}
                setTimeout(function () {
                    if (dojo.byId('divPollingPlaceDetailsHeader').className || dojo.byId('divElectedOfficialsHeader').className == "divSelectedHeader") {
                        if (dojo.byId('imgToggleResults').title) {
                            dojo.byId("esriLogo").style.bottom = "210px";
                            dojo.byId('showHide').style.bottom = "200px";
                            dojo.byId('divGradient').style.height = "200px";
                            dojo.byId('divPollingDetails').style.height = "200px";
                            dojo.replaceClass("divPollingDetails", "hideBottomContainer", "showBottomContainer");
                            dojo.replaceClass("divGradient", "hideBottomContainer", "showBottomContainer");
                        }
                    }
                }, 500);
                dojo.byId('imgToggleResults').src = "images/down.png";
                dojo.byId('imgToggleResults').title = HidePanelTooltip; //CanMod
				dojo.byId('imgPrint').title = PrintTooltip; //CanMod: Print button behavior
                // maximize
            }
        }
    });
}

//slide to right
function SlideRight() {
    var difference = dojo.byId('divPollingData').offsetWidth - dojo.byId('carouselscroll').offsetWidth;
    if (newLeft >= difference) {
        dojo.byId('PollingLeftArrow').style.display = "block";
        var node = dojo.byId('carouselscroll');
        newLeft = newLeft - (infoBoxWidth + 5);

        dojo.byId('carouselscroll').style.left = newLeft + "px";
        dojo.addClass(dojo.byId('carouselscroll'), "slidePanel");

        if ((newLeft <= (difference + 5))) {
            dojo.byId('PollingRightArrow').style.display = "none";
        }
        if (dojo.byId('PollingRightArrow').style.display == "none") {
            dojo.byId('PollingLeftArrow').style.display = "block";
        }
    }
    if (difference > 0) {
        dojo.byId('PollingRightArrow').style.display = "none";
    }
}

//slide to left
function SlideLeft() {
    var difference = dojo.byId('divPollingData').offsetWidth - dojo.byId('carouselscroll').offsetWidth;
    if (newLeft < 0) {
        if (newLeft > -(infoBoxWidth + 5)) {
            newLeft = 0;
        }
        else {
            newLeft = newLeft + (infoBoxWidth + 5);
        }

        dojo.byId('carouselscroll').style.left = newLeft + "px";
        dojo.addClass(dojo.byId('carouselscroll'), "slidePanel");

        if (dojo.byId('PollingRightArrow').style.display == "none") {
            if (newLeft >= difference) {
                dojo.byId('PollingRightArrow').style.display = "block";
            }
        }
        if (newLeft == 0) {
            dojo.byId('PollingLeftArrow').style.display = "none";
        }
    }
}

//slide elected officials data panels to the right
function SlideOfficeRight() {
    var difference = dojo.byId('divOfficeData').offsetWidth - dojo.byId('carouselOfficescroll').offsetWidth;
    if (newLeftOffice >= difference) {
        dojo.byId('OfficeLeftArrow').style.display = "block";
        var node = dojo.byId('carouselOfficescroll');
        newLeftOffice = newLeftOffice - (infoBoxWidth + 5);

        dojo.byId('carouselOfficescroll').style.left = newLeftOffice + "px";
        dojo.addClass(dojo.byId('carouselscroll'), "slidePanel");

        if (newLeftOffice <= (difference + 5)) {
            dojo.byId('OfficeRightArrow').style.display = "none";
        }
        if (dojo.byId('OfficeRightArrow').style.display == "none") {
            dojo.byId('OfficeLeftArrow').style.display = "block";
        }
    }
    if (difference > 0) {
        dojo.byId('OfficeRightArrow').style.display = "none";
    }
}

//slide elected officials data panels to the left
function SlideOfficeLeft() {
    var difference = dojo.byId('divOfficeData').offsetWidth - dojo.byId('carouselOfficescroll').offsetWidth;
    if (newLeftOffice < 0) {
        if (newLeftOffice > -(infoBoxWidth + 5)) {
            newLeftOffice = 0;
        }
        else {
            newLeftOffice = newLeftOffice + (infoBoxWidth + 5);
        }
        var node = dojo.byId('carouselOfficescroll');

        dojo.byId('carouselOfficescroll').style.left = newLeftOffice + "px";
        dojo.addClass(dojo.byId('carouselOfficescroll'), "slidePanel");

        if (dojo.byId('OfficeRightArrow').style.display == "none") {
            if (newLeftOffice >= difference) {
                dojo.byId('OfficeRightArrow').style.display = "block";
            }
        }
        if (newLeftOffice == 0) {
            dojo.byId('OfficeLeftArrow').style.display = "none"
        }
    }
}

//Reset the slide controls
function ResetSlideControls() {
    if (newLeftOffice > dojo.byId("divOfficeData").offsetWidth - dojo.byId("carouselOfficescroll").offsetWidth) {
        dojo.byId('OfficeRightArrow').style.display = "block";
        dojo.byId('OfficeRightArrow').style.cursor = "pointer";
    }
    else {
        dojo.byId('OfficeRightArrow').style.display = "none";
        dojo.byId('OfficeRightArrow').style.cursor = "default";
    }

    if (newLeftOffice == 0) {
        dojo.byId('OfficeLeftArrow').style.display = "none";
        dojo.byId('OfficeLeftArrow').style.cursor = "default"; //CanMod
    }
    else {
        dojo.byId('OfficeLeftArrow').style.display = "block";
        dojo.byId('OfficeLeftArrow').style.cursor = "pointer";
    }

    if (newLeft > dojo.byId("divPollingData").offsetWidth - dojo.byId("carouselscroll").offsetWidth) {
        dojo.byId('PollingRightArrow').style.display = "block";
        dojo.byId('PollingRightArrow').style.cursor = "pointer";
    }
    else {
        dojo.byId('PollingRightArrow').style.display = "none";
        dojo.byId('PollingRightArrow').style.cursor = "default";
    }

    if (newLeft == 0) {
        dojo.byId('PollingLeftArrow').style.display = "none";
        dojo.byId('PollingLeftArrow').style.cursor = "default"; //CanMod
    }
    else {
        dojo.byId('PollingLeftArrow').style.display = "block";
        dojo.byId('PollingLeftArrow').style.cursor = "pointer";
    }
}