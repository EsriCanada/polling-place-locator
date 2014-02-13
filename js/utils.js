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
var orientationChange = false; //variable for setting the flag on orientation
var pointAttr; //variable for storing the info pop up attribute values
var selectedPollingID; //varible used for storing the selected polling ID
var storeAttr; //variable for storing the header name for the info window
var tinyResponse; //variable for storing the response getting from tiny url api
var tinyUrl; //variable for storing the tiny url

//Refresh address container
function RemoveChildren(parentNode) {
    if (parentNode) {
        while (parentNode.hasChildNodes()) {
            parentNode.removeChild(parentNode.lastChild);
        }
    }
}

//function to trim string
String.prototype.trim = function () {
    return this.replace(/^\s*/, "").replace(/\s*$/, "");
}

//Clear graphics on map
function ClearGraphics() {
    if (map.getLayer(tempGraphicsLayerId)) {
        map.getLayer(tempGraphicsLayerId).clear();
    }
}

//Add graphic on the layer
function AddGraphic(layer, symbol, point) {
    var graphic = new esri.Graphic(point, symbol, null, null);
    layer.add(graphic);
}

//Function to append ... for a string
String.prototype.trimString = function (len) {
    return (this.length > len) ? this.substring(0, len) + "..." : this;
}

//Create scrollbar for polling details
function CreatePollingDetailsScrollBar(container, content) {
    CreateScrollbar(dojo.byId(container), dojo.byId(content));
    dojo.byId(container + "scrollbar_track").style.top = dojo.coords(dojo.byId(content)).t + "px";
    dojo.byId(container + "scrollbar_track").style.right = 3 + "px";
    dojo.byId(container + "scrollbar_track").style.backgroundColor = "#E6FAE6";
}

//Populate data in the bottom panel
function DetailsContent(feature, attributes, pollingPlaceData) {
    for (var i in map.getLayer(pollLayerId).fields) {
        if (!attributes[map.getLayer(pollLayerId).fields[i].name]) {
            attributes[map.getLayer(pollLayerId).fields[i].name] = "-";
            continue;
        }
        if (map.getLayer(pollLayerId).fields[i].type == "esriFieldTypeDate") {
            if (attributes[map.getLayer(pollLayerId).fields[i].name]) {
                if (Number(attributes[map.getLayer(pollLayerId).fields[i].name])) {
                    var date = new js.date();
                    var utcMilliseconds = Number(attributes[map.getLayer(pollLayerId).fields[i].name]);
                    attributes[map.getLayer(pollLayerId).fields[i].name] = dojo.date.locale.format(date.utcTimestampFromMs(utcMilliseconds), { datePattern: formatDateAs, selector: "date" });
                }
            }
        }
    }

    for (var index in pollingPlaceData) {
        if (pollingPlaceData[index].ShowDirection) {
            continue;
        }
        if (pollingPlaceData[index].Data) {
            var divContainer = dojo.byId("div" + index + "content");
            RemoveChildren(divContainer);

            divContainer.style.overflow = "hidden";
            divContainer.style.height = "144px";

            var table = document.createElement("table");
            table.style.width = "95%";
            table.style.paddingTop = "5px";
            table.style.paddingLeft = "5px";
            var tbody = document.createElement("tbody");
            tbody.id = "tbody" + index + "Container";
            table.appendChild(tbody);

            table.cellSpacing = 2;
            table.cellPadding = 0;

            // Run through each of the lines specified for the details display
            // Variable "attributes" contains the polling place's attributes; if this detail display
            // was for a precinct, it also contains attributes["_PrecinctAttributes"], which are
            // the precinct's attributes. For the details display, "FieldName" refers to the polling
            // place attributes, while "PrecinctFieldExpression" refers to the precinct attributes.
            for (var key = 0; key < pollingPlaceData[index].Data.length; key++) {
                var dataLineEntry = pollingPlaceData[index].Data[key];
                var dataLineDisplay = "";
                if (dataLineEntry.FieldName) {
                    dataLineDisplay = dojo.string.substitute(dataLineEntry.FieldName, attributes);
                } else if (dataLineEntry.PrecinctFieldExpression && attributes["_PrecinctAttributes"]) {
                    dataLineDisplay = dojo.string.substitute(
                        dataLineEntry.PrecinctFieldExpression, attributes["_PrecinctAttributes"]);
                }

                if (dataLineDisplay.length > 0) {
                    var tr = document.createElement("tr");
                    tr.id = "trDataContainer";
                    tbody.appendChild(tr);

                    // Label
                    var td1 = document.createElement("td");
					td1.className = "tdLabel"; //CanMod
                    td1.style.height = "20px";
                    td1.style.verticalAlign = "top";

                    if (dataLineEntry.DisplayText) {
                        td1.innerHTML = dataLineEntry.DisplayText;
                    }

                    // Value
                    var td2 = document.createElement("td");
                    td2.style.height = "20px";
                    td2.style.verticalAlign = "top";
                    td2.style.paddingLeft = "5px";
                    td2.className = "tdBreak";

                    if (CheckMailFormat(dataLineDisplay)) {
                        td2.innerHTML = "<u style='cursor:pointer'>" + dataLineDisplay + "</u>";
                        td2.style.wordBreak = "break-all";
                        td2.setAttribute("maill", dataLineDisplay);
                        td2.onclick = function () {
                            parent.location = "mailto:" + this.getAttribute("maill");
                        }
                    } else {
                        td2.innerHTML = dataLineDisplay;
                    }

                    tr.appendChild(td1);
                    tr.appendChild(td2);
                    tbody.appendChild(tr);
                }
            }
            divContainer.appendChild(table);
            CreatePollingDetailsScrollBar("div" + index + "container", "div" + index + "content");
        }
        else if (showCommentsTab) {
            if ((pollingPlaceData[index].ShowDirection != true) && (pollingPlaceData[index].ShowDirection != false)) {
                dojo.byId("btnAddComments").setAttribute("commentsId", index);
                FetchComments(dojo.string.substitute((isBrowser ? pollLayer.PrimaryKeyForPolling : pollMobileLayer.PrimaryKeyForPolling), attributes), index);
                setTimeout(function () {
                    CreatePollingDetailsScrollBar("div" + index + "container", "div" + index + "content");
                }, 1000);
            }
        }
    }
}

//Create scroll-bar
function CreateScrollbar(container, content) {
    var yMax;
    var pxLeft, pxTop, xCoord, yCoord;
    var scrollbar_track;
    var isHandleClicked = false;
    this.container = container;
    this.content = content;
    content.scrollTop = 0;
    if (dojo.byId(container.id + 'scrollbar_track')) {
        RemoveChildren(dojo.byId(container.id + 'scrollbar_track'));
        container.removeChild(dojo.byId(container.id + 'scrollbar_track'));
    }
    if (!dojo.byId(container.id + 'scrollbar_track')) {
        scrollbar_track = document.createElement('div');
        scrollbar_track.id = container.id + "scrollbar_track";
        scrollbar_track.className = "scrollbar_track";
    }
    else {
        scrollbar_track = dojo.byId(container.id + 'scrollbar_track');
    }

    var containerHeight = dojo.coords(container);
    //scrollbar_track.style.height = (containerHeight.h - 6) + "px"; //CanMod: Bug fix in IE8, line would fail, not sure why though
	var xyz = containerHeight.h + "px";
	scrollbar_track.style.height = xyz;
    scrollbar_track.style.right = 5 + 'px';

    var scrollbar_handle = document.createElement('div');
    scrollbar_handle.className = 'scrollbar_handle';
    scrollbar_handle.id = container.id + "scrollbar_handle";

    scrollbar_track.appendChild(scrollbar_handle);
    container.appendChild(scrollbar_track);

    if ((content.scrollHeight - content.offsetHeight) <= 5) {
        scrollbar_handle.style.display = 'none';
        scrollbar_track.style.display = 'none';
        return;
    }
    else {
        scrollbar_handle.style.display = 'block';
        scrollbar_track.style.display = 'block';
        scrollbar_handle.style.height = Math.max(this.content.offsetHeight * (this.content.offsetHeight / this.content.scrollHeight), 25) + 'px';
        yMax = this.content.offsetHeight - scrollbar_handle.offsetHeight;
        yMax = yMax - 5; //for getting rounded bottom of handle
        if (window.addEventListener) {
            content.addEventListener('DOMMouseScroll', ScrollDiv, false);
        }
        content.onmousewheel = function (evt) {
            ScrollDiv(evt);
        }
    }

    function ScrollDiv(evt) {
        var evt = window.event || evt //equalize event object
        var delta = evt.detail ? evt.detail * (-120) : evt.wheelDelta //delta returns +120 when wheel is scrolled up, -120 when scrolled down
        pxTop = scrollbar_handle.offsetTop;

        if (delta <= -120) {
            var y = pxTop + 10;
            if (y > yMax) y = yMax // Limit vertical movement
            if (y < 0) y = 0 // Limit vertical movement
            scrollbar_handle.style.top = y + "px";
            content.scrollTop = Math.round(scrollbar_handle.offsetTop / yMax * (content.scrollHeight - content.offsetHeight));
        }
        else {
            var y = pxTop - 10;
            if (y > yMax) y = yMax // Limit vertical movement
            if (y < 0) y = 2 // Limit vertical movement
            scrollbar_handle.style.top = (y - 2) + "px";
            content.scrollTop = Math.round(scrollbar_handle.offsetTop / yMax * (content.scrollHeight - content.offsetHeight));
        }
    }

    //Attaching events to scrollbar components
    scrollbar_track.onclick = function (evt) {
        if (!isHandleClicked) {
            evt = (evt) ? evt : event;
            pxTop = scrollbar_handle.offsetTop // Sliders vertical position at start of slide.
            var offsetY;
            if (!evt.offsetY) {
                var coords = dojo.coords(evt.target);
                offsetY = evt.layerY - coords.t;
            }
            else
                offsetY = evt.offsetY;
            if (offsetY < scrollbar_handle.offsetTop) {
                scrollbar_handle.style.top = offsetY + "px";
                content.scrollTop = Math.round(scrollbar_handle.offsetTop / yMax * (content.scrollHeight - content.offsetHeight));
            }
            else if (offsetY > (scrollbar_handle.offsetTop + scrollbar_handle.clientHeight)) {
                var y = offsetY - scrollbar_handle.clientHeight;
                if (y > yMax) y = yMax // Limit vertical movement
                if (y < 0) y = 0 // Limit vertical movement
                scrollbar_handle.style.top = y + "px";
                content.scrollTop = Math.round(scrollbar_handle.offsetTop / yMax * (content.scrollHeight - content.offsetHeight));
            }
            else {
                return;
            }
        }
        isHandleClicked = false;
    };
    //Attaching events to scrollbar components
    scrollbar_handle.onmousedown = function (evt) {
        isHandleClicked = true;
        evt = (evt) ? evt : event;
        evt.cancelBubble = true;
        if (evt.stopPropagation) evt.stopPropagation();
        pxTop = scrollbar_handle.offsetTop // Sliders vertical position at start of slide.
        yCoord = evt.screenY // Vertical mouse position at start of slide.
        document.body.style.MozUserSelect = 'none';
        document.body.style.userSelect = 'none';
        document.onselectstart = function () {
            return false;
        }
        document.onmousemove = function (evt) {
            evt = (evt) ? evt : event;
            evt.cancelBubble = true;
            if (evt.stopPropagation) evt.stopPropagation();
            var y = pxTop + evt.screenY - yCoord;
            if (y > yMax) y = yMax // Limit vertical movement
            if (y < 0) y = 0 // Limit vertical movement
            scrollbar_handle.style.top = y + "px";
            content.scrollTop = Math.round(scrollbar_handle.offsetTop / yMax * (content.scrollHeight - content.offsetHeight));
        }
    };

    document.onmouseup = function () {
        document.body.onselectstart = null;
        document.onmousemove = null;
    };

    scrollbar_handle.onmouseout = function (evt) {
        document.body.onselectstart = null;
    };

    var startPos;
    var scrollingTimer;

    dojo.connect(container, "touchstart", function (evt) {
        touchStartHandler(evt);
    });

    dojo.connect(container, "touchmove", function (evt) {
        touchMoveHandler(evt);
    });

    dojo.connect(container, "touchend", function (evt) {
        touchEndHandler(evt);
    });

    //Handlers for Touch Events
    function touchStartHandler(e) {
        startPos = e.touches[0].pageY;
    }

    function touchMoveHandler(e) {
        dojo.byId("txtComments").blur();
        var touch = e.touches[0];
        e.cancelBubble = true;
        if (e.stopPropagation) e.stopPropagation();
        e.preventDefault();

        pxTop = scrollbar_handle.offsetTop;
        var y;
        if (startPos > touch.pageY) {
            y = pxTop + 10;
        }
        else {
            y = pxTop - 10;
        }

        //setting scrollbar handel
        if (y > yMax) y = yMax // Limit vertical movement
        if (y < 0) y = 0 // Limit vertical movement
        scrollbar_handle.style.top = y + "px";

        //setting content position
        content.scrollTop = Math.round(scrollbar_handle.offsetTop / yMax * (content.scrollHeight - content.offsetHeight));

        scrolling = true;
        startPos = touch.pageY;
    }

    function touchEndHandler(e) {
        scrollingTimer = setTimeout(function () { clearTimeout(scrollingTimer); scrolling = false; }, 100);
    }
    //touch scrollbar end
}

