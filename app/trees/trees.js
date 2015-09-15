'use strict';

function Node(value) {
  this.key = value;
  this.parent = null;
  this.left = null;
  this.right = null;
}

function Tree() {
 this.root = null;
}

Tree.prototype.insert = function(value) {
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
};



Tree.prototype.delete = function(value) {

};

Tree.prototype.search = function(targetValue) {
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

Tree.prototype.minimum = function() {

};

Tree.prototype.maximum = function() {

};

Tree.prototype.traverseInOrder = function(processor) {
  var output = [];

  function walk(node) {
    if (!node) {
      return;
    }

    walk(node.left);
    if (processor) {
      processor(node.key, output.length);
    }

    output.push(node.key);
    walk(node.right);
  }

  walk(this.root);

  return output;
};

Tree.prototype.traversePostOrder = function() {
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

      var inorder = tree.traverseInOrder(function(node, index) {
        var height = tree.search(node).height,
            visualNode = {
              key: node,
              x: spacing * index,
              y: spacing * height
            };

        console.log(node, index, height);

        visualTree.push(visualNode);
      });

      $scope.tree = visualTree;

      return inorder;
    }

    $scope.treeUpdate = function() {
      var preorder = $scope.preorder.split(' ');

      tree = new Tree();

      //rebuild tree entirely
      preorder.forEach(function(value, index) {

        tree.insert(Number(value));
      });

      $scope.inorder = recomputeVisually().join(' ');
      $scope.postorder = tree.traversePostOrder().join(' ');


      //compute visual nodes
    };
}]);
