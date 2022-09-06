/**
 * 快捷 toast
 * @param msg
 * @param location
 * @param duration
 * @returns {*}
 * @constructor
 */
function Toast(msg, location = 'middle', duration = 1500) {
    if (typeof msg === 'string') {
        api.toast({
            msg, location, duration
        })
    } else {
        api.toast({
            msg: msg.message,
            location: msg.position,
            duration: msg.duration
        })
    }

}

Toast.loading = function (options) {
    if (Object.keys(options).find(k => ['message', 'forbidClick', 'position'].includes(k))) {
        api.showProgress({
            title: '',
            text: options.message,
            modal: options.forbidClick,
            location: options.position
        });
    } else {
        api.showProgress(options);
    }
}

Toast.clear = api.hideProgress;


export default Toast;