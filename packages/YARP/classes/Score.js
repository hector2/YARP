'use strict';
/**
 * Implements a Character.
 */
class Score extends yarp.Object {

    constructor(params) {
        super();

        if (params.id != null) {
            this._id = params.id;
            this._score = this.default(params.score, 0);
            yarp.mng.register(this);
            this.makeGetterSetter();
        } else {
            throw new TypeError('Score class needs id to be instantiated.\nParameters: ' + JSON.stringify(params));
        }

    }

}

module.exports = Score;