//FRANÇAIS
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

    // Ce fichier continent divers options permettant de configurer le Localisateur de bureaux de scrutin.
    //
    // Utiliser ce fichier afin de configurer:
    //
    // 1.  Le titre de l'application et l'icône           - [ Balise(s) HTML: ApplicationName, WindowTitle, ApplicationIcon ]
    // 2.  Le message de l'écran de garde                 - [ Balise(s) HTML: SplashScreenMessage ]
    // 3.  L'URL pour la page d'aide                      - [ Balise(s) HTML: HelpURL ]
    // 4.  Les mots de localisation                       - [ Balise(s) HTML: PollingPlaceLabel, CandidatesTabLabel ]
    //
    // 5.  Les URL pour les cartes de fond                - [ Balise(s) HTML: BaseMapLayers ]
    // 6.  L'étendue initiale de la carte                 - [ Balise(s) HTML: DefaultExtent ]
    //
    // 7.  Les services de carte:
    // 7a. Les URL des couches opéationnelles             - [ Balise(s) HTML: PollLayer, PollMobileLayer, PrecinctLayer, PrecinctOfficeLayer,
    //                                                                        PollingCommentsLayer, ReferenceOverlayLayer ]
    // 7b. Le nom des champs                              - [ Balise(s) HTML: PrecinctID, PrimaryKeyForComments]
    // 7c. Les option du vote par anticipation            - [ Balise(s) HTML: AdvancedPolls]
    //
    // 8. Les fenêtres et boites de données
    // 8a. Les fentres infos                              - [ Balise(s) HTML: InfoWindowHeader, InfoWindowContent ]
    // 8b. Les fenêtres contextuelle                      - [ Balise(s) HTML: InfoPopupFieldsCollection, ShowCommentsTab ]
    // 8c. La taille des fenêtres contextuelles           - [ Balise(s) HTML: InfoPopupHeight, InfoPopupWidth ]
    // 8d. Le format des donnés                           - [ Balise(s) HTML: ShowNullValueAs, FormatDateAs ]
    //
    // 9.  La recherche par addresse                      - [ Balise(s) HTML: LocatorSettings ]
    //
    // 10. Le service de géométrie et les Printing Tools  - [ Balise(s) HTML: GeometryService, PrintingService ]
	//
	// 11. Le bouton de bascule de la langue              - [ Balise(s) HTML: LanguageButton ]
    //
    // 12. Les option de routage et de l'itinéraire       - [ Balise(s) HTML: RouteServiceURL, ArcGISOnlineClientID DirectionsLanguage,
    //                                                                        RouteColor, RouteWidth ]
    // 12a.Destination du routage                         - [ Balise(s) HTML: GenerateRouteToNonDesignatedPollingPlace <true/false> ]
    // 12b.L'unité de mesure                              - [ Balise(s) HTML: UnitConfig ]
    //
    // 13. Les donnés dans le bas de page                 - [ Balise(s) HTML: InfoBoxWidth, PollingPlaceTabData, CandidatesTabData ]
    //
    // 14. Les champs de la base de données               - [ Balise(s) HTML: DatabaseFields, CommentsInfoPopupFieldsCollection ]
    //
    // 15. Les URL pour le partage des cartes             - [ Balise(s) HTML: FacebookShareURL, TwitterShareURL, ShareByMailLink ]
    // 15a.L'URL pour le service TinyURL                  - [ Balise(s) HTML: MapSharingOptions (set TinyURLServiceURL, TinyURLResponseAttribute) ]
    // 15b.Les options de partage                         - [ Balise(s) HTML: TwitterStatus, TwitterHashtag, TwitterFollow, EmailSubject ]
    // 15c.L'URL des réseaux sociaux                      - [ Balise(s) HTML: FacebookShareURL, TwitterShareURL ]

    // ------------------------------------------------------------------------------------------------------------------------
    // CONFIGURATION GÉNÉRALE
    // ------------------------------------------------------------------------------------------------------------------------
    // Titre de l'application
    ApplicationName: /*Nom de l'application*/ "Localisateur de bureaux de scrutin", //Nom de l'application
    WindowTitle: /*Title de la fenêtre*/ "Bureaux de scrutin",
	
	// Logo de l'application
	ApplicationIcon: "images/appIcon.png",

    // Contenu de l'écran de garde (l'écran qui s'affiche lors du lancement de l'application)
    SplashScreenMessage: "<strong>Localisateur de bureaux de scrutin</strong><br><hr><br>Le <strong>localisateur de bureau de scrutin</strong> permet aux citoyens de trouver leur bureau de scrutin (soit ordinaire ou par anticipation), d’obtenir un itinéraire, d'obtenir de l’information au sujet de leur bureau, de faire des commentaires à propos des bureaux et d’obtenir une liste des candidats. Afin d’indiquer sont lieu de résidence, il est possible de cliquer sur la carte, de chercher par adresse ou d'utiliser l'outil de géolocalisation. L’application permet aussi au citoyens d’alterner entre les bureaux ordinaires (par default) et les bureaux de vote par anticipation.<br><br>",

    // L'URL de la page/du portail d'aide
    HelpURL: "help.htm",

    // CanMod: Variables de localisation (change le texte dans l’application):
    PollingPlaceLabel: /*Étiquette du bureau de scruting*/ "Bureau de scrutin",
	PollingPlacePlural: /*Pluriel du bureau de scrutin*/ "Bureaux de scrutin",
    CandidatesTabLabel: /*Étiquette de l'onglet des candidats*/ "Candidats(es)",

    // ------------------------------------------------------------------------------------------------------------------------
    // CONFIGURATION DES CARTES DE FOND
    // ------------------------------------------------------------------------------------------------------------------------
    // Configurez les couches de carte de fond
    // NB: Tous les cartes de fond doivent avoir la même référence spatiale. Par default, l’application affiche la première carte de fond.
    BaseMapLayers: /*Couches de carte de fond*/
          [
                    {
                        Key: /*Clef*/ "topoMap",
                        ThumbnailSource: /*Imagette*/ "images/topographic.png",
                        Name: /*Nom*/ "Topographique",
                        MapURL: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer"
                    },
                    {
                        Key: /*Clef*/ "imageryMap",
                        ThumbnailSource: /*Imagette*/ "images/imagery.png",
                        Name: /*Nom*/ "Imagerie",
                        MapURL: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
                    }
          ],

    // Étendu initiale de la carte. Utilisez une virgule afin de séparer chaque valeur (ne supprimez pas la dernière virgule).
    // Les coordonnées devraient être en mètres WGS84 Web Mercator. (gauche, haut, droite, bas)
    DefaultExtent: "-8846570,5405896,-8824595,5436318",

    // ------------------------------------------------------------------------------------------------------------------------
    // COUCHES OPÉRATIONELLES
    // ------------------------------------------------------------------------------------------------------------------------

    // Configurez les options suivantes pour les couches opérationnelles
    PollLayer: /*Couche des bureaux de scrutin*/
          {
              ServiceUrl: "http://yourserver:6080/arcgis/rest/services/PollingPlaces/MapServer/0",
              Image: "images/pollingPlace.png",
              UseImage: /*Utiliser l'image*/ false,
              PrimaryKeyForPolling: /*Clef primaire*/ "${POLLINGID}",
              MinDisplayScale: /*Échelle d'affichage minimale*/ 40000 //Une valeur de zéro affichera la couche à toutes échelles
          },
    PollMobileLayer: /*Couche des bureaux de scrutin pour mobile*/
          {
              ServiceUrl: "http://yourserver:6080/arcgis/rest/services/PollingPlaces/MapServer/0",
              Image: "images/pollingPlace.png",
              UseImage: /*Utiliser l'image*/ false,
              PrimaryKeyForPolling: /*Clef primaire*/ "${POLLINGID}",
              MinDisplayScale: /*Échelle d'affichage minimale*/ 40000 //Une valuer de zéro affichera la couche à toutes échelles
          },
    PrecinctLayer: /*Couche des circonscriptions électorales*/
          {
              ServiceUrl: "http://yourserver:6080/arcgis/rest/services/Divisions/MapServer/0",
              Color: /*Couleur*/ "#00ff00",
              Alpha: 0.75,
              UseColor: /*Utiliser la couleur*/ false
          },

    //Table Division Polling Place (Circonscription & Bureaux de scrutin)
    PrecinctOfficeLayer: "http://yourserver:6080/arcgis/rest/services/PollingPlaces/MapServer/2",

    // Champ pour Division ID (Numéro de la circonscription)
    PrecinctID: "${DIVISIONID}",

    // Table des commentaires
    PollingCommentsLayer: "http://yourserver:6080/arcgis/rest/services/PollingPlaces/FeatureServer/3",
    
    // Clef primaire pour la table des commentaires
    PrimaryKeyForComments: "${POLLINGID}",

    // L’URL du Service est le point de terminaison REST pour le recouvrement de référence
    // DisplayOnLoad permet de choisir d’afficher la couche recouvrement
	// NB : Si vous utiliser la fonction des votes par anticipation, le recouvrement ne correspondras pas aux bureaux de scrutin par anticipation
    ReferenceOverlayLayer:
          {
              ServiceUrl: "http://yourserver:6080/arcgis/rest/services/ReferenceOverlay/MapServer",
              DisplayOnLoad: false
          },

    // CanMod: Configurer les bureaux de scrutin par anticipation et les noms
    // Un lien direct vers l’application en mode vote par anticipation peur être créer en ajoutant le paramètre suivant à l’URL : pollType=Alt
    // ex: http://www.maville.ca/elections/bureaux --> http://www.maville.ca/elections/bureaux?pollType=Alt
    AdvancedPolls:
        {
			//L’option Display permet d’ajouter un bouton dans l’application et permet d’activer le lien direct
            Display: true,
            NameOfRegular: /*Nom des bureaux ordinaires*/ "bureaux ordinaires",
            NameOfAdvanced: /*Nom des bureaux par anticipation*/ "bureaux par anticipation",
            ServiceURL: "http://yourserver:6080/arcgis/rest/services/PollingPlaces/MapServer/1",
			// Lorsque "Use" est "true", le bouton et le lien direct seras désactivé après la date configuré
			LastDay: /*Dernier jour*/ {Use: /*Utiliser*/ true, Year: /*Année*/ "2020", Month: /*Mois*/ "12", Day: /*Jour*/ "31"}
        },


    // ------------------------------------------------------------------------------------------------------------------------
    // CONFIGURATION DE LA FENÊTRE INFO
    // ------------------------------------------------------------------------------------------------------------------------
    // La fenêtre info est une petite fenêtre afficher dans l’application mobile lorsque l’utilisateur sélection un élément
    // Titre de la fenêtre info
    InfoWindowHeader: "${POLLNAME}",

    // Contenu de la fenêtre info
    InfoWindowContent: "${FULLADD}",

    // ------------------------------------------------------------------------------------------------------------------------
    // CONFIGURATION DE LA FENÊTRE CONTEXTUELLE
    // ------------------------------------------------------------------------------------------------------------------------
    // La fenêtre contextuelle est afficher lorsque l’utilisateur sélectionne un bureau de scrutin dans l’application desktop et tablet.
    InfoPopupFieldsCollection:
          [
                    {
                        DisplayText: /*Texte d'affichage*/ "Adresse:",
                        FieldName: /*Champs*/ "${FULLADD},${MUNICIPALITY}"
                    },
                    {
                        DisplayText: "Limite pour l'enregistrement:",
                        FieldName: "${REGDATE}"
                    },
                    {
                        DisplayText: "Jour de l'élection:",
                        FieldName: "${NEXTELECT}"
                    },
                    {
                        DisplayText: "Heures d'ouverture:",
                        FieldName: "${OPERHOURS}"
                    },
                    {
                        DisplayText: "Accès aux handicapés:",
                        FieldName: "${HANDICAP}"
                    },
                    {
                        DisplayText: "Coordonnées:",
                        FieldName: "${CONTACT}"
                    },
                    {
                        DisplayText: "Téléphone:",
                        FieldName: "${PHONE}"
                    },
                    {
                        DisplayText: "Courriel:",
                        FieldName: "${EMAIL}"
                    }
          ],

    // Afficher les commentaires et permettre de commenter
    ShowCommentsTab: true,


    // Configurez la taille des fenêtres contextuelles – sélectionnez la hauteur et largeur maximal en pixel
    InfoPopupHeight: /*Hauteur*/ 260, //hauteur minimal doit être au moins 260 pixels
    InfoPopupWidth: /*Largeur*/ 330, //largeur minimal doit être au moins 330 pixels

    // Saisissez le texte utilisé pour les entrés vides ou nuls
    ShowNullValueAs: "S/O",

    // Configurez le format des dates
    FormatDateAs: "yyyy-MMM-dd",


    // ------------------------------------------------------------------------------------------------------------------------
    // CONFIGURATION DE LA RECHERCHE PAR ADDRESSE
    // ------------------------------------------------------------------------------------------------------------------------

    // Configurez les paramètres du service localisateur d’adresse
    LocatorSettings: {
		DisplayText: /*Texte d'affichage*/ "Trouver une adresse",
		Example: /*Exemple*/ "Essayez un adresse tel que '12 Place Concord'",
		MyLocationLabel: /*Étiquette Ma position*/ "ma position",
		LocatorFields: /*Champs du localisateur*/ ["Address", "City", "Region", "Postal"],
		DefaultLocatorSymbol: /*Symbole de localisation*/ "images/RedPushpin.png",
		DefaultResultSymbol: /*Anneau du résultat*/ "images/ripple.png",
		SymbolSize: /*Taille du symbol*/ { width: 25, height: 25 },
		LocatorURL: /*URL du localisateur*/ "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer",
		LocatorParamaters: /*Paramètre du localisateur*/ ["SingleLine"],
		CandidateFields: /*Champs candidats*/ "Loc_name, Score, Match_addr",
		DisplayFieldCML2: /*Champ d'affichage*/ "Match_addr",
		AddressMatchScore: /*Score d'appariement minimum*/ 80,
		LocatorFieldName: /*Nom du champ du localisateur*/ 'Loc_name',
		LocatorFieldValues: /*Valeur du champ du localisateur*/ ["CAN.StreetName" , "CAN.PointAddress", "CAN.StreetAddress", "CAN.PostalExt"],
		//CanMod: Configurez l’étendue utilisé lors d’une recherche par adresse; saisissez un wkid de 0000 afin
        //de chercher l’Amérique du Nord en entier. CGS_WGS_1984 : Utilisez wkid 4326 et des dégrées décimaux;
        //WGS_1984_Web_Mercator : Utilisez wkid 3785 et des mètres; Aucun autre système accepté.
		SearchExtent: {xmin: -8865402.789852107, ymin: 5443102.360231639, xmax: -8807068.937666388, ymax: 5400828.978730424, wkid: 3785}
    },

    // ------------------------------------------------------------------------------------------------------------------------
    // SERVICE DE GÉOMÉTRIE ET D'IMPRESSION
    // ------------------------------------------------------------------------------------------------------------------------
    // Saisissez l'URL du service de géométrie
    GeometryService: "http://yourserver:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer",
	
	// Saisissez l’URL du "Export Web Map Task" (fait partie des outils d’impression) – Laissez vide afin de désactiver l’impression de la carte
	PrintingService: "http://yourserver:6080/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
	
	// ------------------------------------------------------------------------------------------------------------------------
	// BOUTON DE BASCULE DE LA LANGUE
	// ------------------------------------------------------------------------------------------------------------------------
	// Permet d'inclure un bouton dans la barre d'outils afin de changer d'application
	LanguageButton: {
		Enabled: /*Activé*/ false,
		Image: "images/language_EN.png",
		Title: /*Titre*/ "Afficher l'application en anglais",
		AppURL: /*URL de l'application*/ "http://votresiteweb..."
	},

    // ------------------------------------------------------------------------------------------------------------------------
    // ROUTAGE ET ITINÉAIRE
    // ------------------------------------------------------------------------------------------------------------------------
    // Saisissez l’URL pour le service de routage (Analyste de réseau), afin de désactiver le routage, laissez l’option vide ou changez l’option "Show Configuration" à "False".
    RouteServiceURL: "http://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
	
	// CanMod: Le Client ID de votre compte ArcGIS Online pour organisation (configuration aussi nécessaire dans web.config).
	ArcGISOnlineClientID: "",
	UrlToProxy: /*URL vers le proxy*/ "proxy.ashx",

    // CanMod: Choisissez la langue des directives (ex: 'fr' ou 'en')
    DirectionsLanguage: 'fr',

    // Choisissez la couleur utilisez pour afficher la route
    RouteColor: "#7F7FFE",

    // Choisissez la largeur de la route
    RouteWidth: 6,

    // Choisissez qu’elles bureaux de scrutin seras utilisé comme destination
    // Lorsque "true", un itinéraire seras produit pour chaque bureau sélectionné; autrement, un itinéraire ne seras produit que pour le bureau désigné.
    GenerateRouteToNonDesignatedPollingPlace: false,

    //CanMod: Configurez l’unité de mesure ainsi que l’étiquette utilisé pour le routage
    UnitConfig:
    {
        DirectionsLengthUnit: /*Unité de mesure*/ "KM", //Choisissez "KM" pour kilomètres ou "MI" pour miles
        DirectionsLengthLabel: /*Étiquette*/ "km"
    },

    // ------------------------------------------------------------------------------------------------------------------------
    // CONFIGURATION DES BOITES DANS LE BAS DE PAGE
    // ------------------------------------------------------------------------------------------------------------------------
    // Configurez la largeur des boites
    InfoBoxWidth: 422,


    // Configurez les donnés affiché dans les boites du bas de page pour l'onglet Bureau de scrutin
    PollingPlaceTabData: /*Données des bureaux de scrutin*/
          {
              DirectionBox: /*Boite du routage*/ //ne pas enlever
                    {
                        HeaderColor: /*Couleur de fond du titre*/ "#B4C8B4",
                        Title: /*Titre*/ "<strong>Iténéraire</strong>",
                        ShowDirection: /*Afficher l'itinéaire*/ true
                    },
              DetailsBox: /*Boite des détails*/
                    {
                        HeaderColor: /*Coleur de fond du titre*/ "#303030",
                        Title: /*Titre*/ "<strong>Détails</strong>",
						//AttachmentDisplayField: /*Champ d'affichage des fichers joints*/ "Bulletin de vote:", //Optional
                        Data:
                              [
                                        {
                                            DisplayText: /*Texte d'affichage*/ "Circonscription:",
                                            PrecinctFieldExpression: /*Champs des divisions*/ "${DIVISIONNAME} (${DIVISIONID})"  // Provient de la division
                                        },
                                        {
                                            DisplayText: "Nom:",
                                            FieldName: /*Champ*/ "${POLLNAME}"   // Provient du bureau
                                        },
                                        {
                                            DisplayText: "Adresse:",
                                            FieldName: "${FULLADD}, ${MUNICIPALITY}"   // Provient du bureau
                                        },
                                        {
                                            DisplayText: "Heures d'ouverture:",
                                            FieldName: "${OPERHOURS}"   // Provient du bureau
                                        },
                                        {
                                            DisplayText: "Accès aux handicapés:",
                                            FieldName: "${HANDICAP}"   // Provient du bureau
                                        },
                                        {
                                            DisplayText: "Limite pour l'enregistrement:",
                                            FieldName: "${REGDATE}"   // Provient du bureau
                                        },
                                        {
                                            DisplayText: "Jour de l'élection:",
                                            FieldName: "${NEXTELECT}"   // Provient du bureau
                                        }
                              ]
                    },
              ContactBox: /*Boite des coordonnés*/
                    {
                        HeaderColor: "#B4C8B4",
                        Title: "<strong>Coordonnés</strong>",
                        Data:
                              [
                                        {
                                            DisplayText: "Coordonnées:",
                                            FieldName: "${CONTACT}"   // Provient du bureau
                                        },
                                        {
                                            DisplayText: "Téléphone:",
                                            FieldName: "${PHONE}"   // Provient du bureau
                                        },
                                        {
                                            DisplayText: "Courriel:",
                                            FieldName: "${EMAIL}"   // Provient du bureau
                                        }
                              ]
                    },
              CommentsBox: /*Boite des commentaires*/ //Ne pas enlever
                    {
                        HeaderColor: "#B4C8B4",
                        Title: "<strong>Commentaires</strong>"
                    }
          },

    // CandMod_doc: Configurez les donnés affiché dans les boites du bas de page pour l'onglet Candidats(es)
    CandidatesTabData:
          {
              Mayor:
                    {
                        ServiceUrl: "http://yourserver:6080/arcgis/rest/services/Divisions/MapServer/1",
                        HeaderColor: "#B4C8B4",
                        Title: "<strong>Maire/Mairesse de la ville de Toronto</strong>",
                        Data:
                              [
                                        {
                                            DisplayText: "Candidats(es):",
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
                        Title: "<strong>Conseillers(ères) du quartier</strong>",
                        Data:
                              [
                                        {
                                            DisplayText: "Quartier:",
                                            FieldName: "${DISTRICTNAME}"
                                        },
                                        {
                                            DisplayText: "Candidats(es):",
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
                                            DisplayText: "Quartier:",
                                            FieldName: "${DISTRICTNAME} (${DISTRICTID})"
                                        },
                                        {
                                            DisplayText: "Candidats(es):",
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
                                            DisplayText: "Quartier:",
                                            FieldName: "${DISTRICTNAME} (${DISTRICTID})"
                                        },
                                        {
                                            DisplayText: "Candidats(es):",
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
                                            DisplayText: "Région:",
                                            FieldName: "${DISTRICTNAME} (${DISTRICTID})"
                                        },
                                        {
                                            DisplayText: "Candidats(es):",
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
                                            DisplayText: "Région:",
                                            FieldName: "${DISTRICTNAME} (${DISTRICTID})"
                                        },
                                        {
                                            DisplayText: "Candidats(es):",
                                            FieldName: "${REPNAME1}"
                                        }
                              ]
                    }
          },

    // ------------------------------------------------------------------------------------------------------------------------
    // NOM DES CHAMPS DE LA BASSE DE DONNÉES
    // ------------------------------------------------------------------------------------------------------------------------
    // NB : DateFieldName est pour le champ de format date; Tout autres attributs sont pour les champs de texte
    DatabaseFields: {
        PrecinctIdFieldName: /*ID de la division*/ "DIVISIONID",
        PollingIdFieldName: /*ID du bureau*/ "POLLINGID",
        CommentsFieldName: /*Commentaire*/ "COMMENTS",
        DateFieldName: /*Champ de date*/ "SUBMITDT",
        PollingPlaceName: /*Nom du bureau*/ "POLLNAME"
    },

    // Champs pour les commentaires
    CommentsInfoPopupFieldsCollection: {
        Submitdate: /*Date*/ "${SUBMITDT}",
        Comments: /*Commentaire*/ "${COMMENTS}"
    },

    // ------------------------------------------------------------------------------------------------------------------------
    // CONFIGURATION POUR LE PARTAGE DE LA CARTE
    // ------------------------------------------------------------------------------------------------------------------------
    // Configurez l'URL pour le service TinyURL
    MapSharingOptions:
          {
              TinyURLServiceURL: "http://api.bit.ly/v3/shorten?login=esri&apiKey=R_65fd9891cd882e2a96b99d4bda1be00e&uri=${0}&format=json",
              TinyURLResponseAttribute: /*Attribut réponse*/ "data.url",
			  
			  //Configurez les paramètres de partage par réseau sociaux; Laissez une paire de guillemets vides lorsqu’un paramètre n’est
              //pas requis. Veuillez noter que le langage des interfaces est déterminé pas le site web même et ne peut être changé.

			  //FacebookText: Facebook ne permet plus de configurer le texte du bulletin. L’utilisateur seras demander de saisir sont propre commentaire.
			  
			  TwitterText: "Localisateur de bureau de scrutin", //Le texte qui seras ajouté au tweet
			  TwitterHashtag: "CarteÉlectorale", //Le hashtag qui seras ajouté au tweet (e.g. ÉlectionsToronto).
			  TwitterFollow: "EsriCanada", //L’utilisateur seras invité à suivre ce compte sur Twitter (ex: le compte Twitter de la municipalité).

              EmailSubject: /*Sujet du courriel*/ "Localisateur de bureau de scrutin",

              FacebookShareURL: /*URL de partage Facebook*/ "http://www.facebook.com/sharer.php",
              TwitterShareURL: /*URL de partage Twitter*/ "https://twitter.com/share"
          },

    //-------------------------------------------------------------------------------------------------------------------------
    // LES CARTES WEB NE SONT PLUS COMPATIBLE DEPUIS LA VERSION 10.2
    //-------------------------------------------------------------------------------------------------------------------------
    // Les cartes web ne sont pas compatibles depuis la version 10.2 du Localisateur de bureau de scrutin. Veuillez utiliser des services de cartes. Ne changer pas la valeur de "UseWebmap" ou "WebMapId".
    UseWebmap: false,
    WebMapId: ""
});
