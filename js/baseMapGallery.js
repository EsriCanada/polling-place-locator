/** @license
 |
 |ArcGIS for Canadian Municipalities / ArcGIS pour les municipalités canadiennes
 |Polling Place Locator v10.2.0 / Localisateur de bureau de scrutin v10.2.0
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
//Create basemap components
function CreateBaseMapComponent() {
    for (var i = 0; i < baseMapLayers.length; i++) {
        map.addLayer(CreateBaseMapLayer(baseMapLayers[i].MapURL, baseMapLayers[i].Key, (i == 0) ? true : false));
        if (i == 0) {
            dojo.connect(map.getLayer(baseMapLayers[i].Key), "onLoad", function (e) {
                zoomLevel = e.scales.length - 2;
            });
        }
    }

    var layerList = dojo.byId('layerList');

    for (var i = 0; i < Math.ceil(baseMapLayers.length / 2); i++) {
        var previewDataRow = document.createElement("tr");

        if (baseMapLayers[(i * 2) + 0]) {
            var layerInfo = baseMapLayers[(i * 2) + 0];
            layerList.appendChild(CreateBaseMapElement(layerInfo));
        }

        if (baseMapLayers[(i * 2) + 1]) {
            var layerInfo = baseMapLayers[(i * 2) + 1];
            layerList.appendChild(CreateBaseMapElement(layerInfo));
        }
    }
    if (!(dojo.isIE < 9)) {
        dojo.addClass(dojo.byId("imgThumbNail" + baseMapLayers[0].Key), "selectedBaseMap");
        if (dojo.isIE) {
            dojo.byId("imgThumbNail" + baseMapLayers[0].Key).style.marginTop = "-5px";
            dojo.byId("imgThumbNail" + baseMapLayers[0].Key).style.marginLeft = "-5px";
            dojo.byId("spanBaseMapText" + baseMapLayers[0].Key).style.marginTop = "5px";
        }
    }
}

//Create basemap images with respective titles
function CreateBaseMapElement(baseMapLayerInfo) {
    var divContainer = document.createElement("div");
    divContainer.className = "baseMapContainerNode";
    var imgThumbnail = document.createElement("img");
    imgThumbnail.src = baseMapLayerInfo.ThumbnailSource;
    imgThumbnail.className = "basemapThumbnail";
    imgThumbnail.id = "imgThumbNail" + baseMapLayerInfo.Key;
    imgThumbnail.setAttribute("layerId", baseMapLayerInfo.Key);
    imgThumbnail.onclick = function () {
        ChangeBaseMap(this);
        ShowBaseMaps();
    };
    var spanBaseMapText = document.createElement("span");
    spanBaseMapText.id = "spanBaseMapText" + baseMapLayerInfo.Key;
    spanBaseMapText.className = "basemapLabel";
    spanBaseMapText.innerHTML = baseMapLayerInfo.Name;
    divContainer.appendChild(imgThumbnail);
    divContainer.appendChild(spanBaseMapText);
    return divContainer;
}

//Create basemap layer on the map
function CreateBaseMapLayer(layerURL, layerId, isVisible) {
    var layer = new esri.layers.ArcGISTiledMapServiceLayer(layerURL, { id: layerId, visible: isVisible });
    return layer;
}

//Toggle basemap layer
function ChangeBaseMap(spanControl) {
    HideMapLayers();
    var key = spanControl.getAttribute('layerId');

    for (var i = 0; i < baseMapLayers.length; i++) {
        dojo.removeClass(dojo.byId("imgThumbNail" + baseMapLayers[i].Key), "selectedBaseMap");
        if (dojo.isIE) {
            dojo.byId("imgThumbNail" + baseMapLayers[i].Key).style.marginTop = "0px";
            dojo.byId("imgThumbNail" + baseMapLayers[i].Key).style.marginLeft = "0px";
            dojo.byId("spanBaseMapText" + baseMapLayers[i].Key).style.marginTop = "0px";
        }
        if (baseMapLayers[i].Key == key) {
            if (!(dojo.isIE < 9)) {
                dojo.addClass(dojo.byId("imgThumbNail" + baseMapLayers[i].Key), "selectedBaseMap");
                if (dojo.isIE) {
                    dojo.byId("imgThumbNail" + baseMapLayers[i].Key).style.marginTop = "-5px";
                    dojo.byId("imgThumbNail" + baseMapLayers[i].Key).style.marginLeft = "-5px";
                    dojo.byId("spanBaseMapText" + baseMapLayers[i].Key).style.marginTop = "5px";
                }
            }

            var layer = map.getLayer(baseMapLayers[i].Key);
            layer.show();
        }
    }
}

//Hide layers
function HideMapLayers() {
    for (var i = 0; i < baseMapLayers.length; i++) {
        var layer = map.getLayer(baseMapLayers[i].Key);
        if (layer) {
            layer.hide();
        }
    }
}

//Animate basemap container
function ShowBaseMaps() {
    if (dojo.coords("divAppContainer").h > 0) {
        dojo.replaceClass("divAppContainer", "hideContainerHeight", "showContainerHeight");
        dojo.byId('divAppContainer').style.height = '0px';
    }
    if (!isMobileDevice) {
        if (dojo.coords("divAddressHolder").h > 0) {
            dojo.replaceClass("divAddressHolder", "hideContainerHeight", "showContainerHeight");
            dojo.byId('divAddressHolder').style.height = '0px';
        }
    }
    var cellHeight = (isTablet) ? 100 : 115;
    if (dojo.coords("divLayerContainer").h > 0) {
        dojo.replaceClass("divLayerContainer", "hideContainerHeight", "showContainerHeight");
        dojo.byId('divLayerContainer').style.height = '0px';
    }
    else {
        dojo.byId('divLayerContainer').style.height = cellHeight + "px";
        dojo.byId('divLayerContentHolder').style.height = (cellHeight - 10) + "px";
        dojo.byId('divLayerContentHolder').style.top = "0px";
        dojo.replaceClass("divLayerContainer", "showContainerHeight", "hideContainerHeight");
    }
    setTimeout(function () {
        CreateScrollbar(dojo.byId("divLayerContainerHolder"), dojo.byId("divLayerContentHolder"));
    }, 500);
}


