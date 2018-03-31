'use strict';
/**
* @file Label config
*/
module.exports = {
  "7/11": {
    name: "7/11",
    price: "110000000",
    markers: {
      "7/11 Buy": {
        positions: [
          new mp.Vector3(1734.48046875, 6420.38134765625, 34.5372314453125),
          new mp.Vector3(1960.7580566406, 3749.26367187, 31.3437423706055),
          new mp.Vector3(1986.1240234375, 3053.874755859, 47.215171813),
          new mp.Vector3(-709.17022705, -904.21722412109, 19.215591430664),
          new mp.Vector3(28.7538948059082, -1339.8212890625, 29.4970436096191),
          new mp.Vector3(-43.1531448364258, -1748.75244140625, 29.4209976196289),
          new mp.Vector3(378.030487060547, 332.944427490234, 103.566375732422),
          new mp.Vector3(1126.68029785156, -980.39501953125, 45.4157257080078),
          new mp.Vector3(2673.32006835938, 3286.4150390625, 55.241138458252),
          new mp.Vector3(1707.52648925781, 4920.05126953125, 42.0636787414551),
          new mp.Vector3(-1479.22424316406, -375.097686767578, 39.1632804870605),
          new mp.Vector3(-2959.37524414063, 387.556365966797, 14.043158531189),
          new mp.Vector3(-1220.14123535156, -915.712158203125, 11.3261671066284),
          new mp.Vector3(1160.06237792969, -314.061828613281, 69.2050628662109),
          new mp.Vector3(-1829.00427246094, 798.903076171875, 138.186706542969),
          new mp.Vector3(2549.400390625, 385.048309326172, 108.622955322266),
          new mp.Vector3(-621.989135742188, -230.804443359375, 38.0570297241211)
        ],
      },
    },
    labels: {
      "7/11 Buy": {
        enter: (player) => {
          player.call("displayHelpText",["Press ~INPUT_PICKUP~ to shop."]);
          yarp.hotkeys["Event"].bind(player,['createBrowser', ["menu", ['package://YARP/ui/html/sideMenu.html', 'populateStoreItems', "Food", JSON.stringify(yarp.items.categories["Food"])]]]);
        },
        leave: (player) => {
          player.call("clearHelpText");
          yarp.hotkeys["Event"].unbind(player);
        },
        visible: false,
        positions: [
          new mp.Vector3(1734.48046875, 6420.38134765625, 34.5372314453125),
          new mp.Vector3(1960.7580566406, 3749.26367187, 31.3437423706055),
          new mp.Vector3(1986.1240234375, 3053.874755859, 47.215171813),
          new mp.Vector3(-709.17022705, -904.21722412109, 19.215591430664),
          new mp.Vector3(28.7538948059082, -1339.8212890625, 29.4970436096191),
          new mp.Vector3(-43.1531448364258, -1748.75244140625, 29.4209976196289),
          new mp.Vector3(378.030487060547, 332.944427490234, 103.566375732422),
          new mp.Vector3(1126.68029785156, -980.39501953125, 45.4157257080078),
          new mp.Vector3(2673.32006835938, 3286.4150390625, 55.241138458252),
          new mp.Vector3(1707.52648925781, 4920.05126953125, 42.0636787414551),
          new mp.Vector3(-1479.22424316406, -375.097686767578, 39.1632804870605),
          new mp.Vector3(-2959.37524414063, 387.556365966797, 14.043158531189),
          new mp.Vector3(-1220.14123535156, -915.712158203125, 11.3261671066284),
          new mp.Vector3(1160.06237792969, -314.061828613281, 69.2050628662109),
          new mp.Vector3(-1829.00427246094, 798.903076171875, 138.186706542969),
          new mp.Vector3(2549.400390625, 385.048309326172, 108.622955322266),
          new mp.Vector3(-621.989135742188, -230.804443359375, 38.0570297241211)
        ],
      },
    }
  },
};
