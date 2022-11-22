
var markers=[];
var data1;
var path;
var data2;
var svg;
let twitter_csv,twitter_json;
let formatDate = d3.timeFormat("%Y-%m-%d");
let formatTime = d3.timeFormat("%H:%M");
var eventSvg;
var fill = d3.scaleOrdinal().range(d3.schemeDark2);

var eventsdata=[];
var parseDate = d3.timeParse("%Y");

// Create data: coordinates of start and end
// var link = {type: "LineString", coordinates: [[21, 41], [11, 45]]} // Change these data to see ho the great circle reacts
let onLoad = () => {
  const margin = { top: 0, right: 40, bottom: 10, left: 40 };
	eventSvg = d3.select('#eventSvg').append('g')
		.attr("id","chart_g")
		.attr('transform', `translate(${margin.left}, ${margin.top})`);	
}

let totalTime = temp => {
	let [hours, minutes] = temp.split(':');
	let tot=Number(hours)*60+Number(minutes);
	return tot;
}

let convertTime = temp => {
	let [hours, minutes] = temp.split(':');
	if (hours === '0') {
	   hours = '00';
	}
	if (hours === '1') {
		hours = '01';
	}
	if (hours === '2') {
		hours = '02';
	 } 
	 if (hours === '3') {
		hours = '03';
	 }
	 if (hours === '4') {
		hours = '04';
	 }
	 if (hours === '5') {
		hours = '05';
	 }
	 if (hours === '6') {
		hours = '06';
	 }
	 if (hours === '7') {
		hours = '07';
	 }
	 if (hours === '8') {
		hours = '08';
	 }
	 if (hours === '9') {
		hours = '09';
	 }
	return `${hours}:${minutes}`;
 };

 let convertDate = temp => {
	let [month,date,year] = temp.split("/");
	if (date === '1') {
		date = '01';
	}
	if (date === '2') {
		date = '02';
	 } 
	 if (date === '3') {
		date = '03';
	 }
	 if (date === '4') {
		date = '04';
	 }
	 if (date === '5') {
		date = '05';
	 }
	 if (date === '6') {
		date = '06';
	 }
	 if (date === '7') {
		date = '07';
	 }
	 if (date === '8') {
		date = '08';
	 }
	 if (date === '9') {
		date = '09';
	 }
	return `${year}-${month}-${date}`;
 };

document.addEventListener('DOMContentLoaded', function () {
   // Hint: create or set your svg element inside this function
   //start timer
function convertCsv(d){
return{
  
    Event_Name: d['Event Name'],
    Latitude: +d.Latitude,
    Longitude: +d.Longitude,											
    //Tweet_Latitude: +d.Tweet_Latitude,
    //Tweet_Longitude: +d.Tweet_Longitude,
    //Event_Latitude: +d.Event_Latitude,
    //Event_Longitude: +d.Event_Longitude,
    Tweet_Datestamp: convDate(d['Tweet Timestamp']),
    Tweet_Timestamp: convTime(d['Tweet Timestamp']),
    Event_Datestamp: convDate(d['Event Timestamp']),
    Event_Timestamp: convTime(d['Event Timestamp']),
    Category: d['Category (for our reference)'],
    Emotions: d['Emotion'],
    Uncertainity: +d['Uncertainity'],
    Hashtags: d['Hashtags']
}
}

   // This will load your two CSV files and store them into two arrays.
     Promise.all([d3.csv('mockdata.csv'),d3.json("world-topo.json"), d3.csv('twitter_data_pro.csv', convertCsv), d3.csv('heatmap.csv')])
        .then(function (values) {
            data1=values[0];
            data2=values[1];
            eventsdata = values[0];
            heatmapdata = values[3];
			heatMap(heatmapdata)
     eventsdata.forEach(function(d) {
      d.size = +d.size;
    });
            console.log('loaded twitter_data.csv and twitter_data.json');
            twitter_csv=values[2];
            getDateRange(twitter_csv);
               data1.forEach(function (a) {
                markers.push({"long":a.Longitude,"lat":a.Latitude});
            });
               geomap();
            
    });  
});

