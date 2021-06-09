const wait = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

async function magicMissile(handler, targets) {

    let obj01 = "./modules/jb2a_patreon/Library/1st_Level/Magic_Missile/"

    let shockWave =
        [{
            filterType: "wave",
            filterId: "shockWave",
            autoDestroy: true,
            time: 0,
            strength: 0.03,
            frequency: 15,
            maxIntensity: 4.0,
            minIntensity: 0.5,
            padding: 25,
            animated:
            {
                time:
                {
                    loopDuration: 500,
                    loops: 3,
                    active: true,
                    speed: 0.0180,
                    animType: "move",
                }
            }
        }];

    async function cast() {

        let targetKeys = Object.keys(targets)

        for (var i = 0; i < targetKeys.length; i++) {


            let target = targets[targetKeys[i]]
            let missiles = targets[i].numberOfMissiles

            let ray = new Ray(handler.center, target.center)

            let anDeg = -(ray.angle * 57.3);
            let anDist = ray.distance;
            let globalDelay = 200;
            await wait(globalDelay);
        
            async function spellAnimation(number) {

                let x = number;
                let interval = 500;

                for (var i = 0; i < x; i++) {
                    setTimeout(function () {

                        let ranVar = Math.floor(Math.random() * 9 + 1).toString();

                        let filePathBlue = "./modules/jb2a_patreon/Library/1st_Level/Magic_Missile/MagicMissile_01_Regular_Blue_30ft_01_1600x400.webm"

                        let anFileSize = 1200;
                        let anchorX = 0.125;

                        let anScale = anDist / anFileSize;
                        let anScaleY = anDist <= 600 ? 0.6 : anScale;

                        let spellAnim =
                        {
                            file: filePathBlue,
                            position: handler.center,
                            anchor: {
                                x: anchorX,
                                y: 0.5
                            },
                            angle: anDeg,
                            scale: {
                                x: anScale,
                                y: anScaleY
                            }
                        };
                        canvas.fxmaster.playVideo(spellAnim);
                        game.socket.emit('module.fxmaster', spellAnim);
                    }, i * interval);
                }
            }
            spellAnimation(missiles)
            if (game.settings.get("automated-jb2a-animations", "tmfx")) {
                // Activates the Token Magic FX after a delay
                await wait(1000)
                TokenMagic.addFilters(target, shockWave);
            }
        }
    }
    cast();
}

// Create the dialog
function createDialog(handler, targets) {

    let targetsAndMissiles = {}

    let targetButtons = {
        99: {
            label: "Cast Magic Missile",
            //callback: () => magicMissile(handler, targetsAndMissiles)
            callback: html => {
                let checkedTargets = document.getElementById("target00").checked;
                console.log("checkedTargets")
                console.log(checkedTargets)
            }
        },
    };

    let targetSelection = {}

    let targetIndex = 0;

    let targetKeys = Object.keys(targets);
    targetKeys.forEach(key => {

        targetSelection[targetIndex] =
            `<input type="checkbox" id="target0`+ key + `" form="checkTargets"><label for="target01"><b>${targets[key].data.name}:</b></label>`
        targetIndex++;
    })

    let formattedContent = `Please pick your targets and the number of missiles to shoot at them!<br>
    <form id="checkTargets"></form>
    <form id="numberOfMissiles"></form>`

    for (let i=0; i<targets.length; i++) {
        console.log("trying to append to formattedContent")
        formattedContent = formattedContent.concat( `${targetSelection[i]}
            <select id="target0`+ i.toString() + `Missiles" name="missiles" form="numberOfMissiles">
                    <option value="0" selected>0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
            </select>
            <br>
        `)

        console.log("formattedContent: ")
        console.log(formattedContent)
    }

    /*
    <form id="main-form" action="/main-action" method="post"></form>
    <form id="sub-form"  action="/sub-action"  method="post"></form>

    <div class="main-component">
        <input type="text" name="main-property1" form="main-form" />
        <input type="text" name="main-property2" form="main-form" />

        <div class="sub-component">
            <input type="text" name="sub-property1" form="sub-form" />
            <input type="text" name="sub-property2" form="sub-form" />
            <input type="submit" name="sub-save" value="Save" form="sub-form" />
        </div>

        <input type="submit" name="main-save" value="Save" form="main-form" />
    </div>
*/

    formattedContent = formattedContent.concat("</form>")

    let targetDialog = new Dialog({
        title: "Magic Missile",
        content: formattedContent,
        buttons: targetButtons,
    }).render(true);

    targetDialog.render(true);
};

// Initialize the Macro
function main() {

    let handler = canvas.tokens.controlled[0];
    let targets = Array.from(game.user.targets);

    if(targets.length > 0) {
        createDialog(handler, targets);
    } else {
        ui.notifications.warn("No Targets selected.");
    }
    
}

main()