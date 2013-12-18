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
var noRoute = false; //flag for setting for to know route is drawn or not

//To find the route between the polling place and home.
function FindRoute() {
    if (mapPoint) {
        if (desgFlag) {
            CalculateRoute(mapPoint, pollPoint);
        }
        else if (!desgFlag) {
            if (generateRouteToNonDesignatedPollingPlace) {
                CalculateRoute(mapPoint, pollPoint);
            }
        }
    }
}

//function to GenerateRouteNonDesignatedPollingPlace
function CalculateRoute(mapPoint, pollPoint) {
    if (!isMobileDevice) {
        for (var index in pollingPlaceData) {
            if (pollingPlaceData[index].ShowDirection) {
                ShowProgressIndicator();
            }
        }
    }
    else {
        ShowProgressIndicator();
    }
    var routeParams = new esri.tasks.RouteParameters();
    routeParams.stops = new esri.tasks.FeatureSet();
    routeParams.returnRoutes = false;
    routeParams.returnDirections = true;
	//CanMod: Determine unit type from config file
	if (unitConfig.DirectionsLengthUnit == "KM") {routeParams.directionsLengthUnits = esri.Units.KILOMETERS;}
	else {routeParams.directionsLengthUnits = esri.Units.MILES;}
	routeParams.directionsLanguage = directionsLanguage; //CanMod: Directions Language now set by parameter in config.js
    routeParams.outSpatialReference = map.spatialReference;
    routeParams.stops.features[0] = new esri.Graphic(mapPoint, null);
    routeParams.stops.features[1] = new esri.Graphic(pollPoint, null);

    routeTask.solve(routeParams, null, function (err) {
        mapPoint = null;
        pollPoint = null;
        noRoute = true;
        featureID = null;
        HideProgressIndicator();
        map.infoWindow.hide();
        ClearSelection();
        ClearGraphics();

        map.getLayer(precinctLayerId).clear();
        map.getLayer(routeGraphicsLayerId).clear();
        map.getLayer(highlightPollLayerId).clear();
        map.getLayer(routeGraphicsLayerId).clear();

        ShowInfoDetailsView();
        if (!isMobileDevice) {
            setTimeout(function () {
                var imgToggle = dojo.byId('imgToggleResults');
                if (imgToggle.getAttribute("state") == "maximized") {
                    imgToggle.setAttribute("state", "minimized");
                    WipeOutResults();
                    dojo.byId('imgToggleResults').src = "images/up.png";
                }
            }, 500);
        }
        alert(err.message);
    });
}