function wordCloud(data){
  var margin = {top: 0, right: 20, bottom: 20, left: 20},
    width = 400 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var fill = d3.scaleOrdinal().range(d3.schemeDark2);


d3.selectAll("#my_cloudviz > *").remove();
var wordCloudSvg = d3.select("#my_cloudviz")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")")

 wordCloudSvg.append("rect")
 .attr("width", "100%")
 .attr("height", "100%")
 .attr("fill", "black")
 wordCloudSvg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

selectedWords=[]
console.log("Events Data: ")

data.map(function(d){

    selectedWords.push(d);

})
console.log(selectedWords)

createlayout(selectedWords);
             
function createlayout(selectedWords)
{
var layout = d3.layout.cloud()
  .size([width, height])
  .words(selectedWords.map(function(d) { return {text: d.Hashtags, size:d.size+10}; }))
  .padding(5)        
  .rotate(function() { return ~~(Math.random() * 2) * 90; })
  .fontSize(function(d) { return d.size; })     
  .on("end", draw);
   layout.start();
  console.log("in draw");

}


function draw(words) {
  wordCloudSvg
      .append("g")
      .attr("transform", "translate(" + (width / 2) + "," + (height / 2) +")")
      .selectAll("text")
      .data(words)
      .enter().append("text")
      .style("font-size", function(d) { return d.size+ "px"; })   
      .style("fill", function(d, i) { return fill(i); })
      .style("font-family", "Impact")
      .attr("text-anchor", "middle")
      .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function(d) { return d.text; });
}
       
}

