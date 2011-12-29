//This is in no way a comprehensive/elegant parsing of SPARQL
//Maybe later, but now I need something that works

var sparqlParser = (function(){
	var flatQuery = "";
	var impl = this;
	var result = {
	  init: function(query){
	  	flatQuery = query.replace(/\n/g, " ");
	  },
	  parse: function() {
		function getPrefixes(){
	  	  var results = new Object();
	  	  try{
	  	  	var regex1 = /PREFIX (\w*):\s+(<[^<>]+>)/gi;
	  	  	query2 = flatQuery.replace(/\n/g, " ");
	  	  	prefixes = query2.match(regex1);
			var regex2 = /(\w*):\s+(<[^<>]+>)/gi;
	  	  	for(var i=0; i<prefixes.length; i++){
	  	  	  var res = prefixes[i].match(regex2);
	  	  	  var k = RegExp.$1;
	  	  	  var v = RegExp.$2;
	  	  	  results[k]=v;
	  	  	}
	  	  	return results;
	  	  }catch(err){
	  	  	console.log(err);
	  	  	return null;
	  	  }
		}

		function getSelectedVars(){
	  	  var results = new Object();
	  	  try{
	  	  	var regex1 = /SELECT/gi;
	  	  	var regex2 = /WHERE/gi;
	  	  	pos1 = flatQuery.search(regex1);
	  	  	pos2 = flatQuery.search(regex2);
	  	  	vars = flatQuery.substring(pos1+"SELECT".length, pos2);
	  	  	//For now will consider only variables
	  	  	//TODO: Include FROM [NAMED]
	  	  	//      Aggr functions
	  	  	//      Something else?
	  	  	var regex3 = /(\?\w+)/gi;
	  	  	return vars.match(regex3);
	  	  }catch(err){
	  	  	console.log(err);
	  	  	return null;
	  	  }
		}

		function getPatternTriples(){
	  	  var results = new Object();
	  	  var numberOfKeys     = 0;
	  	  var numberOfBrackets = 0;
	  	  try{
	  	  	var regex1 = /\{/gi;
	  	  	var regex2 = /\}[^\}]*$/gi;
	  	  	pos1 = flatQuery.search(regex1);
	  	  	pos2 = flatQuery.search(regex2);
	  	  	patterns = flatQuery.substring(pos1+1, pos2);
	  	  	var regex3 = /[^?]graph[\s<]/gi;
	  	  	return patterns.match(regex3);
	  	  }catch(err){
	  	  	console.log(err);
	  	  	return null;
	  	  }
		}
		
	  	//try{
	  	  getPrefixes();
	  	  getSelectedVars();
	  	  return getPatternTriples();
	  	  /*getFilters(input);*/
	  	/*}catch(err){
	  	  console.log(err);
	  	  return null;
	  	};*/
	  	
	  	
	  },
	};
	return result;
});
