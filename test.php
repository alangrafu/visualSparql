<?
$query = "PREFIX foaf2: <http://xmlns.com/foaf/0.1/x>
PREFIX : <http://graves.cl/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
SELECT ?person ?email WHERE{
GRAPH <http://gras>{
?person a foaf:Person;
foaf:mbox ?email .
}
GRAPH <http://asdasd>{
OPTIONAL{?person a foaf:lansd}
?x a owl:Thing.
}
}";
if(isset($_GET['query'])){
  $query = $_GET['query'];
}elseif(isset($_GET['url'])){
  $query = file_get_contents($_GET['url']);
}

?>
<!DOCTYPE html>
<html>
<head>
<script type="text/javascript" src="js/jquery.min.js"></script>
<script type="text/javascript" src="js/namespace.js"></script>
<script type="text/javascript" src="js/SparqlParser2.js"></script>
<script type="text/javascript" src="js/sparqlApi.js"></script>
<script type="text/javascript">
$(document).ready(function(){
	s = new sparqlParser();
	s.init($("#query").val());
	var x = s.parse();
	console.log(x);
});
</script>
<textarea id="query" cols="60" rows="10"><?=$query?></textarea>
</body>
</html>


