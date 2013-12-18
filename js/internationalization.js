//ENGLISH
/**
 |
 |ArcGIS for Canadian Municipalities / ArcGIS pour les municipalités canadiennes
 |Polling Place Locator v10.2.0 / Localisateur de bureau de scrutin v10.2.0
 |This file was written by Esri Canada - Copyright 2013 Esri Canada
 |
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
 
INTERNATIONALIZATION FILE: Changes hard-coded text in the web application.
**/

var HidePanelTooltip;
var ShowPanelTooltip;
var DetailsTooltip;
var DurationLabel;
var DistanceLabel;
var MobileHeader;
var SwitchTooltip;
var PrintTooltip;

function Internationalization(run) {
	//The following values along with those found in the config.js file can be changed to alter the text displayed in the application
	//Address Search:
	var SearchTitle = "Search Address";
	var SearchTooltip = "Search";
	var LocateTooltip = "Locate";
	
	//Share:
	var ShareTitle = "Share this map";
	var ShareTooltip = "Share";
	var EmailTooltip = "Email";
	
	//Other Toolbar buttons:
	var GeolocateTooltip = "Geolocation";
	var BasemapTooltip = "Switch Basemap";
	var HelpTooltip = "Help";
	
	//InfoWindow & Comments:
	var CommentsTooltip = "Comments";
	DetailsTooltip = "Details";
	var CommentsTitle = "Comments";
	var AddComment = "Add Comment";
	var EnterComment = "Enter comment";
	var SubmitButton = "Submit";
	var CancelButton = "Cancel";
	
	//Driving Directions:
	DurationLabel = "Duration";
	DistanceLabel = "Total Distance";
	
	//General:
	var CloseTooltip = "Close";
	HidePanelTooltip = "Hide Panel";
	ShowPanelTooltip = "Show Panel";
	MobileHeader = "${0} Details"; //${0} will be replaced with the Polling Place Label
	SwitchTooltip = "Display "; //Used in the switch basemap tooltip (use "Display " or "Afficher les " for English or French respectively)
	PrintTooltip = "Print";
	var zoomInAlert = "Zoom in to see "; //The polling place plural label will be appended

	//----DO NOT CHANGE CODE BELOW--------------------------------------------------------------------
	if (run) { //Will only execute after all other initialization code (one of the variables set above is require before the initialization code)
		dojo.byId('searchTitle').innerHTML = SearchTitle;
		dojo.query("#Td1 img")[0].title = SearchTooltip;
		dojo.byId("imgLocate").title = LocateTooltip;
		
		dojo.byId("shareTitle").innerHTML = ShareTitle;
		dojo.byId("imgShare").title = ShareTooltip;
		dojo.byId("imgMail").title = EmailTooltip;
		
		dojo.query("#tdGeolocation img")[0].title = GeolocateTooltip;
		if (!isMobileDevice) { //Element only created on desktop browsers
			dojo.byId("imgBaseMap").title = BasemapTooltip;
		}
		dojo.byId("imgHelp").title = HelpTooltip;
		
		dojo.byId("imgComments").title = CommentsTooltip;
		dojo.byId("divCommentsHeader").innerHTML = CommentsTitle;
		dojo.query("#divCommentsView td")[1].innerHTML = AddComment;
		dojo.setAttr(dojo.byId("txtComments"),"placeholder",EnterComment);
		dojo.query("#btnAddComments")[0].innerHTML = SubmitButton;
		dojo.byId("btnCancelComments").innerHTML = CancelButton;
		
		closeButtons = dojo.query("img[title='Close']");
		dojo.setAttr(closeButtons[0],"title",CloseTooltip);
		dojo.setAttr(closeButtons[1],"title",CloseTooltip);
		dojo.byId("tdInfoHeader").innerHTML = dojo.string.substitute(MobileHeader,[pollingPlaceLabel]);
		dojo.byId("printHeader").innerHTML = PrintTooltip; //Print iframe window header
		dojo.byId("zoomInAlert").innerHTML = dojo.byId("zoomInAlert").innerHTML + zoomInAlert + pollingPlacePlural.toLowerCase();
	}
}