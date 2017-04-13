// Variables
var circlesmap;
var textmap;
var barsmap;
var colormap;
var textmap;
var countries_input = '';
var countries_id_input = '';
var countries;
var countries_id;
var hash_countries;
var hash_ids;

var data_1990_input;
var data_1995_input;
var data_2000_input;
var data_2005_input;
var data_2010_input;
var data_2015_input;
var data_all = {};



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

var selected_source = '';
var selected_year = '';

// All these code will only be executed once the DOM it completely loaded
$(document).ready(function(){
    // Initializing map
    circlesmap = new Datamap({
        element: document.getElementById('circlesMapContainer'),
        fills: {
            defaultFill: '#ABDDA4',
        },
        bubblesConfig: {
            borderColor: '#555555',
            popupTemplate: function(geography, data){
                // console.log(data.data)
                return '<div class="hoverinfo"><h6><strong>'+data.name+'</strong></h4><p>'+data.data+'</p></div>';
            }
        },
        done: function(datamap) {
            datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
                if(selected_year == ''){
                    console.log('year not selected')
                }
                else{
                    selected_source = hash_countries[geography.id];
                    loadBubbles(hash_countries[geography.id], selected_year);
                }
            });
        }
    });
    barsmap = new Datamap({
        element: document.getElementById('barsMapContainer'),
        fills: {
            defaultFill: '#ABDDA4',
        },
        bubblesConfig: {
            borderColor: '#555555',
            popupTemplate: function(geography, data){
                // console.log(data.data)
                return '<div class="hoverinfo"><h6><strong>'+data.name+'</strong></h4><p>'+data.data+'</p></div>';
            }
        },
        done: function(datamap) {
            datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
               if(selected_year == ''){
                    console.log('year not selected')
                }
                else{
                    selected_source = hash_countries[geography.id];
                    loadBars(hash_countries[geography.id], selected_year);
                }
            });
        }
    });
    colormap = new Datamap({
        element: document.getElementById('colorMapContainer'),
        fills: {
            defaultFill: '#ABDDA4',
        },
        bubblesConfig: {
            borderColor: '#555555',
            popupTemplate: function(geography, data){
                return '<div class="hoverinfo"><h6><strong>'+data.name+'</strong></h4><p>'+data.data+'</p></div>';
            }
        },
        done: function(datamap) {
            datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
               if(selected_year == ''){
                    console.log('year not selected')
                }
                else{
                    selected_source = hash_countries[geography.id];
                    loadColors(hash_countries[geography.id], selected_year);
                }
            });
        }
    });
    textmap = new Datamap({
        element: document.getElementById('textMapContainer'),
        fills: {
            defaultFill: '#ABDDA4',
        },
        bubblesConfig: {
            borderColor: '#555555',
            popupTemplate: function(geography, data){
                // console.log(data.data)
                return '<div class="hoverinfo"><h6><strong>'+data.name+'</strong></h4><p>'+data.data+'</p></div>';
            }
        },
        done: function(datamap) {

            datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
                if(selected_year == ''){
                    console.log('year not selected')
                }
                else{
                    selected_source = hash_countries[geography.id];
                    loadNumbers(hash_countries[geography.id], selected_year);
                }

            });
        }
    });
    // Loading and preprocessing data
    loadData();
    // $('.map-container').not('.active').hide()
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
            createImmigrantsArray('1990');
        }
    }
    immigrants_request.send();


    var immigrants_request = new XMLHttpRequest();
    immigrants_request.open('GET', '../data/origin_destination/1995_t.csv', false);
    immigrants_request.onreadystatechange = function() {
        if(immigrants_request.readyState === XMLHttpRequest.DONE && immigrants_request.status === 200) {
            data_1995_input = immigrants_request.responseText;
            createImmigrantsArray('1995');
        }
    }
    immigrants_request.send();


    var immigrants_request = new XMLHttpRequest();
    immigrants_request.open('GET', '../data/origin_destination/2000_t.csv', false);
    immigrants_request.onreadystatechange = function() {
        if(immigrants_request.readyState === XMLHttpRequest.DONE && immigrants_request.status === 200) {
            data_2000_input = immigrants_request.responseText;
            createImmigrantsArray('2000');
        }
    }
    immigrants_request.send();


    var immigrants_request = new XMLHttpRequest();
    immigrants_request.open('GET', '../data/origin_destination/2005_t.csv', false);
    immigrants_request.onreadystatechange = function() {
        if(immigrants_request.readyState === XMLHttpRequest.DONE && immigrants_request.status === 200) {
            data_2005_input = immigrants_request.responseText;
            createImmigrantsArray('2005');
        }
    }
    immigrants_request.send();


    var immigrants_request = new XMLHttpRequest();
    immigrants_request.open('GET', '../data/origin_destination/2010_t.csv', false);
    immigrants_request.onreadystatechange = function() {
        if(immigrants_request.readyState === XMLHttpRequest.DONE && immigrants_request.status === 200) {
            data_2010_input = immigrants_request.responseText;
            createImmigrantsArray('2010');
        }
    }
    immigrants_request.send();


    var immigrants_request = new XMLHttpRequest();
    immigrants_request.open('GET', '../data/origin_destination/2015_t.csv', false);
    immigrants_request.onreadystatechange = function() {
        if(immigrants_request.readyState === XMLHttpRequest.DONE && immigrants_request.status === 200) {
            data_2015_input = immigrants_request.responseText;
            createImmigrantsArray('2015');
        }
    }
    immigrants_request.send();


    hideOtherMaps();
}