//Create tap events at devices for bottom panel
function CreateHorizontalScrollbar(container, content) {
    var startHPos;
    var scrollingHTimer;

    dojo.connect(container, "touchstart", function (evt) {
        touchHStartHandler(evt);
    });
    if (content.id == "carouselscroll") {
        handlePoll = dojo.connect(container, "touchmove", function (evt) {
            touchHMoveHandler(evt);
        });
    }
    else if (content.id == "carouselOfficescroll") {
        handleElected = dojo.connect(container, "touchmove", function (evt) {
            touchHMoveHandler(evt);
        });
    }
    dojo.connect(container, "touchend", function (evt) {
        touchHEndHandler(evt);
    });

    //Handlers for Touch Events
    function touchHStartHandler(e) {
        startHPos = e.touches[0].pageX;
    }

    function touchHMoveHandler(e) {
        if (!scrollingH) {
            var touch = e.touches[0];
            e.cancelBubble = true;
            if (e.stopPropagation) e.stopPropagation();
            e.preventDefault();

            if (touch.pageX - startHPos >= 2) {
                setTimeout(function () {
                    if (content.id == "carouselscroll") {
                        SlideLeft();
                    }
                    else if (content.id == "carouselOfficescroll") {
                        SlideOfficeLeft();
                    }
                }, 100);
            }
            if (startHPos - touch.pageX >= 2) {
                setTimeout(function () {
                    if (content.id == "carouselscroll") {
                        SlideRight();
                    }
                    else if (content.id == "carouselOfficescroll") {
                        SlideOfficeRight();
                    }
                }, 100);
            }


            scrollingH = true;
            startHPos = touch.pageX;
        }
    }
    function touchHEndHandler(e) {
        scrollingHTimer = setTimeout(function () { clearTimeout(scrollingHTimer); scrollingH = false; }, 100);
    }
    //touch scrollbar end
}

//function uses to trim the string
String.prototype.trim = function () { return this.replace(/^\s+|\s+$/g, ''); }

//Display polling places
function ShowPollingPlace(graphic, attributes) {
    var flagForDirection = false;
    if (mapPoint) {
        if (!noRoute) {
            for (var index in pollingPlaceData) {
                if (pollingPlaceData[index].ShowDirection) {
                    FindRoute();
                    flagForDirection = true;
                    break;
                }
            }
        }
    }
    if (!isMobileDevice) {
        DetailsContent(null, attributes, pollingPlaceData);
    }
    if (!flagForDirection) {
        HideProgressIndicator();
    }
}

//Reset comments data
function ResetCommentValues() {
    dojo.byId('txtComments').value = '';
    document.getElementById('commentError').innerHTML = "";
    document.getElementById('commentError').style.display = 'none';
    dojo.byId('divAddComment').style.display = "none";
    dojo.byId('divCommentsView').style.display = "block";
    dojo.byId('divCommentsList').style.display = "block";
    SetHeightComments();
}


//Show error message span
function ShowSpanErrorMessage(controlId, message) {
    dojo.byId(controlId).style.display = "block";
    dojo.byId(controlId).innerHTML = message;
}

//Function triggered when user adds a new comment
function AddComment() {
    var text = dojo.byId('txtComments').value;

    if (text.trim().length == 0) {
        dojo.byId('txtComments').focus();
        ShowSpanErrorMessage('commentError', messages.getElementsByTagName("enterComment")[0].childNodes[0].nodeValue);
        return;
    }
    if (text.length > 250) {
        dojo.byId('txtComments').focus();
        ShowSpanErrorMessage('commentError', messages.getElementsByTagName("commentsLength")[0].childNodes[0].nodeValue);
        return;
    }
    ShowProgressIndicator();
    var commentGraphic = new esri.Graphic();
    var referenceDate = new Date(1970, 0, 1);
    var today = new Date();
    var date = new js.date();

    var attr = {};
    attr[databaseFields.PollingIdFieldName] = selectedPollingID;
    attr[databaseFields.CommentsFieldName] = text;
    attr[databaseFields.DateFieldName] = date.utcMsFromTimestamp(date.localToUtc(date.localTimestampNow()));
    commentGraphic.setAttributes(attr);

    dojo.byId('btnAddComments').disabled = true;
    map.getLayer(pollingCommentsLayerId).applyEdits([commentGraphic], null, null, function (msg) {
        if (msg[0].error) {
        }
        else {
            var table = dojo.query('table', dojo.byId("divcmtscontent"));
            AddCommentRow(table, attr);
            if (!isMobileDevice) {
                if (showCommentsTab) {
                    var tblCmtsPanel = dojo.query('table', dojo.byId("div" + dojo.byId("btnAddComments").getAttribute("commentsId") + "content"));
                    AddCommentRow(tblCmtsPanel, attr);
                    setTimeout(function () {
                        CreatePollingDetailsScrollBar("div" + dojo.byId("btnAddComments").getAttribute("commentsId") + "container", "div" + dojo.byId("btnAddComments").getAttribute("commentsId") + "content");
                    },500);
                    for (var cmtsindex in pollingPlaceData) {
                        if (!pollingPlaceData[cmtsindex].Data) {
                            if (!((pollingPlaceData[cmtsindex].ShowDirection) || (pollingPlaceData[cmtsindex].ShowDirection == false))) {
                                dojo.byId("div" + cmtsindex).style.display = "block";
                                ResetSlideControls();
                                break;
                            }
                        }
                    }
                }
            }
        }
        dojo.byId('btnAddComments').disabled = false;
        ResetCommentValues();
        HideProgressIndicator();
        SetHeightComments();
    }, function (err) {
        dojo.byId('btnAddComments').disabled = false;
        HideProgressIndicator();
    });
}

//Function to add comment row layout
function AddCommentRow(table, attr) {
    if (table.length > 0) {
        var x = dojo.query("tr[noComments = 'true']", table[0]);
        if (x.length > 0) {
            RemoveChildren(table[0]);
        }
        var tr = table[0].insertRow(0);
        var commentsCell = document.createElement("td");
        commentsCell.className = "bottomborder";
        var index = dojo.query("tr", table[0]).length;
        if (index) {
            index = 0;
        }
        commentsCell.appendChild(CreateCommentRecord(attr, index));
        tr.appendChild(commentsCell);
    }
}

//Function to get width of a control when text and font size are specified
String.prototype.getWidth = function (fontSize) {
    var test = document.createElement("span");
    document.body.appendChild(test);
    test.style.visibility = "hidden";

    test.style.fontSize = fontSize + "px";

    test.innerHTML = this;
    var w = test.offsetWidth;
    document.body.removeChild(test);
    return w;
}

