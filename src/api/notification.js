import axios from "axios";
import { API_BASE_URL } from "../config/api";

export const getAllNotifs = (userID) => {
    return axios.get(API_BASE_URL + "/notification/" + userID);
};

export const changeNotifStatusToRead = (notifID) => {
    return axios.patch(API_BASE_URL + "/notification/read/" + notifID);
};