
var w = 700,
h = 400;
var normalColor = "#CFEFCF";
var sp = new SparqlApi();

var ns = new NS();
ns.init();

var vis = d3.select("#chart").append("svg:svg")
.attr("width", w)
.attr("height", h);

var files = d3.select("body").append("div").style("width", 100).style("height", 100).style("border-style", "solid").style("border-width", "1px").style("float", "left");

var nodes = [];
var links = [];
var force;
force = self.force = d3.layout.force();

function init(json){
  nodes = json.nodes;
  links = json.links;
  force.nodes(nodes)
  .links(links)
  .gravity(.2)
  .distance(100)
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
  .attr("x1", function(d){if(!isNaN(d.x1)){return d.x1}else{return 20}})
  .attr("y1", function(d){if(!isNaN(d.y1)){return d.y1}else{return 20}})
  .attr("x2", function(d){if(!isNaN(d.x2)){return d.x2}else{return 20}})
  .attr("y2", function(d){if(!isNaN(d.y2)){return d.y2}else{return 20}})

  link.append("svg:text")
  .attr("class", "link")
  .attr("x", function(d) { return d.source.x; })
  .attr("y", function(d) { return d.source.y; })
  .text(function(d){return d.name;});

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
  .attr("id", function(d){return d.name})
  .style("fill", normalColor)
  .style("stroke", "#000");



  node.append("svg:text")
  .attr("class", "nodetext")
  .attr("dx", 12)
  .attr("dy", ".35em")
  .text(function(d) { return d.name });
  var tick=0;
  force.on("tick", function() {
    tick++;
    if(tick > 100){          
      force.stop();
      force.gravity(0)
      .charge(0);
      force.start();
    }
    link.selectAll("line.link").attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });
    link.selectAll("text.link").attr("x", function(d) { return (d.source.x+d.target.x)/2; })
    .attr("y", function(d) { return (d.source.y+d.target.y)/2; })

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; 
  });

  addEventToNodes();

});




}

function restart() {
  console.log(links);
  vis.selectAll("line.link")
  .data(links)
  .enter().insert("svg:line", "line.link")
  .attr("class", "link")
  .attr("x1", function(d) { return d.source.x; })
  .attr("y1", function(d) { return d.source.y; })
  .attr("x2", function(d) { return d.target.x; })
  .attr("y2", function(d) { return d.target.y; });

  vis.selectAll("circle.node")
  .data(nodes)
  .enter().insert("svg:circle", "circle.node")
  .attr("class", "node")
  .attr("cx", function(d) { return d.x; })
  .attr("cy", function(d) { return d.y; })
  .attr("r", 5)
  .call(force.drag);

  force.start();
}

var  q = document.getElementById("query").value;

sp = new SparqlApi();
sp.init(q);
sp.getPatterns();
var json = {
  nodes: sp.getNodes(),
  links: sp.getLinks()
};
init(json);
restart();


function redrawGraph(){
  nodes = [];
  links = [];
  vis.selectAll("g").remove();
  vis.selectAll("line").remove();
  var json = {
    nodes: sp.getNodes(),
    links: sp.getLinks()
  };
  init(json);
  restart();
}
d3.select("#redraw").on("click", function(){
	redrawGraph();
});


