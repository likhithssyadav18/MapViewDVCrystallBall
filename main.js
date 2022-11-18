
var markers=[];
var data1;
var path;
var data2;
var svg;
// Create data: coordinates of start and end
// var link = {type: "LineString", coordinates: [[21, 41], [11, 45]]} // Change these data to see ho the great circle reacts
document.addEventListener('DOMContentLoaded', function () {
   // Hint: create or set your svg element inside this function
   //start timer
     
  

   // This will load your two CSV files and store them into two arrays.
     Promise.all([d3.csv('mockdata.csv'),d3.json("world-topo.json")])
        .then(function (values) {
            data1=values[0];
            data2=values[1];
              
              //console.log(data1,values[1]);
               data1.forEach(function (a) {
                markers.push({"long":a.Longitude,"lat":a.Latitude});
            });
               geomap();
            
    });
     
  
     
});

function zoomed(e) {
  // mapLayer is a g element
  svg.attr("transform", e.transform);
}

function geomap()
{
  //console.log(markers);

   var width=400;
  var height = 500;
  let zoom = d3.zoom()
  .scaleExtent([0, 7])
  .translateExtent([[-200, 0], [width+300, height]])
  .on('zoom', zoomed);

  svg = d3.select("#my_dataviz").attr('id', 'map').call(zoom).append("g");
 


  //var height = 500;

// Map and projection
// var projection = d3.geoMercator()
//   .fitSize([width, height], data2)

//   path = d3.geoPath().projection(projection)
  
//   svg.append("g")
//     .selectAll("path")
//     .data(data2.features)
//     .enter().append("path")
//     .attr("fill", "#b8b8b8")
//     .attr("d", d3.geoPath()
//       .projection(projection)
//     )
//     .style("stroke", "#fff")
//     .style("stroke-width", 1)
var projection = d3.geoEquirectangular()
        .scale(170)
        .translate([width / 2, height / 2]);

    var geoPath = d3.geoPath()
        .projection(projection);
    
        
         svg.append("g")
            .selectAll("path")
            .data( topojson.feature(data2, data2.objects.countries).features)
            .enter()
            .append("path")
            .attr( "d", geoPath )
            .attr("class","country");  
        
    


  //radius = Math.min(width, height) / 2;

    var color=["#4169e1","#1e90ff","#87cefa","#87ceeb","#b0c4de"]
    var arc = d3.arc()
      .outerRadius(15)
      .innerRadius(8);

    var pie = d3.pie()
      .sort(null)
      .value(function(d) { return d.count; });
    
    var points = svg.selectAll("g")
    .data(data1)
    .enter()
    .append("g")
    .attr("transform",function(d) { 
      //console.log(d.Latitude,d.Longitude);
      return "translate("+projection([d.Longitude,d.Latitude])+")" })
    .attr("class","pies")
    
    
  var pies = points.selectAll(".pies")
    .data(function(d) { 
      var a=d.data.split(['-']);
      e=[];
      a1='0'+d.Location
      a2='1'+d.Location
      a3='2'+d.Location
      a4='3'+d.Location
      a5='4'+d.Location
      //console.log(a1,a2);
      e.push({"label":a1,"count":a[0],"hashtags":d.Hashtags});
      e.push({"label":a2,"count":a[1],"hashtags":d.Hashtags});
      e.push({"label":a3,"count":a[2],"hashtags":d.Hashtags});
      e.push({"label":a4,"count":a[3],"hashtags":d.Hashtags});
      e.push({"label":a5,"count":a[4],"hashtags":d.Hashtags});
      console.log(e);
      return pie(e);
    })
    .enter()
    .append('g')
    .attr('class','arc');
  
   bubbles = Array.from(
      d3.group(data1, d => d.Location), ([key, value]) => ({key, value})
    );
//console.log(bubbles);

    
  pies.append("path")
    .attr('d',arc)
      .attr("fill",function(d,i){
           return color[i];
      })
      .on("click", function(d, i) {
           console.log(i);
           var svg2 = d3.select("#my_dataviz1");
           svg2.selectAll("*").remove();
           var c1;
           for(let j=0;j<bubbles.length;j++)
           {
                if(bubbles[j]["key"]==i.data.label.slice(1))
                {
                  c1=bubbles[j]["value"];
                }
           }
          //console.log(bubbles,c1);
           var start = 0,
          end = 2.25,
      numSpirals = 4;

    var theta = function(r) {
      return numSpirals * Math.PI * r;
    };

    var r = d3.min([300, 300]) / 2 - 40;

    var radius = d3.scaleLinear()
      .domain([start, end])
      .range([40, r]);

    var svg1 = d3.select("#my_dataviz1").append("svg").attr('id',"svg1")
      .attr("width", 300)
      .attr("height", 500)
      .append("g")
      .attr("transform", "translate(" + 300 / 2 + "," + 300 / 2 + ")");

      svg1.append("rect").attr("x",-90).attr("y",200).attr("width", 15).attr("height",15).attr("fill", "#4169e1")
      svg1.append("rect").attr("x",-90).attr("y",220).attr("width", 15).attr("height",15).attr("fill", "#1e90ff")
      svg1.append("rect").attr("x",-90).attr("y",240).attr("width", 15).attr("height",15).attr("fill", "#87cefa")
      svg1.append("rect").attr("x",-90).attr("y",260).attr("width", 15).attr("height",15).attr("fill", "#87ceeb")
      svg1.append("rect").attr("x",-90).attr("y",280).attr("width", 15).attr("height",15).attr("fill", "#b0c4de")
      svg1.append("text").attr("x", -70).attr("y", 210).text("tommorow").style("font-size", "16px").style("fill","white").attr("alignment-baseline","middle")
      svg1.append("text").attr("x", -70).attr("y", 230).text("<=week").style("font-size", "16px").style("fill","white").attr("alignment-baseline","middle")
      svg1.append("text").attr("x", -70).attr("y", 250).text("<=2week").style("font-size", "16px").style("fill","white").attr("alignment-baseline","middle")
      svg1.append("text").attr("x", -70).attr("y", 270).text("<=30days").style("font-size", "16px").style("fill","white").attr("alignment-baseline","middle")
      svg1.append("text").attr("x", -70).attr("y", 290).text(">30days").style("font-size", "16px").style("fill","white").attr("alignment-baseline","middle")
    // create the spiral, borrowed from http://bl.ocks.org/syntagmatic/3543186
    var points1 = d3.range(start, end + 0.001, (end - start) / 1000);

    var spiral = d3.radialLine()
      .curve(d3.curveCardinal)
      .angle(theta)
      .radius(radius);

    var path1 = svg1.append("path")
      .datum(points1)
      .attr("id", "spiral")
      .attr("d", spiral)
      .style("fill", "none")
      .style("stroke", "steelblue");

    // fudge some data, 2 years of data starting today
    var spiralLength = path1.node().getTotalLength();
    //     N = 730,
    //     barWidth = (spiralLength / N) - 1;
    

    // var someData = [];
    // for (var i = 0; i < N; i++) {
    //   var currentDate = new Date();
    //   currentDate.setDate(currentDate.getDate() + i);
    //   someData.push({
    //     date: currentDate,
    //     value: Math.random()
    //   });
    // }
    var someData = [];
    for (var i = 0; i < c1.length; i++) {
      var currentDate = new Date(c1[i].Event_Timestamp);
      
      someData.push({
        date: currentDate,
        Tweet_Timestamp: new Date(c1[i].Tweet_Timestamp),

      });
    }
    //console.log(data1,someData);
    var someData1 = [];
    // for (var i = 0; i < data1.length; i++) {
    //   var currentDate = new Date(data1[i].Event_Timestamp);
      
    //   someData1.push({
    //     date: currentDate,
    //     Tweet_Timestamp: new Date(data1[i].Tweet_Timestamp),

    //   });
    // }
    // console.log(someData1);
    // here's our time scale that'll run along the spiral
    var timeScale = d3.scaleTime()
      .domain(d3.extent(someData, function(d){
        return d.date;
      }))
      .range([0, spiralLength]);
    //console.log(someData,spiralLength);
    
    var spiral=svg1.selectAll("cir")
    .data(someData)
    spiral.exit().remove()
    spiral.enter()
    .append("circle")
    .attr("cx", (d,i) => {
      //console.log(d.date);
      const linePos = timeScale(d.date)
      const posOnLine = path1.node().getPointAtLength(linePos+10)

      d.cx = posOnLine.x
      d.cy = posOnLine.y

      return d.cx;
    })
   .attr("cy", d => d.cy)
   .attr("r", "5")
   .style('fill',function(d){
    //console.log(d);
          const date1 = d.Tweet_Timestamp;
const date2 = d.date;
const diffTime = Math.abs(date2 - date1);
const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
//console.log(date1,date2,diffDays);

if(diffDays<=1){
  return "#4169e1";
}
else if(diffDays>1 && diffDays<=7){
  return "#1e90ff";
}
else if(diffDays>7 && diffDays<=14){
  return "#87cefa";
}
else if(diffDays>14 && diffDays<=30){
  return "#87ceeb";
}
else{
  return "#b0c4de";
}
       });
    
  });



  count =0;
    pies.append('text')
    .style('fill', '#000000')
    .style("font-size", "11px")
    .style("font-weight", "bold")
    .attr("transform", "translate(0," + 2 + ")")
    .attr("text-anchor", "middle")
    .html(function(d, i){
      //console.log(d.data.count);
      if(i===0){count=0;}
      if(i<4){count += parseInt(d.data.count); }
      if(i===4){return count+parseInt(d.data.count);}
      else {return ""}} ); 

    

}

