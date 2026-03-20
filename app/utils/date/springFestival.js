import pkg from 'lunar-calendar';
const { lunarToSolar } = pkg;

export function getSpringFestivalDate(year) {
    const solar = lunarToSolar(year, 1, 1);
    return new Date(solar.year, solar.month - 1, solar.day);
}