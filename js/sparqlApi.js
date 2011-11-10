SparqlApi = function () {
  var query=null;
  var nodes = [];
  var links = [];
  var impl;
  return {
  	init: function(data){
  	  query = data;
  	  impl = this;
  	},
  	createNode: function(n){
  	  var c = 0;  	  
  	  for(var i in nodes){
  	  	if(nodes[i].name == n){
  	  	  return c;
  	  	}
  	  	c++;
  	  }
  	  nodes.push({name: n});
  	  return c;
  	},
  	getNodes: function(){
  	  return nodes;
  	},
  	getLinks: function(){
  	  return links;
  	},
  	getCurie: function(uri){
  	  for(k in ns){
  	  	var v = ns[k];
  	  	var re = new RegExp("^"+ns[k],"g");
  	  	//console.log(v+" es parte de "+uri);
  	  	if(uri.match(re)){
  	  		arr = uri.replace(re, "");
  	  		return k+":"+arr;
  	  	}
  	  }
  	  return uri;
  	},
  	getPatterns: function () {
  	  d3.select("#msg").text("");
  	  try{
  	  	parsed = sparqlParser.parse(query);
  	  }catch(err)
  	  {
  	  	d3.select("#msg").style("color", "red").text("Your query has syntactic error(s)");
  	  	nodes = [];
  	  	links = [];
  	  	return;
  	  }
  	  aux = parsed.units[0].pattern.patterns[0].triplesContext;
  	  console.log(parsed.units[0].pattern.patterns);
  	  for(var i=0; i< aux.length; i++){
  	  	predicate = (aux[i].predicate.value != null)? aux[i].predicate.value : aux[i].predicate.prefix+":"+aux[i].predicate.suffix;
  	  	object = (aux[i].object.value != null)? aux[i].object.value : aux[i].object.prefix+":"+aux[i].object.suffix;
  	  	if(aux[i].object.token == "literal"){object = '"'+object+'"';}
  	  	subject = impl.getCurie(aux[i].subject.value);
  	  	predicate = impl.getCurie(predicate);
  	  	console.log(predicate);
  	  	object = impl.getCurie(object);
  	  	links.push({
  	  		source: impl.createNode(subject),
  	  	  	  	  target: impl.createNode(object),
  	  	  	  	  name: predicate,
  	  	  	  	  value: 10
  	  	  	  });
  	  }
  	},
  	getQuery: function () {
  	  return query;
  	},
  }
}

