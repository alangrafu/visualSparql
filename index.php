<?
$query = "SELECT ?s ?p WHERE
{
?s ?p ?o;
 a foaf:Person ;
 rdfs:label 'asdasdasd';
 foaf:knows <http://alvaro.graves.cl> 
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
<script type="text/javascript" src="js/d3/d3.js"></script>
<script type="text/javascript" src="js/d3/d3.layout.js"></script>
<script type="text/javascript" src="js/d3/d3.geom.js"></script>
<script type="text/javascript" src="js/SparqlParser.js"></script>
<script type="text/javascript" src="js/SparqlApi.js"></script>
<script type="text/javascript" src="js/namespace.js"></script>

<style type="text/css">
.link { stroke: #ccc; font-size: 12px; font-family: sans-serif; color: red;}
.nodetext { pointer-events: none; font-size: 11px; font-family: sans-serif; }
.main{border: 1px; border-color: black}
</style>
<link href='css/style.css' rel='stylesheet' type='text/css' />
<title>Visual SPARQL</title>
</head>
<body>
<h1>Visual SPARQL</h1>
<div style="float: left;border-width: 1px; border-style: solid;" class='gallery' id='chart'></div>
<textarea  cols="40" rows="10" style="float;left" id="query">
<?= $query ?>
</textarea>
<br/>
<button>Redraw</button><div id="msg"></div>
<script type="text/javascript" src='js/main.js'>
</script>
</body>
</html>


