const moment = require("moment"); 
moment.locale("pt-br");

const replaceDates = async (text) => {
  const today = moment();
  const yesterday = moment().subtract(1, "days");
  const tomorrow = moment().add(1, "days");
  const dayAfterTomorrow = moment().add(2, "days");

  const weekdays = [
    "domingo",
    "segunda-feira",
    "terça-feira",
    "quarta-feira",
    "quinta-feira",
    "sexta-feira",
    "sábado"
  ];

  let replacedText = text;

  if (/ontem/gi.test(replacedText)) {
    const weekday = weekdays[yesterday.day()];
    replacedText = replacedText.replace(/ontem/gi, weekday);
  }

  if (/hoje/gi.test(replacedText)) {
    const weekday = weekdays[today.day()];
    replacedText = replacedText.replace(/hoje/gi, weekday);
  }

  if (/amanhã/gi.test(replacedText)) {
    const weekday = weekdays[tomorrow.day()];
    replacedText = replacedText.replace(/amanhã/gi, weekday);
  }

  if (/depois de amanhã/gi.test(replacedText)) {
    const weekday = weekdays[dayAfterTomorrow.day()];
    replacedText = replacedText.replace(/depois de amanhã/gi, weekday);
  }

  return replacedText;
}

module.exports = { replaceDates };