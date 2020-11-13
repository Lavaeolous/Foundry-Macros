/* Lavaeolous – Teleportal Macro
 * 
 * Change-Log:
 * - 13.11.2020: Now only teleports that are at most one space away
 * 
 * Bugs / Stuff to do and fix:
 * 
 * Animates the movement instead of "teleporting"
 * Doesn't pan the camera to the target
 * Has a hardcoded gridUnit instead of taking the one from the scene
 * Uses the lazy way of separating rotations and directions into two variables instead of writing better code
 * Has a hardcoded limit for offsetting teleported tokens at the target locations of 6
 * Could use a better dialog interface
 */

// Variables
var gridUnit = 128;

var validRotations = {
    "0": "N",
    "45": "NE",
    "90": "E",
    "135": "SE",
    "180": "S",
    "225": "SW",
    "270": "W",
    "315": "NW"
}

var validDirections = {
    "N": "0",
    "NE": "45",
    "E": "90",
    "SE": "135",
    "S": "180",
    "SW": "225",
    "W": "270",
    "NW": "315"
}

var validTargetOffset = {
    0: [
        0,
        0
    ],
    1: [
        gridUnit,
        0
    ],
    2: [
        0,
        gridUnit
    ],
    3: [
        gridUnit,
        gridUnit
    ],
    4: [
        2 * gridUnit,
        0
    ],
    5: [
        gridUnit,
        2 * gridUnit
    ]
}

var validTargets = {};
var teleportalCurrentAngle = 0;
var teleportalToken;
var teleportalName = "";
var validOwnedTokens = {};

// Initialize the Macro
main();

function main() {
    initializeTeleportal();
    getValidOwnedTokens();
    if(Object.keys(validOwnedTokens).length > 0) {
        createDialog();
    } else {
        ui.notifications.warn("No one is near enough to activate the teleportal.");
    }
    
}

function initializeTeleportal() {
    // Get the currently selected teleportal
    var teleportal = canvas.tokens.controlled[0];

    if (!teleportal) ui.notifications.warn("Please select a valid teleportal!");
    else {

        /* Extract Teleportal Data
         * Source: The Teleportal that is being activated
         * TargetPairs: The valid Targets in the format "<direction>_<targetTeleportal(s)>"
         */
         
        teleportalName = teleportal.data.name;
        teleportalToken = canvas.tokens.placeables.find(t => t.name === teleportalName);

        var targetPairs = teleportalName.match(/Targets\[([^\]]*)/)[1].split(",");

        targetPairs.forEach(targetPair => {
            let direction = targetPair.split("_")[0];
            let target = targetPair.split("_")[1];
            validTargets[direction] = target;
        });

        teleportalCurrentAngle = teleportalToken.data.rotation;

    }
}

function getValidOwnedTokens() {
    
    // Token Positions start at the top left corner of the token
    let teleportalData = {
        "x": teleportalToken.data.x,
        "y": teleportalToken.data.y,
        "width": teleportalToken.data.width * gridUnit,
        "height": teleportalToken.data.height * gridUnit,
    };

    let validTeleportalZone = {
        "x1": teleportalData.x - gridUnit,
        "x2": teleportalData.x + teleportalData.width + gridUnit,
        "y1": teleportalData.y - gridUnit,
        "y2": teleportalData.y + teleportalData.height + gridUnit
    };

    // Get the owned tokens of the activating player
    let ownedTokens = canvas.tokens.placeables.filter(t => t.owner && t.name.search(/Source/i) === -1 && t.name.search(/Teleportal/i) === -1)

    ownedTokens.forEach(token => {

        // Check if an owned token lies in the valid teleportal zone
        if(token.data.x >= validTeleportalZone.x1 && token.data.x < validTeleportalZone.x2 && token.data.y >= validTeleportalZone.y1 && token.data.y < validTeleportalZone.y2) {

            let currentNumberOfValidTokens = Object.keys(validOwnedTokens).length;

            validOwnedTokens[currentNumberOfValidTokens+1] = token;

        } else {
            console.log("NO TOKEN IN REACH");
        }
    });
}

