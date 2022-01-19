// A very basic macro to roll for confusion and post its effects to chat

let confusionRoll = new Roll('1d100');
confusionRoll.evaluate({"async": false});

let confusionResult = ""

if (confusionRoll.result <= 25) {
     // Act normally
     confusionResult = ", but acts normally."
} else if (confusionRoll.result <= 50) {
     // Babbles incoherently
     confusionResult = " and babbles incoherently."
} else if (confusionRoll.result <= 75) {
     // Deals 1d8 points of damage + Str to self
     confusionResult = " and hits themself for [[1d8+@abilities.str.mod]] damage."
} else {
     // Attacks nearest creature
     confusionResult = " and attacks the nearest creature (friend or foe)."
}

let chatData = {
    //user: game.user._id,
    speaker: ChatMessage.getSpeaker(),
    content: `
        <div class="pf1 chat-card item-card" data-actor-id="{{actor.id}}" data-item-id="{{item.id}}" {{#if tokenId}}data-token-id="{{tokenId}}"{{/if}}>
          <header class="card-header flexrow">
            <img src="assets/kingmaker%20icons/Confusion.png" title="Confusion" width="36" height="36"/>
            <h3 class="item-name">Confusion</h3>
          </header>

        <div>${ChatMessage.getSpeaker().alias} is confused${confusionResult}</div>
        </div>
    `
};
ChatMessage.create(chatData, {});