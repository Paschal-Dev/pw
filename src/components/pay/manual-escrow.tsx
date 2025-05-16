import React from "react";
import EscrowManualConfirm from "./escrow-manual-confirm";
import ManualPaymentStatus from "./manual_payment_status";
// import { setp2pEscrowDetails } from "../../redux/reducers/pay";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";

interface ManualEscrowProps {
  onChatToggle: (isChatOpen: boolean) => void;
  onChatOpen?: () => void;
}

export default function ManualEscrow({
  onChatToggle,
  onChatOpen,
}: ManualEscrowProps): React.JSX.Element {
  // const [isPaidClicked, setIsPaidClicked] = useState(false);

  const { p2pEscrowDetails, confirmPaymentDetails } = useSelector(
    (state: RootState) => state.pay
  );
  // const handlePaidToggle = () => {
  //   setIsPaidClicked((onPaidToggle) => !onPaidToggle);
  // };

  return (p2pEscrowDetails?.confirm_manual_payment !== 0 && p2pEscrowDetails?.confirm_manual_payment !== null) ||
    confirmPaymentDetails ? (
      <ManualPaymentStatus
      onChatToggle={onChatToggle}
      // onPaidToggle={handlePaidToggle}
    />
  ) : (
    
    <EscrowManualConfirm
      onChatToggle={onChatToggle}
      // onPaidToggle={handlePaidToggle}
      onChatOpen={onChatOpen}
    />
  );
}
