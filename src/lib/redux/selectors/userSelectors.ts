import { RootState } from "../store";

const getUser = (state: RootState) => state.user;
const getUserBalance = (state: RootState) => state.user.balance;
export { getUser, getUserBalance };
