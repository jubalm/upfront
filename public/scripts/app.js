angular.module('app', ['ngSanitize', 'restangular'])

.controller('SearchController', function($scope, $http, $filter, $sce, Restangular, FuzzyMatch) {

  // get all pages
  $scope.pages = Restangular.all('pages')
    .getList()
    .$object;

  $scope.$watch('pageSearch', function(newValue, oldValue) {

    // when input is empty
    if (!newValue) {
      $scope.searchResult = $scope.pages;
      $scope.searchHint = '';
      $scope.pageSelected = -1;
      return;
    }

    var pages = $scope.pages.plain();

    // add scores to results
    pages.map(function(page) {

      var titlerank = FuzzyMatch(page.title, newValue);
      var contentrank = FuzzyMatch(page.content, newValue);

      page.score = titlerank.score + (contentrank.score * 0.5);
      page.titleHilited = titlerank.highlightedTerm;
      page.contentHilited = contentrank.highlightedTerm;

      return page;

    });

    // return the sorted pages
    $scope.searchResult = $filter('orderBy')(pages, 'score', true);

    var hint = $scope.searchResult[0].title;

    // set search hint
    $scope.searchHint = (!hint.indexOf(newValue)) ? $scope.searchResult[0].title : '';

    // reset selected page
    $scope.pageSelected = 0;

  });

  $scope.pageSelected = -1;
  $scope.select = function(event) {
    switch (event.keyCode) {
      // down
      case 40:
        if ($scope.pageSelected < $scope.pages.length - 1) {
          $scope.pageSelected++;
        }
        break;
        // up
      case 38:
        if ($scope.pageSelected > -1) {
          $scope.pageSelected--;
        }
        break;
        // right
      case 39:
        if ($scope.pageSelected === -1) { break; }
        $scope.pageSearch = $scope.searchResult[$scope.pageSelected].title;
        break;
        // enter
      case 13:
        if ($scope.pageSelected === -1) { break; }
        console.log($scope.searchResult[$scope.pageSelected].title);
        break;
    }

  };

})

.factory('FuzzyMatch', function($window) {
  return $window.fuzzy;
})

.config(function(RestangularProvider) {
  RestangularProvider.setBaseUrl('/api/v1');
});
