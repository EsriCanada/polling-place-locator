/*FRANÇAIS
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
	//Les valeurs suivante ainsi que ceux du fichier config.js et errormessages.xml peuvent être changés de modifier le texte fixe de l’application
	//Recherche par addresse:
	SearchTitle: "Recherche par adresse", //Titre
	SearchTooltip: "Recherche par adresse", //Infobulle de la recherche
	LocateTooltip: "Localiser", //Infobulle du localisateur
	
	//Partager:
	ShareTitle: "Partager cet carte", //Titre
	ShareTooltip: "Partager", //Infobulle du partage
	EmailTooltip: "Courriel", //Infobulle du courriel
	
	//Autre boutons de la barre d'outils:
	GeolocateTooltip: "Géolocalisation", //Infobulle géolocalisation
	BasemapTooltip: "Changer la carte de fond", //Infobulle carte de fond
	HelpTooltip: "Aide", //Infobulle aide
	
	//Fenêtre-info et commentaires:
	CommentsTooltip: "Commentaires", //Infobulle commentaires
	DetailsTooltip: "Détails", //Infobulle détailles
	CommentsTitle: "Commentaires", //Titre commentaires
	AddComment: "Ajouter un commentaire", //Ajouter commentaire
	EnterComment: "Saisie de commentaire", //Saisir commentaire
	SubmitButton: "Soumettre", //Bouton soumettre
	CancelButton: "Annuler", //Bouton Annuler
	
	//Itinéraire:
	DurationLabel: "Durée", //Étiquette Durée
	DistanceLabel: "Distance totale", //Étiquette distance
	
	//Générale:
	CloseTooltip: "Fermer", //Infobulle Fermer
	HidePanelTooltip: "Cacher le panneau", //Infobulle Cacher panneau
	ShowPanelTooltip: "Afficher le panneau", //Infobulle Aficher panneau
	MobileHeader: "Détails du ${0}", //Titre sur mobile: ${0} seras remplacé avec l'étiquette du bureau de scrutin
	//Texte du bouton pour alterner entre bureaux ordinaires et par anticipation
	SwitchTooltip: "Afficher les ", //(utilisez "Display " ou "Afficher les ")
	PrintTooltip: "Imprimer", //Infobulle imprimer
	zoomInAlert: "Effectuez un zoom avant afin de voir les " //Alerte de zoom avant: l'étiquette des bureau de scrutin seras ajouté automatiquement
});