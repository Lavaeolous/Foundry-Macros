/// Pathfinder Book Events

/// <summary>
/// This macro can be called from a journal entry via the module Inline Macro Execution and
/// [[/macroExec "01_Book-Event-Skill-Check" journalID=<ID> skill=perception dc=17]]{flavor}
/// </summary>
/// <param name="scope.skill">The skill used for the skill check</param>
/// <param name="scope.dc">The difficulty class of the skill check</param>
/// <param name="scope.journalID">The id of the journal containing the results for crit-success, success, failure and crit-fail.
/// I simply use the same journal the start page is in.</param>
/// 
/// Depending on the degree of success of the skill check, one page of 2-6 is opened and shared with the players:
/// Page 2: Critical Failure
/// Page 3: Failure
/// Page 4: Success
/// Page 5: Critical Success
/// Page 6: Override // this is used if you call the macro with "skill=override", e.g. if you want to have an action without skill check

let debug = false;

let pc = null;
let rollForPC = false;

async function main(actor)
{
	let skillName = scope.skill;
	let dc = scope.dc;
	let journalID = scope.journalID;
        rollForPC = scope.rollForPC;
	const journal = game.journal.get(journalID);

        if (rollForPC)
        {
            
            RollForPC();
        }

	if (debug) {
		console.log("actor: " + actor.name);
		console.log(actor);
		console.log("skill: " + skillName);
		console.log("dc: " + dc);
		console.log("journalID: " + journalID);
	}

	if (skillName == "override") {
		overrideActivity(journal);
	}
	else {
		unspecifiedActivity(journal, skillName);
	}

}

async function RollForPC()
{
    const table = await fromUuid("RollTable.Cc4o6tg2K2RbzxL4");
    let tableResult = await table.draw({roll: true, displayChat: false});
    console.log(tableResult .results[0].text);
    pc = tableResult .results[0].text;
}

async function overrideActivity(journal)
{
	let targetPage = await getPage(journal, 4);
	await targetPage.update({ ownership: { default: CONST.DOCUMENT_OWNERSHIP_LEVELS.INHERIT } });

	Journal.show(targetPage, { force: true });
}

async function unspecifiedActivity(journal, skillName, secret = false)
{
	let _title = skillName.charAt(0).toUpperCase() + skillName.slice(1) + " Check"; // uppercase first letter
	let _skill;
	if (skillName == "perception") {
		_skill = actor.perception;
	} else {
		_skill = actor.skills[skillName];
	}
	let checkData = {
		actor,
		type: "skill-check",
		createMessage: false,
		dc: {
			value: dc
		}
	}
	// if (secret) {
	// 	checkData["options"] = ["secret"];
	// }

	result = await actor.skills[skillName].check.roll();

	if (debug) {
		console.log("result");
		console.log(result);
	}

        if (result == null)
        {
            return;
        }

	if (result._evaluated) {
		let total = result._total;
		let differenceToDC = total - dc;

		let degreeOfSuccess = differenceToDC <= -10 ? 0                         // Crit Fail
			: differenceToDC < 0 && differenceToDC > -10 ? 1    // Fail
				: differenceToDC >= 0 && differenceToDC < 10 ? 2    // Success
					: differenceToDC >= 10 ? 3                          // Crit Success
						: -1;                                               // Error
                

		let targetPage = await getPage(journal, degreeOfSuccess);

                if (rollForPC)
                {
                    // Try to find a placeholder in the page and replace it with the pc
                }

		await targetPage.update({ ownership: { default: CONST.DOCUMENT_OWNERSHIP_LEVELS.INHERIT } });

		// open a new journal page


		Journal.show(targetPage, { force: true });

	}
	else {
		console.log("Dice Roll was not evaluated");
	}

}

function getPage(journal, degreeOfSuccess) {
	return Array.from(journal.pages)[degreeOfSuccess + 1]
}

/// <summary>
/// Get the correct actor either via the currently selected token,
/// the character the user has ownership for
/// or show a dialog to pick a character if multiple are owned

const tokens = canvas.tokens.controlled;
const selected = !tokens.length ? false : true;

let actors = tokens.map((o) => o.actor);

if (!actors.length) {
	actors = game.actors.filter((o) => o.type == "character" && o.isOwner == true);
}

actors = actors.filter((o) => o.isOwner == true);

let actor = null;

if (!actors.length) ui.notifications.warn("No applicable actor(s) found");
else {
	if (selected || actors.length === 1) {
		console.log(actors);
		CallMain(actors);
	}
	else if (actors.length > 1) {
		const actorButtons = actors.map((actor) => ({
			label: actor.name,
			callback: () => CallMain([actor]),
		}));

		const msg = "Choose an actor for your roll";

		new Dialog(
			{
				title: "Choose an actor",
				content: `<p>${msg}</p>`,
				buttons: actorButtons,
			},
			{
				classes: ["skill-dialog-box-buttons"],
			}
		).render(true);
	}
}

function CallMain(myActor) {
	actor = myActor[0];
	main(actor);
}

// Just as a note, these are the supported skills
const standardSkills = [
	"acrobatics",
	"arcana",
	"athletics",
	"crafting",
	"deception",
	"diplomacy",
	"intimidation",
	"medicine",
	"nature",
	"occultism",
	"performance",
	"religion",
	"society",
	"stealth",
	"survival",
	"thievery"
]