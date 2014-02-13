/*ENGLISH
 |
 | ArcGIS for Canadian Municipalities / ArcGIS pour les municipalités canadiennes
 | Citizen Service Request v10.2.0 / Demande de service municipal v10.2.0
 | This file was written by Esri Canada - Copyright 2014 Esri Canada
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
*/
define({
	root: ({
		//The following values along with those found in the config.js file can be changed to alter the text displayed in the application
		//Address Search:
		SearchTitle: "Search Address",
		SearchTooltip: "Search",
		LocateTooltip: "Locate",
		
		//Share:
		ShareTitle: "Share this map",
		ShareTooltip: "Share",
		EmailTooltip: "Email",
		
		//Other Toolbar buttons:
		GeolocateTooltip: "Geolocation",
		BasemapTooltip: "Switch Basemap",
		HelpTooltip: "Help",
		
		//InfoWindow & Comments:
		CommentsTooltip: "Comments",
		DetailsTooltip: "Details",
		CommentsTitle: "Comments",
		AddComment: "Add Comment",
		EnterComment: "Enter comment",
		SubmitButton: "Submit",
		CancelButton: "Cancel",
		
		//Driving Directions:
		DurationLabel: "Duration",
		DistanceLabel: "Total Distance",
		
		//General:
		CloseTooltip: "Close",
		HidePanelTooltip: "Hide Panel",
		ShowPanelTooltip: "Show Panel",
		MobileHeader: "${0} Details", //${0} will be replaced with the Polling Place Label
		SwitchTooltip: "Display ", //Used in the switch basemap tooltip (use "Display " or "Afficher les " for English or French respectively)
		PrintTooltip: "Print",
		zoomInAlert: "Zoom in to see " //The polling place plural label will be appended
	}),
	"fr": true
});