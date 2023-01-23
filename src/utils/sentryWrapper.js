export function sentryLog() {

    /*When sentry is integrated fully, these functions will encapsulate sentry logging. */
    function info(data) {
        console.info()
    }
    function debug(data) {
        console.debug(data);
    }
    function error(data) {
        console.error(data);
    }
}