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
//Get candidate results for searched address
function LocateAddress() {
    var thisSearchTime = lastSearchTime = (new Date()).getTime();
    noRoute = false;
    dojo.byId("imgSearchLoader").style.display = "block";
    if (dojo.byId("txtAddress").value.trim() == '') {
        dojo.byId("imgSearchLoader").style.display = "none";
        RemoveChildren(dojo.byId('tblAddressResults'));
        CreateScrollbar(dojo.byId("divAddressScrollContainer"), dojo.byId("divAddressScrollContent"));
        if (dojo.byId("txtAddress").value != "") {
            alert(messages.getElementsByTagName("addressToLocate")[0].childNodes[0].nodeValue);
        }
        return;
    }
    var params = [];
	//CanMod: Modify locator to search in set extent only (makes it uncessary to type city, province, etc in the search field)
    params["address"] = {};
	params["address"][locatorSettings.LocatorParameters[0]] = dojo.byId('txtAddress').value;
	se = locatorSettings.SearchExtent;
	params.outFields = [locatorSettings.LocatorFieldName];
	if (se.wkid == 4326) {
		params.searchExtent = new esri.geometry.Extent(se.xmin,se.ymin,se.xmax,se.ymax, new esri.SpatialReference({ wkid:se.wkid }));
	}
	else if (se.wkid == 3785) {
		require(["esri/geometry/webMercatorUtils"], function(webMercatorUtils) {
			var se_Original = new esri.geometry.Extent(se.xmin, se.ymin, se.xmax, se.ymax, new esri.SpatialReference({ wkid:se.wkid }));
			params.searchExtent = webMercatorUtils.webMercatorToGeographic(se_Original);
		});
	}
    var locator1 = new esri.tasks.Locator(locatorSettings.LocatorURL);
    locator1.outSpatialReference = map.spatialReference;
    locator1.addressToLocations(params, function (candidates) {
        // Discard searches made obsolete by new typing from user
        if (thisSearchTime < lastSearchTime) {
            return;
        }
        ShowLocatedAddress(candidates);
    },
    function (err) {
        dojo.byId("imgSearchLoader").style.display = "none";
        selectedPollPoint = null;
        featureID = null;
        LoctorErrBack("unableToLocate");
    });
}

//Populate candidate address list in address container
function ShowLocatedAddress(candidates) {
    RemoveChildren(dojo.byId('tblAddressResults'));
    CreateScrollbar(dojo.byId("divAddressScrollContainer"), dojo.byId("divAddressScrollContent"));

    if (candidates.length > 0) {
        var table = dojo.byId("tblAddressResults");
        var tBody = document.createElement("tbody");
        table.appendChild(tBody);
        table.cellSpacing = 0;
        table.cellPadding = 0;

        //Filter and display valid address results according to locator settings in configuration file
        var counter = 0;
        for (var i = 0; i < candidates.length; i++) {
            if (candidates[i].score > locatorSettings.AddressMatchScore) {
                for (var bMap = 0; bMap < baseMapLayers.length; bMap++) {
                    if (map.getLayer(baseMapLayers[bMap].Key).visible) {
                        var bmap = baseMapLayers[bMap].Key;
                    }
                }

                if (map.getLayer(bmap).fullExtent.contains(candidates[i].location)) {
                    for (j in locatorSettings.LocatorFieldValues) {
                        if (candidates[i].attributes[locatorSettings.LocatorFieldName] == locatorSettings.LocatorFieldValues[j]) {
                            counter++;
                            var candidate = candidates[i];
                            var tr = document.createElement("tr");
                            tBody.appendChild(tr);
                            var td1 = document.createElement("td");
                            td1.innerHTML = candidate.address;
                            td1.align = "left";
                            td1.className = 'bottomborder';
                            td1.style.cursor = "pointer";
                            td1.height = 20;
                            td1.setAttribute("x", candidate.location.x);
                            td1.setAttribute("y", candidate.location.y);
                            td1.setAttribute("address", candidate.address);
                            td1.onclick = function () {
                                dojo.byId("txtAddress").value = this.innerHTML;
                                lastSearchString = dojo.byId("txtAddress").value.trim();
                                dojo.byId('txtAddress').setAttribute("defaultAddress", this.innerHTML);
                                dojo.byId("txtAddress").setAttribute("defaultAddressTitle", this.innerHTML);
                                mapPoint = new esri.geometry.Point(this.getAttribute("x"), this.getAttribute("y"), map.spatialReference);
                                LocateGraphicOnMap(true);
                            }
                            tr.appendChild(td1);
                        }
                    }
                }
            }
        }

        //Display error message if there are no valid candidate addresses
        if (counter == 0) {
            var tr = document.createElement("tr");
            tBody.appendChild(tr);
            var td1 = document.createElement("td");
            td1.innerHTML = messages.getElementsByTagName("noSearchResults")[0].childNodes[0].nodeValue;
            tr.appendChild(td1);
            dojo.byId("imgSearchLoader").style.display = "none";
            return;
        }
        dojo.byId("imgSearchLoader").style.display = "none";
        SetAddressResultsHeight();
    }
    else {
        dojo.byId("imgSearchLoader").style.display = "none";
        map.infoWindow.hide();
        selectedPollPoint = null;
        pollPoint = null;
        mapPoint = null;
        featureID = null;
        ClearSelection();
        map.getLayer(tempGraphicsLayerId).clear();
        map.getLayer(precinctLayerId).clear();
        map.getLayer(routeGraphicsLayerId).clear();
        map.getLayer(highlightPollLayerId).clear();
        if (!isMobileDevice) {
            var imgToggle = dojo.byId('imgToggleResults');
            if (imgToggle.getAttribute("state") == "maximized") {
                imgToggle.setAttribute("state", "minimized");
                WipeOutResults();
                dojo.byId('imgToggleResults').src = "images/up.png";
                dojo.byId('imgToggleResults').title = ShowPanelTooltip; //CanMod
				dojo.byId('imgPrint').title = PrintTooltip; //CanMod: Print button behavior
            }
        }
        LoctorErrBack("noSearchResults");
    }
}

