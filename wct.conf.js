module.exports = {
    testTimeout: 240 * 1000,
    plugins: {
        sauce: {
            disabled: true,
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
