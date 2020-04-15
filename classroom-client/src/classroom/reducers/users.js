import {USERS_INDEX_FAILED, USERS_INDEX_INVALIDATED, USERS_INDEX_PENDING, USERS_INDEX_SUCCESSFUL} from "../actions/users";

const initialState = {
    isValid: false,
    isFetching: false,
    errors: [],
    updatedAt: Date.now(),
    users: []
};

export default (state = initialState, action) => {
    const updatedAt = Date.now();
    switch(action.type) {
        case USERS_INDEX_PENDING:
            return {
                ...state,
                isFetching: true,
                isValid: false,
                errors: [],
                updatedAt,
                users: state.users
            }
        case USERS_INDEX_SUCCESSFUL:
            const {users} = action.payload;
            return {
                ...state,
                isFetching: false,
                isValid: true,
                errors: [],
                updatedAt,
                users
            };
        case USERS_INDEX_FAILED:
            const {errors} = action.payload;
            return {
                ...state,
                isFetching: false,
                isValid: false,
                errors,
                updatedAt,
                users: state.users
            };
        case USERS_INDEX_INVALIDATED:
            return {
                ...state,
                isFetching: false,
                isValid: false,
                errors: [],
                updatedAt,
                users: state.users
            };
        default:
            return state;
    }
};
