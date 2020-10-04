/*
/////////////////\\\\\\\\\\\\\\\\\\\\\
Author: Mohammed Alghamdi
Porpuse: This files stores all the shown text in WelcomeScreen in different languages.
Usage: default.getText(index) -> index is the one the below constants.
/////////////////\\\\\\\\\\\\\\\\\\\\\
*/

export const WELCOME = 0;
export const SELECT_MODE = 1;
export const PLAY_AI = 2;
export const PLAY_ONLINE = 3;
export const PLAY_TUTORIAL = 4;

export const getText = (desiredText) => {
    const lang = navigator.language.slice(0, 2);
    const text = [
        // Welcome text
        {
            "en": "Welcome to Collecting Stones Game!", 
            "ar": "مرحبا بك في لعبة تجميع الحجارة النادرة"
        }, // please select the mode text
        {
            "en": "If this is your first time playing the game," + 
                " then it is recommended to select tutorial first.",
            "ar": ". اذا كانت هذه المرة الاولى لك ، فانه ينصح باختيار طور التدريب"
        }, // play with AI
        {
            "en": "Play offline with AI",
            "ar": "العب محليا مع الذكاء الاصطناعي"
        }, // play with friend
        {
            "en": "Play online with friends",
            "ar": "العب اونلاين مع الاصدقاء"
        }, // play toturial
        {
            "en": "Play Tutorial", 
            "ar": "العب طور التدريب"
        }
    ];
    return text[desiredText][lang];
};
