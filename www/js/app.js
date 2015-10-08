// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
( IIFE)(window);
function IIFE(window) {
  var reditApp = angular.module('MyReditApp', ['ionic','angularMoment']);

  reditApp.controller('NewsController', ['$scope', '$http', function ($scope, $http) {
    $scope.newsList = [];

    $scope.moreDataCanBeLoaded = function(){
      if($scope.newsList.length >= 1500) {return false;}
      else {return true;}

    };

    var loadNews = function(params,callback) {
      $http.get('https://www.reddit.com/r/machinelearning/new/.json',{params:params}).
        then(function (response) {
        callback(response);
        }, function (response) {
          alert("Response status:" + response.status);
        });
    };
    $scope.loadLatestNews = function(){
      var params = {};
      params['before'] = $scope.newsList[0].data.name;

      var addNewsAtStart = function(response){
        var baseObj = response.data.data.children;

        //Replacement for self/default images
        angular.forEach(baseObj,function(child){
          if(child.data.thumbnail=='self' || child.data.thumbnail == 'default' || child.data.thumbnail == '') {
            child.data.thumbnail='https://www.redditstatic.com/about/assets/reddit-alien.png';
          }
        });

        $scope.newsList= baseObj.concat($scope.newsList);
        $scope.$broadcast('scroll.refreshComplete');
      };
      loadNews(params,addNewsAtStart);
    };

    $scope.loadOldNews = function(){

      var params={};

      if($scope.newsList.length>0) {
        params['after'] = $scope.newsList[$scope.newsList.length - 1].data.name;
      }

      var addNewsAtEnd = function(response){
        var baseObj = response.data.data.children;

        //Replacement for self/default images
        angular.forEach(baseObj,function(child){
          if(child.data.thumbnail=='self' || child.data.thumbnail == 'default' || child.data.thumbnail == '') {
            child.data.thumbnail='https://www.redditstatic.com/about/assets/reddit-alien.png';
          }
        });

        $scope.newsList = $scope.newsList.concat(baseObj);
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };

      loadNews(params,addNewsAtEnd);

    };

    $scope.ClickNews = function(url) {
      window.open(url,'_blank');
    };


  }
  ]);

  reditApp.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }

      if (window.cordova && window.cordova.plugins.InAppBrowser) {
        window.open = window.cordova.InAppBrowser.open;
      }

      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })

}
