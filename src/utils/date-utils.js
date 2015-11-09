import moment from 'moment';
import _ from 'lodash';

const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

let getMonths = () => shortMonths;

let generateShortMonths =
    startingMonth => shortMonths.slice(startingMonth).concat(shortMonths.slice(0, startingMonth));

var generateAllDates = function(startingDate, endDate) {
    let allDates = [];
    let [yearStartingDate, monthStartingDate, dayStartingDate] = startingDate.split('-');
    let [yearEndDate, monthEndDate, dayEndDate] = endDate.split('-');

    allDates = allDates.concat(generateDatesMonth(yearStartingDate, monthStartingDate, parseInt(dayStartingDate)));
    let monthsAndYearToGenerate = getMonthsAndYear(monthStartingDate, yearStartingDate);
    let otherDates = monthsAndYearToGenerate.map(([month, year]) => {
        return generateDatesMonth(year, month, 1);
    });

    allDates = allDates.concat(_.flatten(otherDates));
    //allDates = allDates.concat(this.generateDatesMonth(yearEndDate, monthEndDate, parseInt(dayEndDate) + 1));

    return allDates;
}

var getMonthsAndYear = function(startingMonth, startingYear) {
    let i = 0;
    let res = [];
    let currentValMonth = parseInt(startingMonth) + 1;
    let currentValYear = parseInt(startingYear);

    while (i < 11) {
        res.push([currentValMonth.toString(), currentValYear.toString()]);
        if (parseInt(currentValMonth) + 1 > 12) {
            currentValMonth = '01';
            currentValYear = parseInt(currentValYear) + 1
        } else {
            currentValMonth = getIntValAsString((parseInt(currentValMonth) + 1).toString());
        }

        i++;
    }

    return res;
}

var getIntValAsString = function(val) {
    if (val.length === 1) {
        return '0' + val;
    } else {
        return val.toString();
    }
}

var generateDatesMonth = function(_year, _month, fromDay) {
    let res = [];
    const numDaysInMonths = {'01': 31, '02': 28, '03': 31, '04': 30, '05': 31, '06': 30,
                    '07': 31, '08': 31, '09': 30, '10': 31, '11': 30, '12': 31};

    let numDays = numDaysInMonths[_month];

    for (var i=fromDay; i<numDays+1; i++) {
        res.push(_year + '-' + _month + '-' + getIntValAsString(i.toString()));
    }

    return res;
}

var getDaysBackToClosestSunday = function(firstDate) {
    let res = [];
    let indexDayOfWeek = moment(firstDate).day();
    if (indexDayOfWeek > 0) {
        for (var i=1; i<=indexDayOfWeek; i++) {
            res.push([moment(firstDate).subtract(i, 'days').format('YYYY-MM-DD'), 0]);
        }
    }

    return res;
}

module.exports = {
    generateAllDates: generateAllDates,
    generateShortMonths: generateShortMonths,
    getDaysBackToClosestSunday: getDaysBackToClosestSunday,
}

if (process.env.NODE_ENV === 'test') {
    module.exports._private = {
        getMonthsAndYear: getMonthsAndYear,
        getMonths: getMonths
    }
}
