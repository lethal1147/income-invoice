import { apiStatus } from "@/constant/status";
import { ApiStatusType } from "@/types/utilsType";
import { useState } from "react";

export default function useStatus(starterStatus: ApiStatusType = apiStatus.IDLE) {
    const [status, setStatus] = useState<ApiStatusType>(starterStatus);
    const isPending = status === apiStatus.PENDING;
    const isError = status === apiStatus.ERROR;
    const isSuccess = status === apiStatus.SUCCESS;
    const isIdle = status === apiStatus.IDLE;
  
    return {
      status,
      setStatus,
      isPending,
      isError,
      isSuccess,
      isIdle,
    };
  }
  