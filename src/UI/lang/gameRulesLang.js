/*
/////////////////\\\\\\\\\\\\\\\\\\\\\
Author: Mohammed Alghamdi
Porpuse: This files stores all the shown text in game rules window in different languages.
Usage: default.getText(index) -> index is the one the below constants.
/////////////////\\\\\\\\\\\\\\\\\\\\\
*/

export const FUNDEMENTAL_RULES = 0;
export const RULE1 = 1;
export const RULE2 = 2;
export const RULE3 = 3;
export const RULE4 = 4;
export const RULE5 = 5;
export const RULE6 = 6;
export const RULE7 = 7;
export const RULE8 = 8;
export const RULE9 = 9;
export const RULE10 = 10;
export const CARD_DISC = 11;
export const CARD_RED_STONE = 12;
export const CARD_ORANGE_STONE = 13;
export const CARD_BLUE_STONE = 14;
export const CARD_GREEN_STONE = 15;
export const CARD_NORMAL_SHIELD = 16;
export const CARD_MIRROR_SHIELD = 17;
export const CARD_ABSOLUTE_SHIELD = 18;
export const CARD_HAMMER = 19;
export const CARD_SHIELD_DETROYER = 20;
export const CARD_STONE_STEALLING = 21;
export const CARD_NORMAL_SHIELD_STEALLING = 22;
export const CARD_MIRROR_SHIELD_STEALLING = 23;
export const CARD_PICK_CARD = 24;
export const CARD_PLAY_TWICE = 25;
export const CARD_PREVENT_NEXT_TURN = 26;
export const CARD_RESTORE_STONE = 27;
export const CARD_SAME_CARD = 28;
export const CARD_MULTICOLOR_STONE= 29;
export const CLOSE = 30;