function drawEventCalendarView(twitter_csv,start,stop,begin,end)
{
  const margin = { top: 0, right: 40, bottom: 10, left: 40 };
	eventSvg.selectAll('*').remove();
	let data_csv=twitter_csv;
	let svg_ec = document.querySelector('#eventSvg');
	const width = parseInt(getComputedStyle(svg_ec).width, 10);
	const height = parseInt(getComputedStyle(svg_ec).height, 10);
	const innWidth = width - margin.left - margin.right;
	const innHeight = height - margin.top - margin.bottom;
	//let start,stop,begin,end;
	//[start,stop,begin,end]=getDateRange(data_csv);
	console.log(start,stop,begin,end);
	let diff=stop.getTime()-start.getTime();
	let steps=Math.ceil(diff/(1000*3600*24));
	//console.log(steps)

	let tip = d3.select("body")
			.append("div")
			.style("position", "absolute")
			.style("width","auto")
			.style("height","auto")
			.style("text-align","center")
			.style("z-index", "10")
			.style("visibility", "hidden")
			.style("padding", "15px")
			.style("background", "black")
			.style("border", "2px")
			.style("margin", "5px")
			.style("border-radius", "8px")
			.style("color", "white")
			.style("font-family","sans-serif")
			.style("font-size","15px")
			.style("line-height","20px")
			.style("pointer-events","none");

	let x_scl = d3.scaleTime().range([margin.left, innWidth-margin.right]).nice();
		x_scl.domain([begin,end]).ticks(1440);

	let y_scl = d3.scaleTime().range([innHeight-margin.bottom, margin.top]).nice();
		y_scl.domain([stop,start]);
		
	let y_axisL = d3.axisLeft(y_scl)
					.ticks(25)
					.tickSizeInner(5) 
      				.tickSizeOuter(0)
					.tickFormat(d3.timeFormat("%Y-%m-%d"));

		eventSvg.append('g')
			.attr('id','yScaleL')
			.attr('transform', `translate(${margin.left},0)`)
			.attr('opacity', 0.5)
			.call(y_axisL);
			// .on("click", function(d,i){
			// 			d3.select(this).style("stroke-width",2);
			//     		tip.html(`Value: ${d.originalTarget["__data__"]}`)
			//     			.style("visibility", "visible")
			//     			.style("left",(event.pageX)+"px")
			//     			.style("top", (event.pageY)+"px");	
			//    });
			

	let y_axisR = d3.axisRight(y_scl)
					.ticks(steps)
					.tickSizeInner(5) 
	  				.tickSizeOuter(0)
					.tickFormat(d3.timeFormat("%a"));

		eventSvg.append('g')
			.attr('id','yScaleR')
			.attr('transform', `translate(${innWidth-margin.right+margin.left},0)`)
			.attr('opacity', 0.5)
			.call(y_axisR);
		
			
	let gridLines = d3.axisRight()
					  .ticks(steps)
					  .tickSize(innWidth-margin.right)
					  .tickFormat('')
					  .scale(y_scl);
		  
		eventSvg.append('g')
			.attr('id','grid')
			.attr('transform', `translate(${margin.left},0)`)
			.attr('opacity', 0.2)
			.call(gridLines);
			
	//function update(stop,start)
	//{
		y_scl.domain([stop,start]);
		eventSvg.selectAll("#yScaleL")
			.transition()
			.duration(1500)
			.delay(600)
			.call(y_axisL);
		
		eventSvg.selectAll("#yScaleR")
			.transition()
			.duration(1500)
			.delay(600)
			.call(y_axisR);

	let emotions=['anger','disgust','fear','joy','sadness','surprise']
	let color=d3.scaleOrdinal(d3.schemeAccent).domain(emotions).range(["#A52A2A","#662D91","#FF7F50","#568203","#72A0C1","#FFC72C"]);

	let barGroups = eventSvg.selectAll('g.barGroup')
						.data(twitter_csv)
						.join('g')
			  			.attr('class', 'barGroup');		
	
		barGroups
				.append('circle')
				.attr('transform', `translate(${margin.left},0)`)
				.attr('cx',d => x_scl(new Date(d.Event_Timestamp)))
				.attr('cy',d => y_scl(new Date(d.Event_Datestamp)))
				.attr('r', 10)
				.attr('stroke', 'blue')
				.attr('fill', d => color(d.Emotions))
				.style('opacity',d => d.Uncertainity)
				.attr('stroke-width',d => d.Uncertainity)
				.on("click", function(d,i){console.log("on click");console.log(i); dataCloud=[]; i['Hashtags'].split("#").forEach(hashtag => {
					dataCloud.push({"EventName": i['Event_Name'], "Hashtags" : hashtag, "size": 1});}); wordCloud(dataCloud)})
				.on("mouseover", function(d,i) {
					console.log(d,i);
					d3.select(this).style("stroke-width",2).attr('opacity',2);
					
					tip.html(`Future Event: ${i.Event_Name} <br> Location: (${i.Latitude},${i.Longitude}) <br><br> Keywords:[${i.Hashtags.split(" ")}]`)
						.style("visibility", "visible")
						.style("left",(event.pageX)+"px")
						.style("top", (event.pageY)+"px");			
				})	
				.on("mouseout", function(d,i) {
					d3.select(this).style("stroke-width",1).attr('opacity',0.25);
					tip.style("visibility", "hidden");
				})
				.on("mousemove",function(d,i) {
					tip.style("top", (event.pageY)+"px").style("left",(event.pageX)+"px");
				}).transition()
				.duration(1500)
				.delay(600)
				
				
	function getSolidLine(k,l)
	{
		let events=[];
		events.push(k.Event_Name,l.Event_Name);
			barGroups.append('line')
				.attr('transform', `translate(${margin.left},0)`)
				.attr('x1', x_scl(k.Event_Timestamp))
				.attr('y1', y_scl(k.Event_Datestamp))
				.attr('x2', x_scl(l.Event_Timestamp))
				.attr('y2', y_scl(l.Event_Datestamp))
				.attr('stroke', 'red')
				.attr('opacity',0.1)
				.style("stroke-width",0.6)
				.on("mouseover", function(d,i) {
					console.log("Event hover: ")
					console.log(i)
					d3.select(this).style("stroke-width",2).attr('opacity',1);	
					tip.html(`Future Events: <br> ${events}`)
							.style("visibility", "visible")
							.style("left",(event.pageX)+"px")
							.style("top", (event.pageY)+"px");			
				})	
				.on("mouseout", function(d,i) {
					console.log("Event hover: ")
					console.log(i)
					d3.select(this).style("stroke-width",0.6).attr('opacity',0.1);
					tip.style("visibility", "hidden");
				})
				.on("mousemove",function(d,i) {
					console.log("Event hover: ")
					console.log(i)
					tip.style("top", (event.pageY)+"px").style("left",(event.pageX)+"px");
				}).transition()
				.duration(1500)
				.delay(600);
	}

	function getDottedLine(k,l)
		{
				let hash1=k.Hashtags.split(" ");
				for(let i=0;i<hash1.length;i++)
				{
					hash1[i]=hash1[i].toString().replace("#","");
				}

				let hash2=l.Hashtags.split(" ");
				for(let i=0;i<hash2.length;i++)
				{
					hash2[i]=hash2[i].toString().replace("#","");
				}
				let intersection=hash1.filter(x=>hash2.includes(x));
				if(intersection.length>=8)
				{
					//console.log(hash1,hash2,intersection);
					barGroups.append('line')
						.attr('transform', `translate(${margin.left},0)`)
						.attr('x1', x_scl(k.Event_Timestamp))
						.attr('y1', y_scl(k.Event_Datestamp))
						.attr('x2', x_scl(l.Event_Timestamp))
						.attr('y2', y_scl(l.Event_Datestamp))
						.style("stroke-dasharray", ("9,2"))
						.attr('stroke', 'blue')
						.attr('opacity',0.1)
						.style("stroke-width",0.6)
						.on("mouseover", function(d,i) {
							//console.log(d,i);
							d3.select(this).style("stroke-width",2).attr('opacity',1);	
							tip.html(`Shared Keywords: <br> ${intersection}`)
									.style("visibility", "visible")
									.style("left",(event.pageX)+"px")
									.style("top", (event.pageY)+"px");			
						})	
						.on("mouseout", function(d,i) {
							d3.select(this).style("stroke-width",0.6).attr('opacity',0.25);
							tip.style("visibility", "hidden");
						})
						.on("mousemove",function(d,i) {
							tip.style("top", (event.pageY)+"px").style("left",(event.pageX)+"px");
						}).transition()
						.duration(1500)
						.delay(600);
						//.style("stroke-dasharray", ("3, 3"));
				}
		}

	for(let i=0;i<barGroups._groups[0].length-1;i++)
	{
		for(let j=i+1;j<barGroups._groups[0].length;j++)
		{
			//console.log('23',x_scl(barGroups._groups[0][i]["__data__"].Tweet_Timestamp),x_scl(barGroups._groups[0][j]["__data__"].Tweet_Timestamp))
			if(barGroups._groups[0][i]["__data__"].Latitude===barGroups._groups[0][j]["__data__"].Latitude && barGroups._groups[0][i]["__data__"].Longitude===barGroups._groups[0][j]["__data__"].Longitude){
				getSolidLine(barGroups._groups[0][i]["__data__"],barGroups._groups[0][j]["__data__"]);
			}
			if(i!=j)
			{
				getDottedLine(barGroups._groups[0][i]["__data__"],barGroups._groups[0][j]["__data__"]);
			}
		}
	}	
}