//Create comment record
function CreateCommentRecord(attributes, i) {
    var table = document.createElement("table");
	table.style.width = "100%"; //CanMod: Bug fix allowing comments to display in full Info Window

    var tbody = document.createElement("tbody");
    var tr = document.createElement("tr");
    tbody.appendChild(tr);

    var td = document.createElement("td");
    td.style.width = "80px";

    var trDate = document.createElement("tr");
    tbody.appendChild(trDate);

    var dateField;
    commentsInfoPopupFieldsCollection.Submitdate.replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g, function (match, key) {
        dateField = key;
    });

    var td1 = document.createElement("td");
    var date = new js.date();
    td1.align = "left";
    td1.colSpan = 2;
    try {
        if (!dojo.string.substitute(commentsInfoPopupFieldsCollection.Submitdate, attributes)) {
            dojo.string.substitute(commentsInfoPopupFieldsCollection.Submitdate, attributes) = showNullValueAs;
            td1.innerHTML = "Date: " + showNullValueAs;
        } else {
            var utcMilliseconds = Number(dojo.string.substitute(commentsInfoPopupFieldsCollection.Submitdate, attributes));
            td1.innerHTML = "Date: " + dojo.date.locale.format(date.utcToLocal(date.utcTimestampFromMs(utcMilliseconds)), {
                datePattern: formatDateAs,
                selector: "date"
            });
        }
    }
    catch (err) {
        td1.innerHTML = "Date: " + showNullValueAs;
    }

    tr.appendChild(td);
    trDate.appendChild(td1);

    var tr1 = document.createElement("tr");
    var td2 = document.createElement("td");
    td2.id = "tdComment";
    if (isMobileDevice) {
        td2.style.width = "95%";
    }
    else {
        td2.style.width = (infoPopupWidth - 40) + "px";
    }
    td2.colSpan = 2;
    if (dojo.string.substitute(commentsInfoPopupFieldsCollection.Comments, attributes)) {
        var wordCount = dojo.string.substitute(commentsInfoPopupFieldsCollection.Comments, attributes).trim().split(/\n/).length;
        if (wordCount > 1) {
            var value = dojo.string.substitute(commentsInfoPopupFieldsCollection.Comments, attributes).split(/\n/)[0].length == 0 ? "<br>" : dojo.string.substitute(commentsInfoPopupFieldsCollection.Comments, attributes).split(/\n/)[0].trim();
            for (var c = 1; c < wordCount; c++) {
                var comment;
                if (value != "<br>") {
                    comment = dojo.string.substitute(commentsInfoPopupFieldsCollection.Comments, attributes).split(/\n/)[c].trim().replace("", "<br>");
                }
                else {
                    comment = dojo.string.substitute(commentsInfoPopupFieldsCollection.Comments, attributes).split(/\n/)[c].trim();
                }
                value += dojo.string.substitute(commentsInfoPopupFieldsCollection.Comments, attributes).split(/\n/)[c].length == 0 ? "<br>" : comment;
            }
        }
        else {
            value = dojo.string.substitute(commentsInfoPopupFieldsCollection.Comments, attributes);
        }
        td2.innerHTML += value;

        if (CheckMailFormat(dojo.string.substitute(commentsInfoPopupFieldsCollection.Comments, attributes)) || dojo.string.substitute(commentsInfoPopupFieldsCollection.Comments, attributes).match("http:") || dojo.string.substitute(commentsInfoPopupFieldsCollection.Comments, attributes).match("https:")) {
            td2.className = "tdBreakWord";
        }
        else {
            td2.className = "tdBreak";
        }
        var x = dojo.string.substitute(commentsInfoPopupFieldsCollection.Comments, attributes).split(" ");
        for (var i in x) {
            w = x[i].getWidth(15) - 50;
            var boxWidth = (isMobileDevice) ? (dojo.window.getBox().w - 10) : (infoPopupWidth - 40);
            if (boxWidth < w) {
                td2.className = "tdBreakWord";
                continue;
            }
        }
    }
    else {
        td2.innerHTML = showNullValueAs;
    }
    tr1.appendChild(td2);
    tbody.appendChild(tr1);

    table.appendChild(tbody);
    return table;
}

//Fetch comments from Comments layer
function FetchComments(pollingID, index) {
    if (!isMobileDevice) {
        if (showCommentsTab) {
            for (var cmtsindex in pollingPlaceData) {
                if (!pollingPlaceData[cmtsindex].Data) {
                    if (!((pollingPlaceData[cmtsindex].ShowDirection) || (pollingPlaceData[cmtsindex].ShowDirection == false))) {
                        var indexContainer = cmtsindex;
                        break;
                    }
                }
            }
        }
    }

    dojo.byId('btnAddComments').disabled = false;
    selectedPollingID = pollingID;
    var query = new esri.tasks.Query();

    var relationshipId;
    primaryKeyForComments.replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g, function (match, key) {
        relationshipId = key;
    });
    query.where = relationshipId + "= '" + pollingID + "'";
    query.outFields = ["*"];
    //execute query
    map.getLayer(pollingCommentsLayerId).selectFeatures(query, esri.layers.FeatureLayer.SELECTION_NEW, function (features) {
        var commentsTable = document.createElement("table");
        commentsTable.id = "tblComment";
        if (!isMobileDevice) {
            if (index) {
                commentsTable.style.width = (infoBoxWidth - 25) + "px";
            }
            else {
                commentsTable.style.width = (infoPopupWidth - 25) + "px";
            }
        }
        else {
            commentsTable.style.width = "100%";
        }

        var commentsTBody = document.createElement("tbody");
        commentsTable.appendChild(commentsTBody);
        if (index) {
            RemoveChildren(dojo.byId("div" + index + "content"));
            dojo.byId("div" + index + "content").appendChild(commentsTable);
        }
        else {
            dojo.byId("divcmtscontent").appendChild(commentsTable);
        }
        if (features.length > 0) {
			if (indexContainer) { //CanMod: Fix comment retreival bug (indexContainer has not always been declared)
				dojo.byId("div" + indexContainer).style.display = "block";
			}
            ResetSlideControls();
            features.sort(SortResultFeatures);      //function to sort comments based on submitted date
            for (var i = 0; i < features.length; i++) {
                var trComments = document.createElement("tr");
                var commentsCell = document.createElement("td");
                commentsCell.className = "bottomborder";
                commentsCell.appendChild(CreateCommentRecord(features[i].attributes, i));
                trComments.appendChild(commentsCell);
                commentsTBody.appendChild(trComments);
            }
            SetHeightComments();
        }
        else {
            if (index) {
                if (dojo.byId("tdCom")) {
                    dojo.byId("tdCom").innerHTML = "";
                }
            }
            else {
                if (dojo.byId("tdComPanel")) {
                    dojo.byId("tdComPanel").innerHTML = "";
                }
            }
            var trComments = document.createElement("tr");
            trComments.id = "trCom";
            var commentsCell = document.createElement("td");
            commentsCell.id = (index) ? "tdCom" : "tdComPanel";
            commentsCell.appendChild(document.createTextNode(messages.getElementsByTagName("noComments")[0].childNodes[0].nodeValue));
            trComments.setAttribute("noComments", "true");
            trComments.appendChild(commentsCell);
            commentsTBody.appendChild(trComments);
			if (indexContainer) { //CanMod: Fix comment retreival bug (indexContainer is not always declared)
				dojo.byId("div" + indexContainer).style.display = "none";
			}
            ResetSlideControls();
        }
    }, function (err) {
    });
}

//Sort comments according to date
function SortResultFeatures(a, b) {
    var x = dojo.string.substitute(commentsInfoPopupFieldsCollection.Submitdate, a.attributes);
    var y = dojo.string.substitute(commentsInfoPopupFieldsCollection.Submitdate, b.attributes);
    return ((x > y) ? -1 : ((x < y) ? 1 : 0));
}

//Display current location of the user
function ShowMyLocation() {
	showCandidates = true; //CanMod
	noRoute = false; //CanMod
    if (dojo.coords("divLayerContainer").h > 0) {
        dojo.replaceClass("divLayerContainer", "hideContainerHeight", "showContainerHeight");
        dojo.byId('divLayerContainer').style.height = '0px';
    }
	showHideSearch(true);

    navigator.geolocation.getCurrentPosition(
		function (position) {
		    ShowProgressIndicator();
		    mapPoint = new esri.geometry.Point(position.coords.longitude, position.coords.latitude, new esri.SpatialReference({ wkid: 4326 }));
		    var graphicCollection = new esri.geometry.Multipoint(new esri.SpatialReference({ wkid: 4326 }));
		    graphicCollection.addPoint(mapPoint);
		    geometryService.project([graphicCollection], map.spatialReference, function (newPointCollection) {
		        for (var bMap = 0; bMap < baseMapLayers.length; bMap++) {
		            if (map.getLayer(baseMapLayers[bMap].Key).visible) {
		                var bmap = baseMapLayers[bMap].Key;
		            }
		        }
		        if (!map.getLayer(bmap).fullExtent.contains(newPointCollection[0].getPoint(0))) {
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
		            HideProgressIndicator();
		            if (!isMobileDevice) {
		                var imgToggle = dojo.byId('imgToggleResults');
		                if (imgToggle.getAttribute("state") == "maximized") {
		                    imgToggle.setAttribute("state", "minimized");
		                    WipeOutResults();
		                    dojo.byId('imgToggleResults').src = "images/up.png";
		                }
		            }
		            ShowInfoDetailsView();
		            alert(messages.getElementsByTagName("geoLocation")[0].childNodes[0].nodeValue);
		            return;
		        }
		        mapPoint = newPointCollection[0].getPoint(0);
		        LocateGraphicOnMap(false);
		    });
		},
		function (error) {
		    HideProgressIndicator();
		    switch (error.code) {
		        case error.TIMEOUT:
		            alert(messages.getElementsByTagName("geolocationTimeout")[0].childNodes[0].nodeValue);
		            break;
		        case error.POSITION_UNAVAILABLE:
		            alert(messages.getElementsByTagName("geolocationPositionUnavailable")[0].childNodes[0].nodeValue);
		            break;
		        case error.PERMISSION_DENIED:
		            alert(messages.getElementsByTagName("geolocationPermissionDenied")[0].childNodes[0].nodeValue);
		            break;
		        case error.UNKNOWN_ERROR:
		            alert(messages.getElementsByTagName("geolocationUnKnownError")[0].childNodes[0].nodeValue);
		            break;
		    }
		}, { timeout: 10000 });
}

