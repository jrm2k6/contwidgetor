import React from 'react';

var NoContributionsGrid = React.createClass({
    render: function() {
        let _styles = this.getStyles();
        return (
            <div style={_styles.container}>
                No Contributions Found!
            </div>
        );
    },

    getStyles: function() {
        return {
            container: {
                'display': 'flex',
                'width': '100%',
                'color': '#aaa',
                'fontSize': '20px',
                'font': '13px/1.4 Helvetica',
                'justifyContent': 'center',
                'alignItems': 'center'
            },
        };
    }
});


module.exports = NoContributionsGrid;