function getDateRange(twitter_csv)
{
	let start_date_str=d3.select("#d_start").property('value');
	let [s_year,s_month,s_date] = start_date_str.split('-');
	let start_date = new Date(+s_year, +s_month-1, +s_date);
	let end_date_str=d3.select("#d_end").property('value');
	let [e_year,e_month,e_date] = end_date_str.split('-');
	let end_date = new Date(+e_year, +e_month-1, +e_date);
	
	let delta=end_date.getTime()-start_date.getTime();

	let tweet_date=d3.extent(twitter_csv, a => a.Tweet_Datestamp);
	let event_date=d3.extent(twitter_csv, a => a.Event_Datestamp);
	let tweet_time=d3.extent(twitter_csv, a => a.Tweet_Timestamp);
	let event_time=d3.extent(twitter_csv, a => a.Event_Timestamp);
	//let start=event_date[0],stop=event_date[1],begin=event_time[0],end=event_time[1];

	let start,stop,begin,end;
	
	if(start_date>=event_date[0] || start_date>=tweet_date[0] && delta>0)
	{
		document.getElementById("st_demo").innerHTML="";
		start=start_date;
	}
	else
	{
		//document.getElementById("st_demo").innerHTML="Start date: "+start_date_str + " not in range";
		//console.log("Start date not in Range");
		if(tweet_date[0]<event_date[0])
		{
			start=tweet_date[0];
		}
		else
		{
			start=event_date[0];
		}
	}

	if(end_date<=event_date[1] || end_date<=tweet_date[1] && delta>0)
	{
		document.getElementById("en_demo").innerHTML="";
		stop=end_date;
	}
	else
	{
		//document.getElementById("en_demo").innerHTML="End date: "+end_date_str + " not in range";
		//console.log("End date not in Range");
		if(tweet_date[1]>event_date[1])
		{
			stop=tweet_date[1];
		}
		else
		{
			stop=event_date[1];
		}
	}

	if(tweet_time[1]>event_time[1])
	{
		end=tweet_time[1];
	}
	else
	{
		end=event_time[1];
	}

	if(tweet_time[0]<event_time[0])
	{
		begin=tweet_time[0];
	}
	else
	{
		begin=event_time[0];
	}
	drawEventCalendarView(twitter_csv,start,stop,begin,end);
}

