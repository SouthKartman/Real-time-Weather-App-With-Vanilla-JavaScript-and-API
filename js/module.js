
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

export const monthName = [
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

// @param {number} dateUnix Unix date in seconds
// @param {number} timezone timezone shift from UTC in Seconds
// @returns {string} DAte string: "Sunday 10, Jan"

export const getDate = function (dataUnix, timezone)
{
    const date = new Date ((dateUnix + timezone)* 1000);
    const weekDayNames = weekDayNames[date.getUTCDay()];
    const monthName = monthName[date.getUTCMonth()];

    return `${weekDayNames}, ${date.getUTCDate()}, ${monthName}`;
}

// @param {number} timeUnix Unix date in seconds
// @param {number} timezone shift from UTC in seconds
// @returns {string} Time string formate: "HH:AA AM/PM"


export const getTime = function(timeUnix, timezone)
{
    const date = new date((timeUnix, timezone) * 1000);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const period = hours >= 12 ? "PM" : "AM"

    return `${hours % 12 || 12}:${minutes}:${period}`
}


// @param {number} M/s
// @returns {number} km/h


export const mps_to_kmh = mps => {
    const mph = mph * 3600;
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


