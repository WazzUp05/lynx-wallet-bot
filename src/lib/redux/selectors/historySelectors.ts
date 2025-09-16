import { RootState } from "../store";

const getHistory = (state: RootState) => state.history.items;
export { getHistory };
