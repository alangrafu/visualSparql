
var creatingLink = false;
var sourceNode, targetNode = undefined;
var sourceCircle, targetCircle = undefined;
function addEventToNodes(){
  d3.selectAll("circle.node").on("dblclick", function(d){    
  	  if(creatingLink == false){
  	  	console.log(d3.select(this));
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
  })
  d3.selectAll("circle.node").on("click", function(d){
  	  if(d.type != "var"){
  	  	d3.select("#msg").style("color", "red").text("Only variables can be selected");
  	  }else{  	  	
  	  	var newSelects;  
  	  	var query = d3.select("#query").text();
  	  	var selects = query.match(/SELECT (.*)WHERE/);
  	  	if(d3.select(this).style("fill") == normalColor){
  	  	  newSelects = "SELECT "+selects[1]+d.name+' WHERE';
  	  	  d3.select(this).style("fill", varColor);
  	  	}else if(d3.select(this).style("fill") == varColor){
  	  	  var aux = selects[1].replace(d.name+" ", "");
  	  	  newSelects = "SELECT "+aux+"WHERE";
  	  	  d3.select(this).style("fill", normalColor);
  	  	}
  	  	query = query.replace(/SELECT(.*)WHERE/, newSelects);
  	  	d3.select("#query").text(query);
  	  }
  });
  
  $("#msg").change(function(d){
  	  alert("asd");
  	  setTimeout(function() {  
  	  	  $('#msg').fadeOut('fast');  
  	  }, 1000);
  });
}


$("#submitPred").on("click", function(){
    creatingLink = false;
    $("#predDialog").css("display", "none");
    var addedLink = sp.createLink(sourceNode, targetNode, $("#predname").val());    
    targetCircle, sourceCircle = undefined;
    redrawGraph(); 
    rewriteQuery();
});


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