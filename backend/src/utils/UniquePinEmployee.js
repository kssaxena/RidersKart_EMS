import { Employee } from "../models/employee.models.js";

export const generateUniqueEmployeePin = async () => {
  let pin;
  let exists = true;

  while (exists) {
    pin = Math.floor(100000 + Math.random() * 900000); // 6 digits
    exists = await Employee.exists({ accessPin: pin });
  }

  return pin;
};
