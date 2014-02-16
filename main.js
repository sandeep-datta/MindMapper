function createNode(markdown, x, y) {
    var node = $("<div/>", {class:'node', style:"position:absolute; top:"+y+"px; left:"+x+"px;"});
            
    var input = $('<input/>',{
        type: "hidden",
        name: "markdown",
        value: markdown
    });
    node.append(input);

    var content = $("<div/>", {name:'content', style:'max-width:800px; width:auto; height:auto;'});
    var html = textile.convert(markdown);
    content.html($.parseHTML(html));

    node.append(content);
    return node;
}

function updateNode(node, newMarkdown) {
    var markdownElem = node.children('input[name="markdown"]');
    var markdown = "";
    if(markdownElem.length != 0) {
        markdown = markdownElem.val();
    }
    if (markdown != newMarkdown) {
        var html = textile.convert(newMarkdown);
        markdownElem.val(newMarkdown);
        var contentElem = node.children('div[name="content"]');
        contentElem.html($.parseHTML(html));
    }
}

function main() {
    var contentElem = $('#editor'); // my textarea

    var node1 = createNode(contentElem.val(), 20, 20);
    $('#nodeContainer').append(node1);
    

    // use a simple timer to check if the textarea content has changed
    setInterval(function () {
        updateNode(node1, contentElem.val());
    }, 500);
};
