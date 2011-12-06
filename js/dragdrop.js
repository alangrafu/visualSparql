
var creatingLink = false;
var sourceNode, targetNode = undefined;
var sourceCircle, targetCircle = undefined;
function addEventToNodes(){
    d3.selectAll("circle.node").on("dblclick", function(d){    
        if(creatingLink == false){
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
}


$("#submitPred").on("click", function(){
    creatingLink = false;
    $("#predDialog").css("display", "none");
    var addedLink = sp.createLink(sourceNode, targetNode, $("#predname").val());    
    targetCircle, sourceCircle = undefined;
    redrawGraph(); 
});