function convDate(text)
{
	const myArray=text.split(" ");
	const datestamp=convertDate(myArray[0]);
	const timestamp=convertTime(myArray[1]);
	//let time=datestamp+"T"+timestamp;
	let time=`${datestamp}T00:00`;
	let d=new Date(time);
	return d;
}
  
function convTime(text)
{
	const myArray=text.split(" ");
	const datestamp=convertDate(myArray[0]);
	let total_time=totalTime(myArray[1]);
	let timestamp=convertTime(myArray[1]);
	let time=datestamp+"T"+timestamp;
	//console.log(total_time)
	//let d=new Date(time).getHours();
	return total_time;
}
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
      e.push({"label":a1,"count":a[0],"hashtags":d.Hashtags, "eventName":d['Event Name']});
      e.push({"label":a2,"count":a[1],"hashtags":d.Hashtags, "eventName":d['Event Name']});
      e.push({"label":a3,"count":a[2],"hashtags":d.Hashtags, "eventName":d['Event Name']});
      e.push({"label":a4,"count":a[3],"hashtags":d.Hashtags, "eventName":d['Event Name']});
      e.push({"label":a5,"count":a[4],"hashtags":d.Hashtags, "eventName":d['Event Name']});
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
        dataCloud=[]
        i.data.hashtags.split("#").forEach(hashtag =>{
          dataCloud.push( {"EventName": i.data.eventName, "Hashtags": hashtag, "size": 1})
        })
        
        wordCloud(dataCloud);
        // {'Event Name':'Womens World Cup', 'Hashtags': '', 'size': 3}
        
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
    //------------------------------------

