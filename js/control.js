let countries = [];
let abb = [];
let c_data = Datamap.prototype.worldTopo.objects.world.geometries;

let dm_countries = c_data.map(function(d){
	console.log(d)
	return {'name': d.properties.name, 'key': d.id};
})

let selected_origin = null;
let selected_dest = null;
console.log(dm_countries)
function loadControlData(){
	$.ajax({
		type: "GET",
		url: "../data/origin_destination/countries.csv",
		dataType: "text",
		success: function(result){
			countries = result.split(',');
			initSelect2();
			// console.log(countries)
		},
		error: function (xhr, status, error) {
		    console.log(status + ': ' + error);
		}
	});
}

function initSelect2(){
	for (let i = 0; i < countries.length; i++){
		for(let j = 0; j < dm_countries.length; j++){
			if(countries[i] == dm_countries[j].name){
				$('#originCountry select').append('<option value="'+dm_countries[j].key+'">'+dm_countries[j].name+'</option>');
				$('#destinationCountry select').append('<option value="'+dm_countries[j].key+'">'+dm_countries[j].name+'</option>');
			}
		}
		// console.log(countries[i])
	}
	$('#originCountry select').select2();
	$('#destinationCountry select').select2();
	$('svg').find('path').each(function(){
		abb.push($(this).attr('class').split(' ')[1])
	})

	console.log(abb.length, countries.length)
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
$('#destinationCountry select').change(function(){
	let key = $(this).val();
	let obj = {};
	obj[key] = '#22A7F0';
	selected_dest = obj;
	// obj = Object.assign(obj, selected_origin);
	map.updateChoropleth(obj)
});
loadControlData();