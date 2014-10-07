angular.module('geoinvviz.controllers', [])

.directive('noScroll', function($document) {

  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {

      $document.on('touchmove', function(e) {
        e.preventDefault();
      });
    }
  }
})


.controller('NotificationsCtrl', function($scope, $location, $ionicModal, NotificationsService, ProximitySearchService) {
    $scope.settings = {};
    $scope.settings.isProximityBasedSearch = ProximitySearchService.getIsProximityBasedSearch();
    
	var myLatlng = new google.maps.LatLng(33.730318,-84.380976);
	  var mapOptions = {
	    zoom: 4,
	    center: myLatlng
	  }
	  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	  NotificationsService.setMap(map);
      var bounds = new google.maps.LatLngBounds();
      NotificationsService.setBounds(bounds);


	  $ionicModal.fromTemplateUrl('modal.html', function($ionicModal) {
            $scope.modal = $ionicModal;
        }, 
        {
            // Use our scope for the scope of the modal to keep it simple
            scope: $scope,
            // The animation we want to use for the modal entrance
            animation: 'slide-in-up'
        });

        var radiusToUse;
            if(!$scope.settings.isProximityBasedSearch){
                radiusToUse = null;
            }else{
                radiusToUse = ProximitySearchService.getSelectedRadiusValue()*1000;
            }
	  $scope.showNotificationsModal = function(){
	  	NotificationsService.getAllNotifications(radiusToUse)
	  	 .then(
                            function(data){
                            	$scope.notifications = data;
                            },
                            function( errorMessage ) {
 
                                console.warn( errorMessage );
 
                            }
                        );
	  	$scope.modal.show();
	  }


	  $scope.readNotification = function(notification){
	  	

	  	//TODO - comment this
	  	var radius, currentLat, currentLng;

	  	var isProximityBasedSearch = ProximitySearchService.getIsProximityBasedSearch();

	  	if(!isProximityBasedSearch){
	  		radius = null;
	  		currentLat = null;
	  		currentLng = null;	
	  	}else{
	  		//Get the current latitude and longitude
	  		radius = NotificationsService.getSelectedRadiusValue();
	  		currentLat = 33.730318;
	  		currentLng = -84.380976;	
	  	}

	  	NotificationsService.setNotificationReadStatus(notification).then(
                            function(data){

                            },
                            function( errorMessage ) {
 
                                console.warn( errorMessage );
 
                            }
                        );

	  	NotificationsService.getNotificationDetailById(radius, 
	  		currentLat, currentLng, notification["_id"])
	  	.then(
                            function(data){
                            	$scope.notificationDetail = data;
                            	$scope.notificationClickedOnMap = {};
							  	plotDevicesOnMap(NotificationsService, $scope.notificationDetail, $scope);

								
                            },
                            function( errorMessage ) {
 
                                console.warn( errorMessage );
 
                            }
                        );

	  	//var notificationToView  = NotificationsService.getNotificationDetailById(radius, 
	  		//currentLat, currentLng, notification.notificationid);

	  	$scope.modal.hide();

	  }


	  $scope.markNotificationDone = function(notification){
	  	NotificationsService.markNotificationDone(notification)
	  	.then(
                            function(data){
                            	notification.status = 'Complete';
                            },
                            function( errorMessage ) {
 
                                console.warn( errorMessage );
 
                            }
                        );
	  }

	  $scope.isDeviceStatusComplete = false;

	  $scope.markDeviceDone = function(notificationClickedOnMap){
	  	NotificationsService.markDeviceDone(notification)
	  	.then(
                            function(data){
                            	notificationClickedOnMap.status = 'Complete';
                            	$scope.isDeviceStatusComplete = true;
                            },
                            function( errorMessage ) {
 
                                console.warn( errorMessage );
 
                            }
                        );
	  }

	   $scope.slider = {};
	    $scope.slider.rangeValue = 3;
	    
	    $scope.$watch('slider.rangeValue',function(val,old){
	       $scope.slider.rangeValue = parseInt(val);
	       NotificationsService.setSelectedRadiusValue($scope.slider.rangeValue);
           NotificationsService.getAllNotifications(NotificationsService.getSelectedRadiusValue()*1000)
	  	 .then(
                            function(data){
                            	$scope.notifications = data;
                            },
                            function( errorMessage ) {
 
                                console.warn( errorMessage );
 
                            }
                        );
	    });


	   /*$scope.stocks = [];

	   var socket = io.connect('http://localhost:3000');
  
	  socket.on('msg', function(data) {
			$scope.stocks = JSON.parse(data.msg);
			//$scope.notes.push(data);
		});*/
})

