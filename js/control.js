let control_countries = [];
let abb = [];
let c_data = Datamap.prototype.worldTopo.objects.world.geometries;

let dm_countries = c_data.map(function(d){
	return {'name': d.properties.name, 'key': d.id};
})

let selected_origin = null;
let selected_dest = null;
let years = ['1990', '1995', '2000', '2005', '2010', '2015'];

// $('#yearSelected select').change(function(){
// 	console.log($(this).val())
// 	selected_year = $(this).val();
// 	if(selected_source == ''){
// 		console.log('source not selected')
// 	}
// 	else{
// 		loadBubbles(selected_source, selected_year)
// 	}
// })

$('#changeMap li').click(function(){
	let id = $(this).attr('id');
	let map_id = id.toLowerCase() + 'MapContainer';
	console.log(map_id)

	$('#changeMap li').removeClass('active');
	$(this).addClass('active')

	$('.map-container').removeClass('active');
	$('#'+map_id).addClass('active');
	$('.map-container').hide();

	$('#'+map_id).show();

})

//console.log(dm_countries)
function loadControlData(){
	$.ajax({
		type: "GET",
		url: "../data/origin_destination/countries.csv",
		dataType: "text",
		success: function(result){
			control_countries = result.split(',');
			initSelect2();
			// console.log(countries)
		},
		error: function (xhr, status, error) {
		    console.log(status + ': ' + error);
		}
	});
}

function initSelect2(){
	for (let i = 0; i < control_countries.length; i++){
		for(let j = 0; j < dm_countries.length; j++){
			if(control_countries[i] == dm_countries[j].name){
				$('#originCountry select').append('<option value="'+dm_countries[j].key+'">'+dm_countries[j].name+'</option>');
			}
		}
		// console.log(countries[i])
	}
	for(let i = 0; i < years.length; i++){
		$('#yearSelected select').append('<option value="'+years[i]+'">'+years[i]+'</option>');
	}
	$('#originCountry select').select2();
	$('#yearSelected select').select2();
	$('svg').find('path').each(function(){
		abb.push($(this).attr('class').split(' ')[1])
	})

	//console.log(abb.length, control_countries.length)
	// for(let i = 0; i < abb.length; i++){

	// }
}
// #d64d61
$('#originCountry select').change(function(){
	let key = $(this).val();
	let obj = {};
	obj[key] = '#EF4836';
	selected_origin = obj;
	// obj = Object.assign(obj, selected_dest);
	map.updateChoropleth(obj)
});
loadControlData();