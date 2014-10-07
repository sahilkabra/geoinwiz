angular.module('geoinvviz.services', [])

.factory('NotificationsService', function($http, $q) {


        return({
            getAllNotifications: getAllNotifications,
            getNotificationDetailById: getNotificationDetailById,
            setMap: setMap,
            getMap: getMap,
            setSelectedRadiusValue: setSelectedRadiusValue,
            getSelectedRadiusValue: getSelectedRadiusValue,
            putMarkerNotificationMapping: putMarkerNotificationMapping,
            getMarkerNotificationMapping: getMarkerNotificationMapping,
            addCurrentMarkers : addCurrentMarkers,
            clearMarkers : clearMarkers,
            setNotificationReadStatus: setNotificationReadStatus,
            markNotificationDone: markNotificationDone,
            markDeviceDone: markDeviceDone,
            setBounds : setBounds,
            getBounds : getBounds

        });

        function getAllNotifications(radius){
            

            var request = $http({
                        method: "get",
                        url: "http://indlinvh207:11001/geoinwiz/1/notifications",
                        params: {
                            radius : radius,
                            lng : -84.380976,
                            lat : 33.730318
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );


            

        }

        function handleError( response ) {
 
                    // The API response from the server should be returned in a
                    // nomralized format. However, if the request was not handled by the
                    // server (or what not handles properly - ex. server error), then we
                    // may have to normalize it on our end, as best we can.
                    if (
                        ! angular.isObject( response.data ) ||
                        ! response.data.message
                        ) {
 
                        return( $q.reject( "An unknown error occurred." ) );
 
                    }
 
                    // Otherwise, use expected error message.
                    return( $q.reject( response.data.message ) );
 
                }
 
 
                // I transform the successful response, unwrapping the application data
                // from the API response payload.
               function handleSuccess( response ) {
 
                    return( response.data );
 
                }

       function getNotificationDetailById(radius, currentLat, currentLng, notificationid){
            /*var notificationDetail = {
                "notificationid": "1",
                "devices": [
                    {
                        "deviceid": "1",
                        "type": "Faulty",
                        "name": "Device 1",
                        "location": {
                            "lat": "34.22",
                            "lng": "56.22"
                        },
                        "description": "This is test device Device 1"
                    }
                ]
            };*/

            var requestUrl = "http://indlinvh207:11001/geoinwiz/1/notifications/" + notificationid;
            var request = $http({
                        method: "get",
                        url: requestUrl,
                        params: {
                            
                        }
                    });
 
                    return( request.then( handleSuccess, handleError ) );
        }

        function setMap(map){
            this.map = map;
        }

        function getMap(){
            return this.map;
        }
    
        function setBounds(bounds){
            this.bounds = bounds;
        }
    
        function getBounds(){
            return this.bounds;
        }

        function setSelectedRadiusValue(radius){
            this.radius = radius;
        }

        function getSelectedRadiusValue(){
            return this.radius;
        }

        function putMarkerNotificationMapping(marker, notificationDetail){
            this.markerNotificationObj = {};
            this.markerNotificationObj.marker = marker;
            this.markerNotificationObj.notification = notificationDetail;

             if(! this.markerNotificationsArr) {
                 this.markerNotificationsArr = [];
            }
            this.markerNotificationsArr.push(this.markerNotificationObj);
        }

        function getMarkerNotificationMapping(){
            return this.markerNotificationsArr;
        }

        function addCurrentMarkers(marker){
            if(!this.currentMarkers){
                this.currentMarkers = [];
            }
            this.currentMarkers.push(marker);
        }

        function clearMarkers(){
            if(this.currentMarkers){
                for(var i=0; i<this.currentMarkers.length; i++){
                    this.currentMarkers[i].setMap(null);
                }
                this.currentMarkers = [];
            }
            
        }

        function setNotificationReadStatus(notification){
            if(notification.status !== 'Complete'){
                var requestUrl = "http://indlinvh207:11001/geoinwiz/1/notifications/" + notification["_id"];
                var request = $http({
                        method: "get",
                        url: requestUrl,
                    params : {read : notification.read}
                    });
 
                    return( request.then( handleSuccess, handleError ) );    
            }
            
        }

        function markNotificationDone(notification){
            var requestUrl = "http://indlinvh207:11001/geoinwiz/1/notifications/" + notification["_id"];
                var request = $http({
                        method: "get",
                        url: requestUrl,
                        params: {
                            status: "Complete"
                        }
                    });
 
                    return( request.then( handleSuccess, handleError ) );    
        }

        function markDeviceDone(notification){
            var requestUrl = "http://indlinvh207:11001/geoinwiz/1/notifications/" + notification["notificationid"] 
                        + "/device/" + notification["_id"];
                var request = $http({
                        method: "get",
                        url: requestUrl,
                        params: {
                            status: "Complete"
                        }
                    });
 
                    return( request.then( handleSuccess, handleError ) ); 
        }
    }
)

.factory('ExplorerService', function() {
    var explorer = {
        "explorer":[
            {
            "id":1,
            "name":"Proximity Device Search"
            },
            {
            "id":2,
            "name":"Notifications"
            }
          ]
        };

    return {
      getExplorer: function(){
        return explorer.explorer;
      }
    }

})

.factory('ProximitySearchService', function($http, $q){
    return ({ 
            setIsProximityBasedSearch: setIsProximityBasedSearch,
            getIsProximityBasedSearch: getIsProximityBasedSearch,
            getAllDevicesInProximity : getAllDevicesInProximity,
            setMap: setMap,
            getMap: getMap,
            setSelectedRadiusValue: setSelectedRadiusValue,
            getSelectedRadiusValue: getSelectedRadiusValue,
            putMarkerNotificationMapping: putMarkerNotificationMapping,
            getMarkerNotificationMapping: getMarkerNotificationMapping,
            addCurrentMarkers : addCurrentMarkers,
            clearMarkers : clearMarkers,
            setBounds : setBounds,
            getBounds : getBounds
        });
    
    function setIsProximityBasedSearch(value){
        this.isProximityBasedSearch = value;
    }

    function getIsProximityBasedSearch(){
        return true;
    }
    
     function getAllDevicesInProximity(radius){

        var request = $http({
                    method: "get",
                    url: "http://indlinvh207:11001/geoinwiz/1/devices",
                    params: {
                        radius : radius,
                        lng : -84.380976,
                        lat : 33.730318
                    }
                });
 
        return( request.then( handleSuccess, handleError ) );
    }
    
    function setMap(map){
            this.map1 = map;
    }

    function getMap(){
        return this.map1;
    }
    
    function setBounds(bounds){
            this.bounds1 = bounds;
    }
    
    function getBounds(){
        return this.bounds1;
    }
    
    function setSelectedRadiusValue(radius){
        this.radius1= radius;
    }

    function getSelectedRadiusValue(){
        return this.radius1;
    }
    
    function putMarkerNotificationMapping(marker, devicedetails){
        this.markerNotificationObj1 = {};
        this.markerNotificationObj1.marker = marker;
        this.markerNotificationObj1.devicedetails = devicedetails;
       
        if(! this.markerNotificationsArr1) {
             this.markerNotificationsArr1 = [];
        }
        
        this.markerNotificationsArr1.push(this.markerNotificationObj1);
    }

    function getMarkerNotificationMapping(){
        return this.markerNotificationsArr1;
    }

    function addCurrentMarkers(marker){
        if(!this.currentMarkers1){
            this.currentMarkers1 = [];
        }
        this.currentMarkers1.push(marker);
    }

    function clearMarkers(){
        if(this.currentMarkers1){
            for(var i=0; i<this.currentMarkers1.length; i++){
                this.currentMarkers1[i].setMap(null);
            }
            this.currentMarkers1 = [];
        }

    }
    
    function handleError( response ) {
 
                    // The API response from the server should be returned in a
                    // nomralized format. However, if the request was not handled by the
                    // server (or what not handles properly - ex. server error), then we
                    // may have to normalize it on our end, as best we can.
                    if (
                        ! angular.isObject( response.data ) ||
                        ! response.data.message
                        ) {
 
                        return( $q.reject( "An unknown error occurred." ) );
 
                    }
 
                    // Otherwise, use expected error message.
                    return( $q.reject( response.data.message ) );
 
                }
 
 
                // I transform the successful response, unwrapping the application data
                // from the API response payload.
               function handleSuccess( response ) {
 
                    return( response.data );
 
                }

});
