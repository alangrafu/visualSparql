
var creatingLink = false;
var sourceNode, targetNode = undefined;

function addEventToNodes(){
    d3.selectAll("circle.node").on("dblclick", function(d){    
        var thisNode = d3.select(this);
        thisNode.style("fill", "red");
        if(creatingLink == false){
            creatingLink = true;
            sourceNode= thisNode.attr("id");
        }else{
            $("#predDialog").css("display", "inline");
            targetNode = thisNode.attr("id");
        }
    })
}


$("#submitPred").on("click", function(){
    creatingLink = false;
    $("#predDialog").css("display", "none");
    var addedLink = sp.createLink(sourceNode, targetNode, $("#predname").val());    
    redrawGraph();
});