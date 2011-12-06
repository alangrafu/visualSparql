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
    createLink: function(s, t, n){
      var c = 0;      
      links.push({source: impl.createNode(s), target: impl.createNode(t), name: n, value: 10});
      return links.length;
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
  	  for(var i=0; i< aux.length; i++){
  	  	predicate = (aux[i].predicate.value != null)? aux[i].predicate.value : aux[i].predicate.prefix+":"+aux[i].predicate.suffix;
  	  	object = (aux[i].object.value != null)? aux[i].object.value : aux[i].object.prefix+":"+aux[i].object.suffix;
  	  	subject = (aux[i].subject.value != null)? aux[i].subject.value : aux[i].subject.prefix+":"+aux[i].subject.suffix;
  	  	
  	  	//uris and curies
  	  	if(aux[i].object.token == "uri"){
  	  	  object = ns.uri2curie(object);
  	  	}
  	  	if(aux[i].predicate.token == "uri"){
  	  	  predicate = ns.uri2curie(predicate);
  	  	}
  	  	if(aux[i].subject.token == "uri"){
  	  	  subject = ns.uri2curie(subject);
  	  	}
  	  	
  	  	//vars
  	  	if(aux[i].object.token == "var"){
  	  	  object = "?"+object;
  	  	}
  	  	if(aux[i].predicate.token == "var"){
  	  	  predicate = "?"+predicate;
  	  	}
  	  	if(aux[i].subject.token == "var"){
  	  	  subject = "?"+subject;
  	  	}  	  
  	  	
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

