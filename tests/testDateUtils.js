var dateUtils = require("../src/utils/date-utils.js");
var assert = require("assert");
var _privateDateUtils = dateUtils._private;

describe('Verify generateShortMonths rotates months', function() {
    it('should rotate months with starting month being first', function() {
        const _months = _privateDateUtils.getMonths();

        for (var i=0; i<10; i++) {
            let shortMonths = dateUtils.generateShortMonths(i);
            assert.equal(shortMonths.length, 12);
            assert.equal(shortMonths[0], _months[i]);
        }
    });
});

describe('Verify getIntValAsString', function() {
    it('should prepend a 0 for single digit numbers', function() {
        for (var i=1; i<10; i++) {
            let valAsString = _privateDateUtils.getIntValAsString(i.toString());
            assert.equal(valAsString[0], '0');
            assert.equal(valAsString.length, 2);
        }
    });

    it('should not modify number if double digits', function() {
        for (var i=10; i<32; i++) {
            let valAsString = _privateDateUtils.getIntValAsString(i.toString());
            assert.equal(valAsString, i.toString());
        }
    });
});

describe('Verify generateDatesMonth', function() {
    it('should return an array with the correct number of items', function() {
        let year = 2015;
        const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
        const expected = {'01': 31, '02': 28, '03': 31, '04': 30, '05': 31, '06': 30, '07': 31, '08': 31, '09': 30, '10': 31, '11': 30, '12': 31};

        for (var month of months) {
            for (var i=1; i<32; i++) {
                let dates = _privateDateUtils.generateDatesMonth(year, month, i);
                if (dates.length == 0) {
                    assert.ok(expected[month] < 31);
                } else {
                    assert.equal(dates.length, Math.min(expected[month] - i + 1, expected[month]));
                }
            }
        }
    });
});

describe('Verify getMonthsAndYear', function() {
    it('should return an array with 11 elements', function() {
        let startingYear = 2014;

        for (var i=1; i<13; i++) {
            let months = _privateDateUtils.getMonthsAndYear(i, startingYear);
            assert.equal(months.length, 11);
        }
    });
});

describe('Verify getNextMonthAndYear', function() {
    it('should return the first month of next year', function() {
        let [nextMonth, nextYear] = _privateDateUtils.getNextMonthAndYear('12', '2014');
        assert.equal(nextMonth, '01');
        assert.equal(nextYear, '2015');
    });

    it('should return the next month and the same year', function() {
        const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

        for (var i=0; i<months.length-1; i++) {
            let [nextMonth, nextYear] = _privateDateUtils.getNextMonthAndYear(months[i], '2014');
            assert.equal(nextMonth, months[i+1]);
            assert.equal(nextYear, '2014');
        }
    });
});

describe('Verify generateAllDates', function() {
    it('should return dates belonging to 12 different months in order', function() {
        let startingYear = '2014';
        let endYear = '2015';
        const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
        for (let i=1; i<32; i++) {
            for (var month of months) {
                if (month === '02' && i > 29) {
                    console.log('date not available');
                } else {
                    let startingDate = startingYear + '-' + month + '-' + _privateDateUtils.getIntValAsString(i.toString());
                    let endDate = endYear + '-' + month + '-' + _privateDateUtils.getIntValAsString(i.toString());
                    let dates = dateUtils.generateAllDates(startingDate, endDate);
                    assert.ok(dates.length === 365);
                }
            }
        }
    });
});

describe('Verify getDaysBackToClosestSunday', function() {
    it ('should return an empty array if current day is a Sunday', function() {
        const _date = '2014-11-16';
        let daysBackToSunday = dateUtils.getDaysBackToClosestSunday(_date);
        assert.equal(daysBackToSunday.length, 0);
    });

    it ('should return an array with one element if current day is a Monday', function() {
        const _date = '2014-11-17';
        let daysBackToSunday = dateUtils.getDaysBackToClosestSunday(_date);
        assert.equal(daysBackToSunday.length, 1);
    });

    it ('should return an array with two elements if current day is a Tuesday', function() {
        const _date = '2014-11-18';
        let daysBackToSunday = dateUtils.getDaysBackToClosestSunday(_date);
        assert.equal(daysBackToSunday.length, 2);
    });

    it ('should return an array with three elements if current day is a Wednesday', function() {
        const _date = '2014-11-19';
        let daysBackToSunday = dateUtils.getDaysBackToClosestSunday(_date);
        assert.equal(daysBackToSunday.length, 3);
    });

    it ('should return an array with four elements if current day is a Thursday', function() {
        const _date = '2014-11-20';
        let daysBackToSunday = dateUtils.getDaysBackToClosestSunday(_date);
        assert.equal(daysBackToSunday.length, 4);
    });

    it ('should return an array with five elements if current day is a Friday', function() {
        const _date = '2014-11-21';
        let daysBackToSunday = dateUtils.getDaysBackToClosestSunday(_date);
        assert.equal(daysBackToSunday.length, 5);
    });

    it ('should return an array with six elements if current day is a Saturday', function() {
        const _date = '2014-11-22';
        let daysBackToSunday = dateUtils.getDaysBackToClosestSunday(_date);
        assert.equal(daysBackToSunday.length, 6);
    });
});
