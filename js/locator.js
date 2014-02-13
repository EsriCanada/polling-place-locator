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
//First function called while locating address
function LocateAddressCML2(suggest,event) {
	noRoute = false;
	//On selection of options with arrow keys, do not locate
	if (event) {
		var kc = event.keyCode;
		if (kc == dojo.keys.DOWN_ARROW || kc == dojo.keys.UP_ARROW || kc == dojo.keys.TAB) {
			if(timeouts.autocomplete != null) {clearTimeout(timeouts.autocomplete); timeouts.autocomplete = null;}
			return;
		}
	}
	
	//If selection made, do not proceed to new locator search
	if (!suggest && document.getElementById("autocompleteSelect") && document.getElementById("autocompleteSelect").selectedIndex >= 0) {
		var zCandidate = lastSearchResults[document.getElementById("autocompleteSelect").selectedIndex];
		lastSearchString = zCandidate.attributes[locatorSettings.DisplayFieldCML2];
		document.getElementById("searchInput").value = lastSearchString;
		clearAutocomplete();
		mapPoint = zCandidate.location;
		LocateGraphicOnMap(true);
		return;
	}
	
	//No autocomplete on mobile devices (too unreliable due to device processing speeds)
	if ((isMobileDevice || isTablet) & suggest) {
		return;
	}

    map.infoWindow.hide();
    selectedGraphic = null;
	var currSearch = dojo.byId("searchInput").value.trim();
    if (currSearch === '' || (currSearch == lastSearchString && suggest) || (currSearch.length < 4 && suggest/*No auto-suggest for small*/)) {
		if (currSearch != lastSearchString) {
			lastSearchString = currSearch;
			clearAutocomplete();
		}
        return;
    }
	if(timeouts.autocomplete != null) {clearTimeout(timeouts.autocomplete); timeouts.autocomplete = null;}
	lastSearchString = currSearch;
	var params = [];
	//CanMod: Modify locator to search in set extent only (makes it uncessary to type city, province, etc in the search field)
	params["address"] = {};
	params["address"][locatorSettings.LocatorParamaters] = currSearch;
	se = locatorSettings.SearchExtent;
	params.outFields = [locatorSettings.CandidateFields];
	if (se.wkid == 4326) {
		params.searchExtent = new esri.geometry.Extent(se.xmin,se.ymin,se.xmax,se.ymax, new esri.SpatialReference({ wkid:se.wkid }));
	}
	else if (se.wkid == 3785) {
		require(["esri/geometry/webMercatorUtils"], function(webMercatorUtils) {
			var se_Original = new esri.geometry.Extent(se.xmin, se.ymin, se.xmax, se.ymax, new esri.SpatialReference({ wkid:se.wkid }));
			params.searchExtent = webMercatorUtils.webMercatorToGeographic(se_Original);
		});
	}
    var locatorCML2 = new esri.tasks.Locator(locatorSettings.LocatorURL);
    locatorCML2.outSpatialReference = map.spatialReference;
	autocomplete(locatorCML2,currSearch,params,suggest);
}

// Discard searches made obsolete by new typing from user
function autocomplete(locatorCML2,currSearch,params,suggest) {
	locatorCML2.addressToLocations(params, function (candidates) {
		if (currSearch != dojo.byId("searchInput").value.trim()) {
			return;
		}
		ShowLocatedAddressCML2(candidates,suggest);
    },
	function (err) {
		console.error(err);
    });
}

function ShowLocatedAddressCML2(candidates,suggest) {
	//Keep top 10 candidates that pass minimum score from config file
	candidates = dojo.filter(candidates, function(item) {
		if (dojo.indexOf(locatorSettings.LocatorFieldValues, item.attributes[locatorSettings.LocatorFieldName]) >= 0) {
			return item.score > locatorSettings.AddressMatchScore;
		}
		else {return false;}
	});
	if (candidates.length > 10) {
		candidates = candidates.slice(0,10);
	}

    if (candidates.length > 0) {
		lastSearchResults = candidates;
		
		if (suggest) {
			var sel = document.createElement("select");
			sel.setAttribute("size",String(candidates.length));
			sel.setAttribute("id","autocompleteSelect");
			sel.setAttribute("onclick","LocateAddressCML2(false);");
			sel.setAttribute("onkeyup","if (event.keyCode == dojo.keys.ENTER) {LocateAddressCML2(false);} if (event.keyCode == dojo.keys.ESCAPE) {clearAutocomplete();}");
			dojo.forEach(candidates,function(item,i) {
				var opt = document.createElement("option");
				opt.innerHTML = item.attributes[locatorSettings.DisplayFieldCML2];
				sel.appendChild(opt);
			});
			clearAutocomplete();
			document.getElementById("autocomplete").appendChild(sel);
		}
		else {
			var zCandidate = lastSearchResults[0];
			lastSearchString = zCandidate.attributes[locatorSettings.DisplayFieldCML2];
			clearAutocomplete();
			mapPoint = zCandidate.location;
			LocateGraphicOnMap(true);
		}
    } else {
		var alert = document.createElement("div");
		alert.innerHTML = messages.getElementsByTagName("noSearchResults")[0].childNodes[0].nodeValue + "<hr>" + locatorSettings.Example;
		if(timeouts.autocomplete != null) {clearTimeout(timeouts.autocomplete); timeouts.autocomplete = null;}
		if (suggest) {
			timeouts.autocomplete = setTimeout(function() { //Reduce sporadic appearances of "No Results" as user types
				timeouts.autocomplete = null;
				clearAutocomplete();
				document.getElementById("autocomplete").appendChild(alert);
			},1000);
		}
		else {
			alert.setAttribute("role","alert"); //Alert screen reader users on form submission that no results found
			clearAutocomplete();
			document.getElementById("autocomplete").appendChild(alert);
		}
    }
}

//Locate searched address on map with pushpin graphic
function LocateGraphicOnMap(loc) {
	showCandidates = true;
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
				dojo.byId('imgToggleResults').title = intl.ShowPanelTooltip;
            }
        }
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
	showHideSearch(true);
}