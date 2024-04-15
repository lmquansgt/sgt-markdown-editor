const path = require('path');

module.exports = {
    resolve: {
        alias: {
            '@css': path.resolve(__dirname, 'src/assets/css'),
            '@components': path.resolve(__dirname, 'src/components'),
        },
    },
};