//Locate searched address on map with pushpin graphic
function LocateGraphicOnMap(loc) {
    map.infoWindow.hide();
    selectedPollPoint = null;
    featureID = null;
    ClearGraphics();
    if (!map.getLayer(precinctLayerId).fullExtent.contains(mapPoint)) {
        map.infoWindow.hide();
        selectedPollPoint = null;
        pollPoint = null;
        featureID = null;
        mapPoint = null;
        ClearSelection();
        map.getLayer(tempGraphicsLayerId).clear();
        map.getLayer(precinctLayerId).clear();
        map.getLayer(routeGraphicsLayerId).clear();
        map.getLayer(highlightPollLayerId).clear();
        if (!isMobileDevice) {
            var imgToggle = dojo.byId('imgToggleResults');
            if (imgToggle.getAttribute("state") == "maximized") {
                imgToggle.setAttribute("state", "minimized");
                WipeOutResults();
                dojo.byId('imgToggleResults').src = "images/up.png";
            }
        }
        HideAddressContainer();
        HideProgressIndicator();
        alert(messages.getElementsByTagName("noDataAvlbl")[0].childNodes[0].nodeValue);
        return;
    }
    if (loc) {
        var symbol = new esri.symbol.PictureMarkerSymbol(locatorSettings.DefaultLocatorSymbol, locatorSettings.SymbolSize.width, locatorSettings.SymbolSize.height);
        var graphic = new esri.Graphic(mapPoint, symbol, null, null);
        map.getLayer(tempGraphicsLayerId).add(graphic);
    }
    else {
        var locator2 = new esri.tasks.Locator(locatorSettings.LocatorURL);
        locator2.locationToAddress(mapPoint, 100);
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
                    for (var att in locatorSettings.LocatorFields) {
                        address.push(candidate.address[locatorSettings.LocatorFields[att]]);
                    }
                    attr = { Address: address.join(',') };
                }
                var graphic = new esri.Graphic(mapPoint, symbol, attr, null);
                map.getLayer(tempGraphicsLayerId).add(graphic);
            }
        });
    }
    FindPrecinctLayer();
    if (!isMobileDevice) {
        ShowPollingPlaceDetails();
        for (var index in electedOfficialsTabData) {
            GetOfficeName(electedOfficialsTabData[index].URL, electedOfficialsTabData[index].Data, index);
        }
    }
    HideAddressContainer();
}

//This function is called when locator service fails or does not return any data
function LoctorErrBack(val) {
    RemoveChildren(dojo.byId('tblAddressResults'));
    CreateScrollbar(dojo.byId("divAddressScrollContainer"), dojo.byId("divAddressScrollContent"));

    var table = dojo.byId("tblAddressResults");
    var tBody = document.createElement("tbody");
    table.appendChild(tBody);
    table.cellSpacing = 0;
    table.cellPadding = 0;

    var tr = document.createElement("tr");
    tBody.appendChild(tr);
    var td1 = document.createElement("td");
    td1.innerHTML = messages.getElementsByTagName(val)[0].childNodes[0].nodeValue;
    tr.appendChild(td1);
}
