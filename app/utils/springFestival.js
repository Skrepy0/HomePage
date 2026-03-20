import pkg from 'lunar-calendar';
const { lunarToSolar } = pkg;

export function getSpringFestivalDate(year) {
    // 农历正月初一对应的公历日期
    const solar = lunarToSolar(year, 1, 1);
    // lunarToSolar 返回 { year, month, day }，其中 month 为 1-12
    return new Date(solar.year, solar.month - 1, solar.day);
}