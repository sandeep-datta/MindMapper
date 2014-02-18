function createNode(nodeData, x, y) {
    var node = $("<div/>", {class:'node', id:'node'+nodeData.id, style:"position:absolute; top:"+y+"px; left:"+x+"px;"});
            
    var input = $('<input/>',{
        type: "hidden",
        name: "text",
        value: nodeData.text
    });
    node.append(input);

    var content = $("<div/>", {name:'content', style:'max-width:800px; width:auto; height:auto;'});
    var html = textile.convert(nodeData.text);
    content.html($.parseHTML(html));

    node.append(content);
    return node;
}

function updateNode(nodeElem, newText) {
    var textElem = nodeElem.children('input[name="text"]');
    var text = "";
    if(textElem.length != 0) {
        text = textElem.val();
    }
    if (text != newText) {
        var html = textile.convert(newText);
        textElem.val(newText);
        var contentElem = node.children('div[name="content"]');
        contentElem.html($.parseHTML(html));
    }
}

function createCanvas(width, height) {
    var canvas = $("<canvas/>", {'class':'canvas', 'width': width, 'height':height});
    return canvas;
}

function createEditor(width, height) {
    var editor = $("<textarea/>", {'class':'editor', 'width': width, 'height':height, id:'editor'});
    return editor;
}

function showNodeAtPos(nodeData, x, y) {
    console.log("node:"+nodeData.id+" x:"+x+" y:"+y);
    var nodeElem = createNode(nodeData, x, y);
    $('#nodeLayer').append(nodeElem);
    return $('#node'+nodeData.id);
}


function showNodeWithDescendents(nodes, id, depth, x, y) {
    var nodeData = nodes[id];
    var nodeElem = showNodeAtPos(nodeData, x, y);

    x += nodeElem.width() + 50;

    var retVal = {height: nodeElem.height(), width: nodeElem.width()};

    if(nodeData.children != null) {
        var children = nodeData.children;
        console.log("children.length="+children.length);
        for(var i=0; i<children.length; ++i) {
            console.log("child:"+i);
            var r = showNodeWithDescendents(nodes, children[i], depth+1, x, y);
            y += (r.height + 50);
            retVal.height += r.height;
        }
    }

    return retVal;
}

function main() {
    var canvas = createCanvas(800, 600);
    $('#container').append(canvas);
    
    var nodeLayer = $("<div/>", {id:'nodeLayer'});
    $('#container').append(nodeLayer);


    showNodeWithDescendents(nodes, 0, 0, 0, 0);
    
    //var editor = createEditor(800, 400);
    //$('#container').append(editor);
    


    //var contentElem = $('#editor'); // my textarea

    //var node1 = createNode(contentElem.val(), 400, 20);
    

    // use a simple timer to check if the textarea content has changed
    /*setInterval(function () {
        updateNode(node1, contentElem.val());
    }, 500);*/
};
