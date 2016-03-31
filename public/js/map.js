"use strict";

var googleMaps = {
    ready   : false,
    resolver: {
        map: ['$q', function($q) {

            if (!googleMaps.deferred) {

                googleMaps.deferred = $q.defer();
            }

            if (googleMaps.ready) {

                googleMaps.deferred.resolve();
            }

            return googleMaps.deferred.promise;
        }]
    }
};

window.onGoogleReady = function () {

    googleMaps.ready = true;

    if (googleMaps.deferred) {

        googleMaps.deferred.resolve();
        
    }
};
