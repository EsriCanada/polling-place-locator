//FRANÇAIS
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
	//Les valeurs suivante ainsi que ceux du fichier config.js et errormessages.xml peuvent être changés de modifier le texte fixe de l’application
	//Recherche par addresse:
	var SearchTitle = "Recherche par adresse"; //Titre
	var SearchTooltip = "Recherche par adresse"; //Infobulle de la recherche
	var LocateTooltip = "Localiser"; //Infobulle du localisateur
	
	//Partager:
	var ShareTitle = "Partager cet carte"; //Titre
	var ShareTooltip = "Partager"; //Infobulle du partage
	var EmailTooltip = "Courriel"; //Infobulle du courriel
	
	//Autre boutons de la barre d'outils:
	var GeolocateTooltip = "Géolocalisation"; //Infobulle géolocalisation
	var BasemapTooltip = "Changer la carte de fond"; //Infobulle carte de fond
	var HelpTooltip = "Aide"; //Infobulle aide
	
	//Fenêtre-info et commentaires:
	var CommentsTooltip = "Commentaires"; //Infobulle commentaires
	DetailsTooltip = "Détails"; //Infobulle détailles
	var CommentsTitle = "Commentaires"; //Titre commentaires
	var AddComment = "Ajouter un commentaire"; //Ajouter commentaire
	var EnterComment = "Saisie de commentaire"; //Saisir commentaire
	var SubmitButton = "Soumettre"; //Bouton soumettre
	var CancelButton = "Annuler"; //Bouton Annuler
	
	//Itinéraire:
	DurationLabel = "Durée"; //Étiquette Durée
	DistanceLabel = "Distance totale"; //Étiquette distance
	
	//Générale:
	var CloseTooltip = "Fermer"; //Infobulle Fermer
	HidePanelTooltip = "Cacher le panneau"; //Infobulle Cacher panneau
	ShowPanelTooltip = "Afficher le panneau"; //Infobulle Aficher panneau
	MobileHeader = "Détails du ${0}"; //Titre sur mobile: ${0} seras remplacé avec l'étiquette du bureau de scrutin
	//Texte du bouton pour alterner entre bureaux ordinaires et par anticipation
	SwitchTooltip = "Afficher les "; //(utilisez "Display " ou "Afficher les ")
	PrintTooltip = "Imprimer"; //Infobulle imprimer
	var zoomInAlert = "Effectuez un zoom avant afin de voir les "; //Alerte de zoom avant: l'étiquette des bureau de scrutin seras ajouté automatiquement

	//----NE PAS CHANGER LE CODE CI-DESSOUS--------------------------------------------------------------------
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