//Function triggered for getting attachments information from feature layer
function GetAttachmentInfo(files) {
    if (!isMobileDevice) {
        for (var index in pollingPlaceData) {
            if (pollingPlaceData[index].AttachmentDisplayField) {
                if (document.getElementById("tbody" + index + "Container")) {
                    document.getElementById("tbody" + index + "Container").appendChild(Createfiledata(files));
                }
            }
        }
    }
    else {
        if (document.getElementById("tdAttachLst")) {
            document.getElementById("tdAttachLst").innerHTML = "";
            document.getElementById("tdAttachLst").appendChild(Createfiledata(files));
        }
    }
}

//Retrieve files from FeatureLayer
function Createfiledata(files) {
    if (dojo.byId("trAttachment")) {
        RemoveChildren(dojo.byId("trAttachment"));
    }
    if (isMobileDevice) {
        var fileTable = document.createElement("table");
        if (isMobileDevice) {
            fileTable.style.width = "100%";
        }
        else {
            fileTable.style.width = "90%";
        }
        var fileTBody = document.createElement("tbody");
        fileTable.appendChild(fileTBody);
    }
    if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
            if (isMobileDevice) {
                fileTBody.appendChild(CreateData(files[i].name, files[i].url, files[i].size));
            }
            else {
                return (CreateData(files[i].name, files[i].url, files[i].size));
            }
        }
    }
    else {
        if (!dojo.byId("tdAttachment")) {
            if (!dojo.byId("trAttachment")) {
                var filetr = document.createElement("tr");
                filetr.id = "trAttachment";
            }
            else {
                filetr = dojo.byId("trAttachment");
            }
            var fileHeader = document.createElement('td');
            fileHeader.id = "tdAttachment";
            fileHeader.style.height = "20px";
            fileHeader.style.verticalAlign = "top";
            fileHeader.style.width = "40%";
            for (var a in pollingPlaceData) {
                if (pollingPlaceData[a].AttachmentDisplayField) {
                    fileHeader.innerHTML = pollingPlaceData[a].AttachmentDisplayField + ":";
                }
            }
            filetr.appendChild(fileHeader);

            var filetd = document.createElement("td");
            filetd.style.height = "20px";
            filetd.style.verticalAlign = "top";
            filetd.style.width = "60%";
            filetd.style.paddingLeft = "5px";
            var filespan = document.createElement("span");
            filespan.innerHTML = messages.getElementsByTagName("noAttachments")[0].childNodes[0].nodeValue;
            filetd.appendChild(filespan);
            filetr.appendChild(filetd);
            if (isMobileDevice) {
                fileTBody.appendChild(filetr);
            }
        }

    }
    if (isMobileDevice) {
        fileTable.appendChild(fileTBody);
        return fileTable;
    }
    else {
        return filetr;
    }
}

//Create layout for the attachments
function CreateData(text, attachmentURL, fileSize) {
    if (!dojo.byId("tdAttachment")) {
        if (!dojo.byId("trAttachment")) {
            var filetr = document.createElement("tr");
            filetr.id = "trAttachment";
        }
        else {
            filetr = dojo.byId("trAttachment");
        }
        var fileHeader = document.createElement('td');
        fileHeader.style.width = "40%";
        fileHeader.style.height = "20px";
        fileHeader.style.verticalAlign = "top";
        fileHeader.id = "tdAttachment";
        for (var att in pollingPlaceData) {
            if (pollingPlaceData[att].AttachmentDisplayField) {
                fileHeader.innerHTML = pollingPlaceData[att].AttachmentDisplayField + ":";
            }
        }
        filetr.appendChild(fileHeader);

        var filetd = document.createElement("td");
        filetd.style.height = "20px";
        filetd.style.verticalAlign = "top";
        filetd.style.width = "60%";
        filetd.style.paddingLeft = "5px";
        var filespan = document.createElement("span");
        filespan.style.cursor = 'pointer';
        filespan.style.borderBottom = "White 1px solid";
        filespan.innerHTML = "view";
        filespan.onclick = function () {
            window.open(attachmentURL);
        }
        filetd.appendChild(filespan);
        filetr.appendChild(filetd);
        return filetr;
    }
}

//Handle orientation change event handler
function orientationChanged() {
    orientationChange = true;
    if (map) {
        var timeout = (isMobileDevice && isiOS) ? 100 : 500;
        map.infoWindow.hide();
        setTimeout(function () {
            if (isMobileDevice) {
                map.reposition();
                map.resize();
                SetHeightComments();
                SetHeightSplashScreen();
                SetHeightViewDetails();
                SetHeightViewDirections();
                SetHeightCmtControls();
                HeaderInfo();
                setTimeout(function () {
                    if (selectedPollPoint) {
                        map.setExtent(GetMobileMapExtent(selectedPollPoint));
                    }
                    orientationChange = false;
                    return;
                }, 1000);
            }
            else {
                setTimeout(function () {
                    if (selectedPollPoint) {
                        map.setExtent(GetBrowserMapExtent(selectedPollPoint));
                    }
                    orientationChange = false;
                }, 100);
            }
        }, timeout);
    }
}

//Hide splash screen container
function HideSplashScreenMessage() {
    if (dojo.isIE < 9) {
        dojo.byId("divSplashScreenContent").style.display = "none";
    }
    dojo.addClass('divSplashScreenContainer', "opacityHideAnimation");
    dojo.replaceClass("divSplashScreenContent", "hideContainer", "showContainer");
}

//Set height for splash screen
function SetHeightSplashScreen() {
    var height = (isMobileDevice) ? (dojo.window.getBox().h - 110) : (dojo.coords(dojo.byId('divSplashScreenContent')).h - 80);
    dojo.byId('divSplashContent').style.height = (height + 10) + "px";
    CreateScrollbar(dojo.byId("divSplashContainer"), dojo.byId("divSplashContent"));
}

//Handle resize browser event handler
function resizeHandler() {
    if (map) {
        map.reposition();
        map.resize();
    }
}

//Hide Info request container
function HideInfoContainer() {
    selectedPollPoint = null;
    featureID = null;
    if (isMobileDevice) {
        setTimeout(function () {
            dojo.byId('divInfoContainer').style.display = "none";
            dojo.replaceClass("divInfoContent", "hideContainer", "showContainer");
        }, 500);
    }
    else {
        map.infoWindow.hide();
        pointAttr = null;
        dojo.byId('divInfoContent').style.display = "none";
    }
}

//Show info request container
function ShowServiceRequestContainer() {
    dojo.byId('divInfoContainer').style.display = "block";
    dojo.replaceClass("divInfoContent", "showContainer", "hideContainer");
}

//Set height and create scroll bar for comments
function SetHeightComments() {
    var height = (isMobileDevice) ? (dojo.window.getBox().h) : (dojo.coords(dojo.byId('divInfoContent')).h - 10);
    if (height > 0) {
        dojo.byId('divcmtscontent').style.height = (height - ((isBrowser) ? 120 : 150)) + "px";
    }
    CreateScrollbar(dojo.byId("divCommentsContainer"), dojo.byId("divcmtscontent"));
    if (isMobileDevice) {
        dojo.byId('divInfoComments').style.width = dojo.window.getBox().w - 15 + "px";
    }
}

//Set height for view details
function SetHeightViewDetails() {
    var height = (isMobileDevice) ? dojo.window.getBox().h : dojo.coords(dojo.byId('divInfoContent')).h;
    dojo.byId('divInfoDetailsScroll').style.height = (height - ((isBrowser) ? 55 : 65)) + "px";
    setTimeout(function () {
        CreateScrollbar(dojo.byId("divInfoDetails"), dojo.byId("divInfoDetailsScroll"));
    }, 1000);
}

//Set height for view directions
function SetHeightViewDirections() {
    var height = (isMobileDevice) ? dojo.window.getBox().h : dojo.coords(dojo.byId('divInfoContent')).h;
    dojo.byId('divInfoDirectionsScroll').style.height = (height - ((isBrowser) ? 55 : 65)) + "px";
    CreateScrollbar(dojo.byId("divInfoDirections"), dojo.byId("divInfoDirectionsScroll"));
}

