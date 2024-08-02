import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const UserTypeSelector = ({ userType, setUserType, onClickHandler }: UserTypeSelectorParams) => {
  const accessChangeHandler = (type: UserType) => {
    setUserType(type);
    onClickHandler && onClickHandler(type);
  };

  return (
    <Select value={userType} onValueChange={(type: UserType) => accessChangeHandler(type)}>
      <SelectTrigger className="w-fit border-none bg-transparent">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className={"border-none bg-gray-50"}>
        <SelectItem value="viewer" className={"cursor-pointer focus:bg-gray-200 hover:bg-gray-200"}>
          can view
        </SelectItem>
        <SelectItem value="editor" className={"cursor-pointer focus:bg-gray-200 hover:bg-gray-200"}>
          can edit
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default UserTypeSelector;