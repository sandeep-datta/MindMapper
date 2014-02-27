gNodeWidgets = {};

function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}

//TODO: move the layout code into a separate class
function NodeWidget(nodes, index) {
	var nodeData = nodes[index];
	this.text = nodeData.text;
	
	if(nodeData.children != null) {
		this.children = nodeData.children.map(function(i) {
			if(!(i in gNodeWidgets)){
				gNodeWidgets[i] = new NodeWidget(nodes, i);
			}
			return gNodeWidgets[i];
		});

		assert(this.children.length == nodeData.children.length);
	}



	//console.log(this.children);
	if(nodeData.visible != null) {
		this.visible = nodeData.visible.map(function(i) {
			if(!(i in gNodeWidgets)){
				gNodeWidgets[i] = new NodeWidget(nodes, i);
			}
			return gNodeWidgets[i];
		});
		//assert(this.visible.length == nodeData.visible.length);
	}
	
	this._nodeElem = createNodeElem(nodeData);

	this.getNodeElem = function() {
		return this._nodeElem;
	}

	//Return the div containing this node and its children
	this.getLayoutElem = function() {
		if(this._layoutElem == null) {
			//console.log("getLayoutElem():text:" + this.text);
			
			if(this.children != null && this.children.length > 0) {
				this._layoutElem = createHlayout();
				addElemToHLayout(this._layoutElem, this.getNodeElem());
				
				var vl = createVlayout();
				for(var i=0; i<this.children.length; ++i){
					var childLayout = this.children[i].getLayoutElem();
					addElemToVLayout(vl, childLayout);
				}
				
				addElemToHLayout(this._layoutElem, vl);
				
				//console.log("layoutHtml("+this.text+")"+":  "+this._layoutElem.get(0).outerHTML);
				
				//assert(this._layoutElem.children('tbody').children('tr').children('td').length == 2);
			} else {
				this._layoutElem = this.getNodeElem();
			}
		}
		return this._layoutElem;
	}

	this.show = function() {
	    $('#nodeLayer').append(this.getLayoutElem());
	}

	this.hide = function() {
	    $('#nodeLayer').remove(this.getLayoutElem());
	}

	this.x =function() {
		return parseInt(this._nodeElem.css('left'), 10);
	}

	this.y =function() {
		return parseInt(this._nodeElem.css('top'), 10);
	}

	this.height = function() {
		this._nodeElem.height();
	}

	this.width = function() {
		this._nodeElem.width();
	}
}



function createHlayout() {
	var table = $('<table/>', {'class':'hlayout'});
	var row = $('<tr/>');
	table.append(row);
	return table;
}

function createVlayout() {
	var table = $('<table/>', {'class':'vlayout'});
	return table;
}


function addElemToHLayout(hl, elem) {
	assert(elem.get(0).innerHTML.trim() != '');
	var data = $('<td/>');
	data.append(elem);
	hl.find('tr').first().append(data);
}

function addElemToVLayout(vl, elem) {
	assert(elem.get(0).innerHTML.trim() != '');
	//console.log("addElemToVLayout(): elem=" + elem.get(0).outerHTML);
	var data = $('<td/>');
	data.append(elem);
	var row = $('<tr/>');
	row.append(data);
	vl.append(row);
}


function createNodeElem(nodeData) {
    var node = $("<div/>", {'class':'node', id:'node'+nodeData.id});
            
    var input = $('<input/>',{
        type: "hidden",
        name: "text",
        value: nodeData.text
    });
    node.append(input);

    var content = $("<div/>", {name:'content', style:'max-width:800px; width:auto;'});
    var html = textile.convert(nodeData.text);
    content.html($.parseHTML(html));

    node.append(content);
    return node;
}

function updateNode(nodeElem, newText) {
    var textElem = nodeElem.children('input[name="text"]');
    var text = "";
    if(textElem.length !== 0) {
        text = textElem.val();
    }
    if (text != newText) {
        var html = textile.convert(newText);
        textElem.val(newText);
        var contentElem = node.children('div[name="content"]');
        contentElem.html($.parseHTML(html));
    }
}

function createEditor(width, height) {
    var editor = $("<textarea/>", {'class':'editor', 'width': width, 'height':height, id:'editor'});
    return editor;
}


function showNodes() {
	var root = new NodeWidget(nodes, 0);
	root.show();
}

function drawIntro(svg) { 
    svg.circle(75, 75, 50, 
        {fill: 'none', stroke: 'red', strokeWidth: 3}); 
    var g = svg.group({stroke: 'black', strokeWidth: 2}); 
    svg.line(g, 15, 75, 135, 75); 
    svg.line(g, 75, 15, 75, 135); 
}

function showConnectors() {
	//var nodeLayer = $('#nodeLayer');
	$('#nodeLayer').svg({onLoad: drawIntro});

}

function main() {
    // var canvas = createCanvas(800, 600);
    // $('#container').append(canvas);
    
    var nodeLayer = $("<div/>", {id:'nodeLayer'});
    $('#container').append(nodeLayer);

    showNodes();
    showConnectors();
    
    //var editor = createEditor(800, 400);
    //$('#container').append(editor);
    


    //var contentElem = $('#editor'); // my textarea

    //var node1 = createNodeElem(contentElem.val(), 400, 20);
    

    // use a simple timer to check if the textarea content has changed
    /*setInterval(function () {
        updateNode(node1, contentElem.val());
    }, 500);*/
}
