let die = args[0][0]
let durationRoll = new Roll(`${die}d6`);
durationRoll.evaluate({"async": false});

let chatData = {
    //user: game.user._id,
    speaker: ChatMessage.getSpeaker(),
    content: `
        <div class="pf1 chat-card item-card" data-actor-id="{{actor.id}}" data-item-id="{{item.id}}" {{#if tokenId}}data-token-id="{{tokenId}}"{{/if}}>
          <header class="card-header flexrow">
            <img src="icons/commodities/tech/watch.webp" title="Duration" width="36" height="36"/>
            <h3 class="item-name">Lost in the Maze</h3>
          </header>

        <div>The group wanders through the maze for ${durationRoll.total} hours.</div>
        </div>
    `
};
ChatMessage.create(chatData, {});