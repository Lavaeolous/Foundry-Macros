/* Lavaeolous – Teleportal Macro
 * 
 * Bugs / Stuff to do and fix:
 * Teleports all owned tokens, not only the ones near the teleportal
 * Animates the movement instead of "teleporting"
 * Doesn't pan the camera to the target
 * Has a hardcoded gridUnit instead of taking the one from the scene
 * Uses the lazy way of separating rotations and directions into two variables instead of writing better code
 * Has a hardcoded limit for offsetting teleported tokens at the target locations of 6
 * Could use a better dialog interface
 */

 // Get the Teleportal Data
 var tokens = canvas.tokens.controlled[0];
 var ownedTokens = canvas.tokens.placeables.filter(t => t.owner && t.name.search(/Source/i) === -1 && t.name.search(/Teleportal/i) === -1)
 console.log("ownedTokens:");
 console.log(ownedTokens);

 const gridUnit = 128;

 var validRotations = {
     "45": "N",
     "90": "NE",
     "135": "E",
     "180": "SE",
     "225": "S",
     "270": "SW",
     "315": "W",
     "0": "NW"
 }
 
 var validDirections = {
     "N": "45",
     "NE": "90",
     "E": "135",
     "SE": "180",
     "S": "225",
     "SW": "270",
     "W": "315",
     "NW": "0"
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
        2*gridUnit,
        0
    ],
    5: [
        gridUnit,
        2*gridUnit
    ]
}
 
 var validTargets = {};
 
 var currentPosition = 0;
 
 if (!tokens) ui.notifications.warn("Please select a valid teleportal!");
 else {
 
     var teleportalName= tokens.data.name;
     var teleportalToken = canvas.tokens.placeables.find(t => t.name === teleportalName);
 
     console.log("teleportalName: " + teleportalName);
     var source = teleportalName.match(/Source\[([^\]]*)/)[1];
     console.log("source: " + source);
     var targetPairs = teleportalName.match(/Targets\[([^\]]*)/)[1].split(",");
     console.log("targetPairs: " + targetPairs);
 
     targetPairs.forEach (targetPair => {
         console.log("targetPair: " + targetPair);
         let direction = targetPair.split("_")[0];
         let target = targetPair.split("_")[1];
         validTargets[direction] = target;
     });
 
     console.log("validTargets:");
     console.log(validTargets);
     
     currentPosition = teleportalToken.data.rotation;
 
     createDialog();
 
 }
 
 // Create the dialog
 function createDialog() {
     
     let teleportalSettings = function (ownedTokens) {
         console.log("ownedTokens in teleportalsettings");
         console.log(ownedTokens);

         
         let tokenNames = "";
         let tokenIndex = 1;
         ownedTokens.forEach(token => {
             console.log("token.data.name: " + token.data.name);
             console.log("index: " + tokenIndex);
             console.log("ownedTokens.length: " + ownedTokens.length);
             
             tokenNames = tokenNames.concat("<strong>" + token.data.name + "</strong>");
             if (tokenIndex < ownedTokens.length-1) {
                 tokenNames = tokenNames.concat(", ");
                 tokenIndex++;
             } else if (tokenIndex == ownedTokens.length-1) {
                 tokenNames = tokenNames.concat(" and ");
                 tokenIndex++;
             }
             
         });
         if (tokenIndex > 1) {
             tokenNames = tokenNames.concat(" are near enough to activate it.");
         } else {
             tokenNames = tokenNames.concat(" is near enough to activate it.")
         }
         console.log("tokenNames: " + tokenNames);

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
 
         console.log("key: " + key);
         console.log("validTargetIndex: " + validTargetIndex);
         console.log("validRotation: " + validDirections[key]);
 
         teleportalButtons[validTargetIndex] = {
             label: key,
             callback: () => {
                 setTeleportal(validDirections[key]);
                 teleportalDialog.render(true);
             }
         }
 
         validTargetIndex++;
 
     })
 
     console.log("teleportalButtons:");
     console.log(teleportalButtons);

    let teleportalDialog = new Dialog({
        title: "Teleportal",
        content: teleportalSettings(ownedTokens),
        buttons: teleportalButtons,
    }).render(true);
};
 
// Set the teleportal disk to a specified rotation
function setTeleportal(angle) {
    currentPosition = angle;
    teleportalToken.data.rotation = angle;
    teleportalToken.update({"data.rotation":angle});
}
 
// Use the teleportal
function useTeleportal() {
    console.log("using the teleportal");
    console.log("currentPosition: " + currentPosition);
    console.log("correspondingDirection: " + validRotations[currentPosition]);
    console.log("target: " + validTargets[validRotations[currentPosition]]);
    let target = validTargets[validRotations[currentPosition]];

    // Search a valid target token in the scene
    searchTeleportal(target);
}

// Search for the target teleportal in the scene
function searchTeleportal(target) {
    console.log("Searching for " + target);

    let regExpString = "Source\\["+target+"\\].*";
    let targetRegExp = new RegExp (regExpString,"i")

    console.log("targetRegExp: " + targetRegExp);

    try {
        let targetTeleportal = canvas.tokens.placeables.find(function(token) {
            console.log("token.data.name: " + token.data.name);
            if(token.data.name.search(targetRegExp) !== -1) {
                return token;
            }
        });
        console.log("targetTeleportal");
        console.log(targetTeleportal);

        let targetX = targetTeleportal.data.x;
        let targetY = targetTeleportal.data.y;

        let tokenIndex = 0;

        ownedTokens.forEach(token => {

            token.setPosition(targetX, targetY, false);

            let correctedTargetX = targetX + validTargetOffset[tokenIndex][0];
            let correctedTargetY = targetY + validTargetOffset[tokenIndex][1];
            token.update({
                "x": correctedTargetX,
                "y": correctedTargetY
            }, {animate: false});
            tokenIndex++;
        })

    } catch(e) {
        console.log("No valid target teleportal found");
    }
    

}