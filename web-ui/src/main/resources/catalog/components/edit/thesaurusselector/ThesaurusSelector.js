(function() {
  goog.provide('gn_thesaurus_selector');

  var module = angular.module('gn_thesaurus_selector', []);

  /**
     *
     *
     */
  module.directive('gnThesaurusSelector',
      ['$http', '$rootScope', '$timeout',
       'gnThesaurusManagerService', 'gnMetadataManagerService',
       function($http, $rootScope, $timeout,
       gnThesaurusManagerService, gnMetadataManagerService) {

         return {
           restrict: 'A',
           replace: true,
           transclude: true,
           scope: {
             mode: '@gnThesaurusSelector',
             elementName: '@',
             elementRef: '@'
           },
           templateUrl: '../../catalog/components/edit/' +
           'thesaurusselector/partials/' +
           'thesaurusselector.html',
           link: function(scope, element, attrs) {
             scope.thesaurus = {};
             scope.snippet = null;
             scope.snippetRef = null;

             // TODO: Remove from list existing thesaurus 
             // in the record ?
             gnThesaurusManagerService.getThesaurusList().then(
             function(data) {
               // TODO: Sort them
               scope.thesaurus = data;
             });

             scope.add = function(thesaurusIdentifier) {
               gnThesaurusManagerService
               .getThesaurusSnippet(thesaurusIdentifier).then(
               function(data) {
                 // Add the fragment to the form
                 scope.snippet = '<' + scope.elementName +
                 " xmlns:gmd='http://www.isotc211.org/2005/gmd'>" +
                 data + '</' + scope.elementName + '>';
                 scope.snippetRef = '_X' + scope.elementRef +
                 '_' + scope.elementName.replace(':', 'COLON');

                 // FIXME : time out may not be the best options.
                 // We need to have the form updated before saving
                 // edits
                 $timeout(function() {
                   // Save the metadata and refresh the form
                   $rootScope.$broadcast('SaveEdits', true);
                 }, 200);

               });
               return false;
             };
           }
         };
       }]);
})();
