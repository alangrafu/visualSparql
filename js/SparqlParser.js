SparqlParser = function () {
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
  	getPatterns: function () {
  	  query = query.toString().replace(/(\r\n|\n|\r)/gm,"");
  	  var pat = query.match(/\{(.*)\}/);
  	  var patterns = pat[1].split(".");
  	  console.log(patterns);
  	  patterns.filter(function(i){return i.length>0}).forEach(function(item){
  	  	  var elements = [];
  	  	  item.split(/\s+/).forEach(function(i){
  	  	  	  if(i.length > 0){
  	  	  	  	elements.push(i);
  	  	  	  }
  	  	  });
  	  	  links.push({
  	  	  	  source: impl.createNode(elements[0]),
  	  	  	  target: impl.createNode(elements[2]),
  	  	  	  value: 10
  	  	  });  	  	  	  
  	  });
  	},
  	getQuery: function () {
  	  return query;
  	},
  }
}