export const getText = (desiredText) => {
    const lang = navigator.language.slice(0, 2);
    const text = [
        // fundemental rules
        {
            "en": "Fundemental Rules", 
            "ar": "قواعد أساسية"
        }, // rule 1
        {
            "en": "The goal is to place four destinctive stones on the four fields, and the first player who acheives that is the winner.", 
            "ar": "الهدف هو ان يتم تجميع أربعة حجار مختلفة في الاربعة خانات ، واللاعب الاول الذي يجمعها هو الفائز"
        }, // rule 2
        {
            "en": "The main stones are green, blue, orange, or red.", 
            "ar": "الأحجار الرئيسية تكون خضراء ، او زرقاء ، او برتقال، او حمراء"
        }, // rule 3
        {
            "en": "Multicolor stones can be used instead of any of the main stones, and they can be used repeatedly to win unlike the main stones.", 
            "ar": "الاحجار متعدد الالوان يمكن استخدامه بدلا من الاحجار الرئيسية ، وكما يمكن استخدامها بشكل متكرر على عكس الاحجار الرئيسية"
        }, // rule 4
        {
            "en": "You can play/waste only when it's your turn.", 
            "ar": "يمكنك الاهدار/اللعب عندما يحين دورك فقط"
        }, // rule 5
        {
            "en": "When it's your turn, the cards will be drawn to reach total of 4 cards on the hand if hand's cards are less than 4.", 
            "ar": "عندما يحين دورك ، سوف تسحب عدة بطاقات للوصول للعدد 4 من البطاقات في اليد اذا كانت بطاقات اليد اقل من اربعة"
        }, // rule 6
        {
            "en": "When it's your turn, you must play or waste one card only.", 
            "ar": "عندما يحين دورك ، فلا بد من لعب او اهدار بطاقة واحدة فقط دائما"
        }, // rule 7
        {
            "en": "When the card has an affect, then it would be a \"play\"; otherwise, it would be a \"waste\"", 
            "ar": "عندما تكون البطاقة ذو فعالية ، فانها تعتبر لعب ، وعدا ذلك فانها تعتبر اهدار"
        }, // rule 8
        {
            "en": "Defense cards(sheilds) and stones are placed on the fields when played, and the rest will be placed in the middle.", 
            "ar": "بطاقات الدفاع (الدروع) و الاحجار توضع في الخانات عند لعبها وبقية البطاقات توضع في منتصف الشاشة"
        }, // rule 9
        {
            "en": "It's allowed to play multiple defense cards on the same field, but any field can contain only one stone that can played after or before playing the shield/s; eitherway the shield/s will be on the top of the stone and protect it.", 
            "ar": "يمكن لعب اكثر من بطاقة دفاعية في نفس الخانة ، ولكن كل خانة يمكن ان تحتوي حجر واحد فقط . ويمكن لعب الدرع/الدروع بعد او قبل لعب الحجارة وفي كلا الحالتين الدرع/الدروع ستكون فوق الحجارة وستحميها"
        }, // rule 10
        {
            "en": "When playing a shield on a field, the shield will be placed on the top always, and each shield provide a protection to what's below it only exluding any shield above.",
            "ar": "عند لعب درع في خانة معينة، فان الدرع سيكون دائما في قمة البطاقات دائما، وكل درع يوفر حماية فقط لكل ما تحته"
        }, // Cards' describtions
        {
            "en": "Cards' describtions",
            "ar": "وصف البطاقات"
        }, // CARD_RED_STONE
        {
            "en": "It's red stone, which is one of the main four stones, so you can't place two of red stones on your fields.", 
            "ar": "انه الحجر الاحمر احد الاحجار الرئيسية الأربعة ، لذا يمكن استخدامه في خاناتك مره واحدة فقط"
        }, // CARD_ORANGE_STONE
        {
            "en": "It's orange stone, which is one of the main four stones, so you can't place two of orange stones on your fields.", 
            "ar": "انه الحجر البرتقالي احد الاحجار الرئيسية الأربعة ، لذا يمكن استخدامه في خاناتك مره واحدة فقط"
        }, // CARD_BLUE_STONE
        {
            "en": "It's blue stone, which is one of the main four stones, so you can't place two of blue stones on your fields.", 
            "ar": "انه الحجر الازرق احد الاحجار الرئيسية الأربعة ، لذا يمكن استخدامه في خاناتك مره واحدة فقط"
        }, // CARD_GREEN_STONE
        {
            "en": "It's green stone, which is one of the main four stones, so you can't place two of green stones on your fields.", 
            "ar": "انه الحجر الاخضر احد الاحجار الرئيسية الأربعة ، لذا يمكن استخدامه في خاناتك مره واحدة فقط"
        }, // CARD_NORMAL_SHIELD
        {
            "en": "Normal Shield protects the cards that are below it from the hammer's attack, but it can protect only once then it gets detroyed.", 
            "ar": "الدرع العادي يحمي البطاقات التى اسفل منه من هجمة المطرقة ، ولكنه يحمي من هجمة واحدة ثم يتحطم"
        }, // CARD_MIRROR_SHIELD
        {
            "en": "Mirror Shield protects the cards that are below it from a hammer's attack by "+
             "reflecting the attack to the same field of the attacking opponent. However, like the normal sheild, it protects only once.", 
            "ar": "الدرع العاكس يحمي البطاقات التى اسفل منه من هجمة المطرقة عبر عكس الهجمة الى نفس خانةالبطاقات للخصم المهاجم . ولكنه مثل الدرع العادي يحمي من هجمة واحده فقط"
        }, // CARD_ABSOLUTE_SHIELD
        {
            "en": "Absolute Shield protects the cards that are below it from any card." +
            "It lasts until the end of the game unless a opponent plays sheild destroyer, then this shield will be destroyed.", 
            "ar": "الدرع المطلق يحمي البطاقات التى اسفل منه من هجمات المطرقة وبطاقات السرقة. وهذا الدرع يستمر طيلة اللعبة حتى يستهدف احد الخصوم هذا الدرع ببطاقة محطم الدروع"
        }, // CARD_HAMMER
        {
            "en": "Hammer destroys the stone on the selected field if there's no sheilds. If there were shields, it would destroy the most top shield if it was not an absolute shield", 
            "ar": "المطرقة تحطم الحجر الذي في خانة الخصم المختارة اذا لم يكن يوجد اي درع. واذا كان يوجد دروع فانها تحطم أعلى درع في الخانة المختارة اذا لم يكن درع مطلق"
        }, // CARD_SHIELD_DETROYER
        {
            "en": "Shield Destroyer destroys the most top shield at the selected field from an oppoent's fields. It destroys an shield.", 
            "ar": "محطم الدروع يحطم اعلى درع في الخانة المختارة من احد خانات الخصم .هذه الطاقة تستطيع تحطيم اي نوع من الدروع"
        }, // CARD_STONE_STEALLING
        {
            "en": "Stone stealling steals a stone from an opponent's field if there's no absolute shield and then you play/waste it.", 
            "ar": "بطاقة سرقة الحجارة تأخذ حجارة مختارة من خانات الخصم اذا لم يكن هنا درع مطلق ثم يمكنك لعب الحجارة او اهدارها"
        }, // CARD_NORMAL_SHIELD_STEALLING
        {
            "en": "Normal Shield Stealling steals a normal shield from a selected opponent's field and then you can play/wastes it. It works only if threre's no absolute shield.", 
            "ar":  "بطاقة سرقة الدرع العادي تأخذ درع عادي مختار خانة الخصم المختارة ثم يمكنك لعب الدرع العادي او اهداره. يمكن اللعب بهذه البطاقة فقط في حالة عدم وجدو درع مطلق فوق الدره العادي"
        }, // CARD_MIRROR_SHIELD_STEALLING
        {
            "en": "Mirror Shield Stealling steals a mirror shield from an opponent's field and then you can play/wastes it. It works only if threre's no absolute shield above the mirror shield.", 
            "ar":  "بطاقة سرقة الدرع العاكس تأخذ درع عاكس مختار من خانات الخصم اذا لم يكن هنا درع مطلق ثم يمكنك لعب الدرع العاكس او اهداره. يمكن اللعب بهذه البطاقة فقط في حالة عدم وجود درع مطلق فوق الدرع العاكس"
        }, // CARD_PICK_CARD
        {
            "en": "An opponent's cards on the hand will be revealed then you pick a card and play/waste it.", 
            "ar": "بطاقة أخذ بطاقة تمكنك من كشف البطاقات على يد الخصم ثم لعبها او اهدارها"
        }, // CARD_PLAY_TWICE
        {
            "en": "It enables you to draws two cards and then plays/wastes two cards in a row. However, this card cannot be played twice in the same turn.", 
            "ar": "بطاقة اللعب مرتين تمكنك من سحب بطاقتين ثم اللعب مرتين على التوالي ، لكن لا يمكن لعب هذه البطاقة مرتين في نفس الدور"
        }, // CARD_PREVENT_NEXT_TURN
        {
            "en": "It prevents an opponent from playing in the next turn.", 
            "ar": "بطاقة الغاء الدور التالي تمنع احد خصمك من اللعب في دوره التالي"
        }, // CARD_RESTORE_STONE
        {
            "en": "It returns one of your destroyed stones by a hammer to a field you select.", 
            "ar": "بطاقة ارجاع الحجر تقوم بارجاع احد احجارك التى تم تحطيمها بالمطرقة الى احد خاناتك التى تختارها"
        }, // CARD_SAME_CARD
        {
            "en": "Playing this card is equivlant to playing the same card in the last turn.", 
            "ar": "بطاقة نفس البطاقة تمكنك من لعب نفس البطاقة التى لعبتها في الدور السابق"
        }, // CARD_MULTICOLOR_STONE
        {
            "en": "It's a multicolor stone that can be used instead of any of the four main stone to win.", 
            "ar": "الحجر المتعدد الالوان يمكن استخدامه عواضا عن احد الاحجار الرئيسية الاربعة"
        }, // close
        {
            "en": "close",
            "ar": "اغلاق"
        }
    ];
    return text[desiredText][lang];
};
