'use strict';


let score = 0


/**
 * Colshape events
 * @memberof ragemp.client
 */

/**
 * Player enter coolshape.
 * @event playerEnterColshape
 * @memberof ragemp.client
 * @param {Object} shape The colshape that was entered.
 */
mp.events.add('playerEnterColshape', (shape) => {


    if (shape.getVariable("finish")) {
        mp.events.callRemote("gokuFinished", score)
        score = 0

        mp.browsers.forEach((b) => {
            if (b.url === 'package://index.html') b.destroy()
        })


        mp.game.audio.playSoundFrontend(-1, "Bed", "WastedSounds", true);


    } else {
        score = score + 100
        mp.gui.chat.push(score.toString())
    }



});

/**
 * Player exit coolshape.
 * @event playerExitColshape
 * @memberof ragemp.client
 * @param {Object} shape The colshape that was left.
 */
mp.events.add('playerExitColshape', (shape) => {
});
