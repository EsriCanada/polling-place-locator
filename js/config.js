//ENGLISH
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
dojo.provide("js.Config");
dojo.declare("js.Config", null, {

    // This file contains various configuration settings for "Polling Place Locator" template
    //
    // Use this file to perform the following:
    //
    // 1.  Specify application title & icon           - [ Tag(s) to look for: ApplicationName, WindowTitle, ApplicationIcon ]
    // 2.  Set splash screen message                  - [ Tag(s) to look for: SplashScreenMessage ]
    // 3.  Set URL for help page                      - [ Tag(s) to look for: HelpURL ]
    // 4.  Set localization terms                     - [ Tag(s) to look for: PollingPlaceLabel, CandidatesTabLabel ]
    //
    // 5.  Specify URLs for basemaps                  - [ Tag(s) to look for: BaseMapLayers ]
    // 6.  Set initial map extent                     - [ Tag(s) to look for: DefaultExtent ]
    //
    // 7.  Map services:
    // 7a. Specify URLs for operational layers        - [ Tag(s) to look for: PollLayer, PollMobileLayer, PrecinctLayer, PrecinctOfficeLayer, PollingCommentsLayer, ReferenceOverlayLayer ]
    // 7b. Specify field names for layers             - [ Tag(s) to look for: PrecinctID, PrimaryKeyForComments]
    // 7c. Set the Advanced Poll Settings             - [ Tag(s) to look for: AdvancedPolls]
    //
    // 8. Customize data windows & pods
    // 8a. Customize info-Window settings             - [ Tag(s) to look for: InfoWindowHeader, InfoWindowContent ]
    // 8b. Customize info-Popup settings              - [ Tag(s) to look for: InfoPopupFieldsCollection, ShowCommentsTab ]
    // 8c. Customize info-Popup size                  - [ Tag(s) to look for: InfoPopupHeight, InfoPopupWidth ]
    // 8d. Customize data formatting                  - [ Tag(s) to look for: ShowNullValueAs, FormatDateAs ]
    //
    // 9.  Customize address search settings          - [ Tag(s) to look for: LocatorSettings ]
    //
    // 10. Set URL for geometry & printing service    - [ Tag(s) to look for: GeometryService, PrintingService ]
	//
	// 11. Setup the language toggle button           - [ Tag(s) to look for: LanguageButton ]
    //
    // 12. Customize routing settings for directions  - [ Tag(s) to look for: RouteServiceURL, ArcGISOnlineClientID DirectionsLanguage, RouteColor, RouteWidth ]
    // 12a.Choose destination for route generation    - [ Tag(s) to look for: GenerateRouteToNonDesignatedPollingPlace <true/false> ]
    // 12b.Choose the unit for route directions       - [ Tag(s) to look for: UnitConfig ]
    //
    // 13. Configure data to be displayed on the bottom panel
    //                                                - [ Tag(s) to look for: InfoBoxWidth, PollingPlaceTabData, CandidatesTabData ]
    //
    // 14. Define Database fields                     - [ Tag(s) to look for: DatabaseFields, CommentsInfoPopupFieldsCollection ]
    //
    // 15. Specify URLs for map sharing               - [ Tag(s) to look for: FacebookShareURL, TwitterShareURL, ShareByMailLink ]
    // 15a.In case of changing the TinyURL service
    //     Specify URL for the new service            - [ Tag(s) to look for: MapSharingOptions (set TinyURLServiceURL, TinyURLResponseAttribute) ]
    // 15b.Specify the share settings                 - [ Tag(s) to look for: TwitterStatus, TwitterHashtag, TwitterFollow, EmailSubject ]
    // 15c.Specify the Facebook/Twitter URL in case of change to URL
    //                                                - [ Tag(s) to look for: FacebookShareURL, TwitterShareURL ]

    // ------------------------------------------------------------------------------------------------------------------------
    // GENERAL SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------
    // Set application title
    ApplicationName: "Polling Place Locator",
    WindowTitle: "Polling Places",
	
	// Set application icon path
	ApplicationIcon: "images/appIcon.png",

    // Set splash window content - Message that appears when the application starts
    SplashScreenMessage: "<strong>Polling Place Locator</strong> <br/> <hr/> <br/> The <strong>Polling Place Locator</strong> helps voters locate their assigned election polling place (regular or advanced poll), get driving directions, get poll location information, comment on the polling place conditions, and obtain candidate information. A voter can enter an address in the Search Address Box, select a point on the map or use the geolocator. The voter can switch between regular (default) and advanced polling places.<br/><br/>",

    // Set URL of help page/portal
    HelpURL: "help.htm",

    // CanMod: Localization variables (will change the text in the application):
    PollingPlaceLabel: "Polling Place",
	PollingPlacePlural: "Polling Places",
    CandidatesTabLabel: "Candidates",

    // ------------------------------------------------------------------------------------------------------------------------
    // BASEMAP SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------
    // Set baseMap layers
    // Please note: All basemaps need to use the same spatial reference. By default, on application start the first basemap will be loaded
    BaseMapLayers:
          [
                    {
                        Key: "topoMap",
                        ThumbnailSource: "images/topographic.png",
                        Name: "Topographic",
                        MapURL: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer"
                    },
                    {
                        Key: "imageryMap",
                        ThumbnailSource: "images/imagery.png",
                        Name: "Imagery",
                        MapURL: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
                    }
          ],

    // Initial map extent. Use comma (,) to separate values and don't delete the last comma
    DefaultExtent: "-8846570,5405896,-8824595,5436318",

    // ------------------------------------------------------------------------------------------------------------------------
    // OPERATIONAL DATA SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------

    // Set the following options for the configuration of operational layers
    PollLayer:
          {
              ServiceUrl: "http://yourserver:6080/arcgis/rest/services/PollingPlaces/MapServer/0",
              Image: "images/pollingPlace.png",
              UseImage: false,
              PrimaryKeyForPolling: "${POLLINGID}",
              MinDisplayScale: 40000 //Set to 0 to always display
          },
    PollMobileLayer:
          {
              ServiceUrl: "http://yourserver:6080/arcgis/rest/services/PollingPlaces/MapServer/0",
              Image: "images/pollingPlace.png",
              UseImage: false,
              PrimaryKeyForPolling: "${POLLINGID}",
              MinDisplayScale: 40000 //Set to 0 to always display
          },
    PrecinctLayer: //Polling Divisions Layer
          {
              ServiceUrl: "http://yourserver:6080/arcgis/rest/services/Divisions/MapServer/0",
              Color: "#00ff00",
              Alpha: 0.75,
              UseColor: false
          },

    //Division Polling Place Table
    PrecinctOfficeLayer: "http://yourserver:6080/arcgis/rest/services/PollingPlaces/MapServer/2",

    // Set field for division ID
    PrecinctID: "${DIVISIONID}",

    // Comments Table
    PollingCommentsLayer: "http://yourserver:6080/arcgis/rest/services/PollingPlaces/FeatureServer/3",
    
    // Set primary key for comments table
    PrimaryKeyForComments: "${POLLINGID}",

    // ServiceUrl is the REST end point for the reference overlay layer
    // DisplayOnLoad setting this will show the reference overlay layer on load
	// NB: If Advanced Polls are enabled, the overlay will not match with the data when in advanced poll mode
    ReferenceOverlayLayer:
          {
              ServiceUrl: "http://yourserver:6080/arcgis/rest/services/ReferenceOverlay/MapServer",
              DisplayOnLoad: false
          },

    // CanMod: Set the Advance Polling Station Layer and names
    // A direct link to the advanced polls can be created by adding the following parameter to the URL: pollType=Alt
    // e.g. http://www.mycity.ca/election/polls --> http://www.mycity.ca/election/polls?pollType=Alt
    AdvancedPolls:
        {
			//The Display option set whether to display a button to switch poll type in the application and will disable the direct link
            Display: true,
            NameOfRegular: "Regular Polls",
            NameOfAdvanced: "Advanced Polls",
            ServiceURL: "http://yourserver:6080/arcgis/rest/services/PollingPlaces/MapServer/1",
			//If Use is set to true, both the button and the link will be disabled after the set date in the end users local time.
			LastDay: {Use: true, Year:"2020", Month:"12", Day:"31"}
        },


    // ------------------------------------------------------------------------------------------------------------------------
    // INFO-WINDOW SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------
    // Info-window is a small, two line popup that gets displayed on selecting a feature in the mobile application
    // Set Info-window title. Configure this with text/fields from the polling place layer
    InfoWindowHeader: "${POLLNAME}",

    // Choose content/fields for the info window
    InfoWindowContent: "${FULLADD}",

    // ------------------------------------------------------------------------------------------------------------------------
    // INFO-POPUP SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------
    // Info-popup is a popup dialog that gets displayed on selecting a feature
    // Set the content to be displayed on the info-Popup. Define labels, field values, field types and field formats
    InfoPopupFieldsCollection:
          [
                    {
                        DisplayText: "Address:",
                        FieldName: "${FULLADD},${MUNICIPALITY}"
                    },
                    {
                        DisplayText: "Registration Deadline:",
                        FieldName: "${REGDATE}"
                    },
                    {
                        DisplayText: "Election Date:",
                        FieldName: "${NEXTELECT}"
                    },
                    {
                        DisplayText: "Hours:",
                        FieldName: "${OPERHOURS}"
                    },
                    {
                        DisplayText: "Accessible:",
                        FieldName: "${HANDICAP}"
                    },
                    {
                        DisplayText: "Contact:",
                        FieldName: "${CONTACT}"
                    },
                    {
                        DisplayText: "Phone:",
                        FieldName: "${PHONE}"
                    },
                    {
                        DisplayText: "Email:",
                        FieldName: "${EMAIL}"
                    }
          ],

    // Set this to true to show "Comments" tab in the info-Popup
    ShowCommentsTab: true,


    // Set size of the info-Popup - select maximum height and width in pixels (not applicable for tabbed info-Popups)
    InfoPopupHeight: 260, //minimum height should be 260 for the info-popup in pixels
    InfoPopupWidth: 330, //minimum width should be 330 for the info-popup in pixels

    // Set string value to be shown for null or blank values
    ShowNullValueAs: "N/A",

    // Set date format
    FormatDateAs: "yyyy-MMM-dd",


    // ------------------------------------------------------------------------------------------------------------------------
    // ADDRESS SEARCH SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------

    // Set Locator service settings
    LocatorSettings: {
		DisplayText: "Search for an address",
		Example: "Try searching for a street address such as '12 Concorde Place'",
		MyLocationLabel: "my location",
		LocatorFields: ["Address", "City", "Region", "Postal"],
		DefaultLocatorSymbol: "images/RedPushpin.png",
		DefaultResultSymbol: "images/ripple.png",
		SymbolSize: { width: 25, height: 25 },
		LocatorURL: "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer",
		LocatorParamaters: ["SingleLine"],
		CandidateFields: "Loc_name, Score, Match_addr",
		DisplayFieldCML2: "Match_addr",
		AddressMatchScore: 80,
		LocatorFieldName: 'Loc_name',
		LocatorFieldValues: ["CAN.StreetName" , "CAN.PointAddress", "CAN.StreetAddress", "CAN.PostalExt"],
		//CanMod: Set the extent to be used when searching for an address, set wkid to 0000 in order to search whole of North America
		//CGS_WGS_1984: Use wkid 4326 and decimal degrees; WGS_1984_Web_Mercator: Use wkid 3785 and metres; Other systems not supported
		SearchExtent: {xmin: -8865402.789852107, ymin: 5443102.360231639, xmax: -8807068.937666388, ymax: 5400828.978730424, wkid: 3785}
    },

    // ------------------------------------------------------------------------------------------------------------------------
    // GEOMETRY & PRINTING SERVICE SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------
    // Set geometry service URL
    GeometryService: "http://yourserver:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer",
	
	// Set Export Web Map Task URL (Part of 10.1/10.2 Printing Tools) - Leave blank to disable map printing
	PrintingService: "http://yourserver:6080/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
	
	// ------------------------------------------------------------------------------------------------------------------------
	// LANGUAGE TOGGLE BUTTON
	// ------------------------------------------------------------------------------------------------------------------------
	// Allows you to include a toggle button in the toolbar to switch between two version of the application
	LanguageButton: {
		Enabled: false,
		Image: "images/language_FR.png",
		Title: "Switch to French Application",
		AppURL: "http://yourwebsite..."
	},

    // ------------------------------------------------------------------------------------------------------------------------
    // DRIVING DIRECTIONS SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------
    // Set URL for routing service (network analyst), to turn off the routing functionality update the "ShowDirection" variable to false in the "PollingPlaceTabData" section below.
    RouteServiceURL: "http://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
	
	// CanMod: ArcGIS Online subscription for Developers Client ID for Simple Routing (must also be setup in web.config)
	ArcGISOnlineClientID: "",
	UrlToProxy: "proxy.ashx",

    // CanMod: language to use with directions (e.g., 'en', or 'fr'):
    DirectionsLanguage: 'en',

    // Set color for the route symbol
    RouteColor: "#7F7FFE",

    // Set width of the route
    RouteWidth: 6,

    // Choose destination polling place for route generation
    // If set to true, route will be generated for any selected polling place; otherwise route will be generated for the designated polling place
    GenerateRouteToNonDesignatedPollingPlace: false,

    //CanMod: Set the unit to use for routing directions along with it's label
    UnitConfig:
    {
        DirectionsLengthUnit: "KM", //Choose between "KM" for Kilometres and "MI" for Miles
        DirectionsLengthLabel: "km"
    },

    // ------------------------------------------------------------------------------------------------------------------------
    // SETTINGS FOR INFO-PODS ON THE BOTTOM PANEL
    // ------------------------------------------------------------------------------------------------------------------------
    // Set width of the boxes in the bottom panel
    InfoBoxWidth: 422,


    // Set data to be displayed in the "Polling Place" tab on the bottom panel
    PollingPlaceTabData:
          {
              DirectionBox: //Must not be removed
                    {
                        HeaderColor: "#B4C8B4",
                        Title: "<strong>Driving Directions</strong>",
                        ShowDirection: true
                    },
              DetailsBox:
                    {
                        HeaderColor: "#B4C8B4",
                        Title: "<strong>Details</strong>",
						//AttachmentDisplayField: "Ballot", //Optional
                        Data:
                              [
                                        {
                                            DisplayText: "Division:",
                                            PrecinctFieldExpression: "${DIVISIONNAME} (${DIVISIONID})"  // Attributes from the polling division layer
                                        },
                                        {
                                            DisplayText: "Name:",
                                            FieldName: "${POLLNAME}"   // Attribute name in Polling place layer
                                        },
                                        {
                                            DisplayText: "Address:",
                                            FieldName: "${FULLADD}, ${MUNICIPALITY}"   // Attribute name in Polling place layer
                                        },
                                        {
                                            DisplayText: "Hours:",
                                            FieldName: "${OPERHOURS}"   // Attribute name in Polling place layer
                                        },
                                        {
                                            DisplayText: "Accessible:",
                                            FieldName: "${HANDICAP}"   // Attribute name in Polling place layer
                                        },
                                        {
                                            DisplayText: "Registration Deadline:",
                                            FieldName: "${REGDATE}"   // Attribute name in Polling place layer
                                        },
                                        {
                                            DisplayText: "Election Date:",
                                            FieldName: "${NEXTELECT}"   // Attribute name in Polling place layer
                                        }
                              ]
                    },
              ContactBox:
                    {
                        HeaderColor: "#B4C8B4",
                        Title: "<strong>Contact</strong>",
                        Data:
                              [
                                        {
                                            DisplayText: "Contact:",
                                            FieldName: "${CONTACT}"   // Attribute name in Polling place layer
                                        },
                                        {
                                            DisplayText: "Phone:",
                                            FieldName: "${PHONE}"   // Attribute name in Polling place layer
                                        },
                                        {
                                            DisplayText: "Email:",
                                            FieldName: "${EMAIL}"   // Attribute name in Polling place layer
                                        }
                              ]
                    },
              CommentsBox: //Must not be removed
                    {
                        HeaderColor: "#B4C8B4",
                        Title: "<strong>Comments</strong>"
                    }
          },

    // CandMod: Set data to be displayed in the "Candidates" tab on the bottom panel
    CandidatesTabData:
          {
              Mayor:
                    {
                        ServiceUrl: "http://yourserver:6080/arcgis/rest/services/Divisions/MapServer/1",
                        HeaderColor: "#B4C8B4",
                        Title: "<strong>City of Toronto Mayor</strong>",
                        Data:
                              [
                                        {
                                            DisplayText: "Candidates:",
                                            FieldName: "${REPNAME1}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME2}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME3}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME4}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME5}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME6}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME7}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME8}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME9}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME10}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME11}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME12}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME13}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME14}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME15}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME16}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME17}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME18}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME19}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME20}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME21}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME22}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME23}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME24}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME25}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME26}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME27}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME28}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME29}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME30}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME31}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME32}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME33}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME34}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME35}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME36}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME37}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME38}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME40}"
                                        }
                              ]
                    },
              Councillor:
                    {
                        ServiceUrl: "http://yourserver:6080/arcgis/rest/services/Divisions/MapServer/2",
                        HeaderColor: "#B4C8B4",
                        Title: "<strong>Ward Councillor</strong>",
                        Data:
                              [
                                        {
                                            DisplayText: "Ward:",
                                            FieldName: "${DISTRICTNAME}"
                                        },
                                        {
                                            DisplayText: "Candidates:",
                                            FieldName: "${REPNAME1}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME2}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME3}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME4}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME5}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME6}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME7}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME8}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME9}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME10}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME11}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME12}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME13}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME15}"
                                        }
                              ]
                    },
              TDSB:
                    {
                        ServiceUrl: "http://yourserver:6080/arcgis/rest/services/Divisions/MapServer/3",
                        HeaderColor: "#B4C8B4",
                        Title: "<strong>Toronto District School Board Trustee</strong>",
                        Data:
                              [
                                        {
                                            DisplayText: "Ward:",
                                            FieldName: "${DISTRICTNAME} (${DISTRICTID})"
                                        },
                                        {
                                            DisplayText: "Candidates:",
                                            FieldName: "${REPNAME1}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME2}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME3}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME4}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME5}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME6}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME8}"
                                        }
                              ]
                    },
              TCDSB:
                    {
                        ServiceUrl: "http://yourserver:6080/arcgis/rest/services/Divisions/MapServer/4",
                        HeaderColor: "#B4C8B4",
                        Title: "<strong>Toronto Catholic District School Board Trustee</strong>",
                        Data:
                              [
                                        {
                                            DisplayText: "Ward:",
                                            FieldName: "${DISTRICTNAME} (${DISTRICTID})"
                                        },
                                        {
                                            DisplayText: "Candidates:",
                                            FieldName: "${REPNAME1}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME2}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME3}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME4}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME5}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME6}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME7}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME9}"
                                        }
                              ]
                    },
              CSDCSO:
                    {
                        ServiceUrl: "http://yourserver:6080/arcgis/rest/services/Divisions/MapServer/5",
                        HeaderColor: "#B4C8B4",
                        Title: "<strong>Conseil scolaire de district du Centre-Sud-Ouest</strong>",
                        Data:
                              [
                                        {
                                            DisplayText: "Region:",
                                            FieldName: "${DISTRICTNAME} (${DISTRICTID})"
                                        },
                                        {
                                            DisplayText: "Candidates:",
                                            FieldName: "${REPNAME1}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME2}"
                                        },
                                        {
                                            DisplayText: " ",
                                            FieldName: "${REPNAME3}"
                                        }
                              ]
                    },
              CSDCCS:
                    {
                        ServiceUrl: "http://yourserver:6080/arcgis/rest/services/Divisions/MapServer/6",
                        HeaderColor: "#B4C8B4",
                        Title: "<strong>Conseil scolaire de district Catholique du Centre-Sud</strong>",
                        Data:
                              [
                                        {
                                            DisplayText: "Region:",
                                            FieldName: "${DISTRICTNAME} (${DISTRICTID})"
                                        },
                                        {
                                            DisplayText: "Candidates:",
                                            FieldName: "${REPNAME1}"
                                        }
                              ]
                    }
          },

    // ------------------------------------------------------------------------------------------------------------------------
    // DATABASE FIELD NAMES
    // ------------------------------------------------------------------------------------------------------------------------
    // Note: DateFieldName refers to a date database field; All other attributes refer to text/string database fields.
    DatabaseFields: {
        PrecinctIdFieldName: "DIVISIONID",  // CanMod: database field name for divisions in the polling place layer may differ
        PollingIdFieldName: "POLLINGID",
        CommentsFieldName: "COMMENTS",
        DateFieldName: "SUBMITDT",
        PollingPlaceName: "POLLNAME"   // CanMod: field name for the polling place name in the database containing the polling places feature class
    },

    // Set info-pop fields for displaying comment
    CommentsInfoPopupFieldsCollection: {
        Submitdate: "${SUBMITDT}",
        Comments: "${COMMENTS}"
    },

    // ------------------------------------------------------------------------------------------------------------------------
    // SETTINGS FOR MAP SHARING
    // ------------------------------------------------------------------------------------------------------------------------
    // Set URL for TinyURL service
    MapSharingOptions:
          {
              TinyURLServiceURL: "http://api.bit.ly/v3/shorten?login=esri&apiKey=R_65fd9891cd882e2a96b99d4bda1be00e&uri=${0}&format=json",
              TinyURLResponseAttribute: "data.url",
			  
			  //Set the default settings when sharing the app; Leave an empty set of quotation marks when a setting is not required.
			  //The language displayed by the API's is determined by the website and cannot be changed

			  //FacebookText: Facebook has removed the option to include text. The user will instead be prompted for his own comment.
			  
			  TwitterText: "Polling Place Locator", //The text that will be added to the tweet
			  TwitterHashtag: "PollingPlaceMap", //Hashtag to append to the tweet (e.g. TorontoElections).
			  TwitterFollow: "EsriCanada", //Allows user to follow a Twitter account (e.g. the municipalities twitter account).

              EmailSubject: "Polling Place Locator",

              FacebookShareURL: "http://www.facebook.com/sharer.php",
              TwitterShareURL: "https://twitter.com/share"
          },

    //-------------------------------------------------------------------------------------------------------------------------
    // WEBMAPS ARE NOT SUPPORTED AT 10.2, SEE DETAILS BELOW
    //-------------------------------------------------------------------------------------------------------------------------
    // WebMaps are not supported with the 10.2 version of the Polling Place Locator application. Please use Feature Services for operational layers. Do not change the "UseWebmap" and "WebMapId" parameters.
    UseWebmap: false,
    WebMapId: ""
});
