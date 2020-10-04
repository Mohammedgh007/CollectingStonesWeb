/*
/////////////////\\\\\\\\\\\\\\\\\\\\\
Author: Mohammed Alghamdi
Porpuse: This files stores all the shown text in game play screen in different languages.
Usage: default.getText(index) -> index is the one the below constants.
/////////////////\\\\\\\\\\\\\\\\\\\\\
*/


export const USER_NAME = 0;
export const TYPE_HERE = 1;
export const NUM_2 = 2;
export const NUM_3 = 3;
export const NUM_4 = 4;
export const SELECT_PLAYERS_NUM = 5;
export const BEGIN_PLAY = 6;
export const GAME_RULES = 7;
export const GREEN_STOEN = 8;
export const BLUE_STOEN = 9;
export const RED_STOEN = 10;
export const ORANGE_STOEN = 11;
export const MULTICOLOR_STONE = 12;
export const NORMAL_SHIELD = 13;
export const MIRROR_SHIELD = 14;
export const ABSOLUTE_SHIELD = 15;
export const HAMMER = 16;
export const SHEILD_DESTROYER = 17;
export const STONE_STEALLING = 18;
export const NORMAL_SHEILD_STEALLING = 19;
export const MIRROR_SHIELD_STEALLING = 20;
export const PICK_CARD = 21;
export const ANOTHER_TURN = 22;
export const RESTORE = 23;
export const SAME_CARD = 24;
export const PREVENT_PLAYING = 25;
export const PLAY = 26;
export const WASTE = 27;
export const NOT_YOUR_TURN = 28;
export const YOUR_TURN = 29;
export const CANNOT_CANCEL_PLAY = 30;
export const WON_PLAYER = 31;
export const PLAY_AGAIN = 32;
export const PLAYING = 33;
export const WASTING = 34;
export const OPPONENT1NUM = 35;
export const OPPONENT2NUM = 36;
export const OPPONENT3NUM = 37;
export const PHONE_NOTE = 38;
export const WARN_PHONE_INPUT = 39;
export const WARN_SAME_PHONE = 40;