// Create the dialog
function createDialog() {

    let teleportalSettings = function () {

        let tokenNames = "";
        let tokenIndex = 1;
        let validOwnedTokenKeys = Object.keys(validOwnedTokens);
        validOwnedTokenKeys.forEach(key => {

            tokenNames = tokenNames.concat("<strong>" + validOwnedTokens[key].data.name + "</strong>");
            if (tokenIndex < validOwnedTokenKeys.length - 1) {
                tokenNames = tokenNames.concat(", ");
                tokenIndex++;
            } else if (tokenIndex == validOwnedTokenKeys.length - 1) {
                tokenNames = tokenNames.concat(" and ");
                tokenIndex++;
            }

        });

        if (tokenIndex > 1) {
            tokenNames = tokenNames.concat(" are near enough to activate it.");
        } else {
            tokenNames = tokenNames.concat(" is near enough to activate it.")
        }

        return `
         <div class="main">
             <div class="headline">
                 <em>You see a heavy stone disk with large handles and a single straight indentation on top</em>
             </div>
             <div class="plain-text">
                 <div class="tokens" id="controlledTokens">${tokenNames}</div>
             </div>
         </div>
         `
    }

    let teleportalButtons = {
        99: {
            label: "Use teleportal",
            callback: () => useTeleportal()
        },
    };

    let validTargetIndex = 0;

    let validTargetKeys = Object.keys(validTargets);
    validTargetKeys.forEach(key => {

        teleportalButtons[validTargetIndex] = {
            label: key,
            callback: () => {
                setTeleportal(validDirections[key]);
                teleportalDialog.render(true);
            }
        }

        validTargetIndex++;

    })

    let teleportalDialog = new Dialog({
        title: "Teleportal",
        content: teleportalSettings(),
        buttons: teleportalButtons,
    }).render(true);
};

// Set the teleportal disk to a specified rotation
function setTeleportal(angle) {
    teleportalCurrentAngle = angle;
    teleportalToken.data.rotation = angle;
    teleportalToken.update({ "data.rotation": angle });
}

// Use the teleportal
function useTeleportal() {
    /*
    console.log("using the teleportal");
    console.log("teleportalCurrentAngle: " + teleportalCurrentAngle);
    console.log("correspondingDirection: " + validRotations[teleportalCurrentAngle]);
    console.log("target: " + validTargets[validRotations[teleportalCurrentAngle]]);
    */

    // Fix for ppl changing the angle per alt-mousewheel after picking a direction
    teleportalCurrentAngle = teleportalToken.data.rotation;
    let target = validTargets[validRotations[teleportalCurrentAngle]];

    // Search a valid target token in the scene
    searchTeleportal(target);
}

// Search for the target teleportal in the scene
function searchTeleportal(target) {

    let regExpString = "Source\\[" + target + "\\].*";
    let targetRegExp = new RegExp(regExpString, "i")

    try {
        let targetTeleportal = canvas.tokens.placeables.find(function (token) {
            if (token.data.name.search(targetRegExp) !== -1) {
                return token;
            }
        });

        let targetX = targetTeleportal.data.x;
        let targetY = targetTeleportal.data.y;

        let tokenIndex = 0;

        let validOwnedTokenKeys = Object.keys(validOwnedTokens);
        validOwnedTokenKeys.forEach(key => {

            validOwnedTokens[key].setPosition(targetX, targetY, false);

            let correctedTargetX = targetX + validTargetOffset[tokenIndex][0];
            let correctedTargetY = targetY + validTargetOffset[tokenIndex][1];
            validOwnedTokens[key].update({
                "x": correctedTargetX,
                "y": correctedTargetY
            });
            tokenIndex++;
        })

    } catch (e) {
        ui.notifications.warn("You hear a low vibrating hum, but nothing happens");
    }


}