/* global MLSearchController */
(function () {
  'use strict';

  angular.module('app.search')
    .controller('SearchCtrl', SearchCtrl)
    .filter('nameFilter', NameFilter);

  function NameFilter () {
    return function(input) {
      var txt = '';
      var x2js = new X2JS();
      txt = x2js.xml_str2json(input).envelope.content.consultant.ConsultantName;

      return txt;
    };
  }

  SearchCtrl.$inject = ['$scope', '$location', 'MLSearchFactory',
  'x2js', '$log'];

  // inherit from MLSearchController
  var superCtrl = MLSearchController.prototype;
  SearchCtrl.prototype = Object.create(superCtrl);

  function SearchCtrl($scope, $location, searchFactory, x2js, $log) {
    var ctrl = this;

    superCtrl.constructor.call(ctrl, $scope, $location, searchFactory.newContext());

    ctrl.init();

    ctrl.setSnippet = function(type) {
      ctrl.mlSearch.setSnippet(type);
      ctrl.search();
    };


    $scope.$watch(function(){
      return ctrl.response.results;
    }, function (newVal, oldVal) {
      //transform
      var results = [];

      angular.forEach(ctrl.response.results, function (result) {
        result.extracted.transformed = x2js.xml_str2json(result.extracted.content[0]);
        $log.debug('result.extracted.transformed', result.extracted.transformed);
        results.push(result);
      });

      ctrl.results = results;
    });

  }
}());
