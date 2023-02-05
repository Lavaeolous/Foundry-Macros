async function main(actors) {
  let dc = args[0][0];
  let hd = args[0][1];
  let exhaustion = args[0][2];

  // Calculate the hitpoints lost
  let lostHP = await rollLostHP(hd);

  // Calculate the level of exhaustion
  let exhaustionLevel = await calcExhaustion(exhaustion);

  // Calculate evil things happening to the adventurer
  let evilThings = await calcEvilThings(dc);

  // Create a chat message
  createChatMsg(lostHP, exhaustionLevel, evilThings);
}

async function calcEvilThings(dc) {
  let abilities = [
    "Strength",
    "Dexterity",
    "Constitution",
    "Wisdom",
    "Intelligence",
    "Charisma",
  ];

  let willSaveMod = actor.system.attributes.savingThrows.will.base;
  let rolledWillSave = await new Roll(`1d20+${willSaveMod}`).evaluate({
    async: true,
  });

  let saved = false;

  if (rolledWillSave.total >= dc) saved = true;

  let evilMsg = "";

  if (!saved) {
    let evilRoll = await new Roll("1d6").evaluate({ async: true });
    let days = getRandomInt(6);
    let ability = abilities[getRandomInt(5)];

    switch (evilRoll.total) {
      case 1:
      case 2:
      case 3:
        // Bestow Curse
        let curseRoll = await new Roll("1d3").evaluate({ async: true });
        switch (curseRoll.total) {
          case 1:
            evilMsg = `<span style="color: darkred;">(Will)</span> You are cursed! Receive [[-6]] to ${ability} for [[${days}]] days. This is not damage! (DC ${dc} Will negates)`;
            break;
          case 2:
            evilMsg = `<span style="color: darkred;">(Will)</span> You are cursed! Receive [[-4]] to attacks, saves as well as ability and skill checks for [[${days}]] days. (DC ${dc} Will negates)`;
            break;
          case 3:
            evilMsg = `<span style="color: darkred;">(Will)</span> You are cursed! An otherworldy confusion grasps for your mind. For [[${days}]] days, you have a 50% chance to act normally each turn. Otherwise you take no action. (DC ${dc} Will negates)`;
            break;
          default:
            break;
        }
        break;
      case 4:
        evilMsg = `<span style="color: darkred;">(Reflex)</span>You walk into a magical lightning trap. Suffer [[5d8[The Maze is cruel]]] lightning damage (DC ${dc} Reflex halfs).`;
        break;
      case 5:
        evilMsg = `<span style="color: darkred;">(Reflex)</span>You trigger a blight trap. Suffer [[8d8[The Maze is cruel]]] negative energy damage and gain [[1d3[The Maze is cruel]]] negative levels (DC ${dc} Reflex halfs the damage and negates the energy drain).`;
        break;
      case 6:
        evilMsg = `<span style="color: darkred;">(Will)</span>You step on a magical rune. You are polymorphed into a tiny animal for ${days} days (DC ${dc} Will negates).`;
        break;
      default:
        break;
    }
  }

  return evilMsg;
}

async function rollLostHP(hd) {
  let classHitDie = Object.values(actor.classes)[0].hd;
  let rolledHP = await new Roll(`${hd}d${classHitDie}`).evaluate({
    async: true,
  });
  return rolledHP.total;
}

async function calcExhaustion(exhaustion) {
  let exhaustionLevel = getRandomInt(exhaustion);
  return exhaustionLevel;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * (+max + 1));
}

function createChatMsg(lostHP, exhaustionLevel, evilThings) {
  let exhaustionMsg = "";
  switch (exhaustionLevel) {
    case 2:
      exhaustionMsg = "exhausted";
      break;
    case 1:
      exhaustionMsg = "fatigued";
      break;
    default:
      break;
  }

  let evilBool = false;
  if (evilThings !== "") evilBool = true;

  let chatData = {
    //user: game.user._id,
    speaker: ChatMessage.getSpeaker(),
    content: `
            <div style="line-height: 1.3em;" class="pf1 chat-card item-card" data-actor-id="{{actor.id}}" data-item-id="{{item.id}}" {{#if tokenId}}data-token-id="{{tokenId}}"{{/if}}>
              <header class="card-header flexrow">
                <img src="icons/skills/wounds/injury-pain-body-orange.webp" title="Duration" width="36" height="36"/>
                <h3 class="item-name">${actor.name}'s Hardships</h3>
              </header>
              <br>
            <div>${actor.name} travels through the maze.<br>
            <ul>
            <li style="padding-top: 6px;">Lose [[${lostHP}[The Maze is cruel]]] hitpoints from general exhaustion.</li>
            {{#if ${exhaustionLevel}}}<li style="padding-top: 6px;"><span style="color: darkred;">(Constitution)</span> You are <strong>${exhaustionMsg}</strong> from the long journey.</li>{{/if}}
            {{#if ${evilBool}}}<li style="padding-top: 6px;">${evilThings}</li>{{/if}}
            </ul>
        `,
  };
  ChatMessage.create(chatData, {});
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

    const msg = "Choose an actor for your hardship roll";

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