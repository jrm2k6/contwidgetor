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
