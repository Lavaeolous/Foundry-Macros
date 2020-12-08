// A very basic macro to roll for confusion and post its effects to chat

let confusionRoll = new Roll('1d100').roll().result

let confusionResult = ""

if (confusionRoll <= 25) {
     // Act normally
     confusionResult = "Act normally"
} else if (confusionRoll <= 50) {
     // Babbles incoherently
     confusionResult = "Babble incoherently"
} else if (confusionRoll <= 75) {
     // Deals 1d8 points of damage + Str to self
     confusionResult = "Deal 1d8+Str-Mod"
} else {
     // Attacks nearest creature
     confusionResult = "Attack nearest Creature"
}

let chatData = {
    //user: game.user._id,
    speaker: ChatMessage.getSpeaker(),
    content: confusionResult,
};
ChatMessage.create(chatData, {});