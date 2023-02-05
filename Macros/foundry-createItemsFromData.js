let itemDocuments = [];
// Challenges as an array of challenges in the format [<number>,<name>,<Description>]
let challenges = [
    [1,"Adventuring & Spelunking","Reward","Roll Twice. Choose The Best Result For Your Attack Or Evasion"],
[2,"Adventuring & Spelunking","Reward","Your Legendary Deeds Are Remembered In A Song, Tale Or Plaque"],
[3,"Adventuring & Spelunking","Reward","You Become Famous Or Feared In The Local Region"],
[4,"Adventuring & Spelunking","Reward","You Receive A Potion Of Healing Or Resistance"],
[5,"Adventuring & Spelunking","Reward","You Receiveaboxwitha Random Treasure Item"],
[6,"Adventuring & Spelunking","Reward","Reroll A Failed Dexterity Or Listen Check"],
[7,"Adventuring & Spelunking","Reward","Automatically Succeed A Charisma Or Agility Check"],
[8,"Adventuring & Spelunking","Reward","Your Attack Deals Triple Damage Or Ignores Resistance"],
[9,"Adventuring & Spelunking","Reward","An NPC Grants You Safe Passage & Entry"],
[10,"Adventuring & Spelunking","Reward","Reroll A Failed Dexterity Or Strength Check"],
[11,"Adventuring & Spelunking","Reward","Double Your Movement Or Strength For 1 Minute"],
[12,"Adventuring & Spelunking","Reward","Ignore The Effects Of Fatigue Or Weather For 1 Hour"],
[13,"Adventuring & Spelunking","Reward","You Get A Letter That Reveals The Location Of A Secret Treasure Or Power"],
[14,"Adventuring & Spelunking","Reward","Reroll A Failed Negotiation Or Investigation Check"],
[15,"Adventuring & Spelunking","Reward","An NPC Grows Fond Of You And Wants To Marry Or Train You"],
[16,"Adventuring & Spelunking","Reward","Automatically Succeed A Charisma Or Wisdom Check"],
[17,"Adventuring & Spelunking","Reward","Gain Temporary Immunity Against Charm Or Illusions"],
[18,"Adventuring & Spelunking","Reward","Gain The Services Of A Scout Or Thug For One Week"],
[19,"Adventuring & Spelunking","Reward","Automatically Succeed On A Check To Translate Or Solve A Puzzle"],
[20,"Adventuring & Spelunking","Reward","You Discover A Rare Treasure Item Or Forbidden Tome"],
[21,"Adventuring & Spelunking","Reward","You Are Made Honorary Member Of An Academy Or Renowned Guild"],
[22,"Adventuring & Spelunking","Reward","Your Ability To Detect Lies Or Illusions Permanently Improves"],
[23,"Adventuring & Spelunking","Reward","Roll Twice. Choose The Best Result For Your Attack Or Evasion"],
[24,"Adventuring & Spelunking","Reward","Use A Party Members Stats For Your Weapon Or Spell Attack Roll"],
[25,"Adventuring & Spelunking","Reward","Automatically Succeed To Impress Or Deceive"],
[26,"Adventuring & Spelunking","Reward","Breathe Underwater Or Defy Gravity For Five Minutes"],
[27,"Adventuring & Spelunking","Reward","Reroll An Attack Or Skill Check Of Choice"],
[28,"Adventuring & Spelunking","Reward","Crafting Or Studying Takes Only half thetime"],
[29,"Adventuring & Spelunking","Reward","Reroll A Dexterity Or Strength Check"],
[30,"Adventuring & Spelunking","Reward","A Mercenary Or Artisan Offers Their Services For One Week, Free Of Charge"],
[31,"Adventuring & Spelunking","Reward","Reroll A Saving Throw Against Poison Or Disease"],
[32,"Adventuring & Spelunking","Reward","Reroll A Failed Navigation Or Survival Check"],
[33,"Adventuring & Spelunking","Reward","An NPC Offers A Safe Place To Stay Or To Restock Your Supplies Free Of Charge"],
[34,"Adventuring & Spelunking","Reward","Automatically Succeed To Impress Or Deceive"],
[35,"Adventuring & Spelunking","Reward","Roll Twice. Pick The Best Result For Search Or Navigation"],
[36,"Adventuring & Spelunking","Reward","An Item Or Ally Appears When You Need It Most"],
[37,"Adventuring & Spelunking","Reward","An Attack Against Undead Or Elemental Deals Triple Damage"],
[38,"Adventuring & Spelunking","Reward","Control One Undead Or NPC For One Hour"],
[39,"Adventuring & Spelunking","Reward","Automatically Spot A Hidden Or Invisible Creature Or Object"],
[40,"Adventuring & Spelunking","Reward","Temporarily Gain Darkvision Or Heightened Awareness"],
[41,"Adventuring & Spelunking","Reward","Become A Member Of A Local Council Or Crime Syndicate"],
[42,"Adventuring & Spelunking","Reward","An Attack Is An Automatic Hit Or Deals Maximum Damage"],
[43,"Adventuring & Spelunking","Reward","Get A Private Audience With A Dignitary Or A Crime Lord"],
[44,"Adventuring & Spelunking","Reward","A Local Tavern Offers Lodging And Meals Or Valuable Information"],
[45,"Adventuring & Spelunking","Reward","A Local Artisan Personalizes Your Weapons Or Clothing"],
[46,"Adventuring & Spelunking","Reward","Your Lineage Turns Outto Be Linked To A Legendary Hero Or Ruler Of Yore"],
[47,"Adventuring & Spelunking","Reward","Receive Double Treasure Or Xp Points"],
[48,"Adventuring & Spelunking","Reward","You Are Made A Special Member Of The Local Merchant Or Artisan Guild"],
[49,"Adventuring & Spelunking","Reward","Reroll A Failed Tracking Or Survival Check"],
[50,"Adventuring & Spelunking","Reward","Travel Double The Overland Distance Or Avoid Being Seen"],
[51,"Adventuring & Spelunking","Reward","Roll Triple Damage Or Make Two Attacks Against A Creature"],
[52,"Adventuring & Spelunking","Reward","Swap Initiative Result With A Monster Or Party Member"],
[53,"Adventuring & Spelunking","Reward","An NPC Thief Or Bodyguard Offers To Assist You For Oneweek"],
[54,"Adventuring & Spelunking","Reward","An NPC Grants Unseen Entry Into A Secret Or Restricted Area"],
[55,"Adventuring & Spelunking","Reward","Get A Free Repair For Your Tools Or Weapons"],
[56,"Adventuring & Spelunking","Reward","Double The Result Of Your  Strength Or Attack Roll"],
[57,"Adventuring & Spelunking","Reward","Double The Result Of Your Dexterity Or Charisma Ceck"],
[58,"Adventuring & Spelunking","Reward","Receive A Potion Of Climbing Or Swimming"],
[59,"Adventuring & Spelunking","Reward","Automatically Succeed A Wisdom Or Search Skill Check"],
[60,"Adventuring & Spelunking","Reward","Receive A Crucial Clue Or Object Related To Your Quest"],
[61,"Adventuring & Spelunking","Reward","Fully Recover A Party Member From Injury Or Ailments"],
[62,"Adventuring & Spelunking","Reward","Receive A Full Restock Of Your Ammo Or Spell Components"],
[63,"Adventuring & Spelunking","Reward","Double The Result Of Your Deception Or Insight Check"],
[64,"Adventuring & Spelunking","Reward","Receive Luxury Clothes Or A Quality Weapon"],
[65,"Adventuring & Spelunking","Reward","Gain Temporary Immunity To Being Surprised, Grappled Or Frightened"],
[66,"Adventuring & Spelunking","Reward","No Matter Your Die Roll, You Have The Highest Initiative Or Stealth Result"],
[67,"Adventuring & Spelunking","Reward","Receive A Magic Scroll Or Random Treasure"],
[68,"Adventuring & Spelunking","Reward","Automatically Succeed On A Skill Or Ability Skill Check"],
[69,"Adventuring & Spelunking","Reward","A Spell Attack Deals Double Damage Or Ignores Line Of Sight"],
[70,"Adventuring & Spelunking","Reward","A Bludgeoning Weapon Deals Triple Damage Against A Creature Or Object Of Choice"],
[71,"Adventuring & Spelunking","Reward","A Wild Animal Or Monster Follows Your Orders For One Hour"],
[72,"Adventuring & Spelunking","Reward","A Ruler Or Region Becomes Loyal To You And Aids Your Mission In Any Way They Can"],
[73,"Adventuring & Spelunking","Reward","Your Eyesight Or Hearing Becomes Permanently Sharper"],
[74,"Adventuring & Spelunking","Reward","Your Strength Or Dexterity Permanently Improves"],
[75,"Adventuring & Spelunking","Reward","Double Your Die Roll Result For Swimming Or Running"],
[76,"Adventuring & Spelunking","Reward","Automatically Spot A Trap Or Magical Object"],
[77,"Adventuring & Spelunking","Reward","A Group Of Animals Or People Now See You As Their Noble Leader"],
[78,"Adventuring & Spelunking","Reward","Automatically Succeed A Charisma Or Performance Check"],
[79,"Adventuring & Spelunking","Reward","Triple Your Result To Swim, Run Or Climb For One Minute"],
[80,"Adventuring & Spelunking","Reward","Use A Party Members Strength Or Dexterity"],
[81,"Adventuring & Spelunking","Reward","Reroll A Saving Throw Against A Monster Or NPC Of Choice"],
[82,"Adventuring & Spelunking","Reward","Ignore Damage From Atrap Or Monster Once"],
[83,"Adventuring & Spelunking","Reward","You Receive A Valuable Coded Message Or Pass To A Restricted Area"],
[84,"Adventuring & Spelunking","Reward","A Street Or Child Is Named After You"],
[85,"Adventuring & Spelunking","Reward","You Receive Triple Xp Or A Minor Magic Item"],
[86,"Adventuring & Spelunking","Reward","A Local Artisan Repairs A Damaged Weapon Or Item"],
[87,"Adventuring & Spelunking","Reward","Roll Twice. Pick The Best Result For Tracking Or Survival"],
[88,"Adventuring & Spelunking","Reward","You Learn The Location Of An NPC Or Item Crucial To Your Quest"],
[89,"Adventuring & Spelunking","Reward","Your Ranged Attack Deals Triple Damage Or Ignores Resistance"],
[90,"Adventuring & Spelunking","Reward","Automatically Succeed At Opening A Difficult Or Magical Lock"],
[91,"Adventuring & Spelunking","Reward","A Celibratory Coin Or Statue Is Made To Honor Your Achievements"],
[92,"Adventuring & Spelunking","Reward","Automatically Succeed Your Trading Or Crafting Check"],
[93,"Adventuring & Spelunking","Reward","Re-Roll A Saving Throw, Attack Or Skill Check"],
[94,"Adventuring & Spelunking","Reward","An Attack Against A Construct Or Undead Lands A Guaranteed Critical Hit"],
[95,"Adventuring & Spelunking","Reward","You Have Learned A New Languageorcantrip"],
[96,"Adventuring & Spelunking","Reward","You Receive A Prized Gemstone Or Art Object"],
[97,"Adventuring & Spelunking","Reward","You Obtain A Scroll Of Detect Lies Or Modify Memory"],
[98,"Adventuring & Spelunking","Reward","You Learn A New Language Or Powerful Song"],
[99,"Adventuring & Spelunking","Reward","Gain Free Lodging Or Supplies From A Local Business"],
[100,"Adventuring & Spelunking","Reward","Permanently Improve Your Ability To Sing Or Trade"]
];

let challengesFolder = game.folders.find(f => f.data.name === 'Heroic Challenges' && f.data.type === 'Item');
if (!challengesFolder) 
  challengesFolder = await Folder.create({name : 'Heroic Challenges' , type : 'Item'});
  
for (let c of challenges) {
let item = game.items.filter(i => i.name===1[1] && i.data.folder===spellFolder.id)[0];
if (!item)
    itemDocuments.push({
      "name": c[2] + ": " + c[3],
      "type": "buff",
      "img": "icons/skills/targeting/crosshair-bars-yellow.webp",
        "folder": challengesFolder.id,
      "data": {
        "name": c[3],
        "description":{ "value": `
            <div style="font-size: 1.2em;"><strong> Type:</strong> ${c[1]}<br>
            <strong>Benefit:</strong> ${c[3]}<br><br>
            <span style="font-weight:900; color: red">You have to use this to gain the benefit! You can't hoard more than one of this type of rewards.</span></div>
        `
        }
    }
  });
}
console.log(itemDocuments);
await Item.createDocuments(itemDocuments);