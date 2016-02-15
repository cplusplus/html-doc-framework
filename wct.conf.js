module.exports = {
    testTimeout: 240 * 1000,
    plugins: {
        local: {
            browsers: ['chrome', 'firefox'],
        },
        sauce: {
            disabled: true,
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
