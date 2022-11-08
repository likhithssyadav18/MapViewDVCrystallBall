
var markers=[];
var data1;
var path;
var data2;
// Create data: coordinates of start and end
// var link = {type: "LineString", coordinates: [[21, 41], [11, 45]]} // Change these data to see ho the great circle reacts
document.addEventListener('DOMContentLoaded', function () {
   // Hint: create or set your svg element inside this function
   //start timer
     
  

   // This will load your two CSV files and store them into two arrays.
     Promise.all([d3.csv('mockdata.csv'),d3.json("custom.geo.json")])
        .then(function (values) {
            data1=values[0];
            data2=values[1];
              
              console.log(data1,values[1]);
               data1.forEach(function (a) {
                markers.push({"long":a.Longitude,"lat":a.Latitude});
            });
               geomap();
            
    });
     
  
     
});


function geomap()
{
  console.log(markers);
  var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

// Map and projection
var projection = d3.geoMercator()
  .fitSize([width, height], data2)

  path = d3.geoPath().projection(projection)
  
  svg.append("g")
    .selectAll("path")
    .data(data2.features)
    .enter().append("path")
    .attr("fill", "#b8b8b8")
    .attr("d", d3.geoPath()
      .projection(projection)
    )
    .style("stroke", "#fff")
    .style("stroke-width", 1)

  svg.selectAll(".m")
    .data(markers)
    .enter()
    .append("image")
    .attr('width', 20)
    .attr('height', 20)
    .attr("xlink:href", 'https://cdn3.iconfinder.com/data/icons/softwaredemo/PNG/24x24/DrawingPin1_Blue.png')
    .attr("transform", (d) => {
      let p = projection([d.long,d.lat]);
        return `translate(${p[0]-10}, ${p[1]-10})`;
     });
}


// Load world shape