export const getText = (desiredText) => {
    const lang = navigator.language.slice(0, 2);
    const text = [
        // user name text.
        {
            "en": "user name",
            "ar": "اسم المستخدم"
        },// type here text. 
        {
            "en": "type here", 
            "ar": "اكتب هنا"
        }, // the two players option
        {
            "en": "two players", 
            "ar": "لاعبان"
        } , // the three players option
        {
            "en": "three players",
            "ar": "ثلاثة لاعبين"
        }, // the four players option
        {
            "en": "four players",
            "ar":"أربعة لاعبين"
        }, // select the palyers num 
        {
            "en": "select players' number",
            "ar": "اختر عدد اللاعبين"
        }, // begin
        {
            "en":"start game",
            "ar": "ابدأ اللعبة"
        }, // game rules
        {
            "en": "game rules",
            "ar": "قوانين اللعبة"
        }, // green color stone
        {
            "en": "Green Stone is one out of 4 distinctive stones that should be collected",
            "ar":"الحجر الاخضر هو حجر من اصل أربعة احجار نادرة يجب جمعها"
        }, // blue color stone
        {
            "en": "Blue Stone is one out of 4 distinctive stones that should be collected",
            "ar":"الحجر الازرق هو حجر من اصل أربعة احجار نادرة يجب جمعها"
        }, // red color stone
        {
            "en": "Red Stone is one out of 4 distinctive stones that should be collected",
            "ar":"الحجر الاحمر هو حجر من اصل أربعة احجار نادرة يجب جمعها"
        }, // orange color stone
        {
            "en": "Orange Stone is one out of 4 distinctive stones that should be collected",
            "ar":"الحجر البرتقالي هو حجر من اصل أربعة احجار نادرة يجب جمعها"
        }, // mutli color stone
        {
            "en": "Multicolor stone can be used as any of the four stones",
            "ar":"الحجر المتعدد الألوان يمكن استخدامه مثل اي من الاحجار الأربعة"
        }, // normal sheild
        {
            "en": "Normal shield protects from the hammer but gets destroyed",
            "ar":"الدرع العادي يحمي من المطرقة لكنه يتحطم بعد هجوم المطرقة"
        }, // mirror sheild
        {
            "en": "Mirror shield protects from the hammer and reflects the attack to the opposite field after getting detroyed",
            "ar":"الدرع العاكس تحمي من المطرقة وتعكس الهجوم لنفس لنفس اللون من الحجارة بعد ان تتحطم"
        }, // absolute sheild
        {
            "en":"Absolute protects from everything; The only way to destroy it is the sheild destroyer",
            "ar":"الدرع المطلق تحمي من كل شيء ، الطرقية لتحطيم الدرع هي بطاقة مدمر الدرع"
        }, // hammer
        {
            "en": "Hammer destroys stones if there's no sheilds",
            "ar":"المطرقة تقوم بتحطيم الحجارة اذا لم تكن محمية بدروع"
        }, // sheild destroyer
        {
            "en": "Shield destroyer destroys any type of sheild including the absolute sheild from opponent's feild",
            "ar":"محطم الدروع تحطم كل أنواع الدروع بما فيها الدرع المطلق من ميدان الخصم"
        }, // stone stealling
        {
            "en": "Any stone stealling steals a stone from opponent's feild and play it  or waste it",
            "ar":"بطاقة سرقة الحجارة تستولي على حجارة  من ميدان الخصم مع لعبها او اهدارها"
        }, // normal sheild stealling
        {
            "en": "Normal shield stealling steals a normal sheild from opponent's feild and play it or waste it",
            "ar":"سرقة الدرع العادي تستولي على درع عادي من ميدان الخصم مع لعها او اهدارها"
        }, // mirror sheild stealling
        {
            "en": "Mirror shield stealling steals a mirror sheild from opponent's feild and play it  or waste it",
            "ar":"بطاقة سرقة الدرع العاكس تستولي على درع المراة من ميدان الخصم مع لعبها او اهدارها"
        }, // pick card
        {
            "en": "It steals a card from an opponent's hand and play it or waste it",
            "ar":"تستولي على احد البطايق من يد الخصم مع لعبها او اهدارها"
        }, // another turn
        {
            "en": "draw two cards and play twice. It cannot be used twice in a row in the same turn",
            "ar":"أسحب بطاقتين مع اللعب مرتين ولكن لا يمكن استخدامها مرتين على التوالي في نفس الدور"
        }, // restore
        {
            "en": "resore a destroyed stone by a hammer and place it in a feild",
            "ar":"اصلاح وارجاع الحجر المتحطم بالمطرقة"
        }, // same card
        {
            "en": "play the same card as the last turn",
            "ar":"ألعب نفس البطاقة من اخر دور"
        }, // prevent playing
        {
            "en": "prevent an opponent from playing in the next turn",
            "ar":"منع احد الخصوم من اللعب في دوره التالي"
        }, // play
        {
            "en": "play",
            "ar": "العب"
        }, // waste
        {
            "en":"waste",
            "ar": "اهدر"
        }, // not your turn
        {
            "en": "It's not your turn.",
            "ar": "لم يحن دورك بعد"
        }, //
        {
            "en": "Your Turn!",
            "ar": "حان دورك"
        }, // can't cancel after clicking on play with "pick a hand card"
        {
            "en": "You cannot cancel playing the card. You must play!",
            "ar": "لا يمكنك الغاء لعب هذه البطاقة"
        }, // .. has won!!
        {
            "en": "has won!!!",
            "ar": "فاز"
        }, // play again
        {
            "en": "Play Again",
            "ar": "العب مره أخرى"
        }, // playing
        {
            "en": "Playing",
            "ar": "لعب"
        }, // wasting
        {
            "en": "wasting",
            "ar": "اهدار"
        }, // oppnent1Num
        {
            "en": "Opponent 1 phone's number including country's code",
            "ar": "رقم جوال المنافس الاول مع الرمز الدولي",
        },  // oppnent2Num
        {
            "en": "Opponent 2 phone's number  including country's code",
            "ar": "رقم جوال المنافس الثاني مع الرمز الدولي",
        },  // oppnent3Num
        {
            "en": "Opponent 3 phone's number  including country's code",
            "ar": "رقم جوال المنافس الثالث مع الرمز الدولي",
        }, // number are only ids
        {
            "en": "Note: The phones' numbers are used only to link between players as an id.",
            "ar": "ملاحظة: ارقام الجوال تستخدم كنص معرف يمكن استخدامه للربط بين اللاعبين"
        }, // WARN_PHONE_INPUT
        {
            "en": "Please input a phone number with the right format. It includes + then the country code then the phone number",
            "ar": "الرجاء ادخال رقم الجوال بالطريقة الصحيحة وباللغة الانجليزية. ادخل + ثم الرمز الدولي ثم رقم الجوال"
        }, // WARN_SAME_PHONE
        {
            "en": "Please use the opponents' phone numbers instead of your phone number",
            "ar": "الرجاء اسنخدام الرقام الخصوم بدلا من رقمك"
        }
    ];
    return text[desiredText][lang];
};