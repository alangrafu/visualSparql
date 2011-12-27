
var creatingLink = false;
var sourceNode, targetNode = undefined;
var sourceCircle, targetCircle = undefined;

function changeSelects(d){
  if(d.type != "var"){
  	errorMsg("Only variables can be selected");
  }else{  	  	
  	var newSelects;  
  	var query = d3.select("#query").text();
  	var selects = query.match(/SELECT (.*)WHERE/);
  	if(selects[1].indexOf(d.name+" ") < 0){
  	  newSelects = "SELECT "+selects[1]+d.name+' WHERE';
  	  query = query.replace(/SELECT(.*)WHERE/, newSelects);
  	  d3.select("#query").text(query); 	
  	  return true;	  
  	}else if(selects[1].indexOf(d.name+" ") >= 0){
  	  var aux = selects[1].replace(d.name+" ", "");
  	  newSelects = "SELECT "+aux+"WHERE";
  	  query = query.replace(/SELECT(.*)WHERE/, newSelects);
  	  d3.select("#query").text(query);
  	  return true;
  	}
  	return false;
  }
}

d3.selectAll("circle.node").on("dblclick", function(d){ 
	console.log("double click on circle");
	$("#panel").css("display", "none");
	if(creatingLink == false){
	  sourceCircle = d3.select(this);
	  sourceCircle.style("fill", selectColor);
	  creatingLink = true;
	  sourceNode= sourceCircle.attr("id");
	}else{
	  $("#predDialog").css("display", "inline");
	  if(targetCircle != undefined){
	  	targetCircle.style("fill", normalColor);
	  }
	  targetCircle = d3.select(this);
	  targetCircle.style("fill", selectColor);
	  targetNode = targetCircle.attr("id");
	}
	event.stopPropagation();
	return false;
})


d3.selectAll("circle.node").on("click", function(d){
	changed = changeSelects(d);
	if(changed){
	  if(d3.select(this).style("fill") == normalColor){
	  	d3.select(this).style("fill", varColor); 
	  }else{
	  	d3.select(this).style("fill", normalColor);
	  }
	}
});
d3.selectAll("text.link").on("click", function(d){
	changed = changeSelects(d);
	if(changed){
	  if(d3.select(this).style("stroke") == normalLink){
	  	d3.select(this).style("fill", "black"); 
	  	d3.select(this).style("stroke", varLink); 
	  }else{
	  	d3.select(this).style("fill", "white");
	  	d3.select(this).style("stroke", normalLink);
	  }
	}
});

$("#msg").change(function(d){
	setTimeout(function() {  
		$('#msg').fadeOut('fast');  
	}, 1000);
});

vis.on("dblclick", function(d){
	console.log("double click svg");
	$("#panel").css("display", "inline");
})


//Check that sparql query syntax is OK after typing
var typingTimer;                //timer identifier
var doneTypingInterval = 1200;  //time in ms, 5 second for example

$('#query').keyup(function(){
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
});

$('#query').keydown(function(){
    clearTimeout(typingTimer);
});

$("#submitPred").on("click", function(){
    creatingLink = false;
    $("#predDialog").css("display", "none");
    var addedLink = sp.createLink(sourceNode, targetNode, $("#predname").val());    
    targetCircle, sourceCircle = undefined;
    redrawGraph(); 
    rewriteQuery();
    return false;
});


function doneTyping () {
  q = document.getElementById("query").value;
  
  if(sp.init(q)){
	sp.getPatterns();
	projections = sp.getProjection();
	redrawGraph();
  }
}

function addPrefix(curie, prefixes){ 
  aux = curie.split(":");
  if(prefixes.indexOf(aux[0]) <0){
  	prefixes.push(aux[0]);
  }
}

function rewriteQuery(){
  var usedPrefixes = new Array();
  var q = "";
  for(var i=0; i<links.length; i++){
  	if(links[i].source.type == "curie"){
  	  addPrefix(links[i].source.name, usedPrefixes);
  	}
  	if(links[i].type == "curie"){
  	  addPrefix(links[i].name, usedPrefixes);
  	}
  	if(links[i].target.type == "curie"){
  	  addPrefix(links[i].target.name, usedPrefixes);
  	}
  }
  for(var i=0; i< usedPrefixes.length; i++){
  	q += "PREFIX "+usedPrefixes[i]+": <"+ns.get(usedPrefixes[i])+">\n";
  }
  q += "SELECT";
  var p = sp.getProjection();
  for(var i=0; i<p.length; i++){
  	q += " "+p[i];
  }
  q+= " WHERE{\n";
  for(var i=0; i<links.length; i++){
  	q+= "  "+links[i].source.name+" "+links[i].name+" "+links[i].target.name+" .\n";
  }
  q += "}";
  document.getElementById("query").value = q;
}