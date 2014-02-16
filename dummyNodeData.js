var nodes = {
    '0': {id:0, text:"Knowlege base", children:[1,2], visible:[1,2]}, //Root node
    '1':{id:1, text:"Computers", children:[3,4], visible:[3,4]},
    '2':{id:2, text:"Work", children:[4,3], visible:[4,3]},//Note the order of the nodes in the children's list specifies the order in which the nodes appear on the page
    '3':{id:3, text:"h1. Using this tool\n\nThis page lets you create HTML.\n* Type Textile text in the left window\n* See the HTML in the right'", children:null, visible:null},
    '4':{id:4, text:"\"It is described as\":http://textile.thresholdstate.com/:\nbq. Textile takes plain text with *simple* markup and produces valid XHTML.", children:null, visible:null},
};
