angular.module('geoinvviz', ['ionic', 'geoinvviz.services', 'geoinvviz.controllers'])


.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })

    .state('tab.notifications', {
      url: '/notifications',
      views: {
        'explorer-tab': {
          templateUrl: 'templates/notifications.html',
          controller: 'NotificationsCtrl'
        }
      }
    })

    .state('tab.proximitysearch', {
      url: '/proximitysearch',
      views: {
        'explorer-tab': {
          templateUrl: 'templates/proximitysearch.html',
          controller: 'ProximitySearchCtrl'
        }
      }
    })

    .state('tab.explorer', {
      url: '/explorer',
      views: {
        'explorer-tab': {
          templateUrl: 'templates/explorer.html',
          controller: 'ExplorerCtrl'
        }
      }
    })

    .state('tab.settings', {
      url: '/settings',
      views: {
        'settings-tab': {
          templateUrl: 'templates/settings.html',
          controller: 'SettingsCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/explorer');

});

