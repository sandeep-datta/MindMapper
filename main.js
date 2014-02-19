var gNodeWidgets = {}

//TODO: move the layout code into a separate class
function NodeWidget(nodes, index) {
	var nodeData = nodes[index];
	this.text = nodeData.text;
	
	this.xSpacing = 50;
	this.ySpacing = 50;
	
	if(nodeData.children != null) {
		this.children = nodeData.children.map(function(i) {
			if(!(i in gNodeWidgets)){
				gNodeWidgets[i] = new NodeWidget(nodes, i);
			}
			return gNodeWidgets[i];
		});
	}

	if(nodeData.visible != null) {
		this.visible = nodeData.visible.map(function(i) {
			if(!(i in gNodeWidgets)){
				gNodeWidgets[i] = new NodeWidget(nodes, i);
			}
			return gNodeWidgets[i];
		});
	}
	
	this.nodeElem = createNodeElem(nodeData);

	
	//Return the div containing this node and its children
	this.getLayoutDiv = function() {
		if(this._layoutDiv == null){
			if(this.children.length > 0) {
				this._layoutDiv = $("<div/>", {class:'layoutDiv'});
				this._layoutDiv.width(this.getWidthWithChildren());
				this._layoutDiv.height(this.getHeightWithChildren());

				for(var i=0; i<this.children.length; ++i){
					this._layoutDiv.append(this.children[i].getLayoutDiv());
				}
			} else {
				return this.nodeElem;
			}
		}
		return this._layoutDiv;
	}

	this.show = function() {
	    $('#nodeLayer').append(this.getLayoutDiv());
	}

	this.hide = function() {
	    $('#nodeLayer').remove(this.getLayoutDiv());
	}

	this.move = function(x, y) {
		this.nodeElem.css('left', x);
		this.nodeElem.css('top', y);
	}

	this.x =function() {
		return parseInt(this.nodeElem.css('left'));
	}

	this.y =function() {
		return parseInt(this.nodeElem.css('top'));
	}

	this.height = function() {
		this.nodeElem.height();
	}

	this.width = function() {
		this.nodeElem.width();
	}

	this.heightWithChildren = function() {
		var height = 0;
		if(this.children != null) {
			for(var i=0; i<this.children.length; ++i){
				height += this.children[i].heightWithChildren();
			}
			height += (this.children.length - 1) * this.ySpacing;
		} else {
			height = this.height();
		}
		//TODO: return max(height, cumulative height of children)
		return Math.max(this.height(), height);
	}

	this.widthWithChildren = function() {
		var width = this.width();
		var maxChildWidth = 0;
		
		if(this.children != null) {
			for(var i=0; i<this.children.length; ++i){
				maxChildWidth = Math.max(maxChildWidth, this.children[i].widthWithChildren());
			}
			width += xSpacing;
		}

		width += maxChildWidth;
		return width;
	}
}

function createNodeElem(nodeData) {
    var node = $("<div/>", {class:'node', id:'node'+nodeData.id, style:"position:absolute;"});
            
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
    var nodeElem = createNodeElem(nodeData, x, y);
    $('#nodeLayer').append(nodeElem);
    return $('#node'+nodeData.id);
}


function showNodeWithDescendents(nodes, id, x, y) {
    var nodeData = nodes[id];
    var nodeElem = showNodeAtPos(nodeData, x, y);

    x += nodeElem.width() + 50;

    var retVal = {height: nodeElem.height(), width: nodeElem.width()};

    if(nodeData.children != null) {
        var children = nodeData.children;
        console.log("children.length="+children.length);
        for(var i=0; i<children.length; ++i) {
            console.log("child:"+i);
            var r = showNodeWithDescendents(nodes, children[i], x, y);
            y += r.height + 50;
            retVal.height += r.height;
        }
    }

    return retVal;
}

function showNodes() {
	showNodeWithDescendents(nodes, 0, 0, 0);
}

function main() {
    // var canvas = createCanvas(800, 600);
    // $('#container').append(canvas);
    
    var nodeLayer = $("<div/>", {id:'nodeLayer'});
    $('#container').append(nodeLayer);

    showNodes();
    
    //var editor = createEditor(800, 400);
    //$('#container').append(editor);
    


    //var contentElem = $('#editor'); // my textarea

    //var node1 = createNodeElem(contentElem.val(), 400, 20);
    

    // use a simple timer to check if the textarea content has changed
    /*setInterval(function () {
        updateNode(node1, contentElem.val());
    }, 500);*/
};
