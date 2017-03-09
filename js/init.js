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
    country_id_request.open('GET', '../data/origin_destination/countries.csv');
    country_id_request.onreadystatechange = function() {
        if(country_id_request.readyState === XMLHttpRequest.DONE && country_id_request.status === 200) {
            countries = country_id_request.responseText.split(",");
        }
    }
    country_id_request.send();
    
    // Reading 'countries.csv' file from the FileSystem
    var countries_request = new XMLHttpRequest();
    countries_request.open('GET', '../data/origin_destination/countries_id.csv');
    countries_request.onreadystatechange = function() {
        if(countries_request.readyState === XMLHttpRequest.DONE && countries_request.status === 200) {
            countries_id = countries_request.responseText.split(",");
            createCountriesHashtable();
        }
    }
    countries_request.send();
    
    // Reading 'countries.csv' file from the FileSystem
    var immigrants_request = new XMLHttpRequest();
    immigrants_request.open('GET', '../data/origin_destination/1990_t.csv');
    immigrants_request.onreadystatechange = function() {
        if(immigrants_request.readyState === XMLHttpRequest.DONE && immigrants_request.status === 200) {
            data_1990_input = immigrants_request.responseText;
            createImmigrantsArray();
        }
    }
    immigrants_request.send();
    
}

function createCountriesHashtable() {
    hash_countries = {};
    countries_id.forEach(function(d, i) {
        hash_countries[d] = i;
    });
    
    hash_ids = {};
    countries_id.forEach(function(d, i) {
        hash_ids[i] = d;
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
    
    var data_1990_rows = data_1990_input.split('\n');
    var data_1990_columns;
    for (var i = 0; i < data_1990_rows.length; i++) {
        data_1990_columns = data_1990_rows[i].split(',');
        for (var j = 0; j < data_1990_columns.length; j++) {
            data_1990[i][j] = data_1990_columns[j];
        }
    }
}

function loadBubbles(country_id) {
    map.bubbles([]);
    
    var dest_immigrants = data_1990[country_id];
    var bubbles = [];
    for (var i = 0; i < dest_immigrants.length; i++) {
        if (dest_immigrants[i] > 0 && hash_ids[i] != -1) {
            var radius = Math.random() * 20;
            var item = {};
            item["name"] = 'name' + i;
            item["radius"] = radius;
            item["centered"] = hash_ids[i];
            bubbles.push(item);
        }
    }
    
    map.bubbles(bubbles);
}