
`use strict`

export const weekDayNames = [
    "Воскресенье",
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота"
];

export const monthNames = [
    "Янв",
    "Фев",
    "Март",
    "Апр",
    "Май",
    "Июнь",
    "Июль",
    "Авг",
    "Сен",
    "Окт",
    "Нояб",
    "Дек",
];

/**  
 * @param {number} dateUnix Unix-дата в секундах
 * @param {number} timezone смещение часового пояса относительно UTC в секундах
 * @returns {string} Строка даты: "Воскресенье 10, Янв"
 */
export const getDate = function (dateUnix, timezone) {
    const date = new Date((dateUnix + timezone) * 1000);
    const dayName = weekDayNames[date.getUTCDay()];
    const monthName = monthNames[date.getUTCMonth()];

    return `${dayName} ${date.getUTCDate()}, ${monthName}`;
}

/** 
 * @param {number} timeUnix Unix date in seconds
 * @param {number} timezone shift from UTC in seconds
 * @returns {string} Time string format: "HH:MM AM/PM"
 */
export const getTime = function(timeUnix, timezone) {
    const dateTime = new Date((timeUnix + timezone) * 1000);

    // Check if dateTime is a valid Date object
    if (!(dateTime instanceof Date && !isNaN(dateTime))) {
        return 'Invalid Date';
    }

    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";

    return `${hours % 12 || 12}:${minutes < 10 ? '0' : ''}${minutes} ${period}`;
}

/** 
 * @param {number} timeUnix Unix date in seconds
 * @param {number} timezone shift from UTC in seconds
 * @returns {string} Time string format: "HH AM/PM"
 */

export const getHours = function(timeUnix, timezone) {
    const dateTime = new Date((timeUnix + timezone) * 1000);
    const hours = dateTime.getHours();
    const period = hours >= 12 ? "PM" : "AM";

    return `${hours % 12 || 12} ${period}`;
}

/**
// @param {number} Mps Metter/s
// @returns {number} km/h
*/

export const mps_to_kmh = mps => {
    const mph = mps * 3600;
    return mph/1000;
}

export const  aqiText = {
    1:{
        level:"Good",
        message:"Качество воздуха считается удовлетворительным, а загрязнение воздуха не представляет серьезной проблемы."
    },
    2:{
        level:"Fair",
        message:"Качество воздуха приемлемое; однако некоторые загрязняющие вещества могут представлять умеренную угрозу для здоровья очень небольшого числа людей."
    },
    3:{
        level:"Moderate",
        message:"Многие могут испытывать последствия для здоровья. Большенство людей вряд ли пострадает"
    },
    4:{
        level:"Poor",
        message:"Каждый человек может начать ощущать последствия для здоровья"
    },
    5:{
        level:"Very Poor",
        message:"Предупреждения о чрезвычайных ситуациях. Скорее всего, пострадает все население"
    }
    
}


