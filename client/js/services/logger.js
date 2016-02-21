var logger;

(function () {
    'use strict';

    let errorGlobalConflict = function (name) {
        console.error(
            'Global with name "' + name + '" has already been defined'
        );
    };

    if (!!logger) {
        return errorGlobalConflict('logger');
    }

    logger = {
        self: this,
        debug: false,
        setDebug: function (value) {
            self.debug = value;
        },
        log: function (message) {
            if (self.debug) {
                console.log(message);
            }
        },
        error: function (message) {
            if (self.debug) {
                console.error(message);
            }
        },
        errorGlobalConflict: function (name) {
            errorGlobalConflict(name, self.debug);
        }
    };
}());
