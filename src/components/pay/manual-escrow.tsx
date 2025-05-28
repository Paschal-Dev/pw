import React from "react";
import EscrowManualConfirm from "./escrow-manual-confirm";
import ManualPaymentStatus from "./manual_payment_status";
// import { setp2pEscrowDetails } from "../../redux/reducers/pay";
// import { RootState } from "../../redux/store";
// import { useSelector } from "react-redux";

interface ManualEscrowProps {
  onChatToggle: (isChatOpen: boolean) => void;
  checkStatus: boolean;
  setCheckStatus: (val: boolean) => void;
  countDown?: number;
}

export default function ManualEscrow({
  onChatToggle,
  checkStatus,
  setCheckStatus,
  countDown,
}: ManualEscrowProps): React.JSX.Element {
  if (checkStatus) {
    return <ManualPaymentStatus onChatToggle={onChatToggle} />;
  }

  return <EscrowManualConfirm countDown={countDown} onChatToggle={onChatToggle} onPaid={() => setCheckStatus(true)} />;
}
