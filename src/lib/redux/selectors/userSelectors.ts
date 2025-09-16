import { RootState } from "../store";

const getUser = (state: RootState) => state.user;
const getLoading = (state: RootState) => state.user.loading;
const getWallet = (state: RootState) => state.user.data?.wallet;

export { getUser, getLoading, getWallet };
