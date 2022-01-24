import { appHistory } from "../history";
export function* customerAdded({ customer }) {
  appHistory.push("/addAppointment");
}
