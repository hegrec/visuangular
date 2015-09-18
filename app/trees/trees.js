'use strict';

function Node(value) {
  this.key = value;
  this.parent = null;
  this.left = null;
  this.right = null;
  this.colored = true; //starts out red
}

function RBTree() {
 this.root = null;
}

RBTree.prototype.insert = function(value) {
  var found = this.search(value);
  if (found.node) {
    return;
  }

  var target = this.root,
      working = null;
  while (target != null) {
    working = target;
    if (value < target.key) {
      target = target.left;
    } else {
      target = target.right;
    }
  }

  var node = new Node(value);
  node.parent = working;

  if (working == null) {
    this.root = node;
  } else if (node.key < working.key) {
    working.left = node;
  } else {
    working.right = node;
  }
  console.log(working);
  this.fixupRB(node);
};

RBTree.prototype.fixupRB = function(newNode) {
  var working = null;

  while (newNode.parent && newNode.parent.colored) {
    if (newNode.parent == newNode.parent.parent.left) {
      working = newNode.parent.parent.right;

      if (working && working.colored) { //If uncle is red, grandparent must have been black, flip parent, grand, and uncle
        newNode.parent.colored = false;
        working.colored = false;
        newNode.parent.parent.colored = true;
        newNode = newNode.parent.parent;
      } else {
        if (newNode == newNode.parent.right) {
          newNode = newNode.parent;
          this.rotateLeft(newNode);
        }

        newNode.parent.colored = false;
        newNode.parent.parent.colored = true;
        this.rotateRight(newNode.parent.parent);
      }

    } else {
      working = newNode.parent.parent.left;

      if (working && working.colored) { //If uncle is red, grandparent must have been black, flip parent, grand, and uncle
        newNode.parent.colored = false;
        working.colored = false;
        newNode.parent.parent.colored = true;
        newNode = newNode.parent.parent;

      } else {
        if (newNode == newNode.parent.left) {
          newNode = newNode.parent;
          this.rotateRight(newNode);
        }

        newNode.parent.colored = false;
        newNode.parent.parent.colored = true;
        this.rotateLeft(newNode.parent.parent);
      }
    }
  }

  this.root.colored = false;
};

RBTree.prototype.delete = function(value) {

};

RBTree.prototype.rotateLeft = function(node) {
  var right = node.right;

  // Attach the successor of 'node' directly to it
  node.right = right.left;

  if (right.left) {
    right.left.parent = node;
  }

  right.parent = node.parent;

  if (node.parent == null) {
    this.root = right;
  } else if (node == node.parent.left) {
    node.parent.left = right;
  } else {
    node.parent.right = right;
  }

  right.left = node;
  node.parent = right;
};

RBTree.prototype.rotateRight = function(node) {
  var left = node.left;

  // Attach the successor of 'node' directly to it
  node.left = left.right;

  if (left.right) {
    left.right.parent = node;
  }

  left.parent = node.parent;

  if (node.parent == null) {
    this.root = left;
  } else if (node == node.parent.right) {
    node.parent.right = left;
  } else {
    node.parent.left = left;
  }

  left.right = node;
  node.parent = left;
};

RBTree.prototype.search = function(targetValue) {
  var workingNode = this.root;
  var height = 0;
  while (workingNode != null && workingNode.key != targetValue) {
    height ++;
    if (targetValue < workingNode.key) {
      workingNode = workingNode.left;
    } else {
      workingNode = workingNode.right;
    }
  }

  return {
    node: workingNode,
    height: height
  };
};

RBTree.prototype.minimum = function() {

};

RBTree.prototype.maximum = function() {

};

RBTree.prototype.traverseInOrder = function(processor) {
  var output = [];

  function walk(node) {

    if (!node) {
      return;
    }

    walk(node.left);
    console.log(node.key);
    if (processor) {
      processor(node.key, node.colored, output.length);
    }

    output.push(node.key);
    walk(node.right);
  }

  walk(this.root);

  return output;
};

RBTree.prototype.traversePostOrder = function() {
  var output = [];
  function walk(node) {
    if (!node) return;
    walk(node.left);
    walk(node.right);
    output.push(node.key);
  }

  walk(this.root);

  return output;
};


angular.module('myApp.trees', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/trees', {
    templateUrl: 'trees/trees.html',
    controller: 'TreesCtrl'
  });
}])

.controller('TreesCtrl', ['$scope', function($scope) {
  var tree;
  $scope.tree = [];

    function recomputeVisually() {
      var visualTree = [],
          spacing = 40; //pixels
      console.log(tree.root);
      var inorder = tree.traverseInOrder(function(node, colored, index) {
        var height = tree.search(node).height,
            visualNode = {
              key: node,
              x: spacing * index,
              y: spacing * height,
              colored: colored
            };

        visualTree.push(visualNode);
      });

      $scope.tree = visualTree;

      return inorder;
    }

    $scope.treeUpdate = function() {
      var preorder = $scope.preorder.split(' ');

      tree = new RBTree();

      //rebuild tree entirely
      preorder.forEach(function(value, index) {

        tree.insert(Number(value));
      });

      $scope.inorder = recomputeVisually().join(' ');
      $scope.postorder = tree.traversePostOrder().join(' ');


      //compute visual nodes
    };
}]);
