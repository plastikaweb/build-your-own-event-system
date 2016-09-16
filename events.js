var EventTracker = function(name) {
    this.name = name;
    this.events = {};
    this.notifies = {};
};
EventTracker.prototype.on = function(eventName, callback) {
    if (!this.events[eventName]) {
        this.events[eventName] = [callback];
    } else {
        this.events[eventName].push(callback);
    }
};
EventTracker.prototype.notify = function(parentEventTracker, eventName) {
    if (!this.notifies[eventName]) {
        this.notifies[eventName] = [parentEventTracker];
    } else {
        this.notifies[eventName].push(parentEventTracker);
    }
};
EventTracker.prototype.trigger = function(eventName, param) {

    try {
        if( !this.events[eventName] && !this.notifies[eventName]) {
            throw new Error('The event ' + eventName + ' does not appear as valid for the ' + this.name + ' tracker');
        }
        // own events
        if (this.events[eventName]) {
            var callbacks = this.events[eventName];
            for (var i = 0; i < callbacks.length || 0; i++) {
                callbacks[i].call(this, param);
            }
        }

        // notifies
        if (this.notifies[eventName]) {
            var notifies = this.notifies[eventName];
            for (var i = 0; i < notifies.length || 0; i++) {
                notifies[i].trigger(eventName, param);
            }
        }
    } catch (err) {
        console.error(new Error(err.message));
    }
};

function purchase(item) { console.log( 'purchasing ' + item); }
function celebrate() { console.log( this.name + ' says birthday parties are awesome!' ); }

var nephewParties = new EventTracker( 'nephews');
var richard = new EventTracker( 'Richard' );

nephewParties.on( 'mainEvent', purchase );
richard.on( 'mainEvent', celebrate );
richard.on( 'mainEvent', purchase );
nephewParties.notify( richard, 'mainEvent' );

nephewParties.trigger( 'mainEvent', 'ice cream' );
richard.trigger( 'mainEvent', 'sudden' );
richard.trigger( 'mainEvent', 'hate' );