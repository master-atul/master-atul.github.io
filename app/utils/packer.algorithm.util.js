/** ****************************************************************************
This is a binary tree based bin packing algorithm that is more complex than
the simple Packer (packer.js). Instead of starting off with a fixed width and
height, it starts with the width and height of the first block passed and then
grows as necessary to accomodate each subsequent block. As it grows it attempts
to maintain a roughly square ratio by making 'smart' choices about whether to
grow right or down.
When growing, the algorithm can only grow to the right OR down. Therefore, if
the new block is BOTH wider and taller than the current target then it will be
rejected. This makes it very important to initialize with a sensible starting
width and height. If you are providing sorted input (largest first) then this
will not be an issue.
A potential way to solve this limitation would be to allow growth in BOTH
directions at once, but this requires maintaining a more complex tree
with 3 children (down, right and center) and that complexity can be avoided
by simply chosing a sensible starting block.
Best results occur when the input blocks are sorted by height, or even better
when sorted by max(width,height).
Inputs:
------
  blocks: array of any objects that have .width and .height attributes
Outputs:
-------
  marks each block that fits with a .fit attribute pointing to a
  node with .x and .y coordinates
Example:
-------
  const blocks = [
    { width: 100, height: 100 },
    { width: 100, height: 100 },
    { width:  80, height:  80 },
    { width:  80, height:  80 },
    etc
    etc
  ];
  const packer = new GrowingPacker();
  packer.fit(blocks);
  for(const n = 0 ; n < blocks.length ; n++) {
    const block = blocks[n];
    if (block.fit) {
      Draw(block.fit.x, block.fit.y, block.width, block.height);
    }
  }
******************************************************************************/

const GrowingPacker = function (width, height) {
  this.init(width, height);
};

GrowingPacker.prototype = {
  init: function (width, height) {
    const aspectRatio = width / height;
    this.aspectRatio = (aspectRatio > 1) ? (width / height) : (height / width);
    this.root = {x: 0, y: 0, width: width, height: height};
  },
  fit: function (blocks) {
    let n, node, block, len = blocks.length;
    for (n = 0; n < len; n++) {
      block = blocks[n];
      node = this.findNode(this.root, block.width, block.height);
      if (node)
        block.fit = this.splitNode(node, block.width, block.height);
      else
        block.fit = this.growNode(block.width, block.height);
    }
  },

  findNode: function (root, width, height) {
    if (root.used)
      return this.findNode(root.right, width, height) || this.findNode(root.down, width, height);
    else if ((width <= root.width) && (height <= root.height))
      return root;
    else
      return null;
  },

  splitNode: function (node, width, height) {
    node.used = true;
    node.down  = {x: node.x,     y: node.y + height, width: node.width,     height: node.height - height};
    node.right = {x: node.x + width, y: node.y,     width: node.width - width, height: height};
    return node;
  },

  growNode: function (width, height) {
    const canGrowDown  = (width <= this.root.width);
    const canGrowRight = (height <= this.root.height);

    const shouldGrowRight = canGrowRight && (this.root.height * (this.aspectRatio) >= (this.root.width + width)); // attempt to keep square-ish by growing right when height is much greater than width
    const shouldGrowDown  = canGrowDown  && (this.root.width * (1 / this.aspectRatio) >= (this.root.height + height)); // attempt to keep square-ish by growing down  when width  is much greater than height

    if (shouldGrowRight)
      return this.growRight(width, height);
    else if (shouldGrowDown)
      return this.growDown(width, height);
    else if (canGrowRight)
      return this.growRight(width, height);
    else if (canGrowDown)
      return this.growDown(width, height);
    else
      return null; // need to ensure sensible root starting size to avoid this happening
  },

  growRight: function (width, height) {
    const newWidth = this.root.width + width;
    const newHeight = newWidth * (1 / this.aspectRatio);
    this.root = {
      used: true,
      x: 0,
      y: 0,
      width: newWidth,
      height: newHeight,
      down: this.root,
      right: {x: this.root.width, y: 0, width: width, height: newHeight}
    };
    const node = this.findNode(this.root, width, height);
    if (node)
      return this.splitNode(node, width, height);
    else
      return null;
  },

  growDown: function (width, height) {
    const newHeight = this.root.height + height;
    const newWidth = newHeight * this.aspectRatio;
    this.root = {
      used: true,
      x: 0,
      y: 0,
      width: newWidth,
      height: newHeight,
      down: {x: 0, y: this.root.height, width: newWidth, height: height},
      right: this.root
    };
    const node = this.findNode(this.root, width, height);
    if (node)
      return this.splitNode(node, width, height);
    else
      return null;
  }

};

export default GrowingPacker;



/** ****************************************************************************
This is a very simple binary tree based bin packing algorithm that is initialized
with a fixed width and height and will fit each block into the first node where
it fits and then split that node into 2 parts (down and right) to track the
remaining whitespace.
Best results occur when the input blocks are sorted by height, or even better
when sorted by max(width,height).
Inputs:
------
  width:       width of target rectangle
  height:      height of target rectangle
  blocks: array of any objects that have .width and .height attributes
Outputs:
-------
  marks each block that fits with a .fit attribute pointing to a
  node with .x and .y coordinates
Example:
-------
  var blocks = [
    { width: 100, height: 100 },
    { width: 100, height: 100 },
    { width:  80, height:  80 },
    { width:  80, height:  80 },
    etc
    etc
  ];
  var packer = new Packer(500, 500);
  packer.fit(blocks);
  for(var n = 0 ; n < blocks.length ; n++) {
    var block = blocks[n];
    if (block.fit) {
      Draw(block.fit.x, block.fit.y, block.width, block.height);
    }
  }
******************************************************************************/

const Packer = function (width, height) {
  this.init(width, height);
};

Packer.prototype = {
  init: function (width, height) {
    this.root = {x: 0, y: 0, width: width, height: height};
  },

  fit: function (blocks) {
    var n, node, block;
    for (n = 0; n < blocks.length; n++) {
      block = blocks[n];
      node = this.findNode(this.root, block.width, block.height);
      if (node)
        block.fit = this.splitNode(node, block.width, block.height);
    }
  },

  findNode: function (root, width, height) {
    if (root.used)
      return this.findNode(root.right, width, height) || this.findNode(root.down, width, height);
    else if ((width <= root.width) && (height <= root.height))
      return root;
    else
      return null;
  },

  splitNode: function (node, width, height) {
    node.used = true;
    node.down  = {x: node.x, y: node.y + height, width: node.width, height: node.height - height};
    node.right = {x: node.x + width, y: node.y,  width: node.width - width, height: height};
    return node;
  }
};

export const FixedSizePacker = Packer;