.controller('ProximitySearchCtrl', function($scope, $location, ProximitySearchService) {
    
    $scope.settings = {};
    $scope.settings.isProximityBasedSearch = ProximitySearchService.getIsProximityBasedSearch();
    
	 $scope.slider = {};
	    $scope.slider.rangeValue = 3;
	    
	    $scope.$watch('slider.rangeValue',function(val,old){
	       $scope.slider.rangeValue = parseInt(val);
	       ProximitySearchService.setSelectedRadiusValue($scope.slider.rangeValue);
            var radiusToUse;
            if(!$scope.settings.isProximityBasedSearch){
                radiusToUse = null;
            }else{
                radiusToUse = ProximitySearchService.getSelectedRadiusValue()*1000;
            }
            ProximitySearchService.getAllDevicesInProximity(radiusToUse)
	  	 .then(
            function(data){
                $scope.allnotifications = data;
                plotDevicesOnMapProximity(ProximitySearchService, $scope)
                
            },
            function( errorMessage ) {

                console.warn( errorMessage );

            }
        );
	    });
    var myLatlng = new google.maps.LatLng(33.730318,-84.380976);
	  var mapOptions = {
	    zoom: 4,
	    center: myLatlng
	  }
	  var map = new google.maps.Map(document.getElementById('map-canvas-1'), mapOptions);
      var bounds = new google.maps.LatLngBounds();
	  ProximitySearchService.setMap(map);
      ProximitySearchService.setBounds(bounds);
      
    
    ProximitySearchService.getAllDevicesInProximity(ProximitySearchService.getSelectedRadiusValue()*1000)
	  	 .then(
            function(data){
                $scope.allnotifications = data;
                plotDevicesOnMapProximity(ProximitySearchService, $scope)
                
            },
            function( errorMessage ) {

                console.warn( errorMessage );

            }
        );
})

.controller('SettingsCtrl', function($scope, $location, ProximitySearchService) {
	$scope.settings = {};
	$scope.settings.isProximityBasedSearch = ProximitySearchService.getIsProximityBasedSearch();

	$scope.$watch('settings.isProximityBasedSearch', function(newValue, oldValue) {
	  ProximitySearchService.setIsProximityBasedSearch(newValue);
	});

	$scope.changeProximitySearchSetting = function(){
		ProximitySearchService.setIsProximityBasedSearch(!$scope.settings.isProximityBasedSearch);
	}
})

.controller('ExplorerCtrl', function($scope, $location, ExplorerService, ProximitySearchService) {
	$scope.explorer = ExplorerService.getExplorer();

	$scope.displayExploreChoices = function(explorerTypeId){
		if(explorerTypeId === 1){
			$location.path('/tab/proximitysearch');
		} else if(explorerTypeId === 2){
			$location.path('/tab/notifications');
		}
	}
});

function plotDevicesOnMap(NotificationsService, notificationDetail, $scope){

	var devicesToPlot = notificationDetail.devices;
    NotificationsService.clearMarkers();
    var bounds = NotificationsService.getBounds();
	NotificationsService.clearMarkers();
	for (var i = 0; i < devicesToPlot.length ; i++) {

		var deviceLocation = devicesToPlot[i].location.coordinates;
		var lat = deviceLocation[1];
		var lng = deviceLocation[0];

		var map = NotificationsService.getMap();

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lng),
            map: map
        });
        bounds.extend(new google.maps.LatLng(lat,lng));
        NotificationsService.putMarkerNotificationMapping(marker, devicesToPlot[i]);
        NotificationsService.addCurrentMarkers(marker);

		google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
            	var infowindow = new google.maps.InfoWindow({});
            	var markerNotificationsMap = NotificationsService.getMarkerNotificationMapping();
            	for(var i =0; i<markerNotificationsMap.length; i++){
            		if(marker === markerNotificationsMap[i].marker){
            			$scope.notificationClickedOnMap = markerNotificationsMap[i].notification;
            			$scope.$apply();
            			break;
            		}
            	}
            }
        })(marker, i));

    }
    map.setCenter(bounds.getCenter());
    map.fitBounds(bounds);
}


function plotDevicesOnMapProximity(ProximitySearchService, $scope){

	var allnotifications = $scope.allnotifications;
    ProximitySearchService.clearMarkers();
    var bounds = ProximitySearchService.getBounds();
    var map = ProximitySearchService.getMap();
    for (var j = 0; j < allnotifications.length ; j++) {
        var notid = allnotifications[j]._id;
        var devicesToPlot = allnotifications[j].devices;
        for (var i = 0; i < devicesToPlot.length ; i++) {

            var deviceLocation = devicesToPlot[i].location.coordinates;
            var lat = deviceLocation[1];
            var lng = deviceLocation[0];
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(lat, lng),
                map: map
            });
            
            bounds.extend(new google.maps.LatLng(lat,lng));
            ProximitySearchService.putMarkerNotificationMapping(marker, {notid : allnotifications[j]._id, notdesc : allnotifications[j].description, device : devicesToPlot[i] });
            ProximitySearchService.addCurrentMarkers(marker);

            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                    var infowindow = new google.maps.InfoWindow({});
                    var markerNotificationsMap = ProximitySearchService.getMarkerNotificationMapping();
                    for(var i =0; i<markerNotificationsMap.length; i++){
                        if(marker === markerNotificationsMap[i].marker){
                            $scope.devicedetails = markerNotificationsMap[i].devicedetails;
                            $scope.$apply();
                            break;
                        }
                    }
                }
            })(marker, i));


        }
        map.setCenter(bounds.getCenter());
        map.fitBounds(bounds);
    }
    
	
	
}