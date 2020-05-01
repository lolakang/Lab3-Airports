var mymap = L.map('map', {
    center: [39.23,-96.62],
    zoom: 4.5,
    maxZoom: 10,
    minZoom: 3,
    detectRetina: true // detect whether the sceen is high resolution or not.
});

// 2. Add a base map.
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(mymap);

// 3. Add cell towers GeoJSON Data
// Null variable that will hold cell tower data
var airports = null;
// Get GeoJSON and put on it on the map when it loads

// 4. build up a set of colors from colorbrewer's dark2 category
var colors = chroma.scale('dark2').mode('lch').colors(2);

// 5. dynamically append style classes to this page. This style classes will be used for colorize the markers.
for (i = 0; i < 2; i++) {
    $('head').append($("<style> .marker-color-" + (i + 1).toString() + " { color: " + colors[i] + "; font-size: 15px; text-shadow: 0 0 3px #ffffff;} </style>"));
}

airports= L.geoJson.ajax("assets/airports.geojson", {
    // assign a function to the onEachFeature parameter of the cellTowers object.
    // Then each (point) feature will bind a popup window.
    // The content of the popup window is the value of `feature.properties.company`
    onEachFeature: function (feature, layer) {
        layer.bindPopup(feature.properties.AIRPT_NAME);
    },
    pointToLayer: function (feature,latlng) {
        var id = 0;
        if (feature.properties.CNTL_TWR == "Y") { id = 0; }
        else if (feature.properties.CNTL_TWR == "N")  { id = 1; }
        else {id = 2; }
        //<i class="fas fa-broadcast-tower"></i>
        return L.marker(latlng, {icon: L.divIcon({className: 'fa fa-plane marker-color-' + (id + 1).toString() })});
    },
    attribution: 'Airports Data &copy; Data.gov | US-States &copy; Mike Bostock of D3 | Base Map &copy; CartoDB.DarkMatter | Made By Le Kang'
}).addTo(mymap);

// 6. Set function for color ramp
    colors = chroma.scale('YlGnBu').colors(5); //colors = chroma.scale('OrRd').colors(5);

    function setColor(count) {
        var id = 0;
        if (count > 100) { id = 4; }
        else if (count > 30 && count <= 100) { id = 3; }
        else if (count > 10 && count <= 30) { id = 2; }
        else if (count > 0 &&  count <= 10) { id = 1; }
        else  { id = 0; }
        return colors[id];
    }


    // 7. Set style function that sets fill color.md property equal to cell tower density
    function style(feature) {
        return {
            fillColor: setColor(feature.properties.count),
            fillOpacity: 0.4,
            weight: 1,
            opacity: 1,
            color: '#b4b4b4',
            dashArray: '4'
        };
    }

    // 8. Add county polygons
    // create counties variable, and assign null to it.
    var states = null;
    states = L.geoJson.ajax("assets/us-states.geojson", {
        style: style
    }).addTo(mymap);

    var legend = L.control({position: 'topright'});

        // 10. Function that runs when legend is added to map
        legend.onAdd = function () {

            // Create Div Element and Populate it with HTML
            var div = L.DomUtil.create('div', 'legend');
            div.innerHTML += '<b><p># Airport</p></b><br />';
            div.innerHTML += '<i style="background: ' + colors[4] + '; opacity: 0.5"></i><p>100+</p>';
            div.innerHTML += '<i style="background: ' + colors[3] + '; opacity: 0.5"></i><p>30-100</p>';
            div.innerHTML += '<i style="background: ' + colors[2] + '; opacity: 0.5"></i><p>10-30</p>';
            div.innerHTML += '<i style="background: ' + colors[1] + '; opacity: 0.5"></i><p> 0-10</p>';
            div.innerHTML += '<i style="background: ' + colors[0] + '; opacity: 0.5"></i><p> 0</p>';
            div.innerHTML += '<hr><b><p>Air Traffic Control Tower</p><b><br />';
            div.innerHTML += '<i class="fa fa-plane marker-color-1"></i><p> Yes</p>';
            div.innerHTML += '<i class="fa fa-plane marker-color-2"></i><p> No</p>';
            // Return the Legend div containing the HTML content
            return div;
        };

        // 11. Add a legend to map
        legend.addTo(mymap);

        // 12. Add a scale bar to map
        L.control.scale({position: 'bottomleft'}).addTo(mymap);
