$(document).ready(function(){
	
	$("#newnode").on("click", function(){
		$("#panel").css("display", "inline");
	});

	$("#submitNode").on("click", function(){
		newNode = $("#nodename").val();
		var nodeListSize = nodes.length;
		var addedNode = sp.createNode(newNode);
		if(nodeListSize > addedNode){
			alert("Node \""+newNode+"\" already exists!");
		}else{
			var json = {
				nodes: sp.getNodes(),
				links: sp.getLinks()
			};
			init(json);
			$("#nodename").val("");
			$("#panel").css("display", "none");

		}
	});

})
