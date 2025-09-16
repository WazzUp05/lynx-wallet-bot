import { RootState } from "../store";

const getUser = (state: RootState) => state.user;
const getLoading = (state: RootState) => state.user.loading;

export { getUser, getLoading };