function hideOtherMaps(){
    $('.map-container').not('#circlesMapContainer').hide();
}

function createCountriesHashtable() {
    // Creating hash
    hash_countries = {};
    countries_id.forEach(function(d, i) {
        hash_countries[d] = i;
    });
}

function createImmigrantsArray(year) {
    // Constant
    var size = 232;
    var temp_data = [];
    var temp_data_rows;
    var temp_data_columns;

    // Loading data
    switch(year){
        case '1990':
            temp_data_rows = data_1990_input.split('\n');
            break;
        case '1995':
            temp_data_rows = data_1995_input.split('\n');
            break;
        case '2000':
            temp_data_rows = data_2000_input.split('\n');
            break;
        case '2005':
            temp_data_rows = data_2005_input.split('\n');
            break;
        case '2010':
            temp_data_rows = data_2010_input.split('\n');
            break;
        case '2015':
            temp_data_rows = data_2015_input.split('\n');
            break;
    }
    for (var i = 0; i < temp_data_rows.length; i++) {
        var temp_array = [];
        temp_data_columns = temp_data_rows[i].split(',');
        for (var j = 0; j < temp_data_columns.length; j++) {
            temp_array.push(temp_data_columns[j])
        }
        temp_data.push(temp_array);
    }
    data_all[year] = temp_data;
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

function loadBubbles(country_id, year) {
    // Cleaning current bubbles
    circlesmap.bubbles([]);

    // Setting up new bubbles    
    var dest_immigrants = data_all[year][country_id];
    var text_labels = {};
    var color_labels = {};

    var bubbles = [];
    for (var i = 0; i < dest_immigrants.length; i++) {
        if (dest_immigrants[i] > 0 && countries_id[i] != -1) {
            var item = {};
            
            // Creating json object corresponding to each bubble
            item["id"] = i;
            item["name"] = countries[i];
            item["radius"] = dest_immigrants[i] / 20000;
            item["centered"] = countries_id[i];
            item['data'] = dest_immigrants[i];
            bubbles.push(item);
            text_labels[countries_id[i]] = dest_immigrants[i];
        }
    }

    // color_labels[countries_id[country_id]] = '#89C4F4';
    // circlesmap.updateChoropleth(color_labels, {reset: true})

    circlesmap.bubbles(bubbles);
}
function loadBars(country_id, year){
    var dest_immigrants = data_all[year][country_id];
    var text_labels = {};

    d3.selectAll('#barsMapContainer .data-bars').remove();

    barsmap.labels();
    d3.selectAll('#barsMapContainer .labels text').text(function(){
        var key = d3.select(this).text();
        var elem = d3.select(this);
        countries_id.forEach(function(t, i){
            if(key == t && dest_immigrants[i] != 0){
                var h = dest_immigrants[i] / 5000;
                var position1 = elem.attr('x');
                var position2 = elem.attr('y');
                d3.select('#barsMapContainer .datamap').append('rect')
                .classed('data-bars', true)
                .attr('x', position1).attr('y', position2)
                .attr('height', h).attr('width', 10)
                .attr("transform", "translate(0,"+-h+")")
                .style('fill', 'red')
                console.log(key,position1, position2)
                console.log(dest_immigrants[i])
            }
        })
        return '';
    })
}

function loadColors(country_id, year){
    var dest_immigrants = data_all[year][country_id];
    var color_labels = {};

    for (var i = 0; i < dest_immigrants.length; i++) {
        if (dest_immigrants[i] > 0 && countries_id[i] != -1) {
            var hue1 = dest_immigrants[i] / 2000 + 171;
            var hue2 = 221 - dest_immigrants[i] / 900;
            var hue3 = 164 - dest_immigrants[i] / 1000;

            console.log(hue1, hue2, hue3);
            var new_color = 'rgb('+hue1+', '+hue2+', '+hue3+')'
            color_labels[countries_id[i]] = new_color;
            // lines[countries_id[i]] = 30;
        }
    }
    colormap.updateChoropleth(color_labels, {reset: true})
}

function loadNumbers(country_id, year){
    var dest_immigrants = data_all[year][country_id];
    var text_labels = {};
    var lines = {};

    d3.selectAll('#textMapContainer .labels text').text('');

    for (var i = 0; i < dest_immigrants.length; i++) {
        if (dest_immigrants[i] > 0 && countries_id[i] != -1) {
            console.log(dest_immigrants[i])
            text_labels[countries_id[i]] = dest_immigrants[i];
            lines[countries_id[i]] = 30;
        }
    }
    textmap.labels({'customLabelText': text_labels} );

    d3.selectAll('#textMapContainer .labels text')
        .text(function(){
            var d = d3.select(this).text();
            if(isNaN(parseInt(d))){
                return '';
            }
            else{
                if(parseInt(d) > 0){
                    return d;
                }
            }
        });

    d3.select('#textMapContainer .labels').classed('labels-appended', true);
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
