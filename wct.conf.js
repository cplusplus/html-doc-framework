module.exports = {
    testTimeout: 240 * 1000,
    plugins: {
        local: {
            browsers: ['chrome', 'firefox'],
        },
        sauce: {
            disabled: true,
            // Remove this once https://github.com/Polymer/wct-sauce/pull/15 is fixed.
            tunnelId: process.env.TRAVIS_JOB_NUMBER,
            browsers: [
                {
                    "browserName": "chrome",
                    "platform": "OS X 10.11",
                    "version": "beta"
                }, {
                    "browserName": "firefox",
                    "platform": "Windows 10",
                    "version": ""
                }
            ]
        }
    }
};