//Show service information deatils infowindow
function ShowServiceInfoDetails(mapPoint, attributes) {
	showCandidates = false; //CanMod: Do not show candidates when retreiving data for non-designated polling place
    featureID = attributes[map.getLayer(pollLayerId).objectIdField];
    map.getLayer(pollLayerId).clearSelection();
    if (!isMobileDevice) {
        dojo.byId('divInfoContent').style.width = infoPopupWidth + "px";
        dojo.byId('divInfoContent').style.height = infoPopupHeight + "px";
    }
    map.infoWindow.hide();
    if (showCommentsTab) {
        dojo.byId("imgComments").style.display = "block";
    }
    else {
        dojo.byId("imgComments").style.display = "none";
        dojo.byId("imgComments").style.width = 0 + "px";
    }

    if (!isMobileDevice) {
        dojo.byId('divInfoContent').style.display = "none";
    }
    selectedPollPoint = mapPoint;
    pointAttr = attributes;
    for (var i in attributes) {
        if (!attributes[i]) {
            attributes[i] = "";
        }
    }
    (isMobileDevice) ? map.infoWindow.resize(225, 60) : map.infoWindow.resize(infoPopupWidth, infoPopupHeight);

    setTimeout(function () {
        if (!isMobileDevice) {
            map.setExtent(GetBrowserMapExtent(selectedPollPoint));
        }
        else {
            map.setExtent(GetMobileMapExtent(selectedPollPoint));
        }

        var screenPoint = map.toScreen(selectedPollPoint);
        screenPoint.y = map.height - screenPoint.y;
        map.infoWindow.show(screenPoint);

        if (isMobileDevice) {
            var header;
            if (dojo.string.substitute(infoWindowHeader, attributes)) {
                header = dojo.string.substitute(infoWindowHeader, attributes).trimString(Math.round(225 / 14));
            }
            else {
                header = dojo.string.substitute(infoWindowHeader, attributes);
            }
            map.infoWindow.setTitle(header);


            dojo.connect(map.infoWindow.imgDetailsInstance(), "onclick", function () {
                if (isMobileDevice) {
                    selectedPollPoint = null;
                    featureID = null;
                    map.infoWindow.hide();
                    if (showCommentsTab) {
                        dojo.byId('imgComments').src = "images/comments.png";
                        dojo.byId('imgComments').title = "Comments";
                    }
                    if (map.getLayer(routeGraphicsLayerId).graphics.length > 0) {
                        dojo.byId('imgDirections').src = "images/imgDirections.png";
                        dojo.byId('imgDirections').title = "Directions";
                        dojo.byId('imgDirections').setAttribute("disp", "Directions");
                        if (showCommentsTab) {
                            dojo.byId('imgComments').src = "images/comments.png";
                            dojo.byId('imgComments').title = "Comments";
                            dojo.byId('imgComments').setAttribute("disp", "Comments");
                        }
                        else {
                            dojo.byId("tdComments").style.display = "none";
                        }

                        dojo.byId("imgDirections").style.display = "block";
                    }
                    else {
                        dojo.byId('imgDirections').src = "images/Details.png";
                        dojo.byId('imgDirections').setAttribute("disp", "Details");
                        dojo.byId('imgDirections').title = intl.DetailsTooltip; //CanMod
                        if (!showCommentsTab) {
                            dojo.byId("tdComments").style.display = "none";
                        }
                        dojo.byId("imgDirections").style.display = "none";
                    }
                    ShowServiceRequestContainer();
                }
                ServiceRequestDetails(mapPoint, attributes);
            });
            var cont;
            if (dojo.string.substitute(infoWindowContent, attributes).trimString) {
                cont = dojo.string.substitute(infoWindowContent, attributes).trimString(Math.round(225 / 12));
            }
            else {
                cont = dojo.string.substitute(infoWindowContent, attributes);
            }
            map.infoWindow.setContent(cont);
            if (generateRouteToNonDesignatedPollingPlace) {
                pollPoint = mapPoint;
                ShowPollingPlace(null, attributes);
            }
            else {
                dojo.byId('divInfoDirectionsScroll').style.marginTop = "2px";
                dojo.byId('divInfoDirectionsScroll').innerHTML = "&nbsp;" + dojo.string.substitute(messages.getElementsByTagName("nonDesignatedPollingPlace")[0].childNodes[0].nodeValue,[pollingPlaceLabel.toLowerCase()]); //CanMod
            }
        }
        else {
            ServiceRequestDetails(mapPoint, attributes);
        }
    }, 300);
}

//Create information details view
function ServiceRequestDetails(point, attributes) {
    if (!isMobileDevice) {
        dojo.byId('divInfoContent').style.display = "block";
    }
    for (var index in pollingPlaceData) {
        if (pollingPlaceData[index].ShowDirection) {
            if (!isMobileDevice) {
                RemoveChildren(dojo.byId('div' + index + 'content'));
            }
            if (map.getLayer(tempGraphicsLayerId).graphics.length == 0) {
                if (dojo.byId('div' + index + 'content')) {
                    dojo.byId('div' + index + 'content').innerHTML = "&nbsp;" + messages.getElementsByTagName("directionsMessage")[0].childNodes[0].nodeValue;
                }
            }
            else if ((pollPoint) && (pollPoint.x == point.x) && (pollPoint.y == point.y)) {
                pollPoint = point;
                desgFlag = true;
                map.getLayer(pollLayerId).queryAttachmentInfos(devObjectId, GetAttachmentInfo, function (err) {
                    GetAttachmentInfo();
                });
                continue;
            }
            else if (generateRouteToNonDesignatedPollingPlace) {
                pollPoint = point;
                devObjectId = attributes[map.getLayer(pollLayerId).objectIdField];
                map.getLayer(pollLayerId).queryAttachmentInfos(devObjectId, GetAttachmentInfo, function (err) {
                    GetAttachmentInfo();
                });
            }
            else {
                desgFlag = false;
                if (dojo.byId('div' + index + 'content')) {
                    dojo.byId('div' + index + 'content').style.marginTop = "2px";
                    dojo.byId('div' + index + 'content').innerHTML = "&nbsp;" + dojo.string.substitute(messages.getElementsByTagName("nonDesignatedPollingPlace")[0].childNodes[0].nodeValue,[pollingPlaceLabel.toLowerCase()]); //CanMod
                }
                devObjectId = attributes[map.getLayer(pollLayerId).objectIdField];
                map.getLayer(pollLayerId).queryAttachmentInfos(devObjectId, GetAttachmentInfo, function (err) {
                    GetAttachmentInfo();
                })
            }
        }
    }

    ShowPollingPlace(null, attributes);

    for (var i in map.getLayer(pollLayerId).fields) {
        if (!attributes[map.getLayer(pollLayerId).fields[i].name]) {
            attributes[map.getLayer(pollLayerId).fields[i].name] = "-";
            continue;
        }
        if (map.getLayer(pollLayerId).fields[i].type == "esriFieldTypeDate") {
            if (attributes[map.getLayer(pollLayerId).fields[i].name]) {
                if (Number(attributes[map.getLayer(pollLayerId).fields[i].name])) {
                    var date = new js.date();
                    var utcMilliseconds = Number(attributes[map.getLayer(pollLayerId).fields[i].name]);
                    attributes[map.getLayer(pollLayerId).fields[i].name] = dojo.date.locale.format(date.utcTimestampFromMs(utcMilliseconds), { datePattern: formatDateAs, selector: "date" });
                }
            }
        }
    }

    ShowInfoDetailsView();
    RemoveChildren(dojo.byId('tblInfoDetails'));
    RemoveChildren(dojo.byId('divcmtscontent'));
    var value;
    if (isBrowser) {
        value = dojo.string.substitute(infoWindowHeader, attributes).trim();
        value = value.trimString(Math.round(infoPopupWidth / 6));
        if (value.length > Math.round(infoPopupWidth / 6)) {
            dojo.byId('tdInfoHeader').title = dojo.string.substitute(infoWindowHeader, attributes);
        }
    }
    else {
        value = dojo.string.substitute(infoWindowHeader, attributes).trim();
        value = value.trimString(Math.round(infoPopupWidth / 10));
    }
    dojo.byId('tdInfoHeader').innerHTML = value;
    storeAttr = dojo.string.substitute(infoWindowHeader, attributes);

    if (isMobileDevice) {
        dojo.byId('tdInfoHeader').innerHTML = dojo.string.substitute(intl.MobileHeader,[pollingPlaceLabel]); //CanMod
        var tblInfoDetails = dojo.byId('tblInfoDetails');
        var tbodyInfoDetails = document.createElement("tbody");
        tblInfoDetails.appendChild(tbodyInfoDetails);

        for (var ind in pollingPlaceData) {
            if (pollingPlaceData[ind].ShowDirection) {
                continue;
            }
            if (pollingPlaceData[ind].Data || pollingPlaceData[ind].ShowDirection) {
                var trInfoDetailsHeader = document.createElement('tr');
                tbodyInfoDetails.appendChild(trInfoDetailsHeader);
                var tdInfoDetailsHeader = document.createElement('td');
                trInfoDetailsHeader.appendChild(tdInfoDetailsHeader);
                var tblDtlHdr = document.createElement('table');
                tblDtlHdr.style.paddingTop = "3px";
                tblDtlHdr.style.borderBottom = "1px white solid";
                tdInfoDetailsHeader.appendChild(tblDtlHdr);
                tblDtlHdr.style.width = "100%";
                var tbodyDtlHdr = document.createElement('tbody');
                tblDtlHdr.appendChild(tbodyDtlHdr);
                var trDtlHdr = document.createElement('tr');
                tbodyDtlHdr.appendChild(trDtlHdr);
                var tdDtlHdr = document.createElement("td");
                tdDtlHdr.innerHTML = pollingPlaceData[ind].Title;
                trDtlHdr.appendChild(tdDtlHdr);

                var trInfoDetailsList = document.createElement('tr');
                tbodyInfoDetails.appendChild(trInfoDetailsList);
                var tdInfoDetailsList = document.createElement('td');
                trInfoDetailsList.appendChild(tdInfoDetailsList);
                var tblDtlLst = document.createElement("table");
                tblDtlLst.style.width = "100%";
                tdInfoDetailsList.appendChild(tblDtlLst);
                var tbodyDtlLst = document.createElement('tbody');
                tblDtlLst.appendChild(tbodyDtlLst);
            }

            for (var index in pollingPlaceData[ind].Data) {
                var trDtlLst = document.createElement('tr');
                tbodyDtlLst.appendChild(trDtlLst);

                var td1 = document.createElement("td");
                td1.style.verticalAlign = "top";
                td1.style.width = "40%";
                if (pollingPlaceData[ind].Data[index].DisplayText) {
                    td1.innerHTML = pollingPlaceData[ind].Data[index].DisplayText;
                }
                else {
                    for (var m = 0; m < map.getLayer(pollLayerId).fields.length; m++) {
                        if ("${" + map.getLayer(pollLayerId).fields[m].name + "}" == pollingPlaceData[ind].Data[index].FieldName.split(",")[0]) {
                            td1.innerHTML = map.getLayer(pollLayerId).fields[m].alias + ' :';
                            break;
                        }
                    }
                }
                td1.height = 20;

                var td2 = document.createElement("td");
                td2.style.verticalAlign = "top";
                td2.style.width = "60%";
                td2.style.wordWrap = "break-word";
                td2.height = 20;
                td2.style.paddingLeft = "5px";
				//CanMod: Bug Fix - Is now able to process details that include PrecinctFieldExpression in the config.js file
				if (pollingPlaceData[ind].Data[index].FieldName) {
					if (dojo.string.substitute(pollingPlaceData[ind].Data[index].FieldName, attributes)) {
						if (CheckMailFormat(dojo.string.substitute(pollingPlaceData[ind].Data[index].FieldName, attributes))) {
							td2.innerHTML = "<u style='cursor:pointer'>" + dojo.string.substitute(pollingPlaceData[ind].Data[index].FieldName, attributes) + "</u>";
							td2.style.wordBreak = "break-all";
							td2.setAttribute("mail", dojo.string.substitute(pollingPlaceData[ind].Data[index].FieldName, attributes));
							td2.onclick = function () {
								parent.location = "mailto:" + this.getAttribute("mail");
							}
						}
						else {
							td2.innerHTML = dojo.string.substitute(pollingPlaceData[ind].Data[index].FieldName, attributes);
						}
					}
					else {
						td2.innerHTML = showNullValueAs;
					}
				}
				else if (pollingPlaceData[ind].Data[index].PrecinctFieldExpression && attributes["_PrecinctAttributes"]) {
					if (dojo.string.substitute(pollingPlaceData[ind].Data[index].PrecinctFieldExpression, attributes["_PrecinctAttributes"])) {
						if (CheckMailFormat(dojo.string.substitute(pollingPlaceData[ind].Data[index].PrecinctFieldExpression, attributes["_PrecinctAttributes"]))) {
							td2.innerHTML = "<u style='cursor:pointer'>" + dojo.string.substitute(pollingPlaceData[ind].Data[index].PrecinctFieldExpression, attributes["_PrecinctAttributes"]) + "</u>";
							td2.style.wordBreak = "break-all";
							td2.setAttribute("mail", dojo.string.substitute(pollingPlaceData[ind].Data[index].PrecinctFieldExpression, attributes["_PrecinctAttributes"]));
							td2.onclick = function () {
								parent.location = "mailto:" + this.getAttribute("mail");
							}
						}
						else {
							td2.innerHTML = dojo.string.substitute(pollingPlaceData[ind].Data[index].PrecinctFieldExpression, attributes["_PrecinctAttributes"]);
						}
					}
					else {
						td2.innerHTML = showNullValueAs;
					}
				}
				else {
					td2.innerHTML = showNullValueAs;
				}
        //End of CanMod
                trDtlLst.appendChild(td1);
                trDtlLst.appendChild(td2);
            }

            if (pollingPlaceData[ind].AttachmentDisplayField) {
                var trInfLst = document.createElement('tr');
                trInfLst.id = "trAttachLst";
                tbodyInfoDetails.appendChild(trInfLst);
                var tdAttach = document.createElement('td');
                tdAttach.id = "tdAttachLst";
                tdAttach.height = 20;
                trInfLst.appendChild(tdAttach);
                devObjectId = attributes[map.getLayer(pollLayerId).objectIdField];
                map.getLayer(pollLayerId).queryAttachmentInfos(devObjectId, GetAttachmentInfo, function (err) {
                    GetAttachmentInfo();
                });
            }
        }
    }
    else {
        var tblInfoDetails = dojo.byId('tblInfoDetails');
        tblInfoDetails.cellPadding = 0;
        tblInfoDetails.cellSpacing = 2;
        var tbody = document.createElement("tbody");
        tblInfoDetails.appendChild(tbody);
        for (var index in infoPopupFieldsCollection) {
            var tr = document.createElement("tr");
            tbody.appendChild(tr);

            var td1 = document.createElement("td");
            td1.style.verticalAlign = "top";
            if (infoPopupFieldsCollection[index].DisplayText) {
                td1.innerHTML = infoPopupFieldsCollection[index].DisplayText;
            }
            else {
                for (var m = 0; m < map.getLayer(pollLayerId).fields.length; m++) {
                    if ("${" + map.getLayer(pollLayerId).fields[m].name + "}" == infoPopupFieldsCollection[index].FieldName.split(",")[0]) {
                        td1.innerHTML = map.getLayer(pollLayerId).fields[m].alias + ' :';
                        break;
                    }
                }
            }
            td1.height = 20;

            var td2 = document.createElement("td");
            td2.style.verticalAlign = "top";
            td2.height = 20;
            td2.style.paddingLeft = "5px";
            if (dojo.string.substitute(infoPopupFieldsCollection[index].FieldName, attributes)) {
                if (CheckMailFormat(dojo.string.substitute(infoPopupFieldsCollection[index].FieldName, attributes))) {
                    td2.innerHTML = "<u style='cursor:pointer'>" + dojo.string.substitute(infoPopupFieldsCollection[index].FieldName, attributes) + "</u>";
                    td2.setAttribute("email", dojo.string.substitute(infoPopupFieldsCollection[index].FieldName, attributes));
                    td2.onclick = function () {
                        parent.location = "mailto:" + this.getAttribute("email");
                    }
                }
                else {
                    td2.innerHTML = dojo.string.substitute(infoPopupFieldsCollection[index].FieldName, attributes);
                }
            }
            else {
                td2.innerHTML = showNullValueAs;
            }

            tr.appendChild(td1);
            tr.appendChild(td2);
        }
    }
    SetHeightViewDetails();
    FetchComments(dojo.string.substitute((isBrowser ? pollLayer.PrimaryKeyForPolling : pollMobileLayer.PrimaryKeyForPolling), attributes), null);
}

