import { getUserInfo } from "./userDataActions.js";

export function filterUsers(usersData, filtersFields, filtersFormNode) {
    const filtersFormData = new FormData(filtersFormNode);
    let filteredUsers = usersData;
    filtersFields.map((fieldName) => {
        const fieldValues = filtersFormData.getAll(fieldName);
        if (fieldValues != 0) {
            filteredUsers = filteredUsers.filter(
                (user) => filterFunction(fieldValues, fieldName, user)
            );
        }
    });
    return filteredUsers;
}

function filterFunction(fieldValues, fieldName, user) {
        const isRelatedUser = fieldValues
            .map((fieldValue) => checkUser(user, fieldName, fieldValue))
            .find((isRelated) => isRelated == true);
        return isRelatedUser ? true : false;
    }

    function checkUser(user, fieldName, fieldValue) {
        const [value, valueMax] = fieldValue.split("-");
        if (valueMax === undefined) {
            return getUserInfo.getValue(user, fieldName) === value ? true : false;
        } else {
            return  getUserInfo.getValue(user, fieldName) >= value &&
                    getUserInfo.getValue(user, fieldName) <= valueMax
                    ? true
                    : false;
        }
    }
