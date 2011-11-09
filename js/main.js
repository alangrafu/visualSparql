
var w = 700,
    h = 400

var vis = d3.select("#chart").append("svg:svg")
    .attr("width", w)
    .attr("height", h);

var files = d3.select("body").append("div").style("width", 100).style("height", 100).style("border-style", "solid").style("border-width", "1px").style("float", "left");

var currentInstrument = "";
var currentOpMode = "";


function getFiles(){
     files.html("Loading....");
     msg = "";
     d3.json("/field/run/files?instrument="+encodeURIComponent(currentInstrument)+"&opmode="+encodeURIComponent(currentOpMode), function(json){
          json.nodes.forEach(function(i){
            msg += "<a href='"+i.uri+"'>"+i.name+"</a><br/>";
          });
          if(msg == ""){
           msg = "<strong>No files found</strong>";
          }else{
           msg = "<strong>Files found</strong><br/>"+msg;
          }
          files.html(msg);
        });
}

var nodes = [];
var links = [];
var force;

    function init(json){
    force = self.force = d3.layout.force();
      nodes = json.nodes;
      links = json.links;
      force.nodes(nodes)
      .links(links)
      .gravity(.2)
      .distance(100)
      .charge(-500)
      .linkDistance(100)
      .size([w, h])
      .start();
      
      var link = vis.selectAll("g.link")
      .data(links)
      .enter()
      .append("svg:g").attr("class", "link")
      .call(force.drag);
      link.append("svg:line")
      .attr("class", "link")
      .attr("x1", function(d){return d.x1})
      .attr("y1", function(d){return d.y1})
      .attr("x2", function(d){return d.x1})
      .attr("y2", function(d){return d.y2});
      
      link.append("svg:text")
      .attr("class", "link")
      .attr("x", function(d) { return d.source.x; })
      .attr("y", function(d) { return d.source.y; })
      .text(function(d){return d.name;});
      
/*
        var link = vis.selectAll("g.link")
      .data(links)
      .enter().append("svg:line")
      .attr("class", "link")
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });*/
  /*    
      link.append("svg:text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text("texst");
    */  
      
      var node = vis.selectAll("g.node")
      .data(nodes)
      .enter().append("svg:g")
      .attr("class", "node")
      .attr("dx", "80px")
      .attr("dy", "80px")
      .call(force.drag);
      
      node.append("svg:circle")
      .attr("class", "node")
      .attr("r", 10)
      .attr("x", "-8px")
      .attr("y", "-8px")
      .attr("width", "16px")
      .attr("height", "16px")
      .style("fill", "#CFEFCF")
      .style("stroke", "#000");
      
     
      
      node.append("svg:text")
      .attr("class", "nodetext")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text(function(d) { return d.name });
      
      force.on("tick", function() {
      	  link.selectAll("line.link").attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });
          link.selectAll("text.link").attr("x", function(d) { return (d.source.x+d.target.x)/2; })
          .attr("y", function(d) { return (d.source.y+d.target.y)/2; })
          
          node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; 
          });
          
          vis.selectAll("g.node").on("click", function(d){
          	  if(d.instance != undefined){
          	  	if(d.open == 0){
          	  	  d3.json("/field/run/opmod?thing="+encodeURIComponent(d.uri)+"&id="+d.index+"&max="+nodes.length, function(json) {
          	  	  	  init(json);
          	  	  });
          	  	}
          	  	currentInstrument = d.uri;
          	  	currentOpMode = "null";
          	  	getFiles();
          	  	d.open = 1;
          	  }else if(d.opmod != undefined){
          	  	if(d.open == 0){
          	  	  /* d3.json("/field/run/param?thing="+encodeURIComponent(d.uri)+"&id="+d.index+"&max="+nodes.length, function(json) {
          	  	  msg = "";
          	  	  json.nodes.forEach(function(n){
          	  	  msg += n.name+"<br/>";
          	  	  });
          	  	  //details.html(msg);    
          	  	  //init(json);
          	  	  });*/
          	  	}
          	  	currentOpMode = d.uri;
          	  	getFiles();
          	  }else{
          	  	if(d.open == 0){
          	  	  d3.json("/field/run/sparql?thing="+encodeURIComponent(d.uri)+"&id="+d.index+"&max="+nodes.length, function(json) {
          	  	  	  init(json);
          	  	  });
          	  	}
          	  	d.open = 1;
          	  }
          	  
          });
          
      });



}


function restart(){
  q = document.getElementById("query").value;
  d3.select("#query").text(q);
  var sp = new SparqlParser();
  nodes = [];
  links = [];
  sp.init(q);
  sp.getPatterns();
  var localNodes = sp.getNodes();
  var localLinks = sp.getLinks();
  var json = {
  	nodes: sp.getNodes(),
  	links: sp.getLinks()
  };
  init(json);
  
}
restart();

d3.select("button").on("click", function(){
	nodes = [];
	links = [];
	vis.selectAll("g").remove();
	vis.selectAll("line").remove();
	restart();
});
