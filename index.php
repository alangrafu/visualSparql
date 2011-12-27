<?
$query = "PREFIX foaf: <http://xmlns.com/foaf/0.1/>
SELECT ?person ?email WHERE {
  ?person a foaf:Person;
          foaf:mbox ?email .
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
<script type="text/javascript" src="js/d3/d3.js"></script>
<script type="text/javascript" src="js/d3/d3.layout.js"></script>
<script type="text/javascript" src="js/d3/d3.geom.js"></script>
<script type="text/javascript" src="js/namespace.js"></script>
<script type="text/javascript" src="js/SparqlParser.js"></script>
<script type="text/javascript" src="js/sparqlApi.js"></script>

<style type="text/css">
.link { stroke: #000; font-size: 11px; font-family: sans-serif; }
.nodetext { pointer-events: none; font-size: 11px; font-family: sans-serif; }
arrowhead {
  stroke: #999;
  fill: #999;
  stroke-width: 1;
}
.main{border: 1px; border-color: black}
</style>
<link href='css/style.css' rel='stylesheet' type='text/css' />
<link href='css/dialog.css' rel='stylesheet' type='text/css' />
<title>Visual SPARQL</title>
</head>
<body>
<h1>Visual SPARQL</h1>
<div style="height:420px">
<div>
<div style="float: left;border-width: 1px; border-style: solid;" class='gallery' id='chart'></div>
<div style="float:left;color:red" id="msg"></div>

<textarea  cols="60" rows="20" style="float;left" id="query">
<?= $query ?>
</textarea>

<br/>
<button id="redraw">Redraw</button>
</div>
<div id="dialog-overlay"></div>
<div id="dialog-box">
    <div class="dialog-content">
        <div id="dialog-message"></div>
        <a href="#" class="button">Close</a>
    </div>
</div>
<div id="panel" style="display:none">
<input type="text" id="nodename" value="rdfs:Class"/><br/>
  <button id="submitNode">Add</button>
</div>
<div id="predDialog" style="display:none">
  <input type="text" id="predname" value="foaf:based_near"/><br/>
  <button id="submitPred">Add</button>
</div>
</div>
</div>
<div>
<table style="border: 1px; border-style:solid">
<tr><th>Action</th><th>Event</th></tr>
  <tr><td><strong>Double-click on screen</strong></td><td>Create a new node</td></tr>
  <tr><td><strong>Double-click on node</strong></td><td>Create a new link between nodes</td></tr>
  <tr><td><strong>Single-click on node</strong></td><td>Select node</td></tr>
</table>
</div>
<script type="text/javascript" src='js/main.js'></script>
<script type="text/javascript" src="js/dialog.js"></script>
<script type="text/javascript" src="js/events.js"></script>
</body>
</html>


