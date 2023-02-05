// ---- Interactive Maze Journal
// Called via Journal and Advanced Macros like this
// @UUID[Macro.mXTo7iflkNP58FVE 16 RUpSf87YXwbrtDyC]{Traverse the Maze}
async function main(actor) {

  let dc = args[0][0];          // 16 in the example given above
  let journalID = args[0][1];   // RUpSf87YXwbrtDyC in the example given above

  // Get the journal that contains the pages for the maze
  const journal = game.journal.get(journalID);
  if(!journal) return ui.notifications.warn("The journal was not found.");

  // Get all the pages in that journal for the specific outcomes
  // This is build so as to allow for randomized outcome fluff text later
  let failurePageIDs = [];
  let oneSuccessPageIDs = [];
  let twoSuccessPageIDs = [];
  let threeSuccessPageIDs = [];

  // You have to enter your own ids here
  oneSuccessPageIDs.push("TUfNMvgUqeDspcTO");
  twoSuccessPageIDs.push("yqMFFXYZv1fLKAUQ");
  threeSuccessPageIDs.push("kykXEVG7zMUTjn0W");
	
  failurePageIDs.push("dwxniFb1DxwL8Asa");
  failurePageIDs.push("nFfPJrSKzkZpxnhJ");
	
  let targetPageID = "";

  // Roll Perception, Survival and Intelligence Checks
  let numberOfSuccesses = await rollMazeChecks(dc);

  switch (numberOfSuccesses) {
	case 3:
		targetPageID = await getRandomMatchingPageID(threeSuccessPageIDs);
		break;
	case 2:
		targetPageID = await getRandomMatchingPageID(twoSuccessPageIDs);
		break;
	case 1:
		targetPageID = await getRandomMatchingPageID(oneSuccessPageIDs);
		break;
	default:
		targetPageID = await getRandomMatchingPageID(failurePageIDs);
		break;
  }

  // Try to open a new journal page
  let targetPage = await game.journal.get(targetPageID);

  Journal.show(targetPage, {force: true});
}

async function getRandomMatchingPageID(IDs) {
	let index = getRandomInt(0, IDs.length);
	return IDs[index]
}

function getRandomInt(max) {
	return Math.floor((Math.random() * (+max+1)));
}

// roll perception, survival and intelligence checks and return the number of successes
async function rollMazeChecks(dc) {

  let numberOfSuccesses = 0;

  // Roll Perception
  let perceptionMod = actor.system.skills.per.mod;
  let perceptionRoll = await new Roll("1d20+@mod", {mod: perceptionMod}).evaluate({"async": true});
  if (perceptionRoll.total > +dc ? numberOfSuccesses +=1 : null);

  // Roll Survival
  let survivalMod = actor.system.skills.sur.mod;
  let survivalRoll = await new Roll("1d20+@mod", {mod: survivalMod}).evaluate({"async": true});
  if (survivalRoll.total > +dc ? numberOfSuccesses +=1 : null);

  // Roll Intelligence
  let intelligenceMod = actor.system.abilities.int.mod;
  let intelligenceRoll = await new Roll("1d20+@mod", {mod: intelligenceMod}).evaluate({"async": true});
  if (intelligenceRoll.total > +dc ? numberOfSuccesses +=1 : null);

  return numberOfSuccesses;
}

// ---- Starts here

const tokens = canvas.tokens.controlled;
const selected = !tokens.length ? false : true;

let actors = tokens.map((o) => o.actor);

if (!actors.length) {
  actors = game.actors.filter((o) => o.isPC && o.isOwner == true);
}
actors = actors.filter((o) => o.isOwner == true);

if (!actors.length) ui.notifications.warn("No applicable actor(s) found");
else {
  if (selected || actors.length === 1) {
    main(actors);
  } else if (actors.length > 1) {
    const actorButtons = actors.map((actor) => ({
      label: actor.name,
      callback: () => main([actor]),
    }));

    const msg = "Choose an actor for your roll";

    new Dialog(
      {
        title: "Choose an actor",
        content: `<p>${msg}</p>` + css,
        buttons: actorButtons,
      },
      {
        classes: ["skill-dialog-box-buttons"],
      }
    ).render(true);
  }
}