//Get extent based on the mappoint
function GetBrowserMapExtent(mapPoint) {
    var width = map.extent.getWidth();
    var height = map.extent.getHeight();
    var xmin = mapPoint.x - (width / 2);
    var ymin = mapPoint.y - (height / 3);
    var xmax = xmin + width;
    var ymax = ymin + height;
    return new esri.geometry.Extent(xmin, ymin, xmax, ymax, map.spatialReference);
}

//Get extent based on the mappoint
function GetMobileMapExtent(mapPoint) {
    var width = map.extent.getWidth();
    var height = map.extent.getHeight();
    var xmin = mapPoint.x - (width / 2);
    var ymin = mapPoint.y - (height / 4);
    var xmax = xmin + width;
    var ymax = ymin + height;
    return new esri.geometry.Extent(xmin, ymin, xmax, ymax, map.spatialReference);
}

//Show Info request details view
function ShowInfoDetailsView() {
    dojo.byId('imgDirections').style.display = "none";
    if (showCommentsTab) {
        dojo.byId("imgComments").style.cursor = "pointer";
    }
    dojo.byId("imgComments").style.display = "block";

    dojo.byId('divInfoComments').style.display = "none";
    dojo.byId('divInfoDetails').style.display = "block";
    dojo.byId('divInfoDirections').style.display = "none";
    if (isMobileDevice) {
        if (map.getLayer(routeGraphicsLayerId).graphics.length > 0) {
            dojo.byId('imgDirections').src = "images/imgDirections.png";
            dojo.byId('imgDirections').title = "Directions";
            dojo.byId('imgDirections').setAttribute("disp", "Directions");

            dojo.byId('imgDirections').style.display = "block";
        }
        else {
            dojo.byId('imgDirections').src = "images/Details.png";
            dojo.byId('imgDirections').title = intl.DetailsTooltip; //CanMod
            dojo.byId('imgDirections').setAttribute("disp", "Details");

            dojo.byId('imgDirections').style.display = "none";
            dojo.byId("imgComments").style.display = "block";
        }
        dojo.byId('tdInfoHeader').innerHTML = dojo.string.substitute(intl.MobileHeader,[pollingPlaceLabel]); //CanMod
    }
}

//Show comments view
function ShowCommentsView() {
    if (showCommentsTab) {
        dojo.byId("imgDirections").style.cursor = "pointer";
        dojo.byId("imgDirections").style.display = "block";
        dojo.byId("imgComments").style.display = "none";


        if (isMobileDevice) {
            if (dojo.byId('imgComments').getAttribute("disp") == "Directions") {
                dojo.byId('imgComments').src = "images/comments.png";
                dojo.byId('imgComments').title = "Comments";
                dojo.byId('imgComments').setAttribute("disp", "Comments");
                dojo.byId('divInfoComments').style.display = "none";
                dojo.byId('divInfoDetails').style.display = "none";
                if (map.getLayer(routeGraphicsLayerId).graphics.length > 0) {
                    dojo.byId('divInfoDirections').style.display = "block";

                    dojo.byId('imgDirections').style.display = "block";
                    dojo.byId("imgComments").style.display = "block";
                }
                HeaderInfo();
                SetHeightViewDirections();
            }
            else {
                dojo.byId('imgDirections').src = "images/Details.png";
                dojo.byId('imgDirections').title = intl.DetailsTooltip; //CanMod
                dojo.byId('imgDirections').setAttribute("disp", "Details");
                ResetCommentValues();
                dojo.byId('imgComments').src = "images/imgDirections.png";
                dojo.byId('imgComments').title = "Directions";
                dojo.byId('imgComments').setAttribute("disp", "Directions");

                if (map.getLayer(routeGraphicsLayerId).graphics.length > 0) {
                    dojo.byId('imgComments').src = "images/imgDirections.png";
                    dojo.byId('imgComments').title = "Directions";
                    dojo.byId('imgComments').setAttribute("disp", "Directions");

                    dojo.byId('imgDirections').style.display = "block";
                    dojo.byId("imgComments").style.display = "block";
                }
                else {
                    dojo.byId('imgComments').src = "images/comments.png";
                    dojo.byId('imgComments').title = "Comments";
                    dojo.byId('imgComments').setAttribute("disp", "Comments");

                    dojo.byId('imgDirections').style.display = "block";
                    dojo.byId("imgComments").style.display = "none";
                }
                dojo.byId('divInfoComments').style.display = "block";
                dojo.byId('divInfoDetails').style.display = "none";
                dojo.byId('divInfoDirections').style.display = "none";
                HeaderInfo();
                SetHeightComments();
            }
        } else {
            ResetCommentValues();
            dojo.byId('divInfoComments').style.display = "block";
            dojo.byId('divInfoDetails').style.display = "none";
            dojo.byId('divInfoDirections').style.display = "none";
            SetHeightComments();
        }
    }
}

//Trim the info window header according to mobile media screen
function HeaderInfo() {
    if (dojo.byId('imgDirections').getAttribute("disp") == "Directions") {
        var value = dojo.string.substitute(intl.MobileHeader,[pollingPlaceLabel]); //CanMod
        value = value.trim();
    }
    else {
        if (storeAttr) {
            if (map.getLayer(routeGraphicsLayerId).graphics.length > 0) {
                var value = storeAttr.trim();
            }
            else {
                var value = dojo.string.substitute(intl.MobileHeader,[pollingPlaceLabel]); //CanMod
                value = value.trim();
            }
        }
    }
    if (value) {
        if (dojo.window.getBox().w <= 320) {
            value = value.trimString(25);
        }
        else {
            value = value.trimString(40);
        }
    }
    dojo.byId('tdInfoHeader').innerHTML = value;
}

//Show Info request directions view
function ShowInfoDirectionsView() {
    if (isMobileDevice) {
        if (dojo.byId('imgDirections').getAttribute("disp") == "Details") {
            dojo.byId('imgComments').src = "images/comments.png";
            dojo.byId('imgComments').title = "Comments";
            dojo.byId('imgComments').setAttribute("disp", "Comments");
            if (map.getLayer(routeGraphicsLayerId).graphics.length > 0) {
                dojo.byId('imgDirections').src = "images/imgDirections.png";
                dojo.byId('imgDirections').title = "Directions";
                dojo.byId('imgDirections').setAttribute("disp", "Directions");
            }
            else {
                dojo.byId('imgDirections').src = "images/Details.png";
                dojo.byId('imgDirections').title = intl.DetailsTooltip; //CanMod
                dojo.byId('imgDirections').setAttribute("disp", "Details");

                dojo.byId('imgDirections').style.display = "none";
                dojo.byId("imgComments").style.display = "block";
            }
            dojo.byId('divInfoComments').style.display = "none";
            dojo.byId('divInfoDetails').style.display = "block";
            dojo.byId('tdInfoHeader').innerHTML = dojo.string.substitute(intl.MobileHeader,[pollingPlaceLabel]); //CanMod
            dojo.byId('divInfoDirections').style.display = "none";
            SetHeightViewDetails();
        }
        else {
            dojo.byId('imgDirections').src = "images/Details.png";
            dojo.byId('imgDirections').title = intl.DetailsTooltip; //CanMod
            dojo.byId('imgDirections').setAttribute("disp", "Details");
            dojo.byId('divInfoComments').style.display = "none";
            dojo.byId('divInfoDetails').style.display = "none";
            if (map.getLayer(routeGraphicsLayerId).graphics.length > 0) {
                dojo.byId('divInfoDirections').style.display = "block";
            }
            HeaderInfo();
            SetHeightViewDirections();
        }
    }
    else {
        dojo.byId('imgDirections').style.display = "none";
        dojo.byId("imgComments").style.display = "block";
        dojo.byId('divInfoComments').style.display = "none";
        dojo.byId('divInfoDetails').style.display = "block";
        dojo.byId('divInfoDirections').style.display = "none";
        SetHeightViewDetails();
    }
}

//Show add comments view
function ShowAddCommentsView() {
    if (dojo.isIE) {
        dojo.byId('txtComments').value = "";
    }
    dojo.byId('divAddComment').style.display = "block";
    dojo.byId('divCommentsView').style.display = "none";
    dojo.byId('divCommentsList').style.display = "none";
    SetHeightCmtControls();
    setTimeout(function () {
        dojo.byId('txtComments').focus();
    }, 50);
}

//Show comments controls with scrollbar
function SetHeightCmtControls() {
    var height = (isMobileDevice) ? (dojo.window.getBox().h - 20) : dojo.coords(dojo.byId('divInfoContent')).h;
    dojo.byId("divCmtIpContainer").style.height = (height - ((isTablet) ? 100 : 80)) + "px";
    dojo.byId('divCmtIpContent').style.height = (height - ((isTablet) ? 100 : 80)) + "px";
    CreateScrollbar(dojo.byId("divCmtIpContainer"), dojo.byId("divCmtIpContent"));
}

//Reset map position
function SetMapTipPosition() {
    if (!orientationChange) {
        if (selectedPollPoint) {
            var screenPoint = map.toScreen(selectedPollPoint);
            if (isMobileDevice) {
                screenPoint.y = dojo.window.getBox().h - screenPoint.y;
            }
            else {
                screenPoint.y = map.height - screenPoint.y;
            }
            map.infoWindow.setLocation(screenPoint);
            return;
        }
    }
}

//Function to made tinyurl for facebook,tweet,email
function ShareLink(ext) {
    tinyUrl = null;
    mapExtent = GetMapExtent();
    var url = esri.urlToObject(window.location.toString());
    var urlStr;
    if (mapPoint) {
        if (featureID) {
            urlStr = encodeURI(url.path) + "?extent=" + mapExtent + "$addressPoint=" + mapPoint.x + "," + mapPoint.y + "$featureID=" + featureID;
        }
        else {
            urlStr = encodeURI(url.path) + "?extent=" + mapExtent + "$addressPoint=" + mapPoint.x + "," + mapPoint.y;
        }
    }
    else if (featureID) {
        urlStr = encodeURI(url.path) + "?extent=" + mapExtent + "$featureID=" + featureID;
    }
    else {
        urlStr = encodeURI(url.path) + "?extent=" + mapExtent;
    }
	
	//CanMod: Insert the polltype parameter when appropriate
	if (url.query && url.query.pollType) {
		urlStr = urlStr.split("?")[0] + "?pollType=" + url.query.pollType + "%26" + urlStr.split("?")[1];
	}
	
    url = dojo.string.substitute(mapSharingOptions.TinyURLServiceURL, [urlStr]);
    dojo.io.script.get({
        url: url,
        callbackParamName: "callback",
        load: function (data) {
            tinyResponse = data;
            tinyUrl = data;
            var attr = mapSharingOptions.TinyURLResponseAttribute.split(".");
            for (var x = 0; x < attr.length; x++) {
                tinyUrl = tinyUrl[attr[x]];
            }
            if (ext) {
                if (dojo.coords("divLayerContainer").h > 0) {
                    dojo.replaceClass("divLayerContainer", "hideContainerHeight", "showContainerHeight");
                    dojo.byId('divLayerContainer').style.height = '0px';
                }
				showHideSearch(true);
                var cellHeight = (isMobileDevice || isTablet) ? 81 : 60;
                if (dojo.coords("divAppContainer").h > 0) {
                    dojo.replaceClass("divAppContainer", "hideContainerHeight", "showContainerHeight");
                    dojo.byId('divAppContainer').style.height = '0px';
                }
                else {
                    dojo.byId('divAppContainer').style.height = cellHeight + "px";
                    dojo.replaceClass("divAppContainer", "showContainerHeight", "hideContainerHeight");
                }
            }
        },
        error: function (error) {
            alert(tinyResponse.error);
        }
    });
    setTimeout(function () {
        if (!tinyResponse) {
            alert(messages.getElementsByTagName("tinyURLEngine")[0].childNodes[0].nodeValue);
            return;
        }
    }, 6000);
}

//Function to open login page for facebook,tweet,email
function Share(site) {
    if (dojo.coords("divAppContainer").h > 0) {
        dojo.replaceClass("divAppContainer", "hideContainerHeight", "showContainerHeight");
        dojo.byId('divAppContainer').style.height = '0px';
    }
	//CanMod: Modified to take in strings for post/status/subject in the config file
    if (tinyUrl) {
		var ShareURL;
        switch (site) {
            case "facebook":
				ShareURL = mapSharingOptions.FacebookShareURL + "?";
				ShareURL += dojo.objectToQuery({u:tinyUrl, t: mapSharingOptions.FacebookText});
                window.open(ShareURL);
                break;
            case "twitter":
				ShareURL = mapSharingOptions.TwitterShareURL + "?";
				ShareURL += dojo.objectToQuery({text:mapSharingOptions.TwitterText, url:tinyUrl, related:mapSharingOptions.TwitterFollow, hashtags:mapSharingOptions.TwitterHashtag});
				window.open(ShareURL);
                break;
            case "mail":
				ShareURL = "mailto:%20?"
				ShareURL += dojo.objectToQuery({subject: mapSharingOptions.EmailSubject, body:tinyUrl});
                parent.location = ShareURL;
                break;
        }
	//End of CanMod
    }
    else {
        alert(messages.getElementsByTagName("tinyURLEngine")[0].childNodes[0].nodeValue);
        return;
    }
}

//Get current map Extent
function GetMapExtent() {
    var extents = Math.round(map.extent.xmin).toString() + "," + Math.round(map.extent.ymin).toString() + "," +
                  Math.round(map.extent.xmax).toString() + "," + Math.round(map.extent.ymax).toString();
    return (extents);
}

//Get the query string value of the provided key if not found the function returns empty string
function GetQuerystring(key) {
    var _default;
    if (_default == null) _default = "";
    key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
    var qs = regex.exec(window.location.href);
    if (qs == null)
        return _default;
    else
        return qs[1];
}

//Restrict the maximum no of characters in the textarea control
function imposeMaxLength(Object, MaxLen) {
    return (Object.value.length <= MaxLen);
}

//Show progress indicator
function ShowProgressIndicator() {
    dojo.byId('divLoadingIndicator').style.display = "block";
}

//Hide progress indicator
function HideProgressIndicator() {
    dojo.byId('divLoadingIndicator').style.display = "none";
}
//Validating Email in comments tab
function CheckMailFormat(emailValue) {
    var pattern = /^([a-zA-Z][a-zA-Z0-9\_\-\.]*\@[a-zA-Z0-9\-]*\.[a-zA-Z]{2,4})?$/i
    if (pattern.test(emailValue)) {
        return true;
    } else {
        return false;
    }
}

//Query the features while sharing
function ExecuteQueryTask() {
    ShowProgressIndicator();
    var queryTask = new esri.tasks.QueryTask(isBrowser ? pollLayer.ServiceUrl : pollMobileLayer.ServiceUrl);
    var query = new esri.tasks.Query;
    query.outSpatialReference = map.spatialReference;
    query.where = map.getLayer(pollLayerId).objectIdField + "=" + featureID;
    query.outFields = ["*"];
    query.returnGeometry = true;
    queryTask.execute(query, function (fset) {
        if (fset.features.length > 0) {
            ShowServiceInfoDetails(fset.features[0].geometry, fset.features[0].attributes);
        }
        HideProgressIndicator();
    }, function (err) {
        alert(err.Message);
    });
}