const heatMap = (data)=>{
	const margin = {top: 80, right: 25, bottom: 80, left: 60},
	width = 350 - margin.left - margin.right,
	height = 350 - margin.top - margin.bottom;
  
  // append the svg object to the body of the page
  var svg = d3.select("#my_heatmapviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
		"translate(" + margin.left + "," + margin.top + ")");
  
  //Read the data

	var div = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);
	// Labels of row and columns -> unique identifier of the column called 'Category' and 'Emotion'
	const myGroups = Array.from(new Set(data.map(d => d.Category)))
	const myVars = Array.from(new Set(data.map(d => d.Emotion)))
	console.log(myGroups);
	console.log(myVars);
	// Build X scales and axis:333
	const x = d3.scaleBand()
	  .range([ 0, width ])
	  .domain(myGroups)
	  .padding(0.05);
	svg.append("g")
	  .style("font-size", 15)
	  .attr("transform", `translate(0, ${height})`)
	  //.attr("transform", "rotate(-65)")
	  .call(d3.axisBottom(x))
	  .selectAll("text")
			  .style("text-anchor", "end")
			  // .attr("dx", "-.8em")
			  // .attr("dy", ".15em")
			  .attr("transform", "rotate(-35)" )
  
	  svg.select(".domain").remove()
	  for(let i=0;i<=7;i++){
		svg.select("line").remove()
	  }
	  //svg.select("line").remove()
  
  
	// Build Y scales and axis:
	const y = d3.scaleBand()
	  .range([ height, 0 ])
	  .domain(myVars)
	  .padding(0.05);
	svg.append("g")
	  .style("font-size", 15)
  
	  .call(d3.axisLeft(y).tickSize(0))
	  .select(".domain").remove();
  
  
	// Build color scale
	const myColor = d3.scaleSequential()
	  .interpolator(d3.interpolateInferno)
	  .domain([25,0])
	  console.log(myColor(0))
  
  
  let tooltip = d3.select("#my_heatmapviz")
			  .append("div")
			  .style("position", "absolute")
			  .style("width","auto")
			  .style("height","auto")
			  .style("text-align","center")
			  .style("z-index", "10")
			  .style("visibility", "hidden")
			  .style("padding", "15px")
			  .style("background", "black")
			  .style("border", "2px")
			  .style("margin", "5px")
			  .style("border-radius", "8px")
			  .style("color", "white")
			  .style("font-family","sans-serif")
			  .style("font-size","15px")
			  .style("line-height","20px")
			  .style("pointer-events","none");
	// Three function that change the tooltip when user hover / move / leave a cell
	const mouseover = function(event,d) {
	  tooltip
		.style("opacity", 1)
	  d3.select(this)
		.style("stroke", "black")
		.style("stroke-width", 4)
		.style("opacity", 1)
	}
  
	const mousemove = function(event,d) {
  
		div.transition()
		  .duration(20)
		  .style("opacity",1);
		  div.html("There are "+ d.Count+" events which are "+d.Category+" and "+d.Emotion)
		  .style("font-weight","bold")
		  .style("left", (event.pageX) + "px")
		  .style("top", (event.pageY - 28) + "px");
		// tooltip.style("visibility", "hidden");
		// tooltip.style("top", (event.pageY)+"px").style("left",(event.pageX)+"px");
	}
	
	const mouseleave = function(event,d) {
	  div
		.style("opacity", 0)
	  d3.select(this)
		.style("stroke", "black")
		.style("stroke-width", 2)
		.style("opacity", 0.8)
  
		div.transition()
		  .duration(100)
		  .style("opacity", 0);
	}
  
	// add the squares
	svg.selectAll()
	  .data(data, function(d) { return d.Category+':'+d.Emotion;})
	  .join("rect")
		.attr("x", function(d) { return x(d.Category) })
		.attr("y", function(d) { return y(d.Emotion) })
		.attr("rx", 4)
		.attr("ry", 4)
		.attr("width", x.bandwidth() )
		.attr("height", y.bandwidth() )
		.style("fill", function(d) { return myColor(d.Count)} )
		.style("stroke-width", 2)
		.style("stroke", "black")
		.style("opacity", 0.8)
	  .on("mouseover", mouseover)
	  .on("mousemove", mousemove)
	  .on("mouseleave", mouseleave)
  }
  
  // Add title to graph
  // svg.append("text")
  //         .attr("x", 0)
  //         .attr("y", -50)
  //         .attr("text-anchor", "left")
  //         .style("font-size", "22px")
  //         .text("A d3.js heatmap");
  //
  // // Add subtitle to graph
  // svg.append("text")
  //         .attr("x", 0)
  //         .attr("y", -20)
  //         .attr("text-anchor", "left")
  //         .style("font-size", "14px")
  //         .style("fill", "grey")
  //         .style("max-width", 400)
  //         .text("A short description of the take-away message of this chart.");
  


