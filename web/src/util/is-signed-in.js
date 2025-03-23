import { Storage } from "../storage";

export const isSignedIn = () => !!Storage.retrieve(Storage.Auth);
