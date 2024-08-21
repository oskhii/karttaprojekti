//WMTS karttalayerit
var landPolygons = L.tileLayer('http://<IP ADDRESS>/geoserver/gwc/service/wmts?layer=osm_finland%3Aosm_land_polygons&style=&tilematrixset=EPSG%3A3857&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG:3857:{z}&TileCol={x}&TileRow={y}', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});
var landPolygons_dark = L.tileLayer('http://<IP ADDRESS>/geoserver/gwc/service/wmts?layer=osm_finland%3Aland_polygons_dark&style=&tilematrixset=EPSG%3A3857&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG:3857:{z}&TileCol={x}&TileRow={y}', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});
var suomi = L.tileLayer('http://<IP ADDRESS>/geoserver/gwc/service/wmts?layer=osm_finland:osm_layer_group&style=&tilematrixset=EPSG:3857&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/png&TileMatrix=EPSG:3857:{z}&TileCol={x}&TileRow={y}', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});
var suomi_coastline = L.tileLayer('http://<IP ADDRESS>/geoserver/gwc/service/wmts?layer=osm_finland%3Aosm_finland_coastline&style=&tilematrixset=EPSG%3A3857&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG:3857:{z}&TileCol={x}&TileRow={y}', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});
var rekisterikylat = L.tileLayer('http://<IP ADDRESS>/geoserver/gwc/service/wmts?layer=toimivatkoordinaatit%3Arekisterikylat_2013&style=&tilematrixset=EPSG%3A3857&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A3857%3A{z}&TileCol={x}&TileRow={y}', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

/*//WMTS datalayerit, ei käytössä enää
var url = 'http://<IP ADDRESS>/geoserver/aineisto/wms?';

var kylat = L.tileLayer.wms(url, {
    layers: 'aineisto:suomen_kylat',
    format: "image/png",
    opacity: 1.0,
    transparent: "true",
    version: "1.1.0",
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});
var ahaapaikat = L.tileLayer.wms(url, {
    layers: 'aineisto:ahaapaikat',
    format: "image/png",
    opacity: 1.0,
    transparent: "true",
    version: "1.1.0",
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});
var seurakuntarajat = L.tileLayer.wms(url, {
    layers: 'aineisto:seurakuntarajat',
    format: "image/png",
    opacity: 1.0,
    transparent: "true",
    version: "1.1.0",
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});*/

/*//WMS datalayerit, ei käytössä enää
var kylat = L.tileLayer.wms(url, {
    layers: 'aineisto:suomen_kylat',
    transparent: true,
    format: 'image/png'
});
var ahaapaikat = L.tileLayer.wms(url, {
    layers: 'aineisto:ahaapaikat',
    transparent: true,
    format: 'image/png'
});
var seurakuntarajat = L.tileLayer.wms(url, {
    layers: 'aineisto:seurakuntarajat',
    transparent: true,
    format: 'image/png'
});*/

//Määritellään pohjakarttalayerit
var baseMaps =  {
    "Vaalea tausta": landPolygons,
    "Tumma tausta": landPolygons_dark
};

//Määritellään Layer Groupit (täytyy olla määriteltyinä ennen alla olevaa parentGroup/subGroupia)
var kylat = new L.LayerGroup();
var ahaapaikat = new L.LayerGroup();
var aineistot = new L.LayerGroup();
var emptyLayer = new L.LayerGroup();
var suomenkuntajako = new L.LayerGroup();
var seurakuntarajat = new L.LayerGroup();

//Luodaan kartta ja määritellään oletuskoordinaatit, -zoomitaso ja -layerit
var map = L.map('map', {
    center: [60.1720129, 24.9525317],
    zoom: 10,
    maxZoom: 17,
    layers: [landPolygons, suomi]
}), 
    //Määritellään DonutCluster (Donut Cluster pluginin avulla) ja tehdään siitä parentGroup (FeatureGroup.SubGroup pluginin avulla)
    //Tiedostosta leaflet.donutcluster.js kommentoitu pois rivit 197-206
    parentGroup = L.DonutCluster({
    chunkedLoading: true,
    showCoverageOnHover: false
}, {
    //Konfiguroidaan Donut Clusteria
    key: 'title',
    textContent: 'total',
    legendContent: 'value',
    arcColorDict: {
        Kylät: 'red',
        Ahaapaikat: 'blue',
        Aineistot: "green"
    }
}), //Määritellään parentGroupille subGroupeja (FeatureGroup.SubGroup pluginin avulla)
    kylat = L.featureGroup.subGroup(parentGroup),
    ahaapaikat = L.featureGroup.subGroup(parentGroup);
    aineistot = L.featureGroup.subGroup(parentGroup);

//Lisätään parentGroup karttaan (ei vielä sisällä mitään dataa)
parentGroup.addTo(map);

//DivIconit oletuspopupmarkereiden sijaan (.kylat-icon, .ahaapaikat-icon ja .aineistot-icon CSS:ssä)
var kylatDiv = L.divIcon({
    className: "kylat-icon",
    iconSize: null,
    popupAnchor: [12, 0]
});
var ahaapaikatDiv = L.divIcon({
    className: "ahaapaikat-icon",
    iconSize: null,
    popupAnchor: [12, 0]
});
var aineistotDiv = L.divIcon({
    className: "aineistot-icon",
    iconSize: null,
    popupAnchor: [12, 0]
});

//WFS datan parametrit
var owsrootUrl = 'http://<IP ADDRESS>/geoserver/toimivatkoordinaatit/ows';

var defaultParameters = {
    service : 'WFS',
    version : '1.0.0',
    request : 'GetFeature',
    typeName : 'toimivatkoordinaatit:suomen_kylat_PostGIS,toimivatkoordinaatit:ahaapaikat,toimivatkoordinaatit:suomen_kylat_ja_aineistot,toimivatkoordinaatit:suomenkuntajako_2024_10k,toimivatkoordinaatit:seurakuntarajat_PostGIS',
    //JSONP = 'text/javascript', JSON = 'application/json', JSONin kanssa CORS-ongelma
    outputFormat : 'text/javascript',
    format_options : 'callback:getJson',
    SrsName : 'EPSG:4326'
};

var parameters = L.Util.extend(defaultParameters);
var URL = owsrootUrl + L.Util.getParamString(parameters);

//Muuttujat Timelinea varten
var timeline = null;
var timelineControl;

//WFS data request
var WFSLayer = null;
var ajax = $.ajax({
    url : URL,
    dataType : 'jsonp',
    jsonpCallback : 'getJson',
    success : function (response) {
        WFSLayer = L.geoJson(response, {           
            onEachFeature: function (feature, layer) {
                //Jos kyseessä on kylät-tyyppinen data (vain kylät-datassa on "karttapaikka" taulu)
                if (typeof feature.properties.karttapaikka !== 'undefined') {
                    //Määritellään DonutClusterin datatyyppi
                    layer.options.title = 'Kylät';
                    //Luodaan popupit
                    layer.bindPopup("<table>" + 
                                        "<tr>" + 
                                            "<th>" + "Nimi" + "</th>" + 
                                            "<th>" + "Namn" + "</th>" + 
                                        "</tr>" + 
                                        "<tr>" + 
                                            "<td>" + feature.properties.nimi + "</td>" + 
                                            "<td>" + feature.properties.nimi_2 + "</td>" + 
                                        "</tr>" + 
                                    "</table>" + 
                                    "<br>" + 
                                    "Linkki: " + 
                                    '<a href="' + feature.properties.karttapaikka + '" target="_blank">' + feature.properties.karttapaikka + '</a>');
                    //Luodaan tooltipit
                    layer.bindTooltip(feature.properties.nimi, ({
                        offset: [0, 12],
                        direction: "left"
                    }));
                    layer.on("mouseover", function() {
                        this.openTooltip();
                    });
                    layer.on("mouseout", function() {
                        this.closeTooltip();
                    });
                    //Lisätään data kylät layeriin ja lisätään DivIconit markereiksi
                    kylat.addLayer(layer);
                    layer.setIcon(kylatDiv);
                //Jos kyseessä on ahaapaikat-tyyppinen data (vain ahaapaikat-datassa on "pa05" taulu)
                } else if (typeof feature.properties.pa05 !== 'undefined') {
                    //Määritellään DonutClusterin datatyyppi
                    layer.options.title = 'Ahaapaikat';
                    //Luodaan popupit
                    layer.bindPopup("<table>" + 
                                        "<tr>" + 
                                            "<th>" + "Nimi" + "</th>" + 
                                        "</tr>" + 
                                        "<tr>" + 
                                            "<td>" + feature.properties.nimi + "</td>" +  
                                        "</tr>" + 
                                    "</table>" + 
                                    "<br>" + 
                                    "Linkki: " + 
                                    '<a href="' + feature.properties.pa05 + '" target="_blank">' + feature.properties.pa05 + '</a>');
                    //Luodaan tooltipit
                    layer.bindTooltip(feature.properties.nimi, ({
                        offset: [0, 12],
                        direction: "left"
                    }));
                    layer.on("mouseover", function() {
                        this.openTooltip();
                    });
                    layer.on("mouseout", function() {
                        this.closeTooltip();
                    });
                    //Lisätään data ahaapaikat layeriin ja lisätään DivIconit markereiksi
                    ahaapaikat.addLayer(layer);
                    layer.setIcon(ahaapaikatDiv); 
                //Jos kyseessä on aineistot-tyyppinen data (vain aineistot-datassa on "valmistumisajat" taulu)    
                } else if (typeof feature.properties.valmistumisajat !== 'undefined') {
                    //Määritellään DonutClusterin datatyyppi
                    layer.options.title = 'Aineistot';
                    //Luodaan popupit
                    layer.bindPopup("<table>" + 
                                        "<tr>" + 
                                            "<th>" + "Kunta" + "</th>" + 
                                            "<th>" + "Kylä" + "</th>" + 
                                        "</tr>" + 
                                        "<tr>" + 
                                            "<td>" + feature.properties.kunta + "</td>" + 
                                            "<td>" + feature.properties.kyla + "</td>" +  
                                        "</tr>" + 
                                        "</table>" + 
                                    "<br>" + 
                                    '<button class="btn btn-primary" onclick="toTable()">Tutki aineistoja</button>');
                    //Luodaan tooltipit
                    layer.bindTooltip(feature.properties.kyla, ({
                        offset: [0, 12],
                        direction: "left"
                    }));
                    layer.on("mouseover", function() {
                        this.openTooltip();
                    });
                    layer.on("mouseout", function() {
                        this.closeTooltip();
                    });
                    //Lisätään data aineistot layeriin ja lisätään DivIconit markereiksi
                    aineistot.addLayer(layer);
                    layer.setIcon(aineistotDiv);
                //Jos kyseessä on suomen kuntajako-tyyppinen data (vain suomen kuntajako-datassa on "landarea" taulu)
                } else if (typeof feature.properties.landarea !== 'undefined') {
                    suomenkuntajako.addLayer(layer);
                    //Luodaan popupit
                    layer.bindPopup("<table>" + 
                                        "<tr>" + 
                                            "<th>" + "Nimi" + "</th>" + 
                                            "<th>" + "Namn" + "</th>" + 
                                        "</tr>" + 
                                        "<tr>" + 
                                            "<td>" + feature.properties.namefin + "</td>" + 
                                            "<td>" + feature.properties.nameswe + "</td>" + 
                                        "</tr>" + 
                                    "</table>");
                };
                /*//Seurakuntarajat (ennen timelinea), ei käytössä enää
                //Jos kyseessä on seurakuntarajat-tyyppinen data (vain seurakuntarajat-datassa on "Seurakun24" taulu)
                else if (typeof feature.properties.Seurakun24 !== 'undefined') {
                    seurakuntarajat.addLayer(layer);
                    layer.bindPopup("<table>" + 
                                        "<tr>" + 
                                            "<th>" + "Nimi" + "</th>" + 
                                            "<th>" + "Namn" + "</th>" + 
                                        "</tr>" + 
                                        "<tr>" + 
                                            "<td>" + feature.properties.Suomi + "</td>" + 
                                            "<td>" + feature.properties.Ruotsi + "</td>" + 
                                        "</tr>" + 
                                    "</table>" + 
                                    "<br>" + 
                                    "Linkki: " + 
                                    '<a href="' + feature.properties.Seurakun24 + '">' + feature.properties.Seurakun24 + '</a>');
                }*/
            }
        })
        //Seurakuntarajat ja Timeline seurakuntarajat-layerille
        timeline = L.timeline(response, {
            onEachFeature: function (feature, layer) {
                seurakuntarajat.addLayer(layer);
                layer.bindPopup("<table>" + 
                                    "<tr>" + 
                                        "<th>" + "Nimi" + "</th>" + 
                                        "<th>" + "Namn" + "</th>" + 
                                    "</tr>" + 
                                    "<tr>" + 
                                        "<td>" + feature.properties.Suomi + "</td>" + 
                                        "<td>" + feature.properties.Ruotsi + "</td>" + 
                                    "</tr>" + 
                                "</table>");
            }
        });
        //Konfiguroidaan Timelinen slideria
        timelineControl = L.timelineSliderControl({
            steps: 484,
            duration: 24200,
            formatOutput: function (date) {
            return new Date(date).getFullYear();
            }
        });
        //Lisätään seurakuntarajat ja Timeline
        seurakuntarajat.addTo(map);
        timeline.addTo(seurakuntarajat);
        timelineControl.addTo(map);
        timelineControl.addTimelines(timeline);

        //Poistetaan seurakuntarajat ja timeline jos layeri otetaan pois päältä
        function removeTimeline(layer) {
            if (layer === seurakuntarajat) {
                seurakuntarajat.clearLayers();
                timeline.remove();
                timelineControl.remove();
            };
        };
        map.on('overlayremove', function (event) {
            removeTimeline(event.layer);
        });

        //Lisätään seurakuntarajat ja timeline takaisin jos layeri laitetaan takaisin päälle
        function addTimeline(layer) {
            if (layer === seurakuntarajat) {
                timeline.addTo(seurakuntarajat);
                timelineControl.addTo(map);
            };
        };
        map.on('overlayadd', function (event) {
            addTimeline(event.layer);
        });
    }
});

/*//Lisää ja poistaa karttalayerin zoomaustason mukaan
map.on("zoomend", function() {
    var zoomlevel = map.getZoom();
    if (zoomlevel < 11) {
        if (map.hasLayer(rekisterikylat)) {
            map.removeLayer(rekisterikylat);
        };
    };
    if (zoomlevel >= 11) {
        if (map.hasLayer(rekisterikylat)) {
            //console.log("layer already added");
        } else {
            map.addLayer(rekisterikylat);
        };
    };
    console.log("Current Zoom Level = " + zoomlevel);
});*/

//Datataulukkoon siirtymiseeen
function toTable() {
    var show = document.getElementById("data");
    show.style.display = "block";
    show.scrollIntoView();
};
//Sivun yläosaan siirtymiseeen
function toTop() {
    document.getElementById("top").scrollIntoView();
};

//Luodaan taulukko popupin datan perusteella
map.on('popupopen', function(e) {
    var kunta = e.popup._source.feature.properties.kunta;
    var kyla = e.popup._source.feature.properties.kyla;
    var nimet = e.popup._source.feature.properties.nimet;
    var valmistumisajat = e.popup._source.feature.properties.valmistumisajat;
    var tekijat = e.popup._source.feature.properties.tekijat;
    var aineistoId = e.popup._source.feature.properties.aineistot;
    var kuva = e.popup._source.feature.properties.ensimmainen_kuva; 

    //Jos kyseessä on aineistot-tyyppinen data (vain aineistot-datassa on "nimet" taulu)
    if (typeof nimet !== 'undefined') {
        //Tyhjennetään taulukon data enen uuden lisäämistä
        $("#tbodyId").empty();
        //Lisätään paikannimet taulukkoon
        document.getElementById("kunta").innerHTML = kunta;
        document.getElementById("kyla").innerHTML = kyla;

        var tbody = document.getElementById("tbodyId");

        //Jaetaan aineistot-datan teosten nimet "; " kohdalla
        var nimetSplit = nimet.split(/;(?! )/);
        var index = 0;

        //Lisätään taulukkoon dataa niin kauan kun sitä riittää
        while (index < nimetSplit.length) {
            var row = tbody.insertRow();
            var nimetTable = row.insertCell(0);
            var valmistumisajatTable = row.insertCell(1);
            var tekijatTable = row.insertCell(2);
            var linkkiTable = row.insertCell(3);

            //Lisätään teosten nimet data taulukkoon
            nimetTable.textContent = nimetSplit[index];

            //Jos aineisto sisältää valmistumisajan
            if (valmistumisajat !== null) {
                //Jaetaan aineistot-datan valmistumisajat ";" kohdalla
                var valmistumisajatSplit = valmistumisajat.split(";");

                //Lisätään valmistumisaika taulukkoon
                valmistumisajatTable.textContent = valmistumisajatSplit[index];
            };
            //Jos aineisto sisältää tekijän
            if (tekijat !== null) {
                //Jaetaan aineistot-datan tekijät ";" kohdalla
                var tekijatSplit = tekijat.split(";");

                //Lisätään tekijä taulukkoon
                tekijatTable.textContent = tekijatSplit[index];
            };
            /*//Jos aineisto sisältää kuvan
            if (kuva !== null) {
                //Jaetaan aineistot-datan kuvat ja aineistoID:t ";" kohdalla
                var kuvaSplit = kuva.split(";");
                var aineistoIdSplit = aineistoId.split(";");

                //Jos aineisto sisältää kuvan (tarvitaan, muuten linkki lisätään taulukkoon ilman "kuvaSplit" ja "aineistoIdSplit" arvoja)
                if (typeof kuvaSplit[index] !== 'undefined') {
                    //Luodaan linkki kuvaan
                    var linkki = "https://astia.narc.fi/uusiastia/getFile.php?fileId=" + kuvaSplit[index] + "&aineistoId=" + aineistoIdSplit[index];
                    //Lisätään linkki taulukkoon
                    linkkiTable.innerHTML = '<a href ="' + linkki + '">Katso kuva</a>';
                }
            };*/
            //Jaetaan aineistot-datan aineistoID:t ";" kohdalla
            var aineistoIdSplit = aineistoId.split(";");
            //Luodaan linkki aineistoon
            var linkki = "https://astia.narc.fi/uusiastia/kortti_aineisto.html?id="+ aineistoIdSplit[index];
            //Lisätään linkki taulukkoon
            linkkiTable.innerHTML = '<a href="' + linkki + '" target="_blank">Katso aineisto</a>';

            index++;
        };
    };
});

//Järjestää taulukon nousevasti tai laskevasti nimen, vuoden tai tekijän mukaan, kun taulukon nappeja painaa
function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("tableId");
    switching = true;
    //Set the sorting direction to ascending:
    dir = "asc";
    //Make a loop that will continue until no switching has been done:
    while (switching) {
        //Start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        //Loop through all table rows (except the first, which contains table headers):
        for (i = 1; i < (rows.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            //Get the two elements you want to compare, one from current row and one from the next:
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            //Check if the two rows should switch place, based on the direction, asc or desc:
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                };
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    //If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                };
            };
        };
        if (shouldSwitch) {
            //If a switch has been marked, make the switch and mark that a switch has been done:
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            //Each time a switch is done, increase this count by 1:
            switchcount ++;
        } else {
            //If no switching has been done AND the direction is "asc", set the direction to "desc" and run the while loop again:
            if (switchcount == 0 && dir == "asc") {
            dir = "desc";
            switching = true;
            };
        };
    };
};

//Grouped overlays (GroupedLayerControl pluginin avulla)
var groupedOverlays = {
    "Rantaviivat": {
        "Pois": suomi,
        "Päällä": suomi_coastline,
    },
    "Rajat": {
        "Ei mitään": emptyLayer,
        "Seurakuntarajat": seurakuntarajat,
        "Suomen kuntajako": suomenkuntajako,
    },
    "Data": {
        "Suomen kylät": kylat,
        "Ahaapaikat": ahaapaikat,
        "Aineistot": aineistot,
        "Rekisterikylät": rekisterikylat,
    }
};

var options = {
  //Make the group exclusive (use radio inputs)
  exclusiveGroups: ["Rantaviivat", "Rajat"],
  //Show a checkbox next to non-exclusive group labels for toggling all
  groupCheckboxes: true
};

L.control.groupedLayers(baseMaps, groupedOverlays, options).addTo(map);

/*var kansallisarkisto = L.marker([60.1720129, 24.9525317]).addTo(map);
kansallisarkisto.bindPopup("<b>Kansallisarkisto</b>").openPopup();*/
