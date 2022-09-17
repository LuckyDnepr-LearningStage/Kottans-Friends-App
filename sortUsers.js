import { getUserInfo } from "./userDataActions.js";

export function sortUsers(usersData, sortTypeDecrypter, filtersFormNode) {
    const filterFormData = new FormData(filtersFormNode),
        sortBy = filterFormData.get("sorting"),
        sortFunction =
            sortBy != undefined ? createSortFunction(sortBy, sortTypeDecrypter) : () => true;
    usersData.sort((userA, userB) => sortFunction(userA, userB));

    function createSortFunction(sortBy, sortTypeDecrypter) {
        const [sortField, directionCoeff] = sortTypeDecrypter[sortBy];
        return (userA, userB) => {
            const a = getUserInfo.getValue(userA, sortField),
                b = getUserInfo.getValue(userB, sortField);
            return directionCoeff * ((b < a) - (a < b));
        };
    }
}
