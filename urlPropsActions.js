export const urlPropsActions = {
    get: function (prop) {
        return (new URLSearchParams(window.location.search)).get(prop);
    },
    set: function (prop, value) {
        let queryParams = new URLSearchParams(window.location.search);
        queryParams.set(prop, value);
        history.replaceState(null, null, "?" + queryParams.toString());
    }
}
