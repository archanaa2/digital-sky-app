import { combineReducers } from "redux";

import { authentication } from "./authenticationReducer";
import { registration } from "./registrationReducer";
import { resetPasswordLink } from "./resetPasswordLinkReducer";
import { resetPassword } from "./resetPasswordReducer";
import { saveLocalDroneAcquisitionApplication } from "./localDroneAcquisitionApplicationReducer";
import { pilotProfile } from './pilotProfileReducer';
import { operatorProfile } from './operatorProfileReducer';

const rootReducer = combineReducers({
  authentication,
  registration,
  resetPasswordLink,
  resetPassword,
  saveLocalDroneAcquisitionApplication,
  pilotProfile,
  operatorProfile
});

export default rootReducer;