//To display the driving direction.
function ShowRoute(solveResult) {
    map.getLayer(routeGraphicsLayerId).clear();
    directions = solveResult.routeResults[0].directions;

    map.getLayer(routeGraphicsLayerId).add(new esri.Graphic(directions.mergedGeometry, routeSymbol));
	setTimeout(function(){
		if (!map.extent.contains(directions.extent.expand(1.5))) map.setExtent(map.extent.union(directions.extent).expand(3)); //CanMod: Set extent of map to cover whole route
	},300);

    if (!isMobileDevice) {
        var divSegmentContainer = document.createElement("div");
        divSegmentContainer.id = "divSegmentContainer";
        divSegmentContainer.className = "divSegmentContainer";
        divSegmentContainer.style.height = "86%";
        divSegmentContainer.style.overflow = "hidden";

        var divSegmentContent = document.createElement("div");
        divSegmentContent.id = "divSegmentContent";
        divSegmentContent.style.height = "94%";
        divSegmentContent.style.overflow = "hidden";
        divSegmentContainer.appendChild(divSegmentContent);


        for (var index in pollingPlaceData) {
            if (pollingPlaceData[index].ShowDirection) {
                var divDirections = "div" + index + "content";
                RemoveChildren(dojo.byId(divDirections));
            }
            else if (pollingPlaceData[index].ShowDirection == false) {
                var divDirection = "div" + index + "content";
                RemoveChildren(dojo.byId(divDirection));
            }
        }
    }
    else {
        RemoveChildren(dojo.byId('divInfoDirectionsScroll'));

        var divDirecHdr = document.createElement('div');
        divDirecHdr.style.width = "100%";
        divDirecHdr.style.marginTop = "10px";
        for (var index in pollingPlaceData) {
            if (pollingPlaceData[index].ShowDirection) {
                var divDirections = "div" + index + "content";
                RemoveChildren(dojo.byId("divInfoDirectionsScroll"));
            }

            if (!pollingPlaceData[index].Data) {
                if (pollingPlaceData[index].ShowDirection)  {
                    divDirecHdr.innerHTML = pollingPlaceData[index].Title;
                }
            }
        }
        dojo.byId('divInfoDirectionsScroll').appendChild(divDirecHdr);
    }
    if (divDirections) {
        var tableSummary = document.createElement("table");
        var tbodySummary = document.createElement("tbody");

        tableSummary.style.width = "100%";
        if (!isMobileDevice) {
            tableSummary.style.width = "100%";
            tableSummary.style.height = "15%";
            tableSummary.style.borderBottom = "1px dotted white";
        }
        else {
            tableSummary.style.height = "5%";
            tableSummary.style.borderTop = "2px solid #A5A5A5";
            tableSummary.style.borderBottom = "2px solid #A5A5A5";
        }
        tableSummary.appendChild(tbodySummary);


        var trSummary = document.createElement("tr");
        var tdTotalDistance = document.createElement("td");
        tdTotalDistance.innerHTML = DistanceLabel + ": " + FormatDistance(directions.totalLength, unitConfig.DirectionsLengthLabel); //CanMod: Replace label with variable
        tdTotalDistance.align = "left";

        var tdTotalTime = document.createElement("td");
        tdTotalTime.className = "tdTotalTime";
        tdTotalTime.innerHTML = DurationLabel + ": " + FormatTime(directions.totalTime); //CanMod
        tdTotalTime.align = "center";

        trSummary.appendChild(tdTotalDistance);
        trSummary.appendChild(tdTotalTime);
        tbodySummary.appendChild(trSummary);
    }
    if (isMobileDevice) {
        if (divDirections) {
            dojo.byId("divInfoDirectionsScroll").appendChild(tableSummary);
        }
    }
    else {
        if (divDirections) {
            dojo.byId(divDirections).appendChild(tableSummary);
        }
    }
    if (divDirections) {
        var table = document.createElement("table");
        var tbody = document.createElement("tbody");
        table.style.width = "95%";
        table.style.paddingLeft = "5px";
        table.appendChild(tbody);


        for (var i in solveResult.routeResults[0].directions.features) {
            var feature = solveResult.routeResults[0].directions.features[i];
            var miles = FormatDistance(feature.attributes.length, unitConfig.DirectionsLengthLabel); //CanMod: Use the directions length label from unitConfig to format the distance.
            var tr = document.createElement("tr");
            var td = document.createElement("td");
            var td1 = document.createElement("td");
            td1.innerHTML = (Number(i) + 1) + ". ";
            td1.vAlign = "top";

            if (map.getLayer(tempGraphicsLayerId).graphics.length == 0) {
                var attr = [];
                attr = { Address: locatorSettings.MyLocationLabel };
                var symbol = new esri.symbol.PictureMarkerSymbol(locatorSettings.DefaultLocatorSymbol, locatorSettings.SymbolSize.width, locatorSettings.SymbolSize.height);
                var graphic = new esri.Graphic(mapPoint, symbol, attr, null);
                map.getLayer(tempGraphicsLayerId).add(graphic);
            }

            if (i == 0) {
                if (map.getLayer(tempGraphicsLayerId).graphics.length > 0) {
                    if (map.getLayer(tempGraphicsLayerId).graphics[0].attributes) {
                        td.innerHTML = feature.attributes.text.replace('Location 1', map.getLayer(tempGraphicsLayerId).graphics[0].attributes.Address);
                    }
                    else {
                        td.innerHTML = feature.attributes.text.replace('Location 1', dojo.byId("txtAddress").value);
                    }
                }
            }

            else if (i == (solveResult.routeResults[0].directions.features.length - 1)) {
                var selectedFeature = map.getLayer(pollLayerId).getSelectedFeatures();
                if (selectedFeature.length > 0) {
                    td.innerHTML = feature.attributes.text.replace('Location 2', selectedFeature[0].attributes[databaseFields.PollingPlaceName]); //CanMod: Replace hard-coded NAME attribute with PollingPlaceName from databaseFields
                }
                else {
                    td.innerHTML = feature.attributes.text.replace('Location 2', storeAttr);
                }
            }
            else {
                if (miles) {
					td.innerHTML = feature.attributes.text + " (" + FormatDistance(feature.attributes.length, unitConfig.DirectionsLengthLabel) + ")"; //CanMod: Replace miles label
                }
                else {
                    td.innerHTML = feature.attributes.text;
                }
            }

            tr.appendChild(td1);
            tr.appendChild(td);
            tbody.appendChild(tr);
        }
    }
    HideProgressIndicator();
    if (!isMobileDevice) {
        if (divDirections) {
            dojo.byId(divDirections).appendChild(divSegmentContainer);
            divSegmentContent.appendChild(table);
            CreateDirectionsScrollBar();
        }
    }
    else {
        if (divDirections) {
            dojo.byId("divInfoDirectionsScroll").appendChild(table);
        }
    }
}

//Create scrollbar for comments
function CreateDirectionsScrollBar() {
    CreateScrollbar(dojo.byId("divSegmentContainer"), dojo.byId("divSegmentContent"));
    dojo.byId("divSegmentContainerscrollbar_track").style.top = (dojo.coords(dojo.byId('divSegmentContainer')).t + 1) + "px";
    dojo.byId("divSegmentContainerscrollbar_track").style.right = 5 + "px";
    dojo.byId("divSegmentContainerscrollbar_track").style.height = 90 + "px";
    var hanHeight = parseInt(dojo.byId("divSegmentContainerscrollbar_handle").style.height.split("p"));
    if (hanHeight) {
        dojo.byId("divSegmentContainerscrollbar_handle").style.height = (hanHeight + 6) + "px";
        dojo.byId("divSegmentContainerscrollbar_track").style.backgroundColor = "#666666";
    }
}


//Round the distance to the nearest hundredth of a unit
function FormatDistance(dist, units) {
    var d = Math.round(dist * 100) / 100;
    if (d == 0) {
        return "";
    }
    return d + " " + units;
}

//Format the time as hours and minutes
function FormatTime(time) {
    var hr = Math.floor(time / 60);  //Important to use math.floor with hours
    var min = Math.round(time % 60);
    if (hr < 1 && min < 1) {
        return "30 second(s)";
    }
    else
        if (hr < 1) {
            return min + " minute(s)";
        }
    return hr + " hour(s) " + min + " minute(s)";
}