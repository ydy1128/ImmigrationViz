// Variables
var map;
var countries_input = '';
var countries_id_input = '';
var countries;
var countries_id;
var hash_countries;
var hash_ids;
var data_1990_input;
var data_1990;
var barchart_svg;
var xscale;
var yscale;
var barchart_g;
var barchart_height;
var barchart_width;
var barchart_xaxis;
var barchart_yaxis;
var bars;
var all_countries = [];

// All these code will only be executed once the DOM it completely loaded
$(document).ready(function(){
    // Initializing map
    map = new Datamap({
        element: document.getElementById('mapContainer'),
        fills: {
            defaultFill: '#ABDDA4',
        },
        bubblesConfig: {
            borderColor: '#555555'
        },
        done: function(datamap) {
            datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
                loadBubbles(hash_countries[geography.id]);
            });
        }
    });
    
    // Loading and preprocessing data
    loadData();
});


// Loads the immigration data from the FileSystem
function loadData() {
    // Reading 'countries_id.csv' file from the FileSystem
    var country_id_request = new XMLHttpRequest();
    country_id_request.open('GET', '../data/origin_destination/countries.csv', false);
    country_id_request.onreadystatechange = function() {
        if(country_id_request.readyState === XMLHttpRequest.DONE && country_id_request.status === 200) {
            countries = country_id_request.responseText.split(",");
        }
    }
    country_id_request.send();
    
    // Reading 'countries.csv' file from the FileSystem
    var countries_request = new XMLHttpRequest();
    countries_request.open('GET', '../data/origin_destination/countries_id.csv', false);
    countries_request.onreadystatechange = function() {
        if(countries_request.readyState === XMLHttpRequest.DONE && countries_request.status === 200) {
            countries_id = countries_request.responseText.split(",");
            createCountriesHashtable();
            // Create all countries json array
            createAllCountries();
        }
    }
    countries_request.send();
    
    // Reading 'countries.csv' file from the FileSystem
    var immigrants_request = new XMLHttpRequest();
    immigrants_request.open('GET', '../data/origin_destination/1990_t.csv', false);
    immigrants_request.onreadystatechange = function() {
        if(immigrants_request.readyState === XMLHttpRequest.DONE && immigrants_request.status === 200) {
            data_1990_input = immigrants_request.responseText;
            createImmigrantsArray();
        }
    }
    immigrants_request.send();
    
}

function createCountriesHashtable() {
    // Creating hash
    hash_countries = {};
    countries_id.forEach(function(d, i) {
        hash_countries[d] = i;
    });
}

function createImmigrantsArray() {
    // Constant
    var size = 232;
    
    // Initializing data for 1990
    data_1990 = new Array(size);
    for (var i = 0; i < size; i++) {
      data_1990[i] = new Array(size);
    }
    
    // Loading data
    var data_1990_rows = data_1990_input.split('\n');
    var data_1990_columns;
    for (var i = 0; i < data_1990_rows.length; i++) {
        data_1990_columns = data_1990_rows[i].split(',');
        for (var j = 0; j < data_1990_columns.length; j++) {
            data_1990[i][j] = data_1990_columns[j];
        }
    }
}

function createAllCountries() {
    for (var i = 0; i < countries.length; i++) {
        var item = {};
        item["id"] = i;
        item["name"] = countries[i];
        item["radius"] = 0;
        item["centered"] = countries_id[i];
        all_countries.push(item);
    }
}

function loadBubbles(country_id) {
    // Cleaning current bubbles
    map.bubbles([]);

    // Setting up new bubbles    
    var dest_immigrants = data_1990[country_id];
    var bubbles = [];
    for (var i = 0; i < dest_immigrants.length; i++) {
        if (dest_immigrants[i] > 0 && countries_id[i] != -1) {
            var item = {};
            
            // Creating json object corresponding to each bubble
            item["id"] = i;
            item["name"] = countries[i];
            item["radius"] = Math.random() * 20;
            item["centered"] = countries_id[i];
            bubbles.push(item);
        }
    }
    
    map.bubbles(bubbles);
    loadBarChart(bubbles);
    //updateAllCountries(data);
}

function updateAllCountries(data){
    for (var i = 0; i < all_countries.length; i++) {
        all_countries[i].radius = 0;
    }
    
    for (var i = 0; i < data.length; i++) {
        var id = data[i].id;
        all_countries[id].radius = data[i].radius;
    }
}