//CanMod: Function to Switch between the advanced polls and regular polls
function SwitchPollType() {
	if (window.location.search.indexOf("pollType=Alt") > -1) {
		window.location.replace(window.location.href.replace("pollType=Alt","pollType=Reg"));
	}
	else if (window.location.search.indexOf("pollType=Reg") > -1) {
		window.location.replace(window.location.href.replace("pollType=Reg","pollType=Alt"));
	}
	else {
		if (window.location.search == "") {
			window.location.replace(window.location.href + "?pollType=Alt");
		}
		else {
			var splitURL = window.location.href.split("?");
			window.location.replace(splitURL[0] + "?pollType=Alt&" + splitURL[1]);
		}
	}
}

//CanMod: Function to print
function CreatePrintout() {

		//Determine iFrame dimensions (in order not to exceed the dimensions of the viewport)
		var wd = dojo.window.getBox();
		iW = wd.w -25; if (iW > 760 || iW < 150) {iW = 760;}
		iH = wd.h -95; if (iH > 500 || iW < 150) {iH = 500;}
	
		var title = dojo.byId("lblAppName").innerText || dojo.byId("lblAppName").textContent;
		var printHTML = "<h2 style='margin-bottom:-10px;'>" + title + "</h2>"; //Title
		printHTML += "<img src='images/print_gray.png' alt='" + intl.PrintTooltip + "' title='" + intl.PrintTooltip + "' style='cursor:pointer; float:right;' onclick='window.print();' class='noprint'>"; //Print button
		printHTML += "<h3>" + pollingPlaceLabel + "</h3>"; //Subtitle
		
		// If map was not created, skip it (either due to server error or print task not set in config.js)
		if (mapImgURL!="") {
			printHTML += "<div id='minMapDiv' style='margin:auto; width:600px; height:500px; border:1px solid grey;'><img src='" + mapImgURL + "' alt='Map' style='width:600px; height:500px;'></div>";
		}
		
		var PollPlaceHeader = dojo.query(".PollPlaceHeader"); //Pod Headers
		var PollPlaceContent = dojo.query(".PollPlaceContent"); //Pod Content
		
		// Loop through each pod
		for (var podIndex = 0; podIndex < PollPlaceHeader.length; podIndex++) {
			// Skip the comments box
			if (PollPlaceHeader[podIndex].innerHTML.toLowerCase() == pollingPlaceData.CommentsBox.Title.toLowerCase()) {continue;}
			
			printHTML += "<hr>";
			printHTML += PollPlaceHeader[podIndex].innerHTML;
			var currPod = PollPlaceContent[podIndex].cloneNode(true);
			
			// Adjust info columns (all but directions) to match in width
			var currPodLabel = dojo.query(".tdLabel",currPod);
			for (var innerIndex = 0; innerIndex < currPodLabel.length; innerIndex++) {
				currPodLabel[innerIndex].style.width = "40%";
			}
			
			// Remove Heights (removes white space in some divs and removes coloured spacing divs)
			var allElements = dojo.query("*",currPod);
			for (var innerIndex = 0; innerIndex < allElements.length; innerIndex++) {
				allElements[innerIndex].style.height = "";
			}
			
			// Remove scrollbar div content (causes issues in IE)
			var scrolldiv = dojo.byId("divSegmentContainerscrollbar_track")
			if (scrolldiv) {scrolldiv.style.display = "none";}
			
			printHTML += currPod.innerHTML;
		}
		
		HideProgressIndicator();
		mapImgURL = "";
		
		//Catch Internet Explorer
		var ver = -1;
		if (navigator.appName == 'Microsoft Internet Explorer') {
			var ua = navigator.userAgent;
			var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
			if (re.exec(ua) !=null) {
				ver = parseFloat( RegExp.$1 );
			}
		}
		//IE 7/8
		if (ver != -1 && ver <= 8) {
			var printWindow = window.open("","","width=" + iW + ",height=" + iH + ",location=no,menubar=yes,scrollbars=yes");
			printWindow.document.open();
			printWindow.document.write(printHTML);
			printWindow.document.close();
		}
		//All other browsers
		else {
			//Clear any previous content in div
			dojo.byId("printContainer").innerHTML = "";
			var printContain = dojo.byId("printContainer");
			var printFrame = dojo.create("iframe",{width:iW, height:iH});
			dojo.style(printFrame,"border","0px");
			
			//for browsers who modify the the content before onload
			try {
				if (printFrame.contentDocument) {
					var printHead = dojo.query("head",printFrame.contentDocument)[0];
					if (printHead) {dojo.create("style",{type:"text/css",media:"print",innerHTML:" .noprint { display: none; }"},printHead);}
					var printBody = dojo.query("body",printFrame.contentDocument)[0];
					printBody.innerHTML = printHTML;
				}
			}
			catch (e) { return; }
			
			//for browsers who can only modify the content of iframe after onload
			dojo.connect(printFrame, "onload", function () {
				var printHead = dojo.query("head",printFrame.contentDocument)[0];
				if (printHead) {dojo.create("style",{type:"text/css",media:"print",innerHTML:" .noprint { display: none; }"},printHead);}
				var printBody = dojo.query("body",printFrame.contentDocument)[0];
				printBody.innerHTML = printHTML;
			});
			dojo.place(printFrame, printContain);
			dojo.byId("printWindow").style.display = "block";
		}
}

//CanMod: Function to create map screenshot
function PrepareMapPrintout() {
	if (!noRoute && pollPoint) {	
		if (printService!="") {
			ShowProgressIndicator();
			require(["esri/tasks/PrintTask", "esri/tasks/PrintTemplate", "esri/tasks/PrintParameters"], function(PrintTask, PrintTemplate, PrintParameters) {
				var template = new PrintTemplate();
				template.exportOptions = {
					width: 900,
					height: 750,
					dpi: 96
				};
				template.format = "png32";
				template.layout = "MAP_ONLY";
				template.preserveScale = true;
				
				var params = new PrintParameters();
				params.map = map;
				params.template = template;
				var printTask = new PrintTask(printService);
				//Will run CreatePrintout even if an error occurs (printout will simply not contain a map)
				printTask.execute(params, function(result) {mapImgURL=result.url;CreatePrintout()}, function() {CreatePrintout()});
			});
		}
		else {
			//Run CreatePrintout, without a map
			CreatePrintout();
		}
	}
}

//CanMod: Display zoom in alert when no polls are displayed due to scale dependency
function showZoomInAlert(minScale) {
	//Only called if not mobile & not advanced polls
	if (minScale != 0) {
		nodeObject = dojo.byId("zoomInAlert");
		var curScale = map.getScale();
		if (curScale > minScale) {
			dojo.byId("zoomInAlert").style.display = "block";
			dojo.fadeIn({ node: nodeObject }).play();
		}
		else {
			dojo.fadeOut({ node: nodeObject }).play();
		}
	}
}

//CanMod: Close print window (actually a div) when using iframe method
function closePrint() {
	dojo.byId("printWindow").style.display = "none";
}

//Clear Autocomplete
function clearAutocomplete() {
	document.getElementById("autocomplete").innerHTML = "";
}

//Change autocomplete selection from input using arrow keys
function selectAutocomplete(evt) {
	if (!(dojo.isIE < 9)) {evt.preventDefault();}
	if (document.getElementById("autocompleteSelect")) {
		var sel = document.getElementById("autocompleteSelect");
		var kc = evt.keyCode;
		if (kc == dojo.keys.DOWN_ARROW && sel.selectedIndex != sel.getAttribute("size") -1) {
			sel.selectedIndex ++;
			document.getElementById("searchInput").value = sel.options[sel.selectedIndex].text;
		}
		else if (kc == dojo.keys.UP_ARROW && sel.selectedIndex != -1) {
			sel.selectedIndex --;
			if (sel.selectedIndex == -1) {
				document.getElementById("searchInput").value = lastSearchString;
			}
			else {
				document.getElementById("searchInput").value = sel.options[sel.selectedIndex].text;
			}
		}
	}
	if (evt.keyCode == dojo.keys.ESCAPE) {
		clearAutocomplete();
	}
}

//Show/Hide the IE7/Mobile/Tablet search window
function showHideSearch(closeOnly) {
	var disp = dojo.byId("divAddressSearch").style.display;
	if (disp == "block") {
		dojo.byId("divAddressSearch").style.display = "none";
		dojo.byId("searchButton").setAttribute("aria-expanded","false");
	}
	else if (disp == "none" && !closeOnly) {
		if (dojo.coords("divAppContainer").h > 0) {
			dojo.replaceClass("divAppContainer", "hideContainerHeight", "showContainerHeight");
			dojo.byId('divAppContainer').style.height = '0px';
			//CanAccess
			/*monkey
			document.getElementById('imgShare').setAttribute("aria-expanded",false);
			document.getElementById('imgFacebook').tabIndex="-1";
			document.getElementById('imgTwitter').tabIndex="-1";
			document.getElementById('imgMail').tabIndex="-1";
			if (timeouts.share != null) {clearTimeout(timeouts.share); timeouts.share = null;}
			timeouts.share = setTimeout(function() {
				timeouts.share = null;
				dojo.byId('divAppContainer').style.display = 'none';
			},1000);*/
		}
		if (dojo.coords("divLayerContainer").h > 0) {
			dojo.replaceClass("divLayerContainer", "hideContainerHeight", "showContainerHeight");
			dojo.byId('divLayerContainer').style.height = '0px';
			//CanAccess
			/*monkey
			document.getElementById('imgBaseMap').setAttribute("aria-expanded",false);
			dojo.forEach(dojo.query(".basemapThumbnail"), function(item,i) {
				item.tabIndex = "-1";
			});
			if (timeouts.basemap != null) {clearTimeout(timeouts.basemap); timeouts.basemap = null;}
			timeouts.basemap = setTimeout(function() {
				timeouts.basemap = null;
				dojo.byId('divLayerContainer').style.display = 'none';
			},1000);
			*/
		}
		dojo.byId("divAddressSearch").style.display = "block";
		dojo.byId("searchButton").setAttribute("aria-expanded","true");
	}
}