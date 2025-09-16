import { RootState } from "../store";

const getUser = (state: RootState) => state.user;

export { getUser };
