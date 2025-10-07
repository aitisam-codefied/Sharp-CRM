import { useAuth } from "@/components/providers/auth-provider";

export const RoleWrapper = (roleName: string, children: any) => {
  if (roleName === "Admin") {
    return children;
  }
  return null;
};

export const RoleChecker = (roleName: string, allowedRoles: string[]) => {
  if (allowedRoles.includes(roleName)) {
    return true;
  } else {
    return false;
  